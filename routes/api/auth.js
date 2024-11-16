const express = require('express');
const router = express.Router();
//----------------------------------
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.SECRET_JWT;
const crypto = require('crypto');
//------------------------------------
const { sendOTP, sendOTPSecret } = require('../../controllers/email.js')
//Model-----------------------------
const Embedded = require('../../models/Embedded');


//Generate token
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generating six digit
};

// Ensuring correct key length with secret key
const key = crypto.createHash('sha256').update(jwtSecret).digest('base64').substr(0, 32); 

// Encrypt OTP function
const encryptOTP = (otp) => {
  const iv = crypto.randomBytes(16); // Generate random initialization vector
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
  let encrypted = cipher.update(otp, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
};

// Decrypt OTP function
const decryptOTP = (encryptedOTP) => {
  const otpParts = encryptedOTP.split(':');
  const iv = Buffer.from(otpParts[0], 'hex');
  const encryptedText = otpParts[1];
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

// User route for initiating passwordless authentication
router.post('/', async (req, res) => {
  
      const { email } = req.body;

      try {
        
        if (!email) {
          return res.status(400).json({ message: "Email is required." });
        }
        
        const otp = generateOTP();
        const encryptedOTP = encryptOTP(otp);
        await sendOTP(email, otp); 

        // JWT token with email and OTP payload
        const token = jwt.sign({ email, encryptedOTP }, jwtSecret, { expiresIn: '10m' });
        res.status(200).json({ token });

      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
    }
  );


// Verify OTP route
router.post('/verify', async (req, res) => {

    const { otp, token } = req.body;

    try {
      if (!otp || !token) {
        return res.status(400).json({ message: "OTP and token are required." });
      }

      // Verify JWT token
      const decodedToken = jwt.verify(token, jwtSecret);
      const { email, encryptedOTP } = decodedToken;

      // Decrypting OTP
      const decryptedOTP = decryptOTP(encryptedOTP);

      // Checking if OTP matches
      if (otp === decryptedOTP) {
        const existingUser = await Embedded.findOne({ email });
        if (existingUser) {
          const verifiedAddress = existingUser.wallet; 
          const device_share_verison = existingUser.device_share_version;
          //Create token for the verified address
          const token = jwt.sign({verifiedAddress}, jwtSecret, {expiresIn: '1d'})
          return res.status(200).json({ verified: true, email, isNewUser: false, token, verifiedAddress, device_share_verison });
        } else {
          return res.status(200).json({ verified: true, email, isNewUser: true });
        }
      } else {
        return res.status(401).json({ verified: false, message: "Invalid OTP." });
      }
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ verified: false, message: "Server error." });
    }
});

//------------------------------------------------Reveal secret key----------------------------------------------

// User route for revealing secret key
router.post('/secret', async (req, res) => {
  
  const { email } = req.body;

  try {
    
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }
    
    const otp = generateOTP();
    const encryptedOTP = encryptOTP(otp);
    await sendOTPSecret(email, otp); 

    // JWT token with email and OTP payload
    const token = jwt.sign({ email, encryptedOTP }, jwtSecret, { expiresIn: '2m' });
    res.status(200).json({ token });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}
);


// Verify OTP route
router.post('/verify/secret', async (req, res) => {

  const { otp, token } = req.body;

  try {
    if (!otp || !token) {
      return res.status(400).json({ message: "OTP and token are required." });
    }

    // Verify JWT token
    const decodedToken = jwt.verify(token, jwtSecret);
    const { email, encryptedOTP } = decodedToken;

    // Decrypting OTP
    const decryptedOTP = decryptOTP(encryptedOTP);

    // Checking if OTP matches
    if (otp === decryptedOTP) {
      return res.status(200).json({ verified: true, email});
    } else {
      return res.status(401).json({ verified: false, message: "Invalid OTP." });
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ verified: false, message: "Server error." });
  }
});

module.exports = router;
