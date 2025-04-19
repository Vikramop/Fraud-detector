#![cfg_attr(not(feature = "export-abi"), no_main)]
extern crate alloc;

use stylus_sdk::{
    alloy_primitives::Address,
    prelude::*,
    stylus_proc::entrypoint,
};

#[entrypoint]
pub fn main() -> Result<(), Vec<u8>> {
    let mut contract = ReputationContract::new();
    stylus_sdk::abi::handle(&mut contract)
}

pub struct ReputationContract {
    // Mapping from address to reputation score (0-100)
    scores: StorageMap<Address, u8>,
    
    // Mapping from address to timestamp of last update
    last_updates: StorageMap<Address, u64>,
    
    // Mapping for authorized updaters (address -> bool)
    authorized_updaters: StorageMap<Address, bool>,
    
    // Owner of the contract
    owner: StorageValue<Address>,
}

impl ReputationContract {
    pub fn new() -> Self {
        Self {
            scores: StorageMap::new(b"scores"),
            last_updates: StorageMap::new(b"last_updates"),
            authorized_updaters: StorageMap::new(b"authorized_updaters"),
            owner: StorageValue::new(b"owner"),
        }
    }
    
    // Initialize the contract
    #[storage(read, write)]
    pub fn initialize(&mut self) -> Result<(), Vec<u8>> {
        // Check if already initialized
        if !self.owner.get().is_zero() {
            return Err(b"Already initialized".to_vec());
        }
        
        // Set sender as owner
        self.owner.set(msg::sender());
        
        // Add owner as an authorized updater
        self.authorized_updaters.insert(msg::sender(), true);
        
        Ok(())
    }
    
    // Add or remove an authorized updater
    #[storage(read, write)]
    pub fn set_authorized_updater(&mut self, updater: Address, authorized: bool) -> Result<(), Vec<u8>> {
        // Only owner can add/remove updaters
        if *self.owner.get() != msg::sender() {
            return Err(b"Not authorized".to_vec());
        }
        
        self.authorized_updaters.insert(updater, authorized);
        Ok(())
    }
    
    // Update reputation score for a wallet
    #[storage(read, write)]
    pub fn update_reputation(&mut self, wallet: Address, new_score: u8) -> Result<(), Vec<u8>> {
        // Check if caller is authorized
        let is_authorized = self.authorized_updaters.get(msg::sender()).unwrap_or(false);
        if !is_authorized {
            return Err(b"Not authorized to update scores".to_vec());
        }
        
        // Check that score is within range
        if new_score > 100 {
            return Err(b"Score must be between 0 and 100".to_vec());
        }
        
        // Update score and timestamp
        self.scores.insert(wallet, new_score);
        self.last_updates.insert(wallet, block::timestamp());
        
        Ok(())
    }
    
    // Get reputation score for a wallet (read-only)
    #[storage(read)]
    pub fn get_reputation(&self, wallet: Address) -> u8 {
        self.scores.get(wallet).unwrap_or(50) // Default to 50 (neutral)
    }
    
    // Get last update timestamp for a wallet (read-only)
    #[storage(read)]
    pub fn get_last_update(&self, wallet: Address) -> u64 {
        self.last_updates.get(wallet).unwrap_or(0)
    }
    
    // Check if address is authorized to update scores (read-only)
    #[storage(read)]
    pub fn is_authorized(&self, address: Address) -> bool {
        self.authorized_updaters.get(address).unwrap_or(false)
    }
    
    // Get contract owner (read-only)
    #[storage(read)]
    pub fn get_owner(&self) -> Address {
        *self.owner.get()
    }
    
    // Transfer ownership (only owner can call)
    #[storage(read, write)]
    pub fn transfer_ownership(&mut self, new_owner: Address) -> Result<(), Vec<u8>> {
        if *self.owner.get() != msg::sender() {
            return Err(b"Not authorized".to_vec());
        }
        
        if new_owner.is_zero() {
            return Err(b"New owner cannot be zero address".to_vec());
        }
        
        self.owner.set(new_owner);
        Ok(())
    }
}

// Tests for the contract
#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_initialization() {
        let mut contract = ReputationContract::new();
        
        // Set a mock sender address
        let owner = Address::from_slice(&[1u8; 20]);
        stylus_sdk::testing::set_sender(owner);
        
        // Initialize the contract
        contract.initialize().unwrap();
        
        // Check owner is set correctly
        assert_eq!(contract.get_owner(), owner);
        
        // Owner should be authorized
        assert!(contract.is_authorized(owner));
    }
    
    #[test]
    fn test_update_reputation() {
        let mut contract = ReputationContract::new();
        
        // Set a mock sender address
        let owner = Address::from_slice(&[1u8; 20]);
        stylus_sdk::testing::set_sender(owner);
        
        // Initialize the contract
        contract.initialize().unwrap();
        
        // Create a test wallet address
        let wallet = Address::from_slice(&[2u8; 20]);
        
        // Update reputation score
        contract.update_reputation(wallet, 75).unwrap();
        
        // Check the score was updated
        assert_eq!(contract.get_reputation(wallet), 75);
    }
    
    #[test]
    fn test_unauthorized_update() {
        let mut contract = ReputationContract::new();
        
        // Set a mock sender address and initialize
        let owner = Address::from_slice(&[1u8; 20]);
        stylus_sdk::testing::set_sender(owner);
        contract.initialize().unwrap();
        
        // Switch to unauthorized address
        let unauthorized = Address::from_slice(&[3u8; 20]);
        stylus_sdk::testing::set_sender(unauthorized);
        
        // Try to update reputation score (should fail)
        let wallet = Address::from_slice(&[2u8; 20]);
        let result = contract.update_reputation(wallet, 75);
        
        // Check that it failed
        assert!(result.is_err());
    }
}
