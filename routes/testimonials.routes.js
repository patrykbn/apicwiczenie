const express = require('express');
const router = express.Router();
const {
  getAllTestimonials,
  getRandomTestimonial,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require('../controllers/testimonials.controller');

router.get('/', getAllTestimonials);
router.get('/random', getRandomTestimonial);
router.get('/:id', getTestimonialById);
router.post('/', createTestimonial);
router.put('/:id', updateTestimonial);
router.delete('/:id', deleteTestimonial);

module.exports = router;