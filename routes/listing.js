const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn, isOwner, validateListing } = require('../middleware');
const listingController = require('../controllers/listing');
const multer = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage });

// Validation for listingSchema Middleware Function

router.route('/')
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn, 
    upload.single('listing[image]'), 
    validateListing,
    wrapAsync(listingController.createRoute)
  );

// new route
router.get('/new', isLoggedIn, listingController.newRoute);

router.post('/search',listingController.newRoute);
router.route('/:id')
  .get(wrapAsync(listingController.showRoute))
  .put(isLoggedIn, 
       isOwner, 
       upload.single('listing[image]'),
       validateListing, 
       wrapAsync(listingController.updateRoute)
      )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyRoute));

// edit route
router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingController.editRoute));

module.exports = router;