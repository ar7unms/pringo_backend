const mysql = require('mysql');
const router = require('../controller/fileroute');
const { selectnotify } = require('./bindmodel');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pringo'
});

const User = {
    insertuploads: (userid, start,end, noofcopy, color, docpath,status,notify,callback) => {
        const sql = 'INSERT INTO print (userid,start,end, noofcopy, color, docpath,status,notify) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        pool.query(sql, [userid, start,end, noofcopy, color, docpath,status,notify], callback);
    },
    selectall: (callback) => {
        const sql = 'SELECT print.*, member.name FROM print INNER JOIN member ON print.userid = member.id ORDER BY print.datetime DESC';
        pool.query(sql, callback);
    },
    updatedocument: (docpath, id, callback) => {
        const sql = 'UPDATE print SET docpath = ? WHERE id = ?';
        pool.query(sql, [docpath, id], callback);
    },
    selectone: (id, callback) => {
        const sql = 'SELECT docpath FROM print WHERE id = ?';
        pool.query(sql, [id], callback);
    },
    updatestatus: ( id, callback) => {
        const sql = 'UPDATE print SET status = 1 WHERE id = ?';
        pool.query(sql, [id], callback);
    },
    selectnotupdated: (callback) => {
        const sql = 'SELECT print.*, member.name FROM print INNER JOIN member ON print.userid = member.id WHERE status =0 ORDER BY print.datetime ASC';
        pool.query(sql, callback);
    },
    selectupdated: (callback) => {
        const sql = 'SELECT print.*, member.name FROM print INNER JOIN member ON print.userid = member.id WHERE status =1 ORDER BY print.datetime ASC';
        pool.query(sql, callback);
    },
    updatenotify: ( id, callback) => {
        const sql = 'UPDATE print SET notify = 1 WHERE id = ?';
        pool.query(sql, [id], callback);
     },
     updatenotif: ( id, callback) => {
      const sql = 'UPDATE print SET notify = 0 WHERE id = ?';
      pool.query(sql, [id], callback);
    },     
    selectnotify: (userid,callback) => {
        const sql = 'SELECT print.*, member.name FROM print INNER JOIN member ON print.userid = member.id WHERE notify =1 AND print.userid = ? ORDER BY print.datetime ASC';
        pool.query(sql,[userid],callback);
    }    
};

module.exports = User;
