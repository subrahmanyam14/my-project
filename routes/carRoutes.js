const express = require('express');
const router = express.Router();
const { createCar, getCars, updateCar, deleteCar, searchCars, getAllCars } = require('../controllers/carController');
const auth = require('../middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Multer storage with original filename and extension
// Check if 'uploads' directory exists, if not, create it
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Configure Multer storage with original filename and extension
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

router.post('/create', auth, upload.array('images', 10), createCar);
router.get('/getcars', auth, getCars);
router.get("/getallcars", auth, getAllCars);
router.get('/search', auth, searchCars); // Search route
router.put('/:id', auth, upload.array('images', 10), updateCar);
router.delete('/:id', auth, deleteCar);

module.exports = router;
