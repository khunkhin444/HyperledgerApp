// Handle file-related transactions.

const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage: storage });
const router = express.Router();
const { Gateway, Wallets } = require('fabric-network');

const initializeWallet = async () => {
  return await Wallets.newFileSystemWallet('./wallet');
};

router.post('/sendFile', upload.single('file'), async (req, res) => {
  const wallet = await initializeWallet();
  const gateway = new Gateway();

  try {
    await gateway.connect('./config/connection-profile.json', { wallet, identity: 'userId' });

    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('mycontract');
    const fileBuffer = req.file.buffer;
    await contract.submitTransaction('sendFile', fileBuffer.toString('base64'));

    res.status(200).json({ success: true, message: 'File sent successfully.' });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  } finally {
    gateway.disconnect();
  }
});

router.get('/downloadFile', async (req, res) => {
  const wallet = await initializeWallet();
  const gateway = new Gateway();

  try {
    // await gateway.connect('./config/connection-profile.json', { wallet, identity: 'userId' });
    // File download logic here. Retrieve file from the blockchain using Hyperledger Fabric SDK.
    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('mycontract');
    const result = await contract.evaluateTransaction('downloadFile', 'fileId');
    const fileBuffer = Buffer.from(result, 'base64');

    res.status(200).send(fileBuffer);

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  } finally {
    gateway.disconnect();
  }
});

router.post('/sendBackFile', upload.single('file'), async (req, res) => {
  const wallet = await initializeWallet();
  const gateway = new Gateway();

  try {
    await gateway.connect('./config/connection-profile.json', { wallet, identity: 'userId' });
    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('mycontract');
    const fileBuffer = req.file.buffer;
    await contract.submitTransaction('sendBackFile', fileBuffer.toString('base64'));

    res.status(200).json({ success: true, message: 'File sent back successfully.' });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  } finally {
    gateway.disconnect();
  }
});

module.exports = router;