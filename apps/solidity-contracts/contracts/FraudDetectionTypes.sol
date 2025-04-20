// contracts/FraudDetectionTypes.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

library FraudDetectionTypes {
    struct WalletReputation {
        uint8 score;
        uint256 lastUpdated;
        string riskLevel;
        bool isFlagged;
    }
    struct FraudPattern {
        string name;
        string description;
        uint8 severityLevel;
        bool isActive;
    }
    struct AnalysisResult {
        bool isSuspicious;
        uint8 fraudProbability;
        string[] flaggedPatterns;
        uint256 analysisTimestamp;
    }
}
