const ethers = require('ethers');

const provider = new ethers.providers.WebSocketProvider('ws://localhost:3051');

provider.addListener('pending', async (transaction) => {
    console.log('Transaction received:', transaction);
});