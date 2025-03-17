// pages/api/getStore.js
import { connectToDB } from "../../lib/mongoose";
import Store from "../../models/Store";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
    await connectToDB();
    const stores = await Store.find({});
    res.status(200).json({ success: true, stores });
  } catch (error) {
    console.error("Error in /api/getStore:", error); 
    res.status(500).json({ success: false, error: error.message });
  }
}
