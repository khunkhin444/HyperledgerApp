//enrollAdmin.js: Enroll the admin user for the organization and import it into the wallet for the organization specified in the argument passed to the function.

const { Wallets, Gateway } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');

async function enrollAdmin(org, caInfo, mspId) {
    const wallet = await Wallets.newFileSystemWallet(`./wallet-${org}`);
    
    // Create a new CA client for interacting with the CA.
    const ca = new FabricCAServices(caInfo);
    
    // Register & Enroll admin
    const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
    const x509Identity = {
        credentials: {
            certificate: enrollment.certificate,
            privateKey: enrollment.key.toBytes(),
        },
        mspId: mspId,
        type: 'X.509',
    };
    
    await wallet.put('admin', x509Identity);
    console.log(`Successfully enrolled admin for ${org} and imported it into the wallet`);
}
    
async function main() {
    try {
            // Enroll admin for Org1
    
            await enrollAdmin('Org1', { url: 'http://localhost:7054', caName: 'ca.org1.example.com' }, 'Org1MSP');

            // Enroll admin for Org2
            await enrollAdmin('Org2', { url: 'http://localhost:8054', caName: 'ca.org2.example.com' }, 'Org2MSP');    
            // Enroll admin for Orderer
            await enrollAdmin('Orderer', { url: 'http://localhost:9054', caName: 'ca.orderer.example.com' }, 'OrdererMSP');
            } catch (err) {
        console.error('Failed to enroll admin:', err);
        process.exit(1);
    }
}
    
main();
    