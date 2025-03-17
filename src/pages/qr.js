import { useState } from "react";
import axios from "axios";

export default function QRGenerator() {
  const [storeId, setStoreId] = useState("");
  const [qrCode, setQRCode] = useState(null);
  const [message, setMessage] = useState("");
  const [signerPageUrl, setSignerPageUrl] = useState("");

  // Function to generate QR code
  async function generateQR() {
    try {
      // Making the request to generate the QR code and other data
      const res = await axios.get(`http://localhost:3000/api/verifyQr?storeId=${storeId}`);
      
      if (res.data.success) {
        setQRCode(res.data.qrCodeImage); 
        setMessage(res.data.message); 
        setSignerPageUrl(res.data.signerPageUrl);
      } else {
        console.error("Failed to generate QR code", res.data.message);
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Generate QR Code</h1>
        <input
        type="text"
        placeholder="Store ID"
        className="border p-2 mr-2"
        value={storeId}
        onChange={(e) => setStoreId(e.target.value)}
      />
      <button className="bg-green-500 text-white p-2" onClick={generateQR}>
        Generate QR
      </button>
      {qrCode && (
        <div className="mt-4">
          <h2 className="text-xl">Scan this QR Code with MetaMask</h2>
          <img src={qrCode} alt="QR Code" className="mt-4" />
          <p className="mt-4">
            Please sign the following message with your wallet:
          </p>
          <p><strong>{message}</strong></p>

          {/* Link to signer page */}
          <div className="mt-4">
            <a href={signerPageUrl} target="_blank" rel="noopener noreferrer">
              Click here to sign the message
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
