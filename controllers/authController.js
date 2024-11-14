const User = require('../model/User');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;
    const user = new User({ fullname, email, password });
    await user.save();
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).send({ token, user: {fullname: user.fullname, email: user.email} });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
