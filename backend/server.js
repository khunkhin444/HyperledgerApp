const express = require('express');
const app = express();
const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/files');
const routeHandlers = require('./routes/routeHandlers');
const mydatabase = require('./db'); // Importing the CouchDB database instance
const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs'); // Node.js file system module
const cors = require("cors");

app.use(cors()); // Use CORS Middleware
app.use(bodyParser.json()); // Middleware for JSON body parsing
// app.use('/',routeHandlers); // Use the route handlers

let gateway; // Gateway instance
let contract; // Smart contract instance

async function initializeFabricGateway() {
    const wallet = await Wallets.newFileSystemWallet('./wallet');
    gateway = new Gateway();

    const connectionProfileJson = fs.readFileSync('./connection-profile.json', 'utf8');
    const connectionProfile = JSON.parse(connectionProfileJson);

    await gateway.connect(connectionProfile, { wallet, identity: 'userId' });

    const network = await gateway.getNetwork('mychannel');  // Replace 'mychannel' with your channel name
    contract = network.getContract('mychaincode');  // Replace 'mychaincode' with your smart contract name

    return { gateway, wallet, contract };
}

// Initialize Fabric Gateway
initializeFabricGateway().then(({ gateway, wallet, contract }) => {
    // Set Middleware and Routes
    app.use(express.json()); // Middleware for JSON body parsing

    app.use('/auth', (req, res, next) => {
        req.db = mydatabase;  // attach the db instance to the request object
        next();
    }, authRoutes);

    app.use('/files', (req, res, next) => {
        req.db = mydatabase;  // attach the db instance to the request object
        req.contract = contract;  // attach the contract to the request object
        next();
    }, fileRoutes);

    app.post("/auth/signup", (req, res) => {
        console.log("Signup API was hit");
        // other code
    });

    const PORT = 3001;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((err) => {
    console.log('Error initializing Fabric Gateway', err);
});
