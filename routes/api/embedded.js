const express = require('express');
const router = express.Router();
//----------------------------------------------
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.SECRET_JWT;
//Models
const Embedded = require('../../models/Embedded');
const authenticateToken = require('../../middleware/authenticateToken');


//Getting current embedded wallet info
router.get('/wallet', authenticateToken, async (req, res) => {

  const userData = req.authData;
  const wallet = userData.verifiedAddress;

  try {
    
    const embeddedWallet = await Embedded.findOne({ wallet }, { recovery_share: 0 }).sort({ date: -1 }).lean();
    res.json(embeddedWallet);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Not authorized');
  }
});


//Getting current embedded wallet info
router.get('/recover', authenticateToken, async (req, res) => {

  const userData = req.authData;
  const wallet = userData.verifiedAddress;

  try {
    
    const embeddedWallet = await Embedded.findOne({ wallet }).sort({ date: -1 }).lean();
    res.json(embeddedWallet);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Not authorized');
  }
});


//Creating embedded wallet 
router.post(
    '/',
    async (req, res) => {
  
      const { wallet, email, auth_share, recovery_share } = req.body;
  
      try {
        
        if (!wallet || !auth_share || !recovery_share) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        let embeddedWallet = await Embedded.findOne({ email });
        
  
        if (embeddedWallet) {
          return res
            .json({ exists: true });
        }
  
        embeddedWallet = new Embedded({
          wallet,
          email,
          auth_share,
          recovery_share,
        });
  
        await embeddedWallet.save();

        //Create token for the verified address
        const verifiedAddress = wallet
        const token = jwt.sign({verifiedAddress}, jwtSecret, {expiresIn: '1d'})

        res.json({verifiedAddress, token});
  
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
    }
  );
  


// Updating embedded info
router.put('/wallet', authenticateToken, async (req, res) => {

  const id = req.header('x-auth-id');
  
  const userData = req.authData;
  const wallet = userData.verifiedAddress;

  if(!id || !wallet) {
    return res.status(401).json({ msg: 'Authorization denied' });
  }

  try {
    const embeddedWallet = await Embedded.findOne({ _id: id });

    if (!embeddedWallet) {
      return res.status(404).json({ msg: 'Embedded wallet not found' });
    }

    if (wallet !== embeddedWallet.wallet) {
      return res.status(401).json({ msg: 'Authorization denied' });
    }

    const { auth_share, recovery_share } = req.body;

    embeddedWallet.device_share_version += 1;
    embeddedWallet.auth_share = auth_share;
    embeddedWallet.recovery_share = recovery_share;

    await embeddedWallet.save();
    res.json(embeddedWallet);
    
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


module.exports = router;
