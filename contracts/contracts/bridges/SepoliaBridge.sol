// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SepoliaBridge {
    address public admin;
    mapping(address => uint256) public lockedTokens;

    event TokensLocked(address indexed user, uint256 amount, string targetChain, address targetAddress);
    event TokensUnlocked(address indexed user, uint256 amount);
    event UnlockRequested(address indexed user, uint256 amount);

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    function lockTokens(string memory targetChain, address targetAddress) external payable {
        require(msg.value > 0, "Must lock some tokens");

        lockedTokens[msg.sender] += msg.value;
        emit TokensLocked(msg.sender, msg.value, targetChain, targetAddress);
    }

    function unlockTokens(address user, uint256 amount) external onlyAdmin {
        require(lockedTokens[user] >= amount, "Insufficient locked tokens");

        lockedTokens[user] -= amount;
        payable(user).transfer(amount);
        emit TokensUnlocked(user, amount);
    }

    function requestUnlock(address user, uint256 amount) external onlyAdmin {
        require(lockedTokens[user] >= amount, "Insufficient locked tokens");

        emit UnlockRequested(user, amount);
    }
}
