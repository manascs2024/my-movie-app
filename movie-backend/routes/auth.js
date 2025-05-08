const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// Register with email verification
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const verifyToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1d' });

    user = new User({ email, password: hashed, verifyToken });
    await user.save();

    const link = `${process.env.BACKEND_URL}/api/auth/verify-email?token=${verifyToken}`;
    await sendEmail(
      email,
      'Verify your email',
      `<h2>Welcome!</h2><p>Please <a href="${link}">verify your email</a> to activate your account.</p>`
    );
    res.json({ msg: 'Registration successful. Check your email to verify.' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Verify email
router.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;
    const { email } = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ email, verifyToken: token });
    if (!user) return res.redirect(`${process.env.CLIENT_URL}/login?verified=0`);
    user.isVerified = true;
    user.verifyToken = undefined;
    await user.save();
    return res.redirect(`${process.env.CLIENT_URL}/login?verified=1`);
  } catch {
    return res.redirect(`${process.env.CLIENT_URL}/login?verified=0`);
  }
});


// Login (only if verified)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
    if (!user.isVerified) return res.status(400).json({ msg: 'Verify your email first' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { user: { id: user.id } };
    jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Forgot password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.json({ msg: 'If that email exists, you will receive a reset link.' });

  const resetToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000;
  await user.save();

  const link = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
  await sendEmail(
    email,
    'Reset your password',
    `<p>Click <a href="${link}">here</a> to reset your password. This link expires in 1 hour.</p>`
  );
  res.json({ msg: 'If that email exists, you will receive a reset link.' });
});

// Reset password
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;
  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({
      _id: id,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ msg: 'Invalid or expired token' });

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ msg: 'Password reset successful' });
  } catch {
    res.status(400).json({ msg: 'Invalid or expired token' });
  }
});

module.exports = router;
