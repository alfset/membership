// lib/cors.js
import Cors from "cors";

// Initialize CORS middleware
const cors = Cors({
  methods: ["GET", "POST", "PUT", "DELETE"],
  origin: "*" // Allow all origins, you can restrict this to your frontend URL in production
});

export const runMiddleware = (req, res) =>
  new Promise((resolve, reject) => {
    cors(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
