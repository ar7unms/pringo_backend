const mysql=require('mysql')

//MySQL connection
const pool=mysql.createPool({
    host:'localhost',
    user:'root',
    password:'',
    database:'pringo'
});

const transcationModel={
    inserttran:(tranData,callback)=>{
        const query='INSERT INTO transaction SET ?';
        pool.query(query,tranData,callback)
    },

    viewtran:(callback)=>{
        const query='SELECT * FROM transaction ';
        pool.query(query,callback)
    },

    // deleteMember:(id,callback)=>{
    //     const query='DELETE FROM member WHERE id=?';
    //     pool.query(query,[id],callback)
    // },
    
    // searchMemberByName: (name,callback) => {
    //     const query='SELECT * FROM member WHERE name = ?';
    //     pool.query(query,[name],callback);
    // },
    searchtranByid: (userid, callback) => {
        const query = `SELECT transaction.*, member.name FROM transaction INNER JOIN member ON transaction.userid = member.id WHERE transaction.userid = ? ORDER BY transaction.datetime DESC`;
        pool.query(query, [userid], callback);
    },
    
    
    // memberLogin: (emailid, callback) => {
    //     const query = 'SELECT id,emailid,password FROM member WHERE emailid=?';
    //     pool.query(query, [emailid], (error, result) => {
    //         if (error) {
    //             console.error("Error occurred while executing query:", error);
    //         } else {
    //             console.log("Query result:", result);
    //         }
    //         callback(error, result);
    //     });
    // },
    // searchMemberByemail: (emailid,callback) => {
    //     const query='SELECT * FROM member WHERE emailid = ?';
    //     pool.query(query,[emailid],callback);
    // },

    // updateResetToken: (token, emailid, callback) => {
    //     const query = 'UPDATE member SET token = ? WHERE emailid = ?';
    //     pool.query(query, [token, emailid], callback);
    // }
    
    getcollection:(callback)=>{
        const query='SELECT amount FROM transaction WHERE DATE(datetime)=CURRENT_DATE';
        pool.query(query,callback);
        
    },
    getprintcollection:(callback)=>{
        const query='SELECT amount FROM transaction WHERE DATE(datetime)=CURRENT_DATE AND type="print"';
        pool.query(query,callback);
        
    },
    getbindcollection:(callback)=>{
        const query='SELECT amount FROM transaction WHERE DATE(datetime)=CURRENT_DATE AND type="bind"';
        pool.query(query,callback);
        
    },
    getcollections:(callback)=>{
        const query='SELECT transaction.*,member.name FROM transaction INNER JOIN member ON transaction.userid = member.id WHERE DATE(transaction.datetime)=CURRENT_DATE';
        pool.query(query,callback);
    }    
};

module.exports=transcationModel