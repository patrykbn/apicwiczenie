const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const db = require('../db.js').testimonials;

const validateTestimonial = (data) => {
    const { author, text } = data;
    if (!author || !text) {
        return { valid: false, message: 'Author and text are required.' };
    }
    return { valid: true };
};

router.get('/', (req, res) => {
    res.json(db);
});

router.get('/random', (req, res) => {
    const randomIndex = Math.floor(Math.random() * db.length);
    const testimonial = db[randomIndex];
    res.json(testimonial);
});

router.get('/:id', (req, res) => {
    const testimonial = db.find(item => item.id == req.params.id);
    if (testimonial) {
        res.json(testimonial);
    } else {
        res.status(404).json({ message: 'Matching id not found...' });
    }
});

router.post('/', (req, res) => {
    const validation = validateTestimonial(req.body);
    if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
    }

    const newTestimonial = {
        id: uuidv4(),
        author: req.body.author,
        text: req.body.text,
    };
    db.push(newTestimonial);
    res.status(201).json({ message: 'Testimonial created successfully', data: newTestimonial });
});

router.put('/:id', (req, res) => {
    const testimonial = db.find(item => item.id == req.params.id);
    if (!testimonial) {
        return res.status(404).json({ message: 'Matching id not found...' });
    }

    const validation = validateTestimonial(req.body);
    if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
    }

    testimonial.author = req.body.author;
    testimonial.text = req.body.text;
    res.json({ message: 'Testimonial updated successfully' });
});

router.delete('/:id', (req, res) => {
    const testimonialIndex = db.findIndex(item => item.id == req.params.id);
    if (testimonialIndex !== -1) {
        db.splice(testimonialIndex, 1);
        res.json({ message: 'Testimonial deleted successfully' });
    } else {
        res.status(404).json({ message: 'Matching id not found...' });
    }
});

module.exports = router;