const express = require('express');
const bodyParser = require('body-parser');
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');
const morganBody = require("morgan-body");
const jwt = require('jsonwebtoken');
const User = require('./app/models/user.models');

mongoose.Promise = global.Promise;

/* Make the connection to the database */

mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Hi Amit, Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});


/* Create instance of express */

const app = express();

/* Parse requests of content-type - application/x-www-form-urlencoded */

app.use(bodyParser.urlencoded({ extended: true }))

/* Parse requests of content-type - application/json */

app.use(bodyParser.json())
morganBody(app)

/* define a simple route */
app.get('/', (req, res) => {
    res.json({"message": "Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes."});
});

require('./app/routes/note.routes.js')(app);
require('./app/routes/student.routes.js')(app);
require('./app/routes/user.routes.js')(app);

/* End point for demo api */
app.get('/api', (req,res) =>{
    res.json({
        message: "Welcome to the User Api"
    });
});

/* End point for creating a post */

app.post('/api/post', verifyToken,  (req ,res) =>{
    jwt.verify(req.token,'secretkey',(err, authData) =>{
        if(err){
            res.sendStatus(403);
        }else res.json({
            message:" Post created",
            authData
        });
    });
});

/* End point for getting the user list when user is authenticated already */

app.get('/api/userslist', verifyToken, (req,res) =>{
    jwt.verify(req.token,'secretkey',(err,authData) =>{
        if(err){
            res.sendStatus(403);
        }
        User.find().then(users => {
            res.send(users);
        }).catch(err =>{
            res.status(500).send({
                message: err.message
            });
        });
    });
});

/* End point for login the user */

app.post('/user/login', (req,res) =>{
    const user ={
        name: req.body.name,
        password: req.body.password
    };
    User.findOne(user)
            .then(user => {
                if (!user) {
                    return res.status(404).send({
                        message: "Please enter correct username and password " + req.params.studentId
                    });
                }
                jwt.sign({user}, 'secretkey', (err,token) =>{
                    res.send({
                        access_token : token
                    });
                });
            }).catch(err => {
                if (err.kind === 'ObjectId') {
                    return res.status(404).send({
                        message: "user not found with id " + req.params.studentId
                    });
                }
                return res.status(500).send({
                    message: "Error retrieving user with id " + req.params.studentId
                });
            });
    
});

/* Function for verify the token */

function verifyToken (req,res,next) {
    const bearedHeader = req.headers['authorization'];
    if(typeof bearedHeader !== 'undefined'){
        const bearer = bearedHeader.split(' '); 
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    }else{
        res.sendStatus(403);
    }

}

/* Listen for requests */

app.listen(8001, () => {
    console.log("Server is listening on port 8001");
});
