// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ElemDAO
 * @dev Governança simplificada — holders de ELEM podem criar e votar em propostas.
 *      Peso do voto é proporcional ao saldo de ELEM no momento da votação.
 */
contract ElemDAO is Ownable {
    IERC20 public immutable elemToken;

    uint256 public votingPeriod = 3 days;
    uint256 public quorumPercentage = 10; // 10% do totalSupply
    uint256 public proposalCount;

    enum ProposalState { Active, Approved, Rejected, Executed }

    struct Proposal {
        uint256 id;
        address proposer;
        string description;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 startTime;
        uint256 endTime;
        bool executed;
    }

    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    event ProposalCreated(uint256 indexed id, address indexed proposer, string description);
    event Voted(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight);
    event ProposalExecuted(uint256 indexed id);

    constructor(address _elemToken, address initialOwner) Ownable(initialOwner) {
        elemToken = IERC20(_elemToken);
    }

    /// @notice Criar uma nova proposta
    function createProposal(string calldata description) external returns (uint256) {
        require(elemToken.balanceOf(msg.sender) > 0, "DAO: must hold ELEM");

        uint256 id = proposalCount++;
        Proposal storage p = proposals[id];
        p.id = id;
        p.proposer = msg.sender;
        p.description = description;
        p.startTime = block.timestamp;
        p.endTime = block.timestamp + votingPeriod;

        emit ProposalCreated(id, msg.sender, description);
        return id;
    }

    /// @notice Votar em uma proposta (true = a favor, false = contra)
    function vote(uint256 proposalId, bool support) external {
        Proposal storage p = proposals[proposalId];
        require(block.timestamp <= p.endTime, "DAO: voting ended");
        require(!hasVoted[proposalId][msg.sender], "DAO: already voted");

        uint256 weight = elemToken.balanceOf(msg.sender);
        require(weight > 0, "DAO: no voting power");

        hasVoted[proposalId][msg.sender] = true;

        if (support) {
            p.forVotes += weight;
        } else {
            p.againstVotes += weight;
        }

        emit Voted(proposalId, msg.sender, support, weight);
    }

    /// @notice Verificar estado da proposta
    function state(uint256 proposalId) public view returns (ProposalState) {
        Proposal memory p = proposals[proposalId];
        if (p.executed) return ProposalState.Executed;
        if (block.timestamp <= p.endTime) return ProposalState.Active;

        uint256 quorum = (elemToken.totalSupply() * quorumPercentage) / 100;
        uint256 totalVotes = p.forVotes + p.againstVotes;

        if (totalVotes >= quorum && p.forVotes > p.againstVotes) {
            return ProposalState.Approved;
        }
        return ProposalState.Rejected;
    }

    /// @notice Executar proposta aprovada (owner ou proposer)
    function executeProposal(uint256 proposalId) external {
        require(
            state(proposalId) == ProposalState.Approved,
            "DAO: not approved"
        );
        Proposal storage p = proposals[proposalId];
        require(!p.executed, "DAO: already executed");
        require(
            msg.sender == p.proposer || msg.sender == owner(),
            "DAO: unauthorized"
        );

        p.executed = true;
        emit ProposalExecuted(proposalId);
    }

    /// @notice Atualizar período de votação (owner)
    function setVotingPeriod(uint256 newPeriod) external onlyOwner {
        votingPeriod = newPeriod;
    }

    /// @notice Atualizar quórum mínimo (owner)
    function setQuorumPercentage(uint256 newQuorum) external onlyOwner {
        require(newQuorum <= 100, "DAO: invalid quorum");
        quorumPercentage = newQuorum;
    }
}
