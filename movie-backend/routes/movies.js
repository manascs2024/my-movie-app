const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Get liked movies
router.get('/liked', auth, async (req, res) => {
    const user = await User.findById(req.user.id);
    res.json(user.likedMovies);
});

// Like a movie
router.post('/like', auth, async (req, res) => {
    const user = await User.findById(req.user.id);
    const movie = req.body.movie;
    if (!user.likedMovies.find(m => m.id === movie.id)) {
        user.likedMovies.push(movie);
        await user.save();
    }
    res.json(user.likedMovies);
});

// Unlike a movie
router.post('/unlike', auth, async (req, res) => {
    const user = await User.findById(req.user.id);
    user.likedMovies = user.likedMovies.filter(m => m.id !== req.body.movieId);
    await user.save();
    res.json(user.likedMovies);
});

module.exports = router;