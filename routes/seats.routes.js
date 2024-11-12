const express = require('express');
const router = express.Router();
const {
  getAllSeats,
  getRandomSeat,
  getSeatById,
  createSeat,
  updateSeat,
  deleteSeat,
} = require('../controllers/seats.controller');

router.get('/', getAllSeats);
router.get('/random', getRandomSeat);
router.get('/:id', getSeatById);
router.post('/', createSeat);
router.put('/:id', updateSeat);
router.delete('/:id', deleteSeat);

module.exports = router;