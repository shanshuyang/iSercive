const mongoose = require("mongoose")
const validator = require("validator")

const accountSchema = new mongoose.Schema(
    {
        country:{
            type: String, 
            validate(value){
                if(!(value=='America' || value=='Australia' || value=='China' || value=='England' || value=='France' || value=='Russia')){
                    throw new Error('Must select one country!')
                }
            }
        },
        fname:{
            type: String, 
            required: [true, 'Must input your first name!']
        },
        lname:{
            type: String,
            required: [true, 'Must input your last name!']
        },
        email:{
            type: String,
            trim: true,
            required: [true, 'Must input your email!'],
            validate(value){
                if(!validator.isEmail(value)){
                    throw new Error('Email is not valid!')
                }
            }
        },
        password:{
            type: String,
            minlength: [8, 'Must be more than 8 characters!'],
            maxlength: [16, 'Must be less than 16 characters!'],
            required: [true, 'Must input the password!']
        },
        confirm:{
            type: String,
            minlength: [8, 'Must be more than 8 characters!'],
            maxlength: [16, 'Must be less than 16 characters!'],
            required: [true, 'Must input the confirm password!']
        },
        hashcode:{
            type: String
        },
        address:{
            type: String,
            required: [true, 'Must input your address!']
        },
        city:{
            type: String,
            required: [true, 'Must input your city!']
        },
        state:{
            type: String,
            required: [true, 'Must input your state!']
        },
        ZIP: String,
        phone: String
    }
)

module.exports = mongoose.model("Account", accountSchema)