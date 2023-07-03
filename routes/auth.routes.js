const Router = require('express')
const User = require('../models/User');
const router = Router();
const bcrypt = require('bcrypt');
const {check, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth-middleware');
const fileService = require('../service/fileService');
const File = require('../models/File');



router.post ('/register', [
    check('email').isEmail().withMessage('נא להזין אימייל חוקי'),
    check('password').isLength({min: 6}).withMessage('הסיסמה חייבת להיות לפחות 6 תווים')
], 
async (req, res) => {

   
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        const {email, password} = req.body;
        const candidate = await User.findOne({email});
        if (candidate) {
            res.status(400).json({message: 'המשתמש כבר קיים'});
        }
        const hashPassword = await bcrypt.hash(password, 8);
        const user = new User({email, password: hashPassword});
        await user.save();
        await fileService.createDir(new File({user: user._id, name:''}));
        res.status(201).json({message: 'משתמש שנוצר'});


   
        
    } catch (error) {
        res.status(500).json({message: error.message,massage:"נכשל בריגיסטר"});
        
    }
})


router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }
        const isMatch =  bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(400).json({message: 'Invalid password'});
        }
       const token = jwt.sign({id: user.id}, process.env.SECRET_KEY, {expiresIn: '5h'});
 
       return   res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                diskSpace: user.diskSpace,
                usedSpace: user.usedSpace,
                avatar: user.avatar


            }
        })
    } catch (error) {
       console.log(error);
       res.send({message:"Login Error",message:error})
        
    }
})



router.get('/auth',authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const token = jwt.sign({id: user.id}, process.env.SECRET_KEY, {expiresIn: '5h'});
        return res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                diskSpace: user.diskSpace,
                usedSpace: user.usedSpace,
                avatar: user.avatar
            }
        })
    
        
      
    } catch (error) {
       console.log(error);
       res.send({message:"Login Error",message:error})
        
    }
})

module.exports = router