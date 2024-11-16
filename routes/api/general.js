const express = require('express');
const router = express.Router();
//---------------------------------------------------------------------------------------------------------------------

//Chain lists
router.get('/chains', async (req, res) => {
    let data = [
      {id: 80002, name: 'Polygon Amoy', icon: 'cryptocurrency-color:matic'},
      {id: 84532, name: 'Base Sepolia', icon: 'token:base', color: '#000000'},
    ];
    
    res.status(200).json(data);
});

//---------------------------------------------------------------------------------------------------------------------

module.exports = router;
