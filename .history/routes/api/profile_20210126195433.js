const express=require('express')
const auth=require('../../middleware/auth')
const Profile=require('../../models/Profile')
const router=express.Router()

router.get('/',(req,res)=>res.send('profile Routes'))
module.exports=router