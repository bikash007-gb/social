const express=require('express')
const Post=require('../../model/Post')
const auth=require('../../middleware/auth')
const User = require('../../models/User')
const { check, validationResult } = require('express-validator');
const router=express.Router()

router.get('/',(req,res)=>res.send('post Routes'))
module.exports=router