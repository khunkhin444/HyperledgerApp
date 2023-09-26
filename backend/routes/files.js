const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage: storage });
const router = express.Router();

router.post('/sendFile', upload.single('file'), async (req, res) => { //Replace the /sendFile route with actual functioned chaincode
  try {
    const contract = req.contract;
    const fileBuffer = req.file.buffer;
    await contract.submitTransaction('sendFile', fileBuffer.toString('base64'));

    res.status(200).json({ success: true, message: 'File sent successfully.' });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/downloadFile', async (req, res) => { //Replace the /downloadFile route with actual functioned chaincode
  try {
    const contract = req.contract;
    const result = await contract.evaluateTransaction('downloadFile', 'fileId');  // Replace 'fileId' with the actual ID you use
    const fileBuffer = Buffer.from(result, 'base64');

    res.status(200).send(fileBuffer);

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/sendBackFile', upload.single('file'), async (req, res) => { //Replace the /sendBackFile route with actual functioned chaincode
  try {
    const contract = req.contract;
    const fileBuffer = req.file.buffer;
    await contract.submitTransaction('sendBackFile', fileBuffer.toString('base64'));

    res.status(200).json({ success: true, message: 'File sent back successfully.' });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
