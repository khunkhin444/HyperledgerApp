const { Wallets, Gateway, X509WalletMixin } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');

async function registerUser(userId, org, caInfo, mspId) {
    try {
        // Create a new file system based wallet for managing identities.
        const walletPath = `./wallet-${org}`;
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // Check to see if we've already enrolled the user.
        const userIdentity = await wallet.get(userId);
        if (userIdentity) {
            console.log(`An identity for the user ${userId} already exists in the wallet`);
            return;
        }

        // Check to see if we've already enrolled the admin user.
        const adminIdentity = await wallet.get('admin');
        if (!adminIdentity) {
            console.log('An identity for the admin user does not exist in the wallet');
            console.log('Run the enrollAdmin.js application before retrying');
            return;
        }

        // Connect to CA and get admin context
        const ca = new FabricCAServices(caInfo);
        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, 'admin');

        // Register the user, enroll the user, and import the new identity into the wallet.
        const secret = await ca.register({
            affiliation: `${org}.department1`,
            enrollmentID: userId,
            role: 'client'
        }, adminUser);

        const enrollment = await ca.enroll({
            enrollmentID: userId,
            enrollmentSecret: secret
        });

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

    } catch (error) {
        console.error(`Failed to register user ${userId}: ${error}`);
        if (error.message.includes('Authorization failure')) {
            console.error(`Make sure the user who is running the registerUser function has the necessary permissions to register a new user.`);
        }
    }
}

async function main() {
    try {
        await registerUser('newUser1', 'Org1', { url: 'http://localhost:7054', caName: 'ca.org1.example.com' }, 'Org1MSP');
        // Uncomment below if you also wish to register 'newUser2' for 'Org2'
        // await registerUser('newUser2', 'Org2', { url: 'http://localhost:8054', caName: 'ca.org2.example.com' }, 'Org2MSP');
    } catch (error) {
        console.error(`Failed to register user: ${error}`);
        process.exit(1);
    }
}

main();
