const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const cors = require("cors");


const app = express();


const corsOptions ={
  origin:'*', 
  credentials:true,  //access-control-allow-credentials:true
  optionSuccessStatus:200,
}


// Init Middleware
app.use(cors(corsOptions))
app.use(express.json());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req,res) => {
  res.json({"Altra": "Embedded Wallet"});
})

//routes
app.use('/api/embedded', require('./routes/api/embedded'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/general', require('./routes/api/general'));


const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
