const express=require('express')
const User = require('../../models/User')
const { check, validationResult } = require('express-validator');
const router=express.Router()

//router.get('/',(req,res)=>res.send('User Routes'))

router.post('/',[
    check('name', 'Name is required').notEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check(
    'password',
    'Please enter a password with 6 or more characters'
  ).isLength({ min: 6 }),
],(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
})

module.exports=router