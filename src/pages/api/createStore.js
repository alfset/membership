// pages/api/createStore.js (or other relevant files)
import { runMiddleware } from "../../lib/cors"; // Import the CORS middleware helper
import { connectToDB } from "../../lib/mongoose";
import Store from "../../models/Store";

export default async function handler(req, res) {
  try {
    // Run CORS middleware
    await runMiddleware(req, res);

    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method Not Allowed" });
    }

    // Connect to the database
    await connectToDB();
    const { name, contractAddress } = req.body;

    if (!name || !contractAddress) {
      return res.status(400).json({ message: "Name and contractAddress are required" });
    }

    // Save the store to the database
    const store = new Store({ name, contractAddress });
    await store.save();

    res.status(201).json({ success: true, store });
  } catch (error) {
    console.error("Error in /api/createStore:", error); // Log the error for debugging
    res.status(500).json({ success: false, error: error.message });
  }
}
