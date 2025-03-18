// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./MyNFT.sol";

contract MyNFTFactory is Ownable(address(msg.sender)) {
    address[] public deployedNFTs;
    uint256 public createFee;
    event NFTCreated(address nftAddress);
    event Withdrawn(address indexed owner, uint256 amount);

    constructor(uint256 _createFee) {
        createFee = _createFee;
    }

    function createNFT(
        string memory name,
        string memory symbol,
        uint256 _mintPrice
    ) public payable {
        require(msg.value >= createFee, "Insufficient fee to create NFT contract");
        MyNFT newNFT = new MyNFT(name, symbol, _mintPrice);
        newNFT.transferOwnership(msg.sender);
        deployedNFTs.push(address(newNFT));
        emit NFTCreated(address(newNFT));
        if (msg.value > createFee) {
            payable(msg.sender).transfer(msg.value - createFee);
        }
    }

    function updateCreateFee(uint256 newFee) public onlyOwner {
        createFee = newFee;
    }

    function updateFeeFactoryForNFT(uint256 _fee, address nftAddress) public onlyOwner {
        MyNFT nft = MyNFT(nftAddress); 
        nft.updatefeefactory(_fee);
    }


    function getDeployedNFTsCount() public view returns (uint256) {
        return deployedNFTs.length;
    }

    function getDeployedNFT(address owner) public view returns (address) {
        for (uint256 i = 0; i < deployedNFTs.length; i++) {
            if (MyNFT(deployedNFTs[i]).owner() == owner) {
                return deployedNFTs[i];
            }
        }
        return address(0);
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds available to withdraw");
        payable(owner()).transfer(balance);
        emit Withdrawn(owner(), balance);
    }

    receive() external payable {}
}