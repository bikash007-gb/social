const express=require('express')
const User = require('../../models/User')
const { check, validationResult } = require('express-validator');
const router=express.Router()

//router.get('/',(req,res)=>res.send('User Routes'))

router.post('/',[
    check('name', 'Name is required').notEmpty(),
  check('email', 'Please include a valid email').isEmail(),
],(req,res)=>{
    
})

module.exports=router