// fabric-utils.js: Utility functions for interacting with Hyperledger Fabric

const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

const ccpPath = path.resolve(__dirname, '../fabric-config', 'connection-org1.json');
const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));


// getContract(): Returns a contract object for interacting with the blockchain
async function getContract() {
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
  
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });
  
    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('mychaincode');
  
    return { contract, gateway };
  }

//sendFileToBlockchain(fileData): Submits a transaction to the blockchain (sendFile) with the file data as the argument
async function sendFileToBlockchain(fileData) {
    const { contract, gateway } = await getContract();
  
    try {
      const result = await contract.submitTransaction('sendFile', fileData);  // Replace 'sendFile' with your chaincode function
      console.log(`Transaction has been submitted, result is: ${result.toString()}`);
  
    } catch (error) {
      console.error(`Failed to submit transaction: ${error}`);
      throw new Error(error);
    } finally {
      gateway.disconnect();
    }
}

module.exports = { getContract, sendFileToBlockchain };
