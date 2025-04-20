// contracts/TransactionAnalyzer.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./FraudDetectionTypes.sol";
import "./ReputationStorage.sol";

contract TransactionAnalyzer is Ownable(msg.sender) {
    mapping(bytes32 => FraudDetectionTypes.AnalysisResult) public analysisResults;
    ReputationStorage public reputationStorage;

    event TransactionAnalyzed(bytes32 indexed txHash, bool isSuspicious, uint8 fraudProbability);

    constructor(address repAddr) {
        reputationStorage = ReputationStorage(repAddr);
    }

    function recordAnalysisResult(
        bytes32 txHash,
        bool isSuspicious,
        uint8 fraudProbability,
        string[] calldata flaggedPatterns
    ) external onlyOwner {
        require(fraudProbability <= 100, "Invalid probability");
        analysisResults[txHash] = FraudDetectionTypes.AnalysisResult({
            isSuspicious: isSuspicious,
            fraudProbability: fraudProbability,
            flaggedPatterns: flaggedPatterns,
            analysisTimestamp: block.timestamp
        });
        emit TransactionAnalyzed(txHash, isSuspicious, fraudProbability);

        // Derive new reputation score (example: 100-prob if suspicious)
        uint8 newScore = isSuspicious ? uint8(100 - fraudProbability) : 100;
        reputationStorage.updateReputation(tx.origin, newScore);
    }

    function getAnalysisResult(bytes32 txHash)
        external view returns (FraudDetectionTypes.AnalysisResult memory)
    {
        return analysisResults[txHash];
    }

    function getTransactionCount(address user) external view returns (uint256) {
        // Optionally track count internally or via events off‑chain
        return 0;
    }
}
