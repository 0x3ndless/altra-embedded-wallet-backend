const mongoose = require('mongoose');

//DB URI
const walletURI = process.env.MONGODB_WALLET;

// Connectig to the Embedded wallet DB
const connectDBWallet = mongoose.createConnection(walletURI, { useNewUrlParser: true, useUnifiedTopology: true });

connectDBWallet.on('error', console.error.bind(console, 'Wallet DB Connection error:'));
connectDBWallet.once('open', () => {
  console.log('Wallet database connected...');
});


module.exports = { connectDBWallet };
