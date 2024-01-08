const ValidUser = require('../middlewares/ValidUser');
const ValidateInput = require('../middlewares/ValidateInput');
const IsAdmin = require('../middlewares/isAdmin');
const Otp = require('../models/Otp');
const User = require('../models/User');
const { Register, Login, SendOtp, PasswordChange } = require('../validators/AuthValidator');
const router = require('express').Router();
const nodemailer = require('nodemailer');
const bcryptjs = require('bcryptjs');

const sendMail = async (email, message) => {
    const transport = nodemailer.createTransport({
        service: "gmail",
        port: 587,
        secure: true,
        auth: {
            user: process.env.USER,
            pass: process.env.PASSWORD
        },
        tls: { rejectUnauthorized: false }
    });

    const options = {
        from: process.env.user,
        to: email,
        subject: 'E-Learning-Platform Mail Service System',
        html: message
    }

    await new Promise((resolve, reject) => {
        transport.sendMail(options, (err, info) => {
            if (err) {
                reject(err);
                console.log(err.message);
            } else {
                console.log('Emailed successfully!');
                resolve(info);
            }
        });
    });
}

router.post('/register', ValidateInput(Register), async (req, res) => {
    try {
        var user = await User.findOne({ email: req.body.email });
        if (user)
            return res.status(400).json({ success: false, message: 'User already exists. Please Login' });

        user = await User.create(req.body);
        res.status(200).json({ success: true, user });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.post('/login', ValidateInput(Login), async (req, res) => {
    try {
        var user = await User.findOne({ email: req.body.email });
        if (!user || !await user.validatePassword(req.body.password))
            return res.status(400).json({ success: false, message: 'Invalid Credentials' });

        if (req.body.role !== user.role)
            return res.status(400).json({ success: false, message: 'Role not valid as registered' });

        console.log(await user.generateToken());
        res.status(200).json({ success: true, user: { user, token: await user.generateToken() } });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.put('/updateProfile', ValidUser, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.user._id, { ...req.body }, { new: true });
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.get('/users', ValidUser, IsAdmin, async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
})

router.post('/sendOtp', ValidateInput(SendOtp), async (req, res) => {
    try {
        const { email } = req.body;
        console.log(email);
        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ success: false, message: 'User could not be fetched. Please register' });

        const otp = await Otp.create({
            email,
            otp: Math.floor(Math.random() * 9000) + 1000, // this will generate 4 digit otp
            expiresIn: new Date().getTime() * 5 * 60 * 1000,
        });

        sendMail(email, `<h4>Your one time password for updation of your password is ${otp.otp}. It is valid for only 5 mins. Please do not share it with anyone. <br /> Thank You!</h4>`);
        res.json({ success: true, otp });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.put('/updatePassword', ValidateInput(PasswordChange), async (req, res) => {
    try {
        const { otp, email, password } = req.body;
        const validOtp = await Otp.findOne({ email, otp });

        if (validOtp) {
            const diff = validOtp.expiresIn - new Date().getTime();
            if (diff < 0)
                return res.status(400).json({ success: false, message: "OTP expired" });

            const salt = await bcryptjs.genSalt(10);
            const secPass = await bcryptjs.hash(password, salt);

            const user = await User.findOneAndUpdate({ email }, { password: secPass }, { new: true });
            sendMail(email, "<h4>Your password for the E-Learning-Platform has been updated. Please login and verify. If it wasn't you then please contact us immediately. Thank you</h4>");
            res.status(200).json({ success: true, user });

        } else {
            return res.status(400).json({ success: false, message: 'Invalid OTP' })
        }
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
})

module.exports = router;