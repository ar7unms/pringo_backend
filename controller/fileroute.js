const express = require('express');
const router = express.Router();
const multer = require('multer');
const User = require('../models/filemodel');
const bodyParser = require('body-parser');
const path = require('path');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const fileName = uniqueSuffix + '-' + file.originalname;
      cb(null, fileName);
    },
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(pdf)$/)) {
            return cb(new Error('Only pdf files are allowed'));
        }
        cb(null, true);
    }
});

router.post('/upload', upload.single('file'), (req, res, next) => {
    console.log(req.body);
    // Check if file was uploaded
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    // Destructure properties from req.file
    const { filename: docpath } = req.file;
    
    User.insertuploads(req.body.userid, req.body.start,req.body.end,req.body.noofcopy, req.body.color, docpath,req.body.status,req.body.notify,(err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).json({ error: 'Error inserting data' });
        } else {
            console.log('Data inserted successfully:', result);
            res.status(200).json({ success: 'Data inserted successfully' });
        }
    });
});
router.post('/viewall', (req, res) => {
    User.selectall((error,results)=>{
        if(error){
            res.status(500).send('Error retrieving member data');
        }
        if(results.length > 0){
            res.status(200).json(results);
        }
        else{
            res.status(404).send('Invalid user');
        }
    });
});

router.post('/viewnotify', (req, res) => {
    User.selectnotify(req.body.userid,(error,results)=>{
        if(error){
            res.status(500).send('Error retrieving member data');
        }
        if(results.length > 0){
            console.log(req.body.userid)
            res.status(200).json(results);
        }
        else{
            res.status(404).send('no data');
        }
    });
});

router.post('/updatestatus', (req, res) => {
    User.updatestatus(req.body.id,(error,results)=>{
        if(error){
            res.status(500).send('Error retrieving member data');
        }
        else{
            res.json({
                status:"status updated"
            });
        }
    });
});

router.post('/viewupdated', (req, res) => {
    User.selectupdated((error,results)=>{
        if(error){
            res.status(500).send('Error retrieving member data');
        }
        if(results.length > 0){
            res.status(200).json(results);
        }
        else{
            res.status(404).send('no data');
        }
    });
});

router.post('/viewnotupdated', (req, res) => {
    User.selectnotupdated((error,results)=>{
        if(error){
            res.status(500).send('Error retrieving member data');
        }
        if(results.length > 0){
            res.status(200).json(results);
        }
        else{
            res.status(404).send('no data');
        }
    });
});


router.post('/viewpdf', (req, res) => {
    User.selectone(req.body.id,(error, results) => {
        if (error) {
            return res.status(500).send('Error retrieving data');
        }
        if (results.length > 0) {
            console.log(results)
            // Loop through each result and add file paths to the array
                const fileName = results[0].docpath;
                const filePath = path.join(__dirname, '../uploads/', fileName);
                console.log(filePath)
                User.updatedocument(filePath,req.body.id,(error, results) => {
                    if (error) {
                        return res.status(500).send('Error updating data');
                    }
                    else{
                        res.json({status:"updated"})
                    }
                 });
        } else {
            return res.status(404).send('No results found');
        }
    });
});

router.post('/updatenotify', (req, res) => {
    User.updatenotify(req.body.id,(error,results)=>{
        if(error){
            res.status(500).send('Error retrieving member data');
        }
        else{
            res.json({
                status:"status updated"
            });
        }
    });
});

router.post('/updatenotif', (req, res) => {
    User.updatenotif(req.body.id,(error,results)=>{
        if(error){
            res.status(500).send('Error retrieving member data');
        }
        else{
            res.json({
                status:"status updated"
            });
        }
    });
});


module.exports = router;




module.exports = router;
