//Handle fiile-related transactions.

const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();  // Store the file in memory
const upload = multer({ storage: storage });
const router = express.Router();

router.post('/sendFile', upload.single('file'), (req, res) => {
    // File sending logic here. Use Hyperledger Fabric SDK to send file to the blockchain.
});

router.get('/downloadFile', (req, res) => {
    // File download logic here. Retrieve file from the blockchain using Hyperledger Fabric SDK.
});

router.post('/sendBackFile', upload.single('file'), (req, res) => {
    // Logic to send back the received file.
});

module.exports = router;
