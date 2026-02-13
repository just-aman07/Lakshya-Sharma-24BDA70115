// Base Class
class Person {
  constructor(name, age){
    this.name = name;
    this.age = age;
  }

  introduce(){
    return `Hello, my name is ${this.name}.`;
  }

  render(){
    return `
      <div class="card">
        <h2>${this.name} (Person)</h2>
        <p class="age">Age: ${this.age}</p>
        <p class="desc">${this.introduce()}</p>
      </div>
    `;
  }
}

// Student Class inherits Person
class Student extends Person {
  constructor(name, age, major){
    super(name, age);
    this.major = major;
  }

  introduce(){
    return `Hello, my name is ${this.name} and I'm studying ${this.major}.`;
  }

  render(){
    return `
      <div class="card">
        <h2>${this.name} (Student)</h2>
        <p class="age">Age: ${this.age}</p>
        <p class="desc">${this.introduce()}</p>
        <p class="extra">Major: ${this.major}</p>
      </div>
    `;
  }
}

// Teacher Class inherits Person
class Teacher extends Person {
  constructor(name, age, subject){
    super(name, age);
    this.subject = subject;
  }

  introduce(){
    return `Hello, my name is ${this.name} and I teach ${this.subject}.`;
  }

  render(){
    return `
      <div class="card">
        <h2>${this.name} (Teacher)</h2>
        <p class="age">Age: ${this.age}</p>
        <p class="desc">${this.introduce()}</p>
        <p class="extra">Teaching: ${this.subject}</p>
      </div>
    `;
  }
}

// Create Objects
const p1 = new Person("Alex Johnson", 30);
const s1 = new Student("Emma Watson", 20, "Computer Science");
const t1 = new Teacher("Dr. James Wilson", 45, "Mathematics");

// Display on screen
const container = document.getElementById("cardContainer");

container.innerHTML += p1.render();
container.innerHTML += s1.render();
container.innerHTML += t1.render();
