const email_template_secret = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>One-time passcode</title>
<style>
    /* Styles for the email template */
    body {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
    }
    .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .logo {
        text-align: center;
        margin-top: 30px;
    }
    .logo_keyword2 {
        background: -webkit-linear-gradient(300deg, rgb(255, 48, 48) 0%, rgb(255, 171, 0) 25%, rgb(255, 48, 48) 50%, rgb(255, 171, 0) 75%, rgb(0, 171, 85) 100%) 0% 0% / 400%;
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
    }    
    .info-box {
        text-align: center;
        margin-top: 23px;
        color: #666;
        font-size: 14px;
    }
    .code-box {
        margin: 0 auto; /* Center the box */
        width: 100px; /* Set the width of the box */
        padding: 5px;
        border: 0.5px solid #ccc;
        border-radius: 10px;
        text-align: center;
    }
    .expiration {
        margin-top: 35px;
        text-align: center;
        color: #666;
    }
    .social-login {
        margin-top: 30px;
        text-align: center;
        color: #666;
    }
</style>
</head>
<body>
<div class="container">
    <div class="logo">
        <h1 style="margin: 10px 0; font-size: 34px;">Altra</h1>
    </div>
    <div class="info-box">
        <p>Your verification code is:</p>
    </div>
    <div class="code-box">
        <h2 style="font-size: 24px; margin: 10px 0;">{{otp}}</h2>
    </div>
    <div class="expiration">
        <p style="font-size: 14px;">This code will expire in 2 minutes.</p>
    </div>
</div>
</body>
</html>
`

module.exports = { email_template_secret }