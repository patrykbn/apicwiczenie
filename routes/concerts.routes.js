const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const db = require('../db.js').concerts;

const validateConcert = (data) => {
    const { performer, genre, price, day, image } = data;
    if (!performer || !genre || !price || !day || !image) {
        return { valid: false, message: 'All fields are required.' };
    }
    return { valid: true };
};

router.get('/', (req, res) => {
    res.json(db);
});

router.get('/random', (req, res) => {
    const randomIndex = Math.floor(Math.random() * db.length);
    const concert = db[randomIndex];
    res.json(concert);
});

router.post('/', (req, res) => {
    const validation = validateConcert(req.body);
    if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
    }

    const newConcert = {
        id: uuidv4(),
        performer: req.body.performer,
        genre: req.body.genre,
        price: req.body.price,
        day: req.body.day,
        image: req.body.image,
    };
    db.push(newConcert);
    res.status(201).json({ message: 'Concert created successfully', data: newConcert });
});

router.put('/:id', (req, res) => {
    const concert = db.find(item => item.id == req.params.id);
    if (!concert) {
        return res.status(404).json({ message: 'Matching id not found...' });
    }

    const validation = validateConcert(req.body);
    if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
    }

    concert.performer = req.body.performer;
    concert.genre = req.body.genre;
    concert.price = req.body.price;
    concert.day = req.body.day;
    concert.image = req.body.image;
    res.json({ message: 'Concert updated successfully' });
});

router.delete('/:id', (req, res) => {
    const concertIndex = db.findIndex(item => item.id == req.params.id);
    if (concertIndex !== -1) {
        db.splice(concertIndex, 1);
        res.json({ message: 'Concert deleted successfully' });
    } else {
        res.status(404).json({ message: 'Matching id not found...' });
    }
});

module.exports = router;