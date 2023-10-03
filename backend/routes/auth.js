// auth.js: Authentication routes for the application

const express = require('express');
const router = express.Router();
const jwt = require('jwt-simple');
const bcrypt = require('bcrypt');
const Nano = require('nano');
const nano = Nano('http://admin:admin@localhost:5984');
const mydatabase = nano.db.use('mydatabase');
const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');

// Secret key for JWT encoding
const secret = "YourSecretKey";
const saltRounds = 10;

const initializeFabricGateway = async () => {
    const wallet = await Wallets.newFileSystemWallet('./wallet');
    const gateway = new Gateway();

    const connectionProfileJson = fs.readFileSync('../connection-profile.json', 'utf8');
    const connectionProfile = JSON.parse(connectionProfileJson);

    await gateway.connect(connectionProfile, { wallet, identity: 'userId' });
    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('mycontract');
    
    return contract;
};

router.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await mydatabase.insert({ username, password: hashedPassword }, username);
    
    const token = jwt.encode({ username }, secret);
    
    res.status(200).json({ message: 'User added successfully', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/signin', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await mydatabase.get(username);
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      const token = jwt.encode({ username }, secret);
      
      // Initialize Fabric Gateway & Contract
      const contract = await initializeFabricGateway();
      req.contract = contract;
      
      res.status(200).json({ message: 'User authenticated successfully', token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
