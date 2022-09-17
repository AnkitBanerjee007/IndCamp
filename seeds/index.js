const mongoose = require('mongoose')
const cities = require('./cities')
const {places , descriptors} = require('./seedHelpers')

const Campground = require('../models/campground')

mongoose.connect('mongodb://localhost:27017/camp-ground',{
    useNewUrlParser : true,
    //useCreateIndex : true,
    useUnifiedTopology : true
})

const db = mongoose.connection
db.on('error' , console.error.bind(console, 'connection error :'));
db.once('open', function() {
    console.log("DATABASE SEED CONNECTED");
});



const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDb = async() => {
    await Campground.deleteMany({})
    
    for(let i=0;i<50;i++){

        const random1000 = Math.floor(Math.random() * 1000)
        const priceGenerator = Math.floor(Math.random() * 200)

        const camp = new Campground({
            // MY AUTHOR
            author: '6310d0a7cecba4273de628ec',
            location : `${cities[random1000].city} , ${cities[random1000].state}`,
            title : `${sample(descriptors)} ${sample(places)}`,
            // image : "https://source.unsplash.com/collection/483251",
            description : "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
            price : priceGenerator,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images : [
                {
                  url: 'https://res.cloudinary.com/dqek8ubg5/image/upload/v1662710103/IndCamp/cgbdjybju4d5umdm3tdv.jpg',
                  filename: 'IndCamp/cgbdjybju4d5umdm3tdv'
                  
                },
                {
                  url: 'https://res.cloudinary.com/dqek8ubg5/image/upload/v1662710106/IndCamp/eexginffwxsyyrsvfvov.jpg',
                  filename: 'IndCamp/eexginffwxsyyrsvfvov'
                  
                }
              ]
            
        })
        await camp.save() 
    }
    
    
}

seedDb().then(() => {
    mongoose.connection.close("CONNECTION CLOSED")
})