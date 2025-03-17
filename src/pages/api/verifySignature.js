import { ethers } from "ethers";

const verifySignature = (message, signature, expectedAddress) => {
  try {
    const signerAddress = ethers.verifyMessage(message, signature);
    return signerAddress.toLowerCase() === expectedAddress.toLowerCase();
  } catch (error) {
    console.error("Error verifying signature:", error);
    return false;
  }
};

const checkNFTOwnership = async (address, contractAddress, provider) => {
  try {
    const abi = [
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          }
        ],
        "name": "balanceOf",
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
    ];
    
    const contract = new ethers.Contract(contractAddress, abi, provider);
    const balance = await contract.balanceOf(address);
    return balance.gt(0); 
  } catch (error) {
    console.error("Error checking NFT ownership:", error);
    return false;
  }
};

const applyDiscount = (totalAmount) => {
  const discountPercentage = 10;
  const discountAmount = (totalAmount * discountPercentage) / 100;
  return totalAmount - discountAmount;
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { message, signature, expectedAddress, nftContractAddress, totalAmount } = req.body;
    const amount = totalAmount || req.query.totalAmount;

    if (!amount) {
      return res.status(400).json({ success: false, message: "Total amount is required" });
    }

    const isValid = verifySignature(message, signature, expectedAddress);

    if (isValid) {
      const provider = new ethers.JsonRpcProvider("https://rpc.sepolia.ethpandaops.io"); 

      const ownsNFT = await checkNFTOwnership(expectedAddress, nftContractAddress, provider);

      let discountedAmount = amount;

      if (ownsNFT) {
        discountedAmount = applyDiscount(amount);
        return res.status(200).json({ 
          success: true, 
          message: "Signature is valid, user holds an NFT and discount applied!",
          discountedAmount,
        });
      } else {
        return res.status(200).json({
          success: false,
          message: "Signature is valid, but user does not hold an NFT.",
          discountedAmount, 
        });
      }
    } else {
      return res.status(400).json({ success: false, message: "Invalid signature!" });
    }
  } catch (error) {
    console.error("Error verifying signature and checking NFTs:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}
