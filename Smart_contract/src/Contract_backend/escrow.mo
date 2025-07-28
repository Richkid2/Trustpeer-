import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Float "mo:base/Float";
import Array "mo:base/Array";
import Nat32 "mo:base/Nat32";

actor class EscrowSystem(initAdmin : Principal, usdtCanisterId : Principal) = this {

    // Custom Nat32-safe hash to replace deprecated Hash.hash
    func nat32Hash(n : Nat) : Nat32 {
        Nat32.fromNat(n % 4_294_967_295);
    };

    // DIP20 minimal interface for USDT
    type TxReceipt = { #Ok : Nat; #Err : Text };
    type BalanceResult = { #Ok : Nat; #Err : Text };
    type USDT = actor {
        transfer : shared (to : Principal, value : Nat) -> async TxReceipt;
        balanceOf : shared (who : Principal) -> async BalanceResult;
    };

    type TradeState = {
        #Created;
        #PaymentSent;
        #PaymentReceived;
        #Completed;
        #Disputed;
        #Cancelled;
    };

    type Trade = {
        id : Nat;
        buyer : Principal;
        seller : Principal;
        usdtAmount : Nat;
        ngnAmount : Nat;
        state : TradeState;
        createdAt : Time.Time;
        paymentSentAt : ?Time.Time;
        paymentReceivedAt : ?Time.Time;
        releaseRequestedAt : ?Time.Time;
        disputeReason : ?Text;
    };

    type TraderProfile = {
        principal : Principal;
        telegramHandle : Text;
        rating : Float;
        totalTrades : Nat;
        positiveTrades : Nat;
    };

    stable var profilesStable : [(Principal, TraderProfile)] = [];
    stable var tradesStable : [(Nat, Trade)] = [];
    stable var nextTradeId : Nat = 1;
    stable var admin : Principal = initAdmin;
    stable var usdtCanister : Principal = usdtCanisterId;

    var profiles = HashMap.HashMap<Principal, TraderProfile>(0, Principal.equal, Principal.hash);
    var trades = HashMap.HashMap<Nat, Trade>(0, Nat.equal, nat32Hash);

    system func preupgrade() {
        profilesStable := Iter.toArray(profiles.entries());
        tradesStable := Iter.toArray(trades.entries());
    };

    system func postupgrade() {
        profiles := HashMap.HashMap<Principal, TraderProfile>(profilesStable.size(), Principal.equal, Principal.hash);
        for ((k, v) in profilesStable.vals()) {
            profiles.put(k, v);
        };

        trades := HashMap.HashMap<Nat, Trade>(tradesStable.size(), Nat.equal, nat32Hash);
        for ((k, v) in tradesStable.vals()) {
            trades.put(k, v);
        };
    };

    func isDuplicateTrade(buyer : Principal, seller : Principal, usdtAmount : Nat, ngnAmount : Nat) : Bool {
        for ((_, trade) in trades.entries()) {
            if (trade.buyer == buyer and trade.seller == seller and trade.usdtAmount == usdtAmount and trade.ngnAmount == ngnAmount and trade.state == #Created) {
                return true;
            };
        };
        false;
    };

    func updateProfileStats(principal : Principal, positive : Bool) {
        let profileOpt = profiles.get(principal);
        switch (profileOpt) {
            case (?profile) {
                let newTotal = profile.totalTrades + 1;
                let newPositive = profile.positiveTrades + (if positive { 1 } else { 0 });
                let newRating = if (newTotal == 0) 0.0 else (Float.fromInt(newPositive) / Float.fromInt(newTotal)) * 5.0;
                let updated = {
                    profile with
                    totalTrades = newTotal;
                    positiveTrades = newPositive;
                    rating = newRating;
                };
                profiles.put(principal, updated);
            };
            case null {};
        };
    };

    public shared (msg) func createTrade(buyer : Principal, usdtAmount : Nat, ngnAmount : Nat) : async Result.Result<Nat, Text> {
        if (isDuplicateTrade(buyer, msg.caller, usdtAmount, ngnAmount)) {
            return #err("Duplicate trade exists");
        };

        let trade : Trade = {
            id = nextTradeId;
            buyer = buyer;
            seller = msg.caller;
            usdtAmount = usdtAmount;
            ngnAmount = ngnAmount;
            state = #Created;
            createdAt = Time.now();
            paymentSentAt = null;
            paymentReceivedAt = null;
            releaseRequestedAt = null;
            disputeReason = null;
        };

        trades.put(nextTradeId, trade);
        nextTradeId += 1;
        #ok(trade.id);
    };

    public shared (msg) func confirmPaymentSent(tradeId : Nat) : async Result.Result<(), Text> {
        let tradeOpt = trades.get(tradeId);
        switch (tradeOpt) {
            case (?trade) {
                if (trade.buyer != msg.caller) return #err("Only buyer can confirm payment sent");
                if (trade.state != #Created) return #err("Trade not in Created state");

                let updated = {
                    trade with state = #PaymentSent;
                    paymentSentAt = ?Time.now();
                };

                trades.put(tradeId, updated);
                #ok();
            };
            case (null) return #err("Trade not found");
        };
    };

    public shared (msg) func confirmPaymentReceived(tradeId : Nat) : async Result.Result<(), Text> {
        let tradeOpt = trades.get(tradeId);
        switch (tradeOpt) {
            case (?trade) {
                if (trade.seller != msg.caller) return #err("Only seller can confirm payment received");
                if (trade.state != #PaymentSent) return #err("Trade not in PaymentSent state");

                let updated = {
                    trade with state = #PaymentReceived;
                    paymentReceivedAt = ?Time.now();
                };

                trades.put(tradeId, updated);
                #ok();
            };
            case (null) return #err("Trade not found");
        };
    };

    public shared (msg) func releaseCrypto(tradeId : Nat) : async Result.Result<(), Text> {
        if (msg.caller != admin) return #err("Only admin can release crypto");

        let tradeOpt = trades.get(tradeId);
        switch (tradeOpt) {
            case (?trade) {
                if (trade.state != #PaymentReceived) return #err("Trade not in PaymentReceived state");

                let usdt = actor (Principal.toText(usdtCanister)) : USDT;

                let escrowBalance = await usdt.balanceOf(Principal.fromActor(this));
                switch (escrowBalance) {
                    case (#Err(e)) return #err("Cannot verify escrow balance: " # e);
                    case (#Ok(balance)) {
                        if (balance < trade.usdtAmount) return #err("Escrow underfunded. Transfer missing");
                    };
                };

                let updated = {
                    trade with state = #Completed;
                    releaseRequestedAt = ?Time.now();
                };

                trades.put(tradeId, updated);

                let transferResult = await usdt.transfer(trade.buyer, trade.usdtAmount);
                switch (transferResult) {
                    case (#Ok(_)) {
                        updateProfileStats(trade.buyer, true);
                        updateProfileStats(trade.seller, true);
                        #ok();
                    };
                    case (#Err(e)) return #err("USDT transfer failed: " # e);
                };
            };
            case (null) return #err("Trade not found");
        };
    };

    public shared (msg) func initiateDispute(tradeId : Nat, reason : Text) : async Result.Result<(), Text> {
        let tradeOpt = trades.get(tradeId);
        switch (tradeOpt) {
            case (?trade) {
                if (trade.buyer != msg.caller and trade.seller != msg.caller) return #err("Only buyer or seller can dispute");
                if (trade.state == #Completed or trade.state == #Cancelled) return #err("Cannot dispute completed/cancelled trade");

                let updated = {
                    trade with state = #Disputed;
                    disputeReason = ?reason;
                };

                trades.put(tradeId, updated);
                #ok();
            };
            case (null) return #err("Trade not found");
        };
    };

    public shared (msg) func adminCancelTrade(tradeId : Nat, reason : Text) : async Result.Result<(), Text> {
        if (msg.caller != admin) return #err("Only admin can cancel trade");

        let tradeOpt = trades.get(tradeId);
        switch (tradeOpt) {
            case (?trade) {
                if (trade.state == #Completed or trade.state == #Cancelled) return #err("Trade already completed/cancelled");

                let updated = {
                    trade with state = #Cancelled;
                    disputeReason = ?reason;
                };

                trades.put(tradeId, updated);
                #ok();
            };
            case (null) return #err("Trade not found");
        };
    };

    public shared (msg) func updateProfile(telegramHandle : Text) : async Result.Result<(), Text> {
        let profileOpt = profiles.get(msg.caller);
        switch (profileOpt) {
            case (?p) {
                profiles.put(msg.caller, { p with telegramHandle = telegramHandle });
            };
            case null {
                profiles.put(
                    msg.caller,
                    {
                        principal = msg.caller;
                        telegramHandle = telegramHandle;
                        rating = 0.0;
                        totalTrades = 0;
                        positiveTrades = 0;
                    },
                );
            };
        };
        #ok();
    };

    public query func getTrade(tradeId : Nat) : async ?Trade {
        return trades.get(tradeId);
    };

    public query func getProfile(principal : Principal) : async ?TraderProfile {
        return profiles.get(principal);
    };

    public query func listUserTrades(user : Principal) : async [Trade] {
        var result : [Trade] = [];
        for ((_, trade) in trades.entries()) {
            if (trade.buyer == user or trade.seller == user) {
                result := Array.append(result, [trade]);
            };
        };
        result;
    };

    public query func listAllTrades() : async [Trade] {
        var result : [Trade] = [];
        for ((_, trade) in trades.entries()) {
            result := Array.append(result, [trade]);
        };
        result;
    };

    public query func listAllProfiles() : async [TraderProfile] {
        var result : [TraderProfile] = [];
        for ((_, profile) in profiles.entries()) {
            result := Array.append(result, [profile]);
        };
        result;
    };
};
