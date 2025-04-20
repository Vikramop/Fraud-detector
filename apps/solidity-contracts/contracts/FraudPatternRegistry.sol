// contracts/FraudPatternRegistry.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./FraudDetectionTypes.sol";

contract FraudPatternRegistry is Ownable(msg.sender) {
    mapping(uint256 => FraudDetectionTypes.FraudPattern) public patterns;
    uint256 public patternCount;

    event PatternAdded(uint256 indexed id, string name, uint8 severityLevel);
    event PatternUpdated(uint256 indexed id, bool isActive);

    function addPattern(
        string memory name,
        string memory description,
        uint8 severityLevel
    ) external onlyOwner returns (uint256) {
        require(severityLevel > 0 && severityLevel <= 10, "Invalid severity");
        patterns[patternCount] = FraudDetectionTypes.FraudPattern({
            name: name,
            description: description,
            severityLevel: severityLevel,
            isActive: true
        });
        emit PatternAdded(patternCount, name, severityLevel);
        patternCount++;
        return patternCount - 1;
    }

    function setPatternActive(uint256 id, bool active) external onlyOwner {
        patterns[id].isActive = active;
        emit PatternUpdated(id, active);
    }

    function getActivePatternIds() external view returns (uint256[] memory) {
        uint256 cnt;
        for (uint256 i = 0; i < patternCount; i++) {
            if (patterns[i].isActive) cnt++;
        }
        uint256[] memory list = new uint256[](cnt);
        uint256 j;
        for (uint256 i = 0; i < patternCount; i++) {
            if (patterns[i].isActive) list[j++] = i;
        }
        return list;
    }
}
