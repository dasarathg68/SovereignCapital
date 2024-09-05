// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
library Types{
    struct DAO {
        string name;
        string mission;
        string goals;
        mapping(uint256 => Proposal) proposals;
        uint256 proposalCount;
        mapping(address => User) users;
        uint256 userCount;
        address[] members;
    }
    
    struct Proposal {
        uint256 id;
        string description;
        uint256 aiScore;
        uint256 votes;
        bool executed;
    }

    struct User {
        address user;
        uint256 tasksCompleted;
        string workOutline;
    }

   
}