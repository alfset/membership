import { connectToDB } from "../../lib/mongoose";
import Store from "../../models/Store";
import QRCode from "qrcode";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { storeId } = req.query;

    // Connect to the database
    await connectToDB();
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ message: "Store Not Found" });
    }

    // Prepare the message to sign
    const message = `Please sign this message for Store ID: ${storeId}`;
    const messageForSigner = `message=${encodeURIComponent(message)}&storeId=${encodeURIComponent(storeId)}`;

    // Generate the URL with the message for signing
    const signerPageUrl = `http://localhost:3000/scan?${messageForSigner}`;

    // Generate the QR code for the URL
    const qrCodeImage = await QRCode.toDataURL(signerPageUrl);

    res.json({
      success: true,
      qrCodeImage,   // Base64 QR Code image for the frontend
      message,       // The message to sign
      signerPageUrl  // The URL to the signer page
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
