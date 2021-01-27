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
        const user = await User.findById(req.user.id).select('-password')
        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
          });
          const post=await newPost.save()
          res.json(post)
    } catch (error) {
        console.error(error);
      return res.status(500).json({ msg: 'Server error' });
    }
}
)

module.exports=router