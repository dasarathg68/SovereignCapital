// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import './Types.sol';

contract UnifiedDAO {

    mapping(uint256 => Types.DAO) public daos;
    uint256 public daoCount;
    
    event DAOCreated(uint256 daoId, string name, string mission, string goals);
    event ProposalCreated(uint256 daoId, uint256 proposalId, string description, uint256 aiScore);
    event Voted(uint256 daoId, uint256 proposalId, address voter, uint256 votes);
    event ProposalExecuted(uint256 daoId, uint256 proposalId);
  
    // DAO Management Functions
    function createDAO(
        string memory name, 
        string memory mission, 
        string memory goals, 
        address[] memory initialMembers
    ) external {
        uint256 daoId = daoCount++;
        Types.DAO storage dao = daos[daoId];
        dao.name = name;
        dao.mission = mission;
        dao.goals = goals;

        // Add initial members
        for (uint256 i = 0; i < initialMembers.length; i++) {
            address member = initialMembers[i];
            dao.users[member] = Types.User({
                user: member,
                tasksCompleted: 0,
                workOutline: ""
            });
            dao.members.push(member);
        }
        dao.userCount = initialMembers.length;

        emit DAOCreated(daoId, name, mission, goals);
    }

    function createProposal(uint256 daoId, string memory description) external {
        Types.DAO storage dao = daos[daoId];
        uint256 proposalId = dao.proposalCount++;
        uint256 aiScore = calculateAIScore(description, dao.mission, dao.goals);
        dao.proposals[proposalId] = Types.Proposal(proposalId, description, aiScore, 0, false);
        emit ProposalCreated(daoId, proposalId, description, aiScore);
    }

    function vote(uint256 daoId, uint256 proposalId, uint256 amount) external {
        Types.DAO storage dao = daos[daoId];
        require(!dao.proposals[proposalId].executed, "Proposal already executed"); 
        dao.proposals[proposalId].votes += 1;
        emit Voted(daoId, proposalId, msg.sender, amount);
    }

    function executeProposal(uint256 daoId, uint256 proposalId) external {
        Types.DAO storage dao = daos[daoId];
        Types.Proposal storage proposal = dao.proposals[proposalId];
        require(!proposal.executed, "Proposal already executed");
        require(proposal.votes > 0, "No votes for this proposal");

        proposal.executed = true;
        emit ProposalExecuted(daoId, proposalId);
        
    }

    // AI Scoring Function
    function calculateAIScore(string memory description, string memory mission, string memory goals) internal pure returns (uint256) {
        // Implement AI scoring logic here
        return uint256(keccak256(abi.encodePacked(description, mission, goals))) % 100;
    }
}
