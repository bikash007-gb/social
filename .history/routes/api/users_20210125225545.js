const express=require('express')
const User = require('../../models/User')
const { check, validationResult } = require('express-validator');
const gravatar=require('gravatar')
const bcrypt=require('bcryptjs')
const router=express.Router()

//router.get('/',(req,res)=>res.send('User Routes'))

router.post('/',[
    check('name', 'Name is required').notEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check(
    'password',
    'Please enter a password with 6 or more characters'
  ).isLength({ min: 6 }),
],async (req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const { name, email, password } = req.body;
    try {
        let user=User.findOne({email})

        if(user){
            res.status(400).json({errors:[{msg:'User already exists'}]})
        }
        const avatar=normalize(
            gravatar.url(email, {
              s: '200',
              r: 'pg',
              d: 'mm'
            }),
            { forceHttps: true }
          );
          user=new User({
              name,
              email,
              avatar,
              password
          })
          const salt=await bcrypt.genSalt(10)
          user.password=await bcrypt.hash(password,salt)
    }
    catch(err){
        console.log(err.message)
        res.status(500).send('server error')
    }
})

module.exports=router