const express = require('express');
const app = express();
const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/files');
const mydatabase = require('./db');  // Importing the CouchDB database instance
const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs'); // Node.js file system module

async function initializeFabricGateway() {
    const wallet = await Wallets.newFileSystemWallet('./wallet');
    const gateway = new Gateway();

    const connectionProfileJson = fs.readFileSync('./connection-profile.json', 'utf8');
    const connectionProfile = JSON.parse(connectionProfileJson);

    await gateway.connect(connectionProfile, { wallet, identity: 'userId' });
    
    return { gateway, wallet };
}

app.use(express.json());  // Middleware for JSON body parsing

// You can now use 'mydatabase' within your routes or middleware
// For example, you might pass it as a parameter to the route handlers

app.use('/auth', (req, res, next) => {
    req.db = mydatabase;  // attach the db instance to the request object
    next();
}, authRoutes);

app.use('/files', (req, res, next) => {
    req.db = mydatabase;  // attach the db instance to the request object
    next();
}, fileRoutes);

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

