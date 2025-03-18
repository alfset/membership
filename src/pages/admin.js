import { useState, useEffect } from "react";
import axios from "axios";
import { ethers, toBigInt } from "ethers";

const factoryABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "symbol",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_mintPrice",
				"type": "uint256"
			}
		],
		"name": "createNFT",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_createFee",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "OwnableInvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "OwnableUnauthorizedAccount",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "nftAddress",
				"type": "address"
			}
		],
		"name": "NFTCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "newFee",
				"type": "uint256"
			}
		],
		"name": "updateCreateFee",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_fee",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "nftAddress",
				"type": "address"
			}
		],
		"name": "updateFeeFactoryForNFT",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Withdrawn",
		"type": "event"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	},
	{
		"inputs": [],
		"name": "createFee",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "deployedNFTs",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "getDeployedNFT",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getDeployedNFTsCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

const factoryAddress = "0x1EcA16F659e63C0D0a306Bc3ac3e63978AC94DF3"; 

export default function AdminDashboard() {
  const [stores, setStores] = useState([]);
  const [name, setName] = useState("");
  const [fee, setFee] = useState("");
  const [symbol, setSymbol] = useState(""); 
  const [contractAddress, setContractAddress] = useState("");

  useEffect(() => {
    fetchStores();
  }, []);


  async function fetchStores() {
    const res = await axios.get("http://localhost:3000/api/getStore");
    setStores(res.data.stores);
  }

  async function createStore(e) {
    e.preventDefault();
    await axios.post("http://localhost:3000/api/createStore", { name, contractAddress });
    fetchStores();
  }

  async function createNFT(e) {
    e.preventDefault();

    if (!name || !symbol) {
      alert("Please enter both name and symbol.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const factoryContract = new ethers.Contract(factoryAddress, factoryABI, signer);
      const amountInWei = 1000;
      const tx = await factoryContract.createNFT(name, symbol, fee, { value: amountInWei });
      await tx.wait();
      const deployedNFTsCount = await factoryContract.getDeployedNFTsCount();
      console.log(Number(deployedNFTsCount));
      const newContractAddress = await factoryContract.deployedNFTs(Number(deployedNFTsCount) - 1);
      console.log(newContractAddress);
      //setContractAddress(newContractAddress);
      await axios.post("http://localhost:3000/api/createStore", { name, contractAddress: newContractAddress });
      fetchStores();

      alert("NFT Created Successfully!");
    } catch (error) {
      console.error("Error creating NFT:", error);
      alert("Error creating NFT. Please check your connection and try again.");
    }
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <form onSubmit={createNFT} className="mb-6">
        <input
          type="text"
          placeholder="NFT Name"
          className="border p-2 mr-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="NFT Symbol"
          className="border p-2 mr-2"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)} 
        />
        <input
          type="text"
          placeholder="Fee Mint"
          className="border p-2 mr-2"
          value={fee}
          onChange={(e) => setFee(e.target.value)}
        />
        <button className="bg-blue-500 text-white p-2">Create NFT</button>
      </form>

      <h2 className="text-xl font-bold mb-2">Stores</h2>
      <ul>
        {stores.map((store) => (
          <li key={store._id} className="border p-2 mb-2">
            {store.name} - {store.contractAddress}
          </li>
        ))}
      </ul>
    </div>
  );
}
