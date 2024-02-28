
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const dbUrl = 'mongodb://127.0.0.1:27017/cyclone';

// mongodb connection
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));


// models
const Employee = mongoose.model('Employee', {
    empname: String,
    empaddress: String,
    empphone: String,
    empemail: String
});

// Create an employee
app.post('/employees', async (req, res) => {
    try {
        const { empname, empaddress, empphone, empemail } = req.body;
        const employee = new Employee({ empname, empaddress, empphone, empemail });
        await employee.save();
        res.status(201).send(employee);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get all employees
app.get('/employees', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.send(employees);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get an employee by ID for editing
app.get('/employees/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params._id);
        if (!employee) {
            return res.status(404).send({ error: 'Employee not found' });
        }
        res.send(employee);
    } catch (error) {
        res.status(500).send(error);
    }
});


// Update an employee by ID
app.put('/employees/:id', async (req, res) => {
    try {
        const employeeId = req.params.id;
        const { empname, empaddress, empphone, empemail } = req.body;

        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).send({ error: 'Employee not found' });
        }

        if (empname !== undefined) employee.empname = empname;
        if (empaddress !== undefined) employee.empaddress = empaddress;
        if (empphone !== undefined) employee.empphone = empphone;
        if (empemail !== undefined) employee.empemail = empemail;


        await employee.save();

        res.send(employee);
    } catch (error) {
        res.status(400).send(error);
    }
});


// Delete an employee by ID
app.delete('/employees/:id', async (req, res) => {
    try {
        const employeeId = req.params.id;
        const employee = await Employee.findByIdAndDelete(employeeId);
        if (!employee) {
            return res.status(404).send({ error: 'Employee not found' });
        }
        res.send(employee);
    } catch (error) {
        res.status(500).send(error);
    }
});

// localhost port number
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
