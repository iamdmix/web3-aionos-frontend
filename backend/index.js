// Import necessary libraries
require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const axios = require("axios"); // ADDED: for making HTTP requests
const FormData = require("form-data"); // ADDED: to create the multipart/form-data payload
const fs = require("fs");
const path = require("path");

// Initialize Express app
const app = express();
const port = 3001;

// Middleware Setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure Multer for temporary file storage
const upload = multer({ dest: "uploads/" });

// --- API ENDPOINT ---
// POST /upload-ipfs
app.post("/upload-ipfs", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file was uploaded." });
  }

  // Pinata API endpoint for pinning files
  const pinataEndpoint = "https://api.pinata.cloud/pinning/pinFileToIPFS";
  const filePath = req.file.path;

  // Create a new form-data instance and append the file
  const formData = new FormData();
  const fileStream = fs.createReadStream(filePath);
  formData.append("file", fileStream, { filename: req.file.originalname });

  try {
    // Make the POST request to Pinata using axios
    const response = await axios.post(pinataEndpoint, formData, {
      headers: {
        ...formData.getHeaders(), // This sets the correct Content-Type with boundary
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
      },
    });

    // Delete the temporary file
    fs.unlinkSync(filePath);

    // Return the IPFS hash from the Pinata API response
    res.status(200).json({ ipfsHash: response.data.IpfsHash });
  } catch (error) {
    console.error(
      "Error uploading to Pinata:",
      error.response ? error.response.data : error.message
    );
    // Clean up the file even if the upload fails
    fs.unlinkSync(filePath);
    res.status(500).json({ error: "Failed to upload file to IPFS." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`✅ Backend server running at http://localhost:${port}`);
  if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
  }
});
