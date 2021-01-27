const express=require('express')
const Post=require('../../model/Post')
const auth=require('../../middleware/auth')
const User = require('../../models/User')
const Profile=require('../../models/Profile')
const { check, validationResult } = require('express-validator');
const router=express.Router()


router.post('/',auth,
check('text', 'Text is required').not().isEmpty(),
async(req, res) =>{
    const error =validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try {
        
    } catch (error) {
        console.error(error);
      return res.status(500).json({ msg: 'Server error' });
    }
}
)

module.exports=router