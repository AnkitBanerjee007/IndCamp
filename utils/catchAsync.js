// For handling error in Async functions

module.exports = func => {
    return (req , res , next) => { // Anonymous function
        func(req , res , next).catch(next);
    }
}