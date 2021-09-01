const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const Account = require("./models/Account")
const validator = require("validator")
const bcrypt = require("bcrypt")

const saltRounds = 10
const app = express()
app.use(bodyParser.urlencoded({extended:true}))
app.use('/public', express.static("public"))

app.get('/', (req, res)=>{
    res.sendFile(__dirname + "/custlogin.html")
})
app.get('/custsignup', (req, res)=>{
    res.sendFile(__dirname + "/custsignup.html")
})

const uri = "mongodb+srv://yss:200031@cluster0.cqefb.mongodb.net/iServiceDB?retryWrites=true&w=majority"
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
//mongoose.connect("mongodb://localhost:27017/iServiceDB", {useNewUrlParser:true})
//mongoose.connect("mongodb://yss:200031@cluster0-shard-00-00.cqefb.mongodb.net:27017,cluster0-shard-00-01.cqefb.mongodb.net:27017,cluster0-shard-00-02.cqefb.mongodb.net:27017/iServiceDB?ssl=true&replicaSet=atlas-hikqm1-shard-0&authSource=admin&retryWrites=true&w=majority", {useNewUrlParser:true})


app.post('/custsignup', (req, res)=>{
    const account = new Account({
        country: req.body.country,
        fname: req.body.first_name,
        lname: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        confirm: req.body.confirm_password,
        hashcode: "",
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        ZIP: req.body.ZIP_code,
        phone: req.body.phone_number
    })
    if(account.password == account.confirm){
        bcrypt.hash(account.password, saltRounds, (err, hash)=>{
            if(err){
                res.send(err)
            }
            else{
                account.hashcode = hash
                account.save((err)=>{
                    if(err){
                        res.send(err)
                    }
                    else{
                        res.sendFile(__dirname + "/registersuccess.html")
                        console.log(account)
                   }
                })    
            }        
        })
    }
    else{
        res.send('Password and confirm password must be same!')        
    }
})

app.post('/registersuccess', (req, res)=>{
    res.sendFile(__dirname + "/custlogin.html")
})
app.post('/custlogin', (req, res)=>{
    const email = req.body.login_email
    const password = req.body.login_password
    Account.findOne({"email": email}, 'hashcode', (err, account)=>{
        if(err){
            console.log(err)
        }
        else{
            bcrypt.compare(password, account.hashcode, (err, result)=>{
                if(err){
                    console.log(err)
                }
                else{
                    if(result == true){
                        res.sendFile(__dirname + "/custtask.html")
                    }
                    else{
                        res.send('Invalid email or password!')
                    }
                }
            })
        }
    })
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port, (req,res)=>{
    console.log("Server is running on port 8000")
})
