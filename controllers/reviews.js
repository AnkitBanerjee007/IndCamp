const Campground = require('../models/campground')
const Review = require('../models/review')


module.exports.createReview = async(req , res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)

    review.author = req.user._id // For author of each review

    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success', 'New review added') // Flash message , (Now goto app.js for Flash Middleware)
    res.redirect(`/campgrounds/${campground._id}`)
}



module.exports.deleteReview = async(req, res) => {
    const { id , reviewId } = req.params

    // removing the review Id from Campground schema for a particular campground
    Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId}})

    // removing the review from the Review Schema
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Review deleted') // Flash message , (Now goto app.js for Flash Middleware)

    res.redirect(`/campgrounds/${id}`)

}