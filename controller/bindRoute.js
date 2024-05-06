const express = require('express');
const router = express.Router();
const multer = require('multer');
const bind = require('../models/bindmodel');
const bodyParser = require('body-parser');

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
    
    bind.insertuploads(req.body.userid, req.body.nofpage, req.body.type,req.body.color,docpath,req.body.noofbind,req.body.status,req.body.notify,(err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).json({ error: 'Error inserting data' });
        } else {
            console.log('Data inserted successfully:', result);
            res.status(200).json({ success: 'Data inserted successfully' });
        }
    });
});
router.get('/viewall', (req, res) => {
    bind.selectall((error,results)=>{
        if(error){
            res.status(500).send('Error retrieving bind data');
        }
        if(results.length > 0){
            res.status(200).json(results);
        }
        else{
            res.status(404).send('Invalid');
        }
    });
});

router.post('/updatestatus', (req, res) => {
    bind.updatestatus(req.body.id,(error,results)=>{
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
    bind.selectupdated((error,results)=>{
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

router.post('/viewnotify', (req, res) => {
    bind.selectnotify(req.body.userid,(error,results)=>{
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

router.post('/updatenotify', (req, res) => {
    bind.updatenotify(req.body.id,(error,results)=>{
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
    bind.updatenotif(req.body.id,(error,results)=>{
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


router.post('/viewnotupdated', (req, res) => {
    bind.selectnotupdated((error,results)=>{
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

router.post('/printhistor', (req, res) => {
    bind.printhistory(req.body.userid,(error,results)=>{
        if(error){
            res.status(500).send('Error retrieving print data');
            console.log("//////////////////error1")
        }
        if(results.length > 0){
            console.log("//////////////////noerror")
            res.status(200).json(results);
        }
        else{
            console.log("//////////////////error2")
            res.status(404).send('no data');
        }
    });
});

module.exports = router;
