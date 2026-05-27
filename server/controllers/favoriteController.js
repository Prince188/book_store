const User = require('../models/User');

const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.favorites || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const bookId = req.params.bookId;

    if (!user.favorites) user.favorites = [];

    const index = user.favorites.indexOf(bookId);
    if (index > -1) {
      user.favorites.splice(index, 1);
    } else {
      user.favorites.push(bookId);
    }

    await user.save();
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getFavorites, toggleFavorite };
