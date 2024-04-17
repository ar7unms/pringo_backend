const express = require('express');
const router = express.Router();
const tran = require('../models/transactionModel');
const bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/calcamount', (req, res) => {
    let amount;
    if (req.body.color === "no") {
        amount = req.body.nofpage * 1;
        amount *= req.body.noofcopy;
    } else if (req.body.color === "yes") {
        amount = req.body.nofpage * 5;
        amount *= req.body.noofcopy;
    }
    res.json({status:"success", "amount": amount }); // Sending amount as JSON
});

router.post('/calamount', (req, res) => {
    let amount;
    if (req.body.color === "no") {
        amount = req.body.nofpage * 1;
        amount *= req.body.noofbind;
    } else if (req.body.color === "yes") {
        amount = req.body.nofpage * 5;
        amount *= req.body.noofbind;
    }
    if(req.body.type === "softbind")
    {
        amount=amount+50;
    }
    else if(req.body.type === "hardbind")
    {
        amount=amount+100;
    }
    res.json({status:"success", "amount": amount }); // Sending amount as JSON
});

router.post('/pay', (req, res) => {
    const memberName = req.body;

    tran.inserttran(req.body, (error, results) => {
        if (error) {
            res.status(500).send('Error retrieving member data');
            return;
        } else {
           console.log("//////"+req.body.userid)
            res.json({status:"Transaction success"}); // Sending 200 for success
        }
    });
});

router.post('/search', (req, res) => {
    let user = req.body.userid;
    console.log(user)
    tran.searchtranByid(user, (error, results) => {
        if (error) {
            res.status(500).send('Error retrieving member data');
            return;
        }
        if (results.length > 0) {
            res.status(200).json(results);
        } else {
            res.status(404).send('Invalid user');
        }
    });
});



module.exports = router;
