import express from 'express';
import Person from '../models/Person.js';

const router = express.Router();

// Get all people
router.get('/', async (req, res) => {
  try {
    const people = await Person.find().sort({ createdAt: -1 });
    res.json(people);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single person by ID
router.get('/:id', async (req, res) => {
  try {
    const person = await Person.findById(req.params.id);
    if (!person) return res.status(404).json({ message: 'Person not found' });
    res.json(person);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new person/student/teacher
router.post('/', async (req, res) => {
  const { name, age, type, major, subject } = req.body;

  if (!name || !age || !type) {
    return res.status(400).json({ message: 'Name, age, and type are required' });
  }

  const person = new Person({
    name,
    age,
    type,
    major: type === 'Student' ? major : null,
    subject: type === 'Teacher' ? subject : null
  });

  try {
    const newPerson = await person.save();
    res.status(201).json(newPerson);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a person
router.put('/:id', async (req, res) => {
  try {
    const person = await Person.findById(req.params.id);
    if (!person) return res.status(404).json({ message: 'Person not found' });

    if (req.body.name) person.name = req.body.name;
    if (req.body.age) person.age = req.body.age;
    if (req.body.type) person.type = req.body.type;
    if (req.body.major !== undefined) person.major = req.body.major;
    if (req.body.subject !== undefined) person.subject = req.body.subject;

    const updatedPerson = await person.save();
    res.json(updatedPerson);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a person
router.delete('/:id', async (req, res) => {
  try {
    const person = await Person.findById(req.params.id);
    if (!person) return res.status(404).json({ message: 'Person not found' });

    await Person.findByIdAndDelete(req.params.id);
    res.json({ message: 'Person deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
