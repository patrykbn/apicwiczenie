const express = require('express');
const router = express.Router();
const {
  getAllConcerts,
  getRandomConcert,
  getConcertById,
  createConcert,
  updateConcert,
  deleteConcert,
} = require('../controllers/concerts.controller'); // Import controller functions

router.get('/', getAllConcerts);
router.get('/random', getRandomConcert);
router.get('/:id', getConcertById);
router.post('/', createConcert);
router.put('/:id', updateConcert);
router.delete('/:id', deleteConcert);

module.exports = router;