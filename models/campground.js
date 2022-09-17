const mongoose = require('mongoose')
const review = require('./review')
const Schema = mongoose.Schema


const ImageSchema = new Schema({
    url : String,
    filename : String
})
ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200')
})


const  opts = { toJSON : { virtuals : true }}

const campgroundSchema = new Schema({
    title : String,
    images : [ImageSchema],
    geometry : {
        type:{
            type : String,
            enum : ['Point'],
            required : true
        },
        coordinates : {
            type : [Number],
            required : true
        }

        
    },
    price : Number,
    description : String,
    location : String,
    author : {
        type : Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : 'Review'
        }
    ]
},opts)

// For proper format of geo data
campgroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `<a href="/campgrounds/${this._id}">${this.title}</a>
    <p>${this.description.substring(0,20)}...</p>`
})


// Mongoose Middleware to remove reviews if Campground is deleted
campgroundSchema.post('findOneAndDelete', async function(doc) {
    if(doc) {
        await review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})
// Check reviews db in mondodb - db.reviews.find()


// 'Campground' is the name of the model 
// campgroungSchema is our Schema
module.exports = mongoose.model('Campground',campgroundSchema)