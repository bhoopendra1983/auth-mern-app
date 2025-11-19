
const bcrypt=require('bcrypt');

const UserModel = require("../Models/User");

const jwt= require('jsonwebtoken');

const signup = async(req,res) => {
          try {

          const { name, email, password } = req.body;

          const user = await  UserModel.findOne({email});
            if(user){
            return res.status(409).json({message: 'User is already exits, you can login',success:false});
            }

          const userModel= new UserModel({name,email,password});
          userModel.password = await bcrypt.hash(password,10);
          await userModel.save();
              res.status(201).json({
              message: "Signup successfully",success:true   
            })
          }
          catch (err){

          res.status(500).json({message: 'Inernal server error',success:false})

          }

}

const login = async(req,res)=>{
  try{
           const {email,password} =req.body;
           
           const errorMsg= 'Auth failed email and password is wrong';

          const user = await UserModel.findOne({ email });
              if(!user){
                return res.satus(403).json({message: errorMsg ,success:false});
              }
                   const isPasswordEqual= await bcrypt.compare(password,user.password);
                if(!isPasswordEqual){
                  res.status(403).json({
                message: errorMsg,success:false
                });

                }
                const jwtToken=jwt.sign({email:user.email, _id: user._id},
                  process.env.JWT_SECRET,{expiresIn: '24h'}
                )
              res.status(200).json({
                message: "login successfully",success:true,jwtToken,email,name:user.name
              })
  } catch (err){
     
     res.status(500).json({message: 'Inernal server error',success:false})

  }

}

module.exports = {
    signup,login
}