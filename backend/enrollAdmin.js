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
            await enrollAdmin('Org1', { url: 'https://localhost:7054', caName: 'ca_org1' }, 'Org1MSP');
            // Enroll admin for Org2
            await enrollAdmin('Org2', { url: 'https://localhost:8054', caName: 'ca_org2' }, 'Org2MSP');    
            // Enroll admin for Orderer
            await enrollAdmin('Orderer', { url: 'https://localhost:9054', caName: 'ca_orderer' }, 'OrdererMSP');
            } catch (err) {
        console.error('Failed to enroll admin:', err);
        process.exit(1);
    }
}
    
main();
    