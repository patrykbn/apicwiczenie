const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const db = require('../db.js').seats;

const validateSeat = (data) => {
    const { day, seat, client, email } = data;
    if (!day || !seat || !client || !email) {
        return { valid: false, message: 'All fields are required.' };
    }
    return { valid: true };
};

router.get('/', (req, res) => {
    res.json(db);
});

router.get('/random', (req, res) => {
    const randomIndex = Math.floor(Math.random() * db.length);
    const seat = db[randomIndex];
    res.json(seat);
});

router.post('/', (req, res) => {
    const validation = validateSeat(req.body);
    if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
    }
    const seatTaken = db.some(item => item.day === req.body.day && item.seat === req.body.seat);
    if(seatTaken){
        return res.status(409).json({message: 'This seat is already taken...'})
    }
    const newSeat = {
        id: uuidv4(),
        day: req.body.day,
        seat: req.body.seat,
        client: req.body.client,
        email: req.body.email,
    };
    db.push(newSeat);
    req.io.emit('seatsUpdated', db);

    res.status(201).json({ message: 'Seat created successfully', data: newSeat });
});

router.put('/:id', (req, res) => {
    const seat = db.find(item => item.id == req.params.id);
    if (!seat) {
        return res.status(404).json({ message: 'Matching id not found...' });
    }

    const validation = validateSeat(req.body);
    if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
    }

    seat.day = req.body.day;
    seat.seat = req.body.seat;
    seat.client = req.body.client;
    seat.email = req.body.email;
    res.json({ message: 'Seat updated successfully' });
});

router.delete('/:id', (req, res) => {
    const seatIndex = db.findIndex(item => item.id == req.params.id);
    if (seatIndex !== -1) {
        db.splice(seatIndex, 1);
        res.json({ message: 'Seat deleted successfully' });
    } else {
        res.status(404).json({ message: 'Matching id not found...' });
    }
});

module.exports = router;