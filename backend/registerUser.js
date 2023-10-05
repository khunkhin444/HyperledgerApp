const { Wallets, Gateway, X509WalletMixin } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');

async function registerUser(userId, org, caInfo, mspId) {
    // Create a new file system based wallet for managing identities.
    const walletPath = `./wallet-${org}`;
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // Check if the user is already enrolled
    const userIdentity = await wallet.get(userId);
    if (userIdentity) {
        console.log(`An identity for the user ${userId} already exists in the wallet`);
        return;
    }

    // Must use an admin identity to register a new user
    const adminIdentity = await wallet.get('admin');
    if (!adminIdentity) {
        console.log('An identity for the admin user does not exist in the wallet');
        console.log('Run the enrollAdmin.js application before retrying');
        return;
    }

    // Connect to CA
    const ca = new FabricCAServices(caInfo);
    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, 'admin');

    // Register user
    const secret = await ca.register({
        affiliation: `${org}.department1`, // change this to suit your needs
        enrollmentID: userId,
        role: 'client'
    }, adminUser);

    // Enroll user
    const enrollment = await ca.enroll({
        enrollmentID: userId,
        enrollmentSecret: secret
    });

    // Save user to wallet
    const x509Identity = {
        credentials: {
            certificate: enrollment.certificate,
            privateKey: enrollment.key.toBytes(),
        },
        mspId,
        type: 'X.509',
    };
    await wallet.put(userId, x509Identity);
    console.log(`Successfully registered and enrolled user ${userId} and imported it into the wallet`);
}

async function main() {
    try {
        await registerUser('newUser1', 'Org1', { url: 'http://localhost:7054', caName: 'ca_org1' }, 'Org1MSP');
    } catch (error) {
        console.error(`Failed to register user: ${error}`);
        process.exit(1);
    }
}

main();
