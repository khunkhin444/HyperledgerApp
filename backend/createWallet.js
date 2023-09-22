const { Wallets } = require('fabric-network');

async function main() {
    const wallet = await Wallets.newFileSystemWallet('./wallet');
    console.log('Wallet created at ./wallet');
}

main().catch(err => {
    console.error('Failed to create wallet:', err);
    process.exit(1);
});