import { useEffect, useState } from "react";
import axios from "axios";

export default function SignerPage() {
  const [message, setMessage] = useState("");
  const [storeId, setStoreId] = useState("");
  const [signature, setSignature] = useState("");
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [totalAmount, setTotalAmount] = useState(100);
  const [discountedAmount, setDiscountedAmount] = useState(null);
  const [contractAddress, setContractAddress] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get("message");
    const storeId = urlParams.get("storeId");
    const amount = urlParams.get("totalAmount");

    setMessage(decodeURIComponent(message));
    setStoreId(storeId);
    if (amount) {
      setTotalAmount(parseFloat(amount)); 
    }

    const fetchContractAddress = async () => {
      try {
        const res = await axios.get(`/api/getStoreDetails?storeId=${storeId}`);
        if (res.data.success) {
          setContractAddress(res.data.contractAddress);
        }
      } catch (error) {
        console.error("Error fetching store details:", error);
      }
    };

    if (storeId) {
      fetchContractAddress();
    }
  }, [storeId]);

  const signMessage = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        const account = accounts[0];
        const signedMessage = await window.ethereum.request({
          method: "personal_sign",
          params: [message, account],
        });

        setSignature(signedMessage);
        alert("Message signed successfully!");

        const res = await axios.post("/api/verifySignature", {
          message,
          signature: signedMessage,
          expectedAddress: account,
          totalAmount: totalAmount, 
          nftContractAddress: contractAddress, 
        });

        if (res.data.success) {
          setVerificationStatus(res.data.message);
          setDiscountedAmount(res.data.discountedAmount);
        } else {
          setVerificationStatus(res.data.message);
        }
      } catch (error) {
        console.error("Error signing message:", error);
        alert("Failed to sign the message.");
      }
    } else {
      alert("MetaMask is not installed.");
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Signer Page</h1>
      <p>Please sign the following message using your wallet:</p>
      <p>contract Address: {contractAddress}</p>

      <p><strong>{message}</strong></p>

      <button className="bg-blue-500 text-white p-2 mt-4" onClick={signMessage}>
        Sign Message
      </button>

      {signature && (
        <div className="mt-4">
          <h2 className="text-xl">Signature:</h2>
          <p>{signature}</p>
        </div>
      )}

      {verificationStatus && (
        <div className="mt-4">
          <h2 className="text-xl">{verificationStatus}</h2>
          {discountedAmount !== null && (
            <div className="mt-2">
              <p>Discounted Amount: ${discountedAmount}</p>
            </div>
          )}
        </div>
      )}

      {totalAmount && (
        <div className="mt-4">
          <p>Total Amount: ${totalAmount}</p>
        </div>
      )}
    </div>
  );
}
