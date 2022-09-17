const { campgroundSchema , reviewSchema } = require('./schemas')
const ExpressError = require('./utils/ExpressError')
const Campground = require('./models/campground')
const Review = require('./models/review')

// Login Middleware
module.exports.isLoggedIn = (req, res, next) => {
    
    if(!req.isAuthenticated()){

        // Store the url the user was requesting
        
        req.session.returnTo = req.originalUrl;
        console.log(req.session.returnTo)
        req.flash('error', 'You must be signed in');
        return res.redirect('/login')
    }
    next()
}


// JOI Validate Campground Middleware ---------------------------------------
module.exports.validateCampground = ( req, res, next) => {
    // IMPLEMENTING JOI
        
    
        const { error } = campgroundSchema.validate(req.body);
        if(error){
            const msg = error.details.map(el => el.message).join(',')
            throw new ExpressError(msg,400)
        }else{
            next()
        }
    }
// -------------------------------------------------------------------

// Authorization Middleware
module.exports.isAuthor =  async (req, res, next) => {
    const { id } = req.params
    // AUTHORIZATION
    const campground = await Campground.findById(id)
    if(!campground.author.equals(req.user._id)){
        req.flash('error','You do not have permission')
        res.redirect(`/campgrounds/${id}`)
    }
    next()
}


module.exports.isReviewAuthor =  async (req, res, next) => {
    const { id , reviewId } = req.params
    // AUTHORIZATION
    const review = await Review.findById(reviewId)
    if(!review.author.equals(req.user._id)){
        req.flash('error','You do not have permission')
        res.redirect(`/campgrounds/${id}`)
    }
    next()
}




// JOI Validate Review Middleware ------------------------------------
module.exports.validateReview = (req , res , next) => {
    const { error } = reviewSchema.validate(req.body)

    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next()
    }
}