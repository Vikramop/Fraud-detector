#![cfg_attr(not(feature = "export-abi"), no_main)]
extern crate alloc;

use stylus_sdk::{
    alloy_primitives::{Address, U256},
    prelude::*,
    stylus_proc::entrypoint,
};

#[entrypoint]
pub fn main() -> Result<(), Vec<u8>> {
    let mut contract = TransactionAnalyzer::new();
    stylus_sdk::abi::handle(&mut contract)
}

pub struct TransactionAnalyzer {
    // Mapping from address to transaction count
    tx_count: StorageMap<Address, u32>,
    
    // Mapping from address to total transaction value
    tx_value: StorageMap<Address, U256>,
    
    // Mapping from address to last transaction timestamp
    last_tx_time: StorageMap<Address, u64>,
    
    // Mapping from address to unique counterparties count
    counterparties: StorageMap<Address, u32>,
    
    // Owner of the contract
    owner: StorageValue<Address>,
}

impl TransactionAnalyzer {
    pub fn new() -> Self {
        Self {
            tx_count: StorageMap::new(b"tx_count"),
            tx_value: StorageMap::new(b"tx_value"),
            last_tx_time: StorageMap::new(b"last_tx_time"),
            counterparties: StorageMap::new(b"counterparties"),
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
        
        Ok(())
    }
    
    // Record a transaction for analysis
    #[storage(read, write)]
    pub fn record_transaction(
        &mut self, 
        from: Address, 
        to: Address, 
        value: U256
    ) -> Result<(), Vec<u8>> {
        // Only owner or authorized callers can record transactions
        if *self.owner.get() != msg::sender() {
            return Err(b"Not authorized".to_vec());
        }
        
        // Update transaction count for sender
        let sender_count = self.tx_count.get(from).unwrap_or(0) + 1;
        self.tx_count.insert(from, sender_count);
        
        // Update transaction value for sender
        let sender_value = self.tx_value.get(from).unwrap_or(U256::ZERO) + value;
        self.tx_value.insert(from, sender_value);
        
        // Update last transaction time
        self.last_tx_time.insert(from, block::timestamp());
        self.last_tx_time.insert(to, block::timestamp());
        
        // Update transaction count for receiver
        let receiver_count = self.tx_count.get(to).unwrap_or(0) + 1;
        self.tx_count.insert(to, receiver_count);
        
        // Update counterparties (simplified, in a real implementation we would use a more complex 
        // structure to track unique counterparties)
        let sender_counterparties = self.counterparties.get(from).unwrap_or(0) + 1;
        self.counterparties.insert(from, sender_counterparties);
        
        let receiver_counterparties = self.counterparties.get(to).unwrap_or(0) + 1;
        self.counterparties.insert(to, receiver_counterparties);
        
        Ok(())
    }
    
    // Calculate transaction velocity (transactions per day)
    #[storage(read)]
    pub fn calculate_velocity(&self, wallet: Address, timeframe: u64) -> u32 {
        let count = self.tx_count.get(wallet).unwrap_or(0);
        let last_time = self.last_tx_time.get(wallet).unwrap_or(0);
        
        if count == 0 || last_time == 0 {
            return 0;
        }
        
        let current_time = block::timestamp();
        if current_time <= last_time {
            return 0;
        }
        
        let time_diff = current_time - last_time;
        
        // If time difference is greater than timeframe, return 0
        if time_diff > timeframe {
            return 0;
        }
        
        // Calculate transactions per day (86400 seconds in a day)
        let tx_per_day = (count as u64) * 86400 / time_diff;
        
        // Ensure the result fits in u32
        if tx_per_day > u32::MAX as u64 {
            return u32::MAX;
        }
        
        tx_per_day as u32
    }
    
    // Get transaction count for a wallet
    #[storage(read)]
    pub fn get_transaction_count(&self, wallet: Address) -> u32 {
        self.tx_count.get(wallet).unwrap_or(0)
    }
    
    // Get total transaction value for a wallet
    #[storage(read)]
    pub fn get_transaction_value(&self, wallet: Address) -> U256 {
        self.tx_value.get(wallet).unwrap_or(U256::ZERO)
    }
    
    // Get last transaction time for a wallet
    #[storage(read)]
    pub fn get_last_transaction_time(&self, wallet: Address) -> u64 {
        self.last_tx_time.get(wallet).unwrap_or(0)
    }
    
    // Get counterparties count for a wallet
    #[storage(read)]
    pub fn get_counterparties_count(&self, wallet: Address) -> u32 {
        self.counterparties.get(wallet).unwrap_or(0)
    }
    
    // Get contract owner
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
        let mut contract = TransactionAnalyzer::new();
        
        // Set a mock sender address
        let owner = Address::from_slice(&[1u8; 20]);
        stylus_sdk::testing::set_sender(owner);
        
        // Initialize the contract
        contract.initialize().unwrap();
        
        // Check owner is set correctly
        assert_eq!(contract.get_owner(), owner);
    }
    
    #[test]
    fn test_record_transaction() {
        let mut contract = TransactionAnalyzer::new();
        
        // Set a mock sender address and initialize
        let owner = Address::from_slice(&[1u8; 20]);
        stylus_sdk::testing::set_sender(owner);
        contract.initialize().unwrap();
        
        // Create test addresses and value
        let from = Address::from_slice(&[2u8; 20]);
        let to = Address::from_slice(&[3u8; 20]);
        let value = U256::from(1000000000000000000u128); // 1 ETH
        
        // Record a transaction
        contract.record_transaction(from, to, value).unwrap();
        
        // Check transaction count was updated
        assert_eq!(contract.get_transaction_count(from), 1);
        assert_eq!(contract.get_transaction_count(to), 1);
        
        // Check transaction value was updated
        assert_eq!(contract.get_transaction_value(from), value);
    }
    
    #[test]
    fn test_calculate_velocity() {
        let mut contract = TransactionAnalyzer::new();
        
        // Set a mock sender address and initialize
        let owner = Address::from_slice(&[1u8; 20]);
        stylus_sdk::testing::set_sender(owner);
        contract.initialize().unwrap();
        
        // Create a test wallet
        let wallet = Address::from_slice(&[2u8; 20]);
        
        // Manually set transaction count and time
        contract.tx_count.insert(wallet, 10);
        
        // Set last transaction time to 1 day ago (for simplicity)
        let current_time = 86400; // 1 day in seconds
        stylus_sdk::testing::set_timestamp(current_time);
        contract.last_tx_time.insert(wallet, current_time - 86400);
        
        // Calculate velocity with a timeframe of 2 days
        let velocity = contract.calculate_velocity(wallet, 2 * 86400);
        
        // Should be 10 transactions per day
        assert_eq!(velocity, 10);
    }
}
