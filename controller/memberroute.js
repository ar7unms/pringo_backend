const express=require('express')
const memberModel=require("../models/member")
const bcrypt=require("bcryptjs")
const bodyParser = require('body-parser');
const nodemailer=require("nodemailer")



hashPasswordgenerator=async(pass)=>{
    const salt=await bcrypt.genSalt(10)
    return bcrypt.hash(pass,salt)
}

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'msarjun077@gmail.com',
      pass: 'qlcf udzt wote loxe', // Enter your password here
    },
});
const router=express.Router()
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

//route to member register
router.post('/signup', async (req, res) => {
    try {
        const { name,phonenumber, emailid, password } = req.body;

        // Check if the email already exists in the database
        memberModel.searchMemberByemail(emailid, async (error, results) => {
            if (error) {
                console.error('Error checking existing email:', error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            if (results.length > 0) {
                // Email already exists, return an error response
                return res.json({ status: 'Email already exists' });
            } else {
                // Email doesn't exist, proceed with registration
                const hashedPassword = await hashPasswordgenerator(password);
                const memberData = { name, phonenumber,emailid, password: hashedPassword };

                // Insert the new member into the database
                memberModel.insertMember(memberData, (error, result) => {
                    if (error) {
                        console.error('Error inserting member data:', error);
                        return res.status(500).json({ error: 'Error inserting member data' });
                    }
                    // Registration successful
                    res.json({ status: "success" });
                });
            }
        });
    } catch (error) {
        console.error('Error registering member:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post("/login",async(req,res)=>{
    var {emailid,password}=req.body;
    memberModel.memberLogin(emailid,async(error,results)=>{
        console.log(results)
        if(!results || results.length === 0){
            return res.json({status:"Invalid username"});
        }
    else{
    let dbpassword=results[0].password 
    console.log(dbpassword)   
    console.log(password)
    const match=await bcrypt.compare(password,dbpassword)
    if (!match) {
        return res.json({
            status:"Incorrect password"
        })
 
    }  
    else{
        console.log(results[0].id)
        return res.json({
            status:"success","userdata":results[0]
        })
    }
}   
    })

});


router.post('/search', (req, res) => {
    var memberName =req.body.name

    memberModel.searchMemberByName(memberName,(error,results)=>{
        if(error){
            res.status(500).send('Error retrieving member data');
            return;
        }
        if(results.length > 0){
            res.status(200).json(results[0]);
        }
        else{
            res.status(404).send('Invalid user');
        }
    });
});


router.post('/myprofile',(req,res) => {
    var memberId = req.body.id

    memberModel.viewMyProfile(memberId,(error,results)=>{
        try{
            if (error) {
                console.error('Error fetching user profile:', err);
                return res.status(500).json({
                  status: "Internal Server Error"
                });
              }
              if (results.length === 0) {
                return res.json({
                  status: "Invalid user"
                });
              } else {
                const data = results[0]; // Assuming there is only one matching row
    
                // Prepare response data
                const responseData = {
                  name: data.name,
                  address: data.address,
                  weight: data.weight,
                  height: data.height,
                  emailid: data.emailid,
                  contactno: data.contactNum
                };
    
                console.log(responseData);
    
                return res.json(responseData);
              }
        } catch (error) {
        console.error('Error fetching user profile:', error);
        return res.status(500).json({
          status: "Internal Server Error"
        });
      }
    })
})

router.get('/viewall', (req, res) => {
    var memberName =req.body.name

    memberModel.viewMembers((error,results)=>{
        if(error){
            res.status(500).send('Error retrieving member data');
            return;
        }
        if(results.length > 0){
            res.status(200).json(results[0]);
        }
        else{
            res.status(404).send('Invalid user');
        }
    });
});
router.post('/forgotPassword', async (req, res) => {
    const { emailid } = req.body;

    try {
        // Check if the email exists in the database
        memberModel.viewMembers((error, results) => {
            if (error) {
                console.error('Error retrieving member data:', error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            if (results.length > 0) {
                console.log("Password reset requested for email:", emailid);
                // Generate a reset token
                const resetToken = generateResetToken();

                // Save the reset token to the user's document in the database (if applicable)
                // Update the user document with resetToken
                memberModel.updateResetToken(resetToken,emailid,(error, updateResult) => {
                    if (error) {
                        console.error('Error updating reset token:', error);
                        return res.status(500).json({ error: 'Internal Server Error' });
                    }

                    // Create the password reset link
                    const resetLink = `${emailLinkHandlerUrl}?token=${resetToken}`;
                    console.log('Password reset link:', resetLink);
                    console.log('Password reset token:', resetToken);

                    // HTML body of the email with the password reset link
                    const htmlBody = `
                        <p>To reset your password, click on the following link:</p>
                        <a href="${resetLink}">Reset Password</a>
                    `;

                    // Send email with HTML body
                    const mailOptions = {
                        from: 'msarjun077@gmail.com',
                        to: emailid,
                        subject: 'Password Reset',
                        html: htmlBody,
                    };

                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.error('Error sending email:', error);
                            res.status(500).json({ error: 'Failed to send email' });
                        } else {
                            console.log('Email sent:', info.response);
                            res.json({ status: 'Email sent successfully' });
                        }
                    });
                });
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        });
    } catch (error) {
        console.error('Error initiating password reset:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

function generateResetToken() {
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    return token;
}
const emailLinkHandlerUrl = 'http://192.168.211.53:3001/api/member/emailLinkHandler';


router.post('/resetPassword', async (req, res) => {
    const { emailid, token, newPassword } = req.body;

    try {
        // Find the user associated with the reset token
        memberModel.searchMemberBytoken(token, async (error, results) => {
            if (error) {
                console.error('Error retrieving member data:', error);
                res.status(500).send('Error retrieving member data');
                return;
            }
            if (results.length > 0) {
                try {
                    const hashedPassword = await hashPasswordgenerator(newPassword);
                    memberModel.updatePassword(emailid, hashedPassword, async (updateError, updateResults) => {
                        if (updateError) {
                            console.error('Error updating password:', updateError);
                            res.status(500).send('Error updating password');
                            return;
                        }
                       else {
                            res.json({status:'Password update failed'});
                        }
                    });
                } catch (hashError) {
                    console.error('Error hashing password:', hashError);
                    res.status(500).send('Error hashing password');
                }
            } else {
                res.status(404).send('Invalid user');
            }
        });

    } catch (catchError) {
        console.error('Error resetting password:', catchError);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/emailLinkHandler', (req, res) => {
    // Retrieve the token from the request query parameters
    const { token } = req.query;
    console.log(token);

    // Handle the email link here and send the reset token in the response
    if (token) {
        // Token received, you can further process it if needed
        res.status(200).json({ token });
    } else {
        // Token not found in the request, send an error response
        res.status(400).json({ error: 'Token not provided' });
    }
});



module.exports=router