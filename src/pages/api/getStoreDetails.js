// /pages/api/getStoreDetails.js

import { connectToDB } from "../../lib/mongoose";
import Store from "../../models/Store";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { storeId } = req.query;
    await connectToDB();
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ message: "Store Not Found" });
    }

    res.json({
      success: true,
      contractAddress: store.contractAddress,  
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
