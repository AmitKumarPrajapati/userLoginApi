const User = require('../models/user.models.js');

// Create and Save a new user
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        return res.status(400).send({
            message: "User Content can not be empty"
        });
    }

    // Create a Student
    const user = new User({
        name: req.body.name || "Untitled User",
        age: req.body.age,
        email: req.body.email,
        password: req.body.password,
    });

    // Save user in the database
    user.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the user."
            });
        });
};


// Retrieve and return all users from the database.
exports.findAll = (req, res) => {
    User.find()
        .then(users => {
            res.send(users);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving users."
            });
        });
};

exports.loginUser = (req, res) => {
    User.find(res.params.name)
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found"
                })
            }
            res.send(user)
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with name" + req.params.name
                });
            }
            return res.status(500).send({
                message: "Error retrieving user with name " + req.params.name
            });
        });
}


// Find a single user with a userId
exports.findOne = (req, res) => {
    User.findById(req.params.userId)
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "user not found with id " + req.params.studentId
                });
            }
            res.send(user);
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
};

// // Update a user identified by the userId in the request
// exports.update = (req, res) => {
//     // Validate Request
//     if(!req.body.content) {
//         return res.status(400).send({
//             message: "user content can not be empty"
//         });
//     }

//     // Find user and update it with the request body
//     user.findByIdAndUpdate(req.params.userId, {
//         title: req.body.title || "Untitled user",
//         content: req.body.content
//     }, {new: true})
//     .then(user => {
//         if(!user) {
//             return res.status(404).send({
//                 message: "user not found with id " + req.params.userId
//             });
//         }
//         res.send(user);
//     }).catch(err => {
//         if(err.kind === 'ObjectId') {
//             return res.status(404).send({
//                 message: "user not found with id " + req.params.userId
//             });                
//         }
//         return res.status(500).send({
//             message: "Error updating user with id " + req.params.userId
//         });
//     });
// };

// // Delete a user with the specified userId in the request
// exports.delete = (req, res) => {
//     user.findByIdAndRemove(req.params.userId)
//     .then(user => {
//         if(!user) {
//             return res.status(404).send({
//                 message: "user not found with id " + req.params.userId
//             });
//         }
//         res.send({message: "user deleted successfully!"});
//     }).catch(err => {
//         if(err.kind === 'ObjectId' || err.name === 'NotFound') {
//             return res.status(404).send({
//                 message: "user not found with id " + req.params.userId
//             });                
//         }
//         return res.status(500).send({
//             message: "Could not delete user with id " + req.params.userId
//         });
// });
//};