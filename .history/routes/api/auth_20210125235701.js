const express=require('express')
const auth=require('../../middleware/auth')
const bcrypt=require('bcryptjs')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator');
const config = require('config')
const User = require('../../models/User')
const router=express.Router()

router.get('/',auth,async(req,res)=>{
    try {
        const user=await User.findById(req.user.id).select('-password')
        res.json(user)
        
    } catch (error) {
        console.error(err.message);
    res.status(500).send('Server Error');
    }
})

router.post('/',
check('email', 'Please include a valid email').isEmail(),
check('password', 'Password is required').exists(),
 async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const {email, password } = req.body;
    try {
        let user=await User.findOne({email})

        if(!user){
            return res.status(400).json({errors:[{msg:'User not exists'}]})
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

          await user.save()

          const payload={
              user:{
                  id:user.id
              }
          }
          jwt.sign(payload,config.get('jwtSecret'),{expiresIn:'5 days'},(err,token)=>{
            if (err) throw err;
            res.json({ token });
          })
    }
    catch(err){
        console.log(err.message)
        res.status(500).send('server error')
    }
})
module.exports=router