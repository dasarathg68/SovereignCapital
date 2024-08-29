// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Bridge {
    address public admin;
    uint256 public tokenBalance;

    mapping(address => uint256) public lockedTokens;
    mapping(address => uint256) public mintedTokens;

    event TokensLocked(address indexed user, uint256 amount, string targetChain, address targetAddress);
    event TokensUnlocked(address indexed user, uint256 amount);
    event TokensMinted(address indexed user, uint256 amount);
    event TokensBurned(address indexed user, uint256 amount, string targetChain, address targetAddress);

    constructor() payable {
        admin = msg.sender;
        tokenBalance = msg.value; 
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    // Lock tokens for transfer to another chain
    function lockTokens(uint256 amount, string memory targetChain, address targetAddress) external payable {
        require(msg.value == amount, "Must send exact amount of tokens to lock");

        lockedTokens[msg.sender] += amount;
        tokenBalance += amount;

        emit TokensLocked(msg.sender, amount, targetChain, targetAddress);
    }

    // Unlock tokens when they are transferred back from another chain
    function unlockTokens(address user, uint256 amount) external onlyAdmin {
        require(lockedTokens[user] >= amount, "Insufficient locked tokens");

        lockedTokens[user] -= amount;
        payable(user).transfer(amount);

        emit TokensUnlocked(user, amount);
    }

    // Mint tokens when transferring from another chain to this chain
    function mintTokens(address user, uint256 amount) external onlyAdmin {
        mintedTokens[user] += amount;

        emit TokensMinted(user, amount);
    }

    // Burn tokens for transfer back to another chain
    function burnTokens(uint256 amount, string memory targetChain, address targetAddress) external {
        require(mintedTokens[msg.sender] >= amount, "Insufficient minted tokens");

        mintedTokens[msg.sender] -= amount;
        tokenBalance += amount;

        emit TokensBurned(msg.sender, amount, targetChain, targetAddress);
    }

    // Withdraw locked or burned tokens by admin
    function withdraw(uint256 amount) external onlyAdmin {
        require(tokenBalance >= amount, "Insufficient contract balance");
        tokenBalance -= amount;
        payable(admin).transfer(amount);
    }
    function withdrawUserBalance(address user, uint256 amount) external onlyAdmin {
        require(tokenBalance >= amount && amount<mintedTokens[user], "Insufficient contract balance");
        mintedTokens[user] -= amount;
        tokenBalance -= amount;
        payable(user).transfer(amount);
    }

    // Deposit tokens to the contract
    function deposit() external payable onlyAdmin {
        tokenBalance += msg.value;
    }
}
