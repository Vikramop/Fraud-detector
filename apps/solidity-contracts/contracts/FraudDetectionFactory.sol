// contracts/FraudDetectionFactory.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./ReputationStorage.sol";
import "./FraudPatternRegistry.sol";
import "./TransactionAnalyzer.sol";

contract FraudDetectionFactory is Ownable(msg.sender) {
    ReputationStorage public reputationStorage;
    FraudPatternRegistry public fraudPatternRegistry;
    TransactionAnalyzer public transactionAnalyzer;

    event SystemDeployed(address rep, address reg, address ana);

    function deploySystem() external onlyOwner {
        reputationStorage = new ReputationStorage();
        fraudPatternRegistry = new FraudPatternRegistry();
        transactionAnalyzer = new TransactionAnalyzer(address(reputationStorage));

        reputationStorage.setAuthorizedUpdater(address(transactionAnalyzer), true);

        reputationStorage.transferOwnership(owner());
        fraudPatternRegistry.transferOwnership(owner());
        transactionAnalyzer.transferOwnership(owner());

        emit SystemDeployed(address(reputationStorage), address(fraudPatternRegistry), address(transactionAnalyzer));
    }

    function getContractAddresses() external view returns (address, address, address) {
        return (address(reputationStorage), address(fraudPatternRegistry), address(transactionAnalyzer));
    }
}
