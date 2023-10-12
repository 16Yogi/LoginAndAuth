import UserModel from "../models/User.js";
import bcrypt from 'bcrypt'
import express from 'express'
import jwt from 'jsonwebtoken'

class UserController{
    static userRegistration = async (req,res)=>{
        const {name,email,password,password_confirmtion,tc} = req.body
        const user = await UserModel.findOne({email:email})
        if(user){
            res.send({"status":"failed","message":"Email already exists"})
        }else{
            if(name && email && password && password_confirmtion && tc){
                if(password === password_confirmtion){
                    try{
                        //incript password
                        const salt = await bcrypt.genSalt(10)
                        const hashPassword = await bcrypt.hash(password,salt)
                        const doc = new UserModel({
                            name:name,
                            email:email,
                            password:hashPassword,
                            tc:tc
                        }) 
                        await doc.save()
                        //after resiter save data
                        const save_user = await UserModel.findOne({email:email})
                        //generate JWT TOken
                        const token = jwt.sign({userID:save_user._id}, process.env.JWT_SECRET_KEY, {expiresIn:'1d'})

                        res.status(201).send({"status":"success","message":"registration successfull","token":token})
                    }catch(error){
                       console.warn(error)
                       res.send({"status":"failed","message":"unable to register"})
                    }  
                }else{
                    res.send({"status":"failed", "message":"Password and confirm password doesn't match"})
                }
            }else{
                res.send({"status":"failed","message":"All fields are required"})
            }
        }
    }
    //login
    static userLogin = async (req,res) =>{
        try{
            const {email,password} = req.body
            if(email && password){
                const user = await UserModel.findOne({email:email})
                if(user != null){
                    const isMatch = await bcrypt.compare(password,user.password)
                    if(user.email === email && isMatch){
                        //generate token
                        const token = jwt.sign({userID:user._id},process.env.JWT_SECRET_KEY,{expiresIn:'1d'})

                        res.send({"status":"success","message":"login successfull","token":token})

                    }else{
                        res.send({"status":"failed", "message":"email or password is not valid"})
                    }
                }else{
                    res.send({"status":"failed","message":"You are not a registed user"})
                }
            }else{
                res.send({"status":"failed","message":"All fields are required"})
            }
        }catch(error){
            console.warn(error)
            res.send({"status":"failed","message":"unable to login"})
        }
    }

    //chnage password
    static changeUserPassword = async (req,res)=>{
        const {password,password_confirmtion} = req.body
        if(password && password_confirmtion){
            if(password !== password_confirmtion){
                res.send({"Status":"failed","message":"New Password and confirm new password doesn't match"})
            }else{
                const salt = await bcrypt.genSalt(10)
                const newHashPassword = await bcrypt.hash(password,salt)
                // console.warn(req.user)
                // console.warn(req.user._id)
                await UserModel.findByIdAndUpdate(req.user._id,{$set:{
                    password:newHashPassword
                }})

                //middleware
                res.send({"status":"success","message":"password changed successfully"})
            }
        }else{
            res.send({"status":"failed","message":"All fileds are required"})
        }
    }

    //login user
    static loggedUser = async (req,res) =>{
        res.send({"user":req.user})
    }

    //forget password using mail
    static sendUserPasswordResetEmail = async (req,res) =>{
        const {email} = req.body
        if(email){
            const user = await UserModel.findOne({email:email})
            console.warn(user) 
            if(user){
                const secret = user._id + process.env.JWT_SECRET_KEY
                const token = jwt.sign({userID:user._id},secret,{expiresIn:'15m'})
                //frontend link
                const link = `http://localhost:3000/api/user/reset/${user._id}/${token}`
                //-/api/user/reset/:id/:token
                console.log(link)   
                res.send({"status":"success","message":"Password reset Email send... Please check your email"})
            }else{
                res.send({"status":"failed","message":"Email doesn't exists"})
            }
        }else{
            res.send({"status":"failed","message":"email field is required"})
        }
    }

    //
    static userPasswordReset = async (req,res) =>{
        const {password,password_confirmtion} = req.body
        const {id,token} = req.params 
        const user = await UserModel.findById(id)
        const new_secret = user._id + process.env.JWT_SECRET_KEY
        try{
            jwt.verify(token,new_secret)
            if(password &  password_confirmtion){
                if(password !== password_confirmtion){
                    res.send({"status":"failed","message":"ALl fields are required"})
                }else{
                    const salt = await bcrypt.genSalt(10)
                    const newHashPassword = await bcrypt.hash(password,salt)
                    await UserModel.findByIdAndUpdate(user._id, {$set:{password:newHashPassword}})
                    res.send({"status":"success","message":"Password Reset SUccessfullt"})
                }
            }else{
                res.send({"status":"failed","message":"ALl fields are required"})
            }

        }catch(error){
            console.warn(error)
            res.send({"status":"failed","message":"Invali"})
        }
    }
}

export default UserController