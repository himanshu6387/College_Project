const User = require('../models/UserModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

exports.userRegister = async (req, res) => {
    const { name, email, password } = req.body

    try {
        //Check if user exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists..' })
        }

        // Hash Password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = new User({
            name,
            email,
            password: hashedPassword
        })

        await user.save()

        res.status(200).json({ message: 'User SignedUp Successfully..', 'user': user })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


exports.userLogin = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: 'Invalid Email..' })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Password' })
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })

        res.status(200).json({ message: 'User LoggedIn Successfully..', token,user:{name:user.name}})
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}
