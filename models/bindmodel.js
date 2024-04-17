const mysql = require('mysql');
const router = require('../controller/fileroute');

const pool=mysql.createPool({
    host:'localhost',
    user:'root',
    password:'',
    database:'pringo'
  });

  const User={
    insertuploads:(userid,nofpage,type,color,docpath,noofbind,status,notify,callback)=>{
        const sql='INSERT INTO bind (userid,nofpage,type,color,docpath,noofbind,status,notify) VALUES (?,?,?,?,?,?,?,?)';
        pool.query(sql,[userid,nofpage,type,color,docpath,noofbind,status,notify],callback)
    },
    updatestatus: ( id, callback) => {
      const sql = 'UPDATE bind SET status = 1 WHERE id = ?';
      pool.query(sql, [id], callback);
   },
  selectnotupdated: (callback) => {
    const sql = 'SELECT bind.*, member.name FROM bind INNER JOIN member ON bind.userid = member.id WHERE status =0 ORDER BY bind.datetime ASC';
    pool.query(sql, callback);
  },
  selectupdated: (callback) => {
    const sql = 'SELECT bind.*, member.name FROM bind INNER JOIN member ON bind.userid = member.id WHERE status =1 ORDER BY bind.datetime ASC';
    pool.query(sql, callback);
  },
  updatenotify: ( id, callback) => {
    const sql = 'UPDATE bind SET notify = 1 WHERE id = ?';
    pool.query(sql, [id], callback);
 },
 updatenotif: ( id, callback) => {
  const sql = 'UPDATE bind SET notify = 0 WHERE id = ?';
  pool.query(sql, [id], callback);
},
selectupdated: (callback) => {
  const sql = 'SELECT bind.*, member.name FROM bind INNER JOIN member ON bind.userid = member.id WHERE status =1 ORDER BY bind.datetime ASC';
  pool.query(sql, callback);
},
selectnotify: (userid,callback) => {
  const sql = 'SELECT bind.*, member.name FROM bind INNER JOIN member ON bind.userid = member.id WHERE notify =1 AND bind.userid = ? ORDER BY bind.datetime ASC';
  pool.query(sql,[userid],callback);
},


  }

  module.exports = User;