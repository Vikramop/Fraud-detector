#![cfg_attr(not(feature = "export-abi"), no_main)]
extern crate alloc;

use stylus_sdk::{
    prelude::*,                     // ArbResult, msg, StorageValue, etc.
    alloy_primitives::Address,
    call::Call,                     // cross‑contract call builder
    abi,                            // Make sure abi is explicitly imported
    msg,                            // Explicitly import msg
    ArbResult,
    storage::StorageAddress,          // Explicitly import ArbResult and ArbError
    // stylus_proc::entrypoint         ,
    
};

// Generate Rust bindings for your Solidity ABIs
sol_interface! {
    interface IReputationStorage {
        function updateReputation(address walletAddress, uint8 newScore) external;
    }
    interface ITransactionAnalyzer {
        function recordAnalysisResult(bytes32 txHash, bool isSuspicious, uint8 fraudProbability, string[] flaggedPatterns) external;
    }
}

// #[entrypoint]
// pub fn main() -> ArbResult {
//     // Instantiate and dispatch to your bridge
//     let mut bridge = FraudBridge::new();
//     stylus_sdk::abi::handle(&mut bridge)
// }

sol_storage!{
    #[entrypoint]
    struct FraudBridge {
        address rep;   // ReputationStorage
        address ana;   // TransactionAnalyzer
        address owner;
    }
}
#[public]
impl FraudBridge {
    /// Constructor: set storage keys
    // pub fn new() -> Self {
    //     Self {
    //         rep: StorageAddress::new(b"rep"),
    //         ana: StorageAddress::new(b"ana"),
    //         owner: StorageAddress::new(b"owner"),
    //     }
    // }

    /// Initialize with on‑chain addresses of your deployed Solidity contracts
    
    pub fn initialize(&mut self, rep_addr: Address, ana_addr: Address) -> ArbResult {
        if !self.owner.get().is_zero() {
            return Err(b"Already initialized".to_vec());
        }
        let sender = msg::sender();
        self.owner.set(sender);
        self.rep.set(rep_addr);
        self.ana.set(ana_addr);
        Ok(vec![])
    }

    /// Cross‑VM call to TransactionAnalyzer.recordAnalysisResult(...)
    
    pub fn call_record_analysis(
        &mut self,
        tx_hash: [u8; 32],
        is_suspicious: bool,
        prob: u8,
        patterns: Vec<String>,
    ) -> ArbResult {
        // Build and execute a low‑level call
        // let target = *self.ana.get();
        // let data = abi::encode_call(
        //     "recordAnalysisResult",
        //     &(tx_hash.into(), is_suspicious, prob, patterns.as_slice()),
        // );
        // Call::new(self)          // self implements CallContext
        //     .target(target)      // call TransactionAnalyzer
        //     .gas(1_000_000)      // limit gas if desired
        //     .value(0)            // no ETH attached
        //     .data(&data)         // ABI‑encoded calldata
        //     .call()?;            // execute cross‑VM call
        let analyzer = ITransactionAnalyzer::new(alloy_primitives::Address(*self.ana.get()));
        analyzer.record_analysis_result(self, tx_hash.into(), is_suspicious, prob, patterns)?;
        Ok(vec![])
        
    }

    /// Cross‑VM call to ReputationStorage.updateReputation(...)
    pub fn call_update_score(&mut self, user: Address, score: u8) -> ArbResult {
        let reputation = IReputationStorage::new(alloy_primitives::Address(*self.rep.get()));
        reputation.update_reputation(self,user, score)?;
        Ok(vec![])
    }
}
