import React, { useState, useEffect } from "react";
import "./App.css";

const API_URL = import.meta.env.DEV 
  ? 'http://localhost:5000/api'
  : 'https://your-backend-url.com/api';

class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  introduce() {
    return `Hello, my name is ${this.name}.`;
  }
}

class Student extends Person {
  constructor(name, age, major) {
    super(name, age);
    this.major = major;
  }

  introduce() {
    return `Hello, my name is ${this.name} and I'm studying ${this.major}.`;
  }
}

class Teacher extends Person {
  constructor(name, age, subject) {
    super(name, age);
    this.subject = subject;
  }

  introduce() {
    return `Hello, my name is ${this.name} and I teach ${this.subject}.`;
  }
}

function App() {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ name: '', age: '', type: 'Person', major: '', subject: '' });

  // Fetch people from backend
  useEffect(() => {
    fetchPeople();
  }, []);

  const fetchPeople = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/people`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setPeople(data);
      setError(null);
    } catch (err) {
      setError('Failed to load data. Make sure backend is running on port 5000.');
      console.error('Fetch error:', err);
      // Fallback to hardcoded data
      setPeople([
        new Person("Alex Johnson", 30),
        new Student("Emma Watson", 20, "Computer Science"),
        new Teacher("Dr. James Wilson", 45, "Mathematics"),
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Add a new person
  const handleAddPerson = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.age) {
      alert('Please fill all required fields');
      return;
    }

    const newPerson = {
      name: formData.name,
      age: parseInt(formData.age),
      type: formData.type,
      major: formData.type === 'Student' ? formData.major : null,
      subject: formData.type === 'Teacher' ? formData.subject : null
    };

    try {
      const response = await fetch(`${API_URL}/people`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPerson)
      });
      if (!response.ok) throw new Error('Failed to add person');
      
      setFormData({ name: '', age: '', type: 'Person', major: '', subject: '' });
      fetchPeople();
    } catch (err) {
      alert('Failed to add person: ' + err.message);
    }
  };

  // Delete a person
  const handleDeletePerson = async (id) => {
    try {
      const response = await fetch(`${API_URL}/people/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete');
      fetchPeople();
    } catch (err) {
      alert('Failed to delete person: ' + err.message);
    }
  };

  // Create person objects with introduce methods
  const peopleWithMethods = people.map(p => {
    if (p.type === 'Student') {
      return new Student(p.name, p.age, p.major);
    } else if (p.type === 'Teacher') {
      return new Teacher(p.name, p.age, p.subject);
    } else {
      return new Person(p.name, p.age);
    }
  });

  return (
    <div className="container">
      <h1>Person Class Hierarchy</h1>
      
      {error && <div className="error-message">{error}</div>}

      {/* Form to add new person */}
      <div className="form-container">
        <h2>Add New Person</h2>
        <form onSubmit={handleAddPerson}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="form-group">
            <input
              type="number"
              placeholder="Age"
              value={formData.age}
              onChange={(e) => setFormData({...formData, age: e.target.value})}
            />
          </div>
          <div className="form-group">
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
            >
              <option value="Person">Person</option>
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
            </select>
          </div>
          {formData.type === 'Student' && (
            <div className="form-group">
              <input
                type="text"
                placeholder="Major"
                value={formData.major}
                onChange={(e) => setFormData({...formData, major: e.target.value})}
              />
            </div>
          )}
          {formData.type === 'Teacher' && (
            <div className="form-group">
              <input
                type="text"
                placeholder="Subject"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
              />
            </div>
          )}
          <button type="submit">Add Person</button>
        </form>
      </div>

      {/* Loading state */}
      {loading && <p className="loading">Loading...</p>}

      {/* Display people */}
      <div className="people-list">
        {peopleWithMethods.map((person, index) => (
          <div className="card" key={people[index]._id || index}>
            <h2>
              {person.name} ({person.constructor.name})
            </h2>
            <p>Age: {person.age}</p>
            <p className="intro">{person.introduce()}</p>
            {person instanceof Student && <p>Major: {person.major}</p>}
            {person instanceof Teacher && <p>Teaching: {person.subject}</p>}
            <button
              className="delete-btn"
              onClick={() => handleDeletePerson(people[index]._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
