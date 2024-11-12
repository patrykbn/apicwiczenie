const Seat = require('../models/seat.model');

const getAllSeats = async (req, res) => {
  try {
    const seats = await Seat.find();
    res.json(seats);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

const getRandomSeat = async (req, res) => {
  try {
    const seats = await Seat.find();
    const randomIndex = Math.floor(Math.random() * seats.length);
    res.json(seats[randomIndex]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

const getSeatById = async (req, res) => {
  try {
    const seat = await Seat.findById(req.params.id);
    if (!seat) {
      return res.status(404).json({ message: 'Seat not found.' });
    }
    res.json(seat);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

const createSeat = async (req, res) => {
  const { day, seat, client, email } = req.body;

  if (!day || !seat || !client || !email) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const seatExists = await Seat.findOne({ day, seat });
    if (seatExists) {
      return res.status(409).json({ message: 'This seat is already taken.' });
    }

    const newSeat = new Seat({ day, seat, client, email });
    const savedSeat = await newSeat.save();
    req.io.emit('seatsUpdated', await Seat.find());
    res.status(201).json({ message: 'Seat created successfully', data: savedSeat });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

const updateSeat = async (req, res) => {
  const { day, seat, client, email } = req.body;

  if (!day || !seat || !client || !email) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const updatedSeat = await Seat.findByIdAndUpdate(
      req.params.id,
      { day, seat, client, email },
      { new: true }
    );

    if (!updatedSeat) {
      return res.status(404).json({ message: 'Seat not found.' });
    }

    res.json({ message: 'Seat updated successfully', data: updatedSeat });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

const deleteSeat = async (req, res) => {
  try {
    const deletedSeat = await Seat.findByIdAndDelete(req.params.id);

    if (!deletedSeat) {
      return res.status(404).json({ message: 'Seat not found.' });
    }

    res.json({ message: 'Seat deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

module.exports = {
  getAllSeats,
  getRandomSeat,
  getSeatById,
  createSeat,
  updateSeat,
  deleteSeat,
};