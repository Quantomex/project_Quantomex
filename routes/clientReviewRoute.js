// routes/clientReviews.js

const express = require('express');
const router = express.Router();
const ClientReview = require('../models/clientReviewModel'); // Import the ClientReview model
const { isAdmin } = require('../middleware/isAdmin'); // You may define your isAdmin middleware
const AdminOTP = require('../models/otpModel'); // Import the AdminOTP model

const { uploader } = require('cloudinary').v2;
const multer = require('multer');
const { storage } = require('../cloudinary/index');
const upload = multer({ storage });

// Get Client Reviews Page
router.get('/admin/client-reviews', isAdmin, async (req, res) => {
  const reviews = await ClientReview.find();
  res.render('./admin/clientReviews', { reviews });
});

// Add Client Review (With OTP)
router.get('/addOTP', isAdmin, async (req, res) => {
  // Render the OTP setting form
  pass = await AdminOTP.find();
  res.render('./admin/setOTP', { pass });
});
router.post('/setOTP', isAdmin, async (req, res) => {
  try {
    const { otp } = req.body;
    // Store the admin-generated OTP in the database
    const pass=  await AdminOTP({ otp });
    await pass.save();
    req.flash('success', 'Admin OTP set successfully');
    res.redirect('/addOTP');
  } catch (error) {
    console.error('Error setting Admin OTP:', error);
    req.flash('error', 'Error setting Admin OTP');
    res.status(500).json({ message: 'Error setting Admin OTP', error: error.message });
  }
});
// Add Client Review
router.post('/addClientReview', upload.single('image'), isAdmin, async (req, res) => {
  try {
    const { clientName, rating, reviewOfJob } = req.body;
    const image = req.file ? req.file.path : '';
    const review = new ClientReview({ image, clientName, rating, reviewOfJob });
    await review.save();
    req.flash('success', 'Client review added successfully');
    res.redirect('/admin/client-reviews');
  } catch (error) {
    console.error('Error adding Client Review:', error);
    req.flash('error', 'Error adding Client Review');
    res.status(500).json({ message: 'Error adding Client Review', error: error.message });
  }
});
// Delete Client Review
router.post('/deleteClientReview/:id', isAdmin, async (req, res) => {
    try {
      const deletedReview = await ClientReview.findByIdAndDelete(req.params.id);
  
      if (deletedReview.image) {
        await uploader.destroy(deletedReview.image);
      }
  
      req.flash('success', 'Client Review deleted successfully');
      res.redirect('/admin/client-reviews');
    } catch (error) {
      console.error('Error deleting Client Review:', error);
      res.status(500).json({ message: 'Error deleting Client Review', error: error.message });
    }
  });
// // Edit Client Review Form
// router.get('/editClientReview/:id', isAdmin, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const review = await ClientReview.findById(id);

//     if (!review) {
//       req.flash('error', 'Client Review not found');
//       return res.redirect('/admin/client-reviews');
//     }

//     res.render('./admin/clientReviewView/editClientReview', { review });
//   } catch (error) {
//     console.error('Error retrieving Client Review:', error);
//     res.status(500).json({ message: 'Error retrieving Client Review', error: error.message });
//   }
// });

// // Update Client Review
// router.post('/editClientReview/:id', upload.single('image'), isAdmin, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const review = await ClientReview.findById(id);

//     if (!review) {
//       req.flash('error', 'Client Review not found');
//       return res.redirect('/admin/client-reviews');
//     }

//     review.image = req.file ? req.file.path : ''; // Update the image path
//     review.clientName = req.body.clientName;
//     review.rating = req.body.rating;
//     review.reviewOfJob = req.body.reviewOfJob;

//     await review.save();

//     req.flash('success', 'Client Review updated successfully');
//     res.redirect('/admin/client-reviews');
//   } catch (error) {
//     console.error('Error updating Client Review:', error);
//     req.flash('error', 'Error updating Client Review');
//     res.status(500).json({ message: 'Error updating Client Review', error: error.message });
//   }
// });



module.exports = router;
