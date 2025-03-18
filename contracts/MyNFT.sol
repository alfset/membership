// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721URIStorage(), Ownable(address(msg.sender)) {
   uint256 public tokenCounter;
    uint256 public mintPrice;
    address public factory;
    uint public feefactory;
    event Withdrawn(address indexed owner, uint256 amount);


    modifier Factory() {
        require(msg.sender == factory, "Only the factory can update the fee");
        _;
    }

    constructor(
        string memory name,
        string memory symbol,
        uint256 _mintPrice
    ) ERC721(name, symbol) {
        tokenCounter = 0;
        mintPrice = _mintPrice;
        factory = address(msg.sender); 
    }

    function updateMintPrice(uint256 _mintPrice) public onlyOwner {
        mintPrice = _mintPrice;
    }

    function updatefeefactory(uint256 _feefactory) public Factory {
        feefactory = _feefactory;
    }

    function mintNFT(address recipient, string memory tokenURI) public payable returns (uint256) {
        require(balanceOf(recipient) == 0, "User already owns an NFT");
        require(msg.value >= mintPrice, "Insufficient funds sent to mint NFT");
        uint256 fee = (mintPrice * feefactory) / 100;
        payable(factory).transfer(fee);
        uint256 newTokenId = tokenCounter;
        _safeMint(recipient, newTokenId);
        _setTokenURI(newTokenId, tokenURI); 
        tokenCounter += 1;
        uint256 refundAmount = msg.value - mintPrice;
        if (refundAmount > 0) {
            payable(msg.sender).transfer(refundAmount);
        }

        return newTokenId;
    }

    function totalSupply() public view returns (uint256) {
        return tokenCounter;
    }
    function getBalance(address owner) public view returns (uint256) {
        return balanceOf(owner);
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds available to withdraw");
        payable(owner()).transfer(balance);
        emit Withdrawn(owner(), balance);
    }
}