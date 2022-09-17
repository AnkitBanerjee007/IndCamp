const express = require('express')
const router = express.Router()
const campgrounds = require('../controllers/campgrounds')
const catchAsync = require('../utils/catchAsync')
const { isLoggedIn , validateCampground , isAuthor } = require('../middleware')
const multer = require('multer')
const { storage } = require('../cloudinary/index')
const upload = multer({ storage })



// VIEW ALL CAMPGROUNDS ---------------------------------------------
router.get("/",catchAsync(campgrounds.index)) // from controller
// ------------------------------------------------------------------

// router.post("/" ,upload.array('image') , (req , res) => {
//     console.log(req.body,req.files)
//     res.send("Working")
// })


// CREATE NEW CAMPGROUND --------------------------------------------
router.get("/new" , isLoggedIn, campgrounds.renderNewForm) // from contoller

router.post("/" , isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))

//  -----------------------------------------------------------------



// SHOWING PARTICULAR CAMP -------------------------------------------
router.get('/:id', catchAsync(campgrounds.showCampground))
// -------------------------------------------------------------------



// EDIT --------------------------------------------------------------
router.get('/:id/edit' , isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

router.put('/:id' , isLoggedIn , isAuthor , upload.array('image') , validateCampground, catchAsync(campgrounds.updateCampground))

// ---------------------------------------------------------------------


// DELETE --------------------------------------------------------------
router.delete('/:id' ,isLoggedIn, isAuthor , catchAsync(campgrounds.deleteCampground))

// ---------------------------------------------------------------------





module.exports = router;







