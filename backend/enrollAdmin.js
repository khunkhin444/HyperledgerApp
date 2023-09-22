const { Wallets, Gateway } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');

async function main() {
    const wallet = await Wallets.newFileSystemWallet('./wallet');

    // Create a new CA client for interacting with the CA.
    const caInfo = { url: 'http://localhost:7054', caName: 'ca.example.com' };
    const ca = new FabricCAServices(caInfo);

    // Register & Enroll admin
    const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
    const x509Identity = {
        credentials: {
            certificate: enrollment.certificate,
            privateKey: enrollment.key.toBytes(),
        },
        mspId: 'Org1MSP',
        type: 'X.509',
    };

    await wallet.put('admin', x509Identity);
    console.log('Successfully enrolled admin and imported it into the wallet');
}

main().catch(err => {
    console.error('Failed to enroll admin:', err);
    process.exit(1);
});