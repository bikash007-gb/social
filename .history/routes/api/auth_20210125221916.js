const express=require('express')
const router=express.Router()

router.get('/',(req,res)=>res.send('auth Routes'))
module.exports=router