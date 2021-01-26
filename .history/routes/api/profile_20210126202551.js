const express=require('express')
const auth=require('../../middleware/auth')
const Profile=require('../../models/Profile')
const User = require('../../models/User')
const { check, validationResult } = require('express-validator');
const normalize = require('normalize-url')
const router=express.Router()

router.get('/me',auth,async(req,res)=>{
    try {
        const profile = await Profile.findOne({user:req.user.id}).populate('user',['name','avatar'])
        if(!profile){
            return res.status(400).json({msg:"there is no profile"})
        }
        res.json(profile)
    } catch (error) {
        console.log(error)
        res.status(500).send('Server Error')
    }
})

router.post('/',auth,
check('status', 'Status is required').notEmpty(),
check('skills', 'Skills is required').notEmpty(),
async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    // destructure the request
    const {
        website,
        skills,
        youtube,
        twitter,
        instagram,
        linkedin,
        facebook,
        // spread the rest of the fields we don't need to check
        ...rest
      } = req.body;

      const profileFields = {
        user: req.user.id,
        website:
          website && website !== ''
            ? normalize(website, { forceHttps: true })
            : '',
        skills: Array.isArray(skills)
          ? skills
          : skills.split(',').map((skill) => ' ' + skill.trim()),
        ...rest
      };
  
}
)
module.exports=router