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

router.post(
    '/',
    auth,
    check('status', 'Status is required').notEmpty(),
    check('skills', 'Skills is required').notEmpty(),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
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
  
      // build a profile
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
  
      // Build socialFields object
      const socialFields = { youtube, twitter, instagram, linkedin, facebook };
  
      // normalize social fields to ensure valid url
      for (const [key, value] of Object.entries(socialFields)) {
        if (value && value.length > 0)
          socialFields[key] = normalize(value, { forceHttps: true });
      }
      // add to profileFields
      profileFields.social = socialFields;
  
      try {
        // Using upsert option (creates new doc if no match is found):
        let profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        return res.json(profile);
      } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
      }
    }
  );

  router.get('/',async(req, res)=>{
      try {
          const profile=await Profile.find().populate('user',['name','avatar'])
          res.json(profile)
          
      } catch (error) {
        console.error(error.message);
        return res.status(500).send('Server Error');
      }
  })

  router.get('/user/:user_id',async(req,res)=>{
    try {
        const profile= await Profile.findOne({user:req.params.user_id}).populate('user',['name','avatar'])
        if(!profile)return res.status(400).json({ msg: 'Profile not found' });
        return res.status(200).json(profile)
    } catch (error) {
        console.error(error.message);
        return res.status(500).send('Server Error');
    }
  })

  router.delete('/',auth,async(req, res)=>{
      try {
          await Promise.all([
              User.findByIdAndRemove({_id:req.user.id}),
              Profile.findByIdAndRemove({user:req.user.id})
          ])
          res.json({ msg: 'User delete'})
      } catch (error) {
        console.error(error.message);
        return res.status(500).send('Server Error')
      }
  })
module.exports=router