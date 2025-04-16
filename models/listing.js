const mongoose = require('mongoose')
mongoose.set('strictQuery',false)

const url = process.env.MONGODB

mongoose.connect(url)
    .then(result=>{
        console.log('connection to db with sucess')
    })
    .catch(error=>{
        console.log('there is an error ', error.message)
    })

const phoneSchema = new mongoose.Schema({
    name :{
        type: String,
        minlength: 3,
    },
    number: {
        type: String,
        validate: {
            validator: (v)=>{
                // Regular expression to validate phone number format
                return /^\d{2,3}-\d{5,}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number.`
        },
        required: [true, 'Phone number is required']
    }
      
    
})

phoneSchema.set('toJSON', {
    transform: (document,returnedObject) =>{
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Listing', phoneSchema) 
