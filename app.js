if(process.env.NODE_ENV != 'production') {
    require('dotenv').config()
} 


const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const session = require('express-session') // For creating sessions 
const flash = require('connect-flash') // Flash
const passport = require('passport') // Passport for Authentication
const LocalStrategy = require('passport-local') // Authentication
const User = require('./models/user')
const mongoSanitize = require('express-mongo-sanitize'); 


const MongoStore = require('connect-mongo');

const { campgroundSchema , reviewSchema } = require('./schemas')

const app = express()

const Campground = require('./models/campground')
const Review = require('./models/review')

//ROUTES
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')
const userRoutes = require('./routes/users')


const path = require('path')


app.use(express.urlencoded({extended : true}))
app.use(methodOverride('_method')) // For "PUT" operation
app.use(express.static(path.join(__dirname,'public'))) // Public Folder

app.use(mongoSanitize()) // Mongo Sanitize


const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/camp-ground'

const secret = process.env.SECRET || 'thisshouldbebettersecret!'
const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60,
    
});

store.on("error",function(e){
    console.log("SESSION STORE ERROR",e)
})

// Session
const sessionConfig = {
    store : store,
    name : 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 *7,
        maxAge: 1000 * 60 * 60 * 24 *7
    }
}
app.use(session(sessionConfig))



// Flash
app.use(flash())


// Passport - Authentication
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate())) // authenticate() - comes from passport-local-mongoose

passport.serializeUser(User.serializeUser()) // From 'passport-local-mongoose'
passport.deserializeUser(User.deserializeUser()) // From 'passport-local-mongoose'





// 'mongodb://localhost:27017/camp-ground'
// MongoDB connection
mongoose.connect(dbUrl,{
    useNewUrlParser : true,
    // useCreateIndex : true,
    useUnifiedTopology : true,
    // useFindAndModify : false
})

const db = mongoose.connection
db.on('error' , console.error.bind(console, 'connection error :'));
db.once('open', function() {
    console.log("DATABASE CONNECTED");
});

// EJS-MATE
app.engine('ejs' , ejsMate)
// Setting our View Engine as ejs
app.set('view engine' , 'ejs')
// Telling where the views folder is in our project
app.set('views',path.join(__dirname,'views'))


// Flash Middleware
app.use((req, res, next) => {

    // console.log(req.session)
    // For Authentication
    res.locals.currentUser = req.user

    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})


// Campground Routes
app.use('/campgrounds' , campgroundRoutes)
// Reviews Routes
app.use('/campgrounds/:id/reviews' , reviewRoutes)
// User Routes
app.use('/',userRoutes)




app.get("/" , (req,res) =>{
    res.render('home')
})




// 404 Error Page -------------------------------------------------
app.all("*" , (req , res , next) => {
    next(new ExpressError('Page not found', 404 ))
})



// Error -----------------------------------------------------------
app.use((err , req , res , next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Something went wrong'
    res.status(statusCode).render('error' , { err })
})

// -----------------------------------------------------------------
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`LISTENING ON PORT ${port}`)
})
