const Car = require('../model/Car');
const path = require("path");

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

exports.createCar = async (req, res) => {
  const { title, description, car_type, company, dealer } = req.body;
  try {
    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' });
    }

    const images = req.files.map(file => file.path); // Array of image paths

    const car = new Car({
      user: req.user.id,
      title,
      description,
      tags: { car_type, company, dealer },
      images
    });
    await car.save();
    res.status(201).json(car);
  } catch (err) {
    console.error("Error in createCar:", err);
    res.status(500).json({ message: 'Server error' });
  }
};
  exports.getCars = async (req, res) => {
    try {
      const cars = await Car.find({ user: req.user.id });
      const carsWithImageUrls = cars.map(car => {
        car.images = car.images.map(image => `${BASE_URL}/${image}`);
        return car;
      });
      res.status(200).json(carsWithImageUrls);
    } catch (err) {
      console.error("error in the getCras", err);
      res.status(500).json({ message: 'Server error' });
    }
  };



  exports.getAllCars = async (req, res) => {
    try {
        const cars = await Car.find();
        const carsWithImageUrls = cars.map(car => {
          car.images = car.images.map(image => `${BASE_URL}/${image}`);
          return car;
        });
        return res.status(200).json(carsWithImageUrls);
    } catch (error) {
        console.log("Error in getAllCars: ", error);
        return res.status(500).json({ message: 'Server error' });
    }
};


  // Update car function
  
  exports.updateCar = async (req, res) => {
    const { title, description, car_type, company, dealer } = req.body;
    const newImages = req.files ? req.files.map(file => `${file.filename}`) : undefined;

    try {
        let car = await Car.findOne({ _id: req.params.id, user: req.user.id });
        if (!car) return res.status(404).json({ message: 'Car not found' });

        // Update fields
        car.title = title || car.title;
        car.description = description || car.description;
        car.tags = {
            car_type: car_type || car.tags.car_type,
            company: company || car.tags.company,
            dealer: dealer || car.tags.dealer
        };

        // Only update images if new images are provided
        if (newImages) {
            car.images = req.files.map(file => file.path);

        }

        await car.save();
        
        const carsWithImageUrls = cars.map(car => {
          car.images = car.images.map(image => `${process.env.BASE_URL}/${image}`);
          return car;
        });
        res.status(200).json(carsWithImageUrls);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

  

  // Delete car function
exports.deleteCar = async (req, res) => {
    try {
      const car = await Car.findOneAndDelete({ _id: req.params.id, user: req.user.id });
      if (!car) return res.status(404).json({ message: 'Car not found' });
  
      res.status(200).json({ message: 'Car deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  };

  
  exports.searchCars = async (req, res) => {
    const { keyword } = req.query; // Get search keyword from query parameters
  
    if (!keyword) return res.status(400).json({ message: 'Keyword is required for searching' });
  
    try {
      // Search across cars belonging to the logged-in user
      const cars = await Car.find(
        { user: req.user.id, $text: { $search: keyword } },
        { score: { $meta: 'textScore' } }
      )
      .sort({ score: { $meta: 'textScore' } }); // Sort by relevance
      const carsWithImageUrls = cars.map(car => {
        car.images = car.images.map(image => `${process.env.BASE_URL}/${image}`);
        return car;
      });
  
      res.status(200).json(carsWithImageUrls);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  