// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GaladrielBridge {
    address public admin;
    uint256 public galBalance;

    mapping(address => uint256) public mintedTokens;

    event TokensMinted(address indexed user, uint256 amount);
    event TokensBurned(address indexed user, uint256 amount, string targetChain, address targetAddress);

    constructor() payable {
        admin = msg.sender;
        galBalance = msg.value; 
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    function mintOnChain(address user, uint256 amount) external onlyAdmin {
        mintedTokens[user] += amount;
        emit TokensMinted(user, amount);
    }

    function burnTokens(uint256 amount, string memory targetChain, address targetAddress) external {
        require(mintedTokens[msg.sender] >= amount, "Insufficient minted tokens");

        mintedTokens[msg.sender] -= amount;
        emit TokensBurned(msg.sender, amount, targetChain, targetAddress);
    }

    // Function to withdraw GAL or equivalent from the contract
    function withdraw(uint256 amount) external onlyAdmin {
        require(galBalance >= amount, "Insufficient contract balance");
        galBalance -= amount;
        payable(admin).transfer(amount);
    }

    function deposit() external payable onlyAdmin {
        galBalance += msg.value;
    }
}
