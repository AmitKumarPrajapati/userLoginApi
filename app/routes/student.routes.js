module.exports = (app) => {
    const students = require('../controllers/student.controller.js');

    // Create a new Note
    app.post('/students', students.create);

    // Retrieve all Notes
    app.get('/students', students.findAll);

    // Retrieve a single Note with noteId
    app.get('/students/:studentsId', students.findOne);

    // Update a Note with noteId
    // app.put('/students/:studentsId', students.update);

    // Delete a Note with noteId
    // app.delete('/students/:studentsId', students.delete);
}