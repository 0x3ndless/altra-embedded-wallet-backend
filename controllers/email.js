const nodemailer = require('nodemailer');
const { email_template } = require('./template');
const { email_template_secret } = require('./templateSecret');

const transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: process.env.NODEMAILER_EMAIL,
		pass: process.env.NODEMAILER_PASSWORD,
	}
});

// Function to send OTP email
const sendOTP = async (email, otp) => {
    try {

      const htmlContent = email_template.replace('{{otp}}', otp);

      const mailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: email,
        subject: `🗝️ ${otp} is your one-time passcode`,
        html: htmlContent,
      };
  
      const info = await transporter.sendMail(mailOptions);
      return { message: 'Email sent!', response: info.response };
    } catch (error) {
      return { message: 'Error sending email.', error: error.message };
    }
};


// Function to send OTP secret
const sendOTPSecret = async (email, otp) => {
  try {

    const htmlContent = email_template_secret.replace('{{otp}}', otp);

    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: `🗝️ ${otp} is your verification code`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    return { message: 'Email sent!', response: info.response };
  } catch (error) {
    return { message: 'Error sending email.', error: error.message };
  }
};


module.exports = { sendOTP, sendOTPSecret }