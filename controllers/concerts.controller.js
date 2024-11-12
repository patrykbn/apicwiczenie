const Concert = require('../models/concert.model');

const getAllConcerts = async (req, res) => {
  try {
    const concerts = await Concert.find();
    res.json(concerts);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

const getRandomConcert = async (req, res) => {
  try {
    const concerts = await Concert.find();
    const randomIndex = Math.floor(Math.random() * concerts.length);
    res.json(concerts[randomIndex]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

const getConcertById = async (req, res) => {
  try {
    const concert = await Concert.findById(req.params.id);
    if (!concert) {
      return res.status(404).json({ message: 'Concert not found.' });
    }
    res.json(concert);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

const createConcert = async (req, res) => {
  const { performer, genre, price, day, image } = req.body;

  if (!performer || !genre || !price || !day || !image) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const newConcert = new Concert({ performer, genre, price, day, image });
    const savedConcert = await newConcert.save();
    res.status(201).json({ message: 'Concert created successfully', data: savedConcert });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

const updateConcert = async (req, res) => {
  const { performer, genre, price, day, image } = req.body;

  if (!performer || !genre || !price || !day || !image) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const updatedConcert = await Concert.findByIdAndUpdate(
      req.params.id,
      { performer, genre, price, day, image },
      { new: true }
    );

    if (!updatedConcert) {
      return res.status(404).json({ message: 'Concert not found.' });
    }

    res.json({ message: 'Concert updated successfully', data: updatedConcert });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

const deleteConcert = async (req, res) => {
  try {
    const deletedConcert = await Concert.findByIdAndDelete(req.params.id);

    if (!deletedConcert) {
      return res.status(404).json({ message: 'Concert not found.' });
    }

    res.json({ message: 'Concert deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

module.exports = {
  getAllConcerts,
  getRandomConcert,
  getConcertById,
  createConcert,
  updateConcert,
  deleteConcert,
};