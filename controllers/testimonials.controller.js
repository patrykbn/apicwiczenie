const Testimonial = require('../models/testimonial.model');

const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

const getRandomTestimonial = async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    const randomIndex = Math.floor(Math.random() * testimonials.length);
    res.json(testimonials[randomIndex]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

const getTestimonialById = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found.' });
    }
    res.json(testimonial);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

const createTestimonial = async (req, res) => {
  const { author, text } = req.body;
  if (!author || !text) {
    return res.status(400).json({ message: 'Author and text are required.' });
  }

  try {
    const newTestimonial = new Testimonial({ author, text });
    const savedTestimonial = await newTestimonial.save();
    res.status(201).json({ message: 'Testimonial created successfully', data: savedTestimonial });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

const updateTestimonial = async (req, res) => {
  const { author, text } = req.body;
  if (!author || !text) {
    return res.status(400).json({ message: 'Author and text are required.' });
  }

  try {
    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { author, text },
      { new: true }
    );

    if (!updatedTestimonial) {
      return res.status(404).json({ message: 'Testimonial not found.' });
    }

    res.json({ message: 'Testimonial updated successfully', data: updatedTestimonial });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

const deleteTestimonial = async (req, res) => {
  try {
    const deletedTestimonial = await Testimonial.findByIdAndDelete(req.params.id);

    if (!deletedTestimonial) {
      return res.status(404).json({ message: 'Testimonial not found.' });
    }

    res.json({ message: 'Testimonial deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

module.exports = {
  getAllTestimonials,
  getRandomTestimonial,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};