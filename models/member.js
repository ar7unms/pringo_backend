const mysql=require('mysql')

//MySQL connection
const pool=mysql.createPool({
    host:'localhost',
    user:'root',
    password:'',
    database:'pringo'
});

const memberModel={
    insertMember:(memberData,callback)=>{
        const query='INSERT INTO member SET ?';
        pool.query(query,memberData,callback)
    },

    viewMembers:(callback)=>{
        const query='SELECT * FROM member';
        pool.query(query,callback)
    },

    deleteMember:(id,callback)=>{
        const query='DELETE FROM member WHERE id=?';
        pool.query(query,[id],callback)
    },
    
    searchMemberByName: (name,callback) => {
        const query='SELECT * FROM member WHERE name = ?';
        pool.query(query,[name],callback);
    },
    searchMemberByid: (id,callback)=>{
        const query='SELECT * FROM member WHERE id = ?';
        pool.query=(query,[id],callback);
    },
    memberLogin: (emailid, callback) => {
        const query = 'SELECT id,emailid,password FROM member WHERE emailid=?';
        pool.query(query, [emailid], (error, result) => {
            if (error) {
                console.error("Error occurred while executing query:", error);
            } else {
                console.log("Query result:", result);
            }
            callback(error, result);
        });
    },
    searchMemberByemail: (emailid,callback) => {
        const query='SELECT * FROM member WHERE emailid = ?';
        pool.query(query,[emailid],callback);
    },

    updateResetToken: (token, emailid, callback) => {
        const query = 'UPDATE member SET token = ? WHERE emailid = ?';
        pool.query(query, [token, emailid], callback);
    },
    updatePassword: (emailid, newPassword, callback) => {
        const query = 'UPDATE member SET password = ? WHERE emailid = ?';
        pool.query(query, [newPassword, emailid], callback);
    },
    searchMemberBytoken:(token,callback)=>{
        const query='SELECT * FROM member WHERE token = ?';
        pool.query(query,[token],callback);
    }

};

module.exports=memberModel