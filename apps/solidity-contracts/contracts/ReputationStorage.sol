// contracts/ReputationStorage.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./FraudDetectionTypes.sol";

contract ReputationStorage is Ownable(msg.sender) {
    mapping(address => FraudDetectionTypes.WalletReputation) private reputations;
    mapping(address => bool) public authorizedUpdaters;

    event ReputationUpdated(address indexed wallet, uint8 oldScore, uint8 newScore, string riskLevel);
    event UpdaterAuthorized(address indexed updater, bool status);

    function setAuthorizedUpdater(address updater, bool status) external onlyOwner {
        authorizedUpdaters[updater] = status;
        emit UpdaterAuthorized(updater, status);
    }

    function updateReputation(address walletAddress, uint8 newScore) external {
        require(authorizedUpdaters[msg.sender] || msg.sender == owner(), "Not authorized");
        require(newScore <= 100, "Score must be 0 to 100");

        FraudDetectionTypes.WalletReputation storage rep = reputations[walletAddress];
        uint8 old = rep.score;
        string memory lvl;
        if (newScore >= 70) { lvl = "Low"; }
        else if (newScore >= 40) { lvl = "Medium"; }
        else { lvl = "High"; }

        rep.score = newScore;
        rep.lastUpdated = block.timestamp;
        rep.riskLevel = lvl;
        rep.isFlagged = (newScore < 40);

        emit ReputationUpdated(walletAddress, old, newScore, lvl);
    }

    function getReputation(address walletAddress)
        external view returns (FraudDetectionTypes.WalletReputation memory)
    {
        FraudDetectionTypes.WalletReputation memory rep = reputations[walletAddress];
        if (rep.lastUpdated == 0) {
            rep.score = 50;
            rep.lastUpdated = 0;
            rep.riskLevel = "Medium";
            rep.isFlagged = false;
        }
        return rep;
    }
}
