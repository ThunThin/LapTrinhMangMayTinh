---
title: "JavaScript Objects & Prototypes: Hiểu Sâu Về Cơ Chế Hoạt Động"
date: 2024-12-25
tags: ["JavaScript", "Objects", "Prototypes", "OOP", "Advanced"]
categories: ["JavaScript"]
summary: "Prototypes là một trong những khái niệm quan trọng nhất trong JavaScript nhưng lại khó hiểu nhất. Bài viết này giải thích chi tiết cách objects và prototypes hoạt động, dựa trên kiến thức từ Cisco JavaScript Essentials 2."
draft: false
---

## Tại Sao Prototypes Quan Trọng?

Khi học JavaScript, tôi đã từng thắc mắc:

```javascript
// Tại sao array có method .map(), .filter()?
const arr = [1, 2, 3];
arr.map(x => x * 2); // [2, 4, 6]

// Tại sao object có method .toString()?
const obj = { name: "John" };
obj.toString(); // "[object Object]"
```

Câu trả lời là: **Prototype Chain**. Đây là cách JavaScript thực hiện inheritance và method sharing.

## Objects Trong JavaScript

### Object Literal

```javascript
// ✅ Object literal - cách đơn giản nhất
const user = {
    name: "John",
    age: 30,
    greet() {
        return `Hello, I'm ${this.name}`;
    }
};

console.log(user.name); // "John"
console.log(user.greet()); // "Hello, I'm John"
```

### Object Constructor

```javascript
// ✅ Object constructor
const user = new Object();
user.name = "John";
user.age = 30;

// Hoặc dùng Object.create()
const user = Object.create(null);
user.name = "John";
```

### Accessing Properties

```javascript
const user = {
    name: "John",
    "full name": "John Doe" // Property với space
};

// Dot notation
user.name; // "John"

// Bracket notation (cần thiết cho dynamic keys)
user["full name"]; // "John Doe"
user["name"]; // "John"

const key = "name";
user[key]; // "John" - dynamic access
```

## Prototype Chain: Cơ Chế Hoạt Động

### Mọi Object Đều Có Prototype

```javascript
// ✅ Mỗi object có một prototype
const obj = {};
console.log(obj.__proto__); // Object.prototype

const arr = [];
console.log(arr.__proto__); // Array.prototype

const str = "hello";
console.log(str.__proto__); // String.prototype
```

### Prototype Chain Lookup

Khi bạn truy cập một property, JavaScript tìm theo thứ tự:

```javascript
const arr = [1, 2, 3];

// 1. Tìm trong chính object đó
arr.length; // 3 - tìm thấy trong arr

// 2. Nếu không tìm thấy, tìm trong prototype
arr.map; // function - tìm thấy trong Array.prototype

// 3. Tiếp tục tìm trong prototype của prototype
arr.toString; // function - tìm thấy trong Object.prototype

// 4. Nếu đến Object.prototype mà không có, trả về undefined
arr.nonExistent; // undefined
```

### Visualizing Prototype Chain

```javascript
// Array.prototype chain
arr → Array.prototype → Object.prototype → null

// Object.prototype chain  
obj → Object.prototype → null

// Custom object chain
function Person(name) {
    this.name = name;
}
const person = new Person("John");
person → Person.prototype → Object.prototype → null
```

## Constructor Functions & Prototypes

### Constructor Function

```javascript
// ✅ Constructor function
function Person(name, age) {
    this.name = name;
    this.age = age;
}

// Thêm method vào prototype
Person.prototype.greet = function() {
    return `Hello, I'm ${this.name}`;
};

Person.prototype.getAge = function() {
    return this.age;
};

// Tạo instance
const person1 = new Person("John", 30);
const person2 = new Person("Jane", 25);

console.log(person1.greet()); // "Hello, I'm John"
console.log(person2.greet()); // "Hello, I'm Jane"

// Method được share qua prototype
console.log(person1.greet === person2.greet); // true - cùng một function!
```

### Tại Sao Dùng Prototype?

```javascript
// ❌ Không hiệu quả - mỗi instance có method riêng
function Person(name) {
    this.name = name;
    this.greet = function() {
        return `Hello, I'm ${this.name}`;
    };
}

const p1 = new Person("John");
const p2 = new Person("Jane");
console.log(p1.greet === p2.greet); // false - khác nhau!

// ✅ Hiệu quả - method được share qua prototype
function Person(name) {
    this.name = name;
}
Person.prototype.greet = function() {
    return `Hello, I'm ${this.name}`;
};

const p1 = new Person("John");
const p2 = new Person("Jane");
console.log(p1.greet === p2.greet); // true - cùng một function!
```

## ES6 Classes: Syntax Sugar

### Class Syntax

```javascript
// ✅ ES6 Class - syntax sugar cho constructor + prototype
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    
    // Method tự động được thêm vào prototype
    greet() {
        return `Hello, I'm ${this.name}`;
    }
    
    getAge() {
        return this.age;
    }
}

const person = new Person("John", 30);
console.log(person.greet()); // "Hello, I'm John"

// Vẫn là prototype-based!
console.log(Person.prototype.greet); // function
```

### Static Methods

```javascript
class Person {
    constructor(name) {
        this.name = name;
    }
    
    // Instance method
    greet() {
        return `Hello, I'm ${this.name}`;
    }
    
    // Static method - thuộc về class, không phải instance
    static createAnonymous() {
        return new Person("Anonymous");
    }
    
    static compareAge(person1, person2) {
        return person1.age - person2.age;
    }
}

const person = Person.createAnonymous();
console.log(person.name); // "Anonymous"

const p1 = new Person("John", 30);
const p2 = new Person("Jane", 25);
Person.compareAge(p1, p2); // 5
```

## Inheritance Với Prototypes

### Prototype Inheritance

```javascript
// ✅ Base class
function Animal(name) {
    this.name = name;
}

Animal.prototype.eat = function() {
    return `${this.name} is eating`;
};

Animal.prototype.sleep = function() {
    return `${this.name} is sleeping`;
};

// ✅ Derived class
function Dog(name, breed) {
    Animal.call(this, name); // Call parent constructor
    this.breed = breed;
}

// Set up prototype chain
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

// Add Dog-specific methods
Dog.prototype.bark = function() {
    return `${this.name} is barking`;
};

Dog.prototype.getBreed = function() {
    return this.breed;
};

// Usage
const dog = new Dog("Buddy", "Golden Retriever");
console.log(dog.eat()); // "Buddy is eating" - từ Animal
console.log(dog.bark()); // "Buddy is barking" - từ Dog
```

### ES6 Class Inheritance

```javascript
// ✅ Base class
class Animal {
    constructor(name) {
        this.name = name;
    }
    
    eat() {
        return `${this.name} is eating`;
    }
    
    sleep() {
        return `${this.name} is sleeping`;
    }
}

// ✅ Derived class
class Dog extends Animal {
    constructor(name, breed) {
        super(name); // Call parent constructor
        this.breed = breed;
    }
    
    bark() {
        return `${this.name} is barking`;
    }
    
    getBreed() {
        return this.breed;
    }
    
    // Override parent method
    eat() {
        return `${this.name} is eating dog food`;
    }
}

const dog = new Dog("Buddy", "Golden Retriever");
console.log(dog.eat()); // "Buddy is eating dog food" - overridden
console.log(dog.sleep()); // "Buddy is sleeping" - từ Animal
console.log(dog.bark()); // "Buddy is barking" - từ Dog
```

## Object Methods & Properties

### Object.create()

```javascript
// ✅ Tạo object với prototype cụ thể
const animal = {
    eat() {
        return "Eating...";
    }
};

const dog = Object.create(animal);
dog.name = "Buddy";
dog.bark = function() {
    return "Woof!";
};

console.log(dog.eat()); // "Eating..." - từ prototype
console.log(dog.bark()); // "Woof!" - từ chính nó
```

### Object.assign()

```javascript
// ✅ Copy properties từ object này sang object khác
const target = { a: 1 };
const source1 = { b: 2 };
const source2 = { c: 3 };

Object.assign(target, source1, source2);
console.log(target); // { a: 1, b: 2, c: 3 }

// ✅ Merge objects
const user = { name: "John" };
const defaults = { age: 0, role: "user" };
const merged = Object.assign({}, defaults, user);
console.log(merged); // { name: "John", age: 0, role: "user" }
```

### Object.keys(), Object.values(), Object.entries()

```javascript
const user = {
    name: "John",
    age: 30,
    role: "admin"
};

// ✅ Get keys
Object.keys(user); // ["name", "age", "role"]

// ✅ Get values
Object.values(user); // ["John", 30, "admin"]

// ✅ Get entries (key-value pairs)
Object.entries(user); // [["name", "John"], ["age", 30], ["role", "admin"]]

// ✅ Iterate over entries
Object.entries(user).forEach(([key, value]) => {
    console.log(`${key}: ${value}`);
});
```

### hasOwnProperty()

```javascript
const user = {
    name: "John"
};

// ✅ Check if property exists in object itself (not prototype)
user.hasOwnProperty("name"); // true
user.hasOwnProperty("toString"); // false (từ Object.prototype)

// ✅ Safe way (avoid prototype pollution)
Object.prototype.hasOwnProperty.call(user, "name"); // true
```

## Advanced: Prototype Manipulation

### Modifying Built-in Prototypes (Not Recommended!)

```javascript
// ⚠️ Không nên làm - modify built-in prototypes
Array.prototype.last = function() {
    return this[this.length - 1];
};

const arr = [1, 2, 3];
console.log(arr.last()); // 3

// Vấn đề: Ảnh hưởng đến tất cả arrays trong app!
```

### Checking Prototype Chain

```javascript
function Person(name) {
    this.name = name;
}

Person.prototype.greet = function() {
    return `Hello, I'm ${this.name}`;
};

const person = new Person("John");

// ✅ Check if object is instance of constructor
person instanceof Person; // true
person instanceof Object; // true

// ✅ Check prototype
Object.getPrototypeOf(person) === Person.prototype; // true
Person.prototype.isPrototypeOf(person); // true
```

## Common Mistakes Tôi Đã Mắc

### 1. Quên Set Constructor

```javascript
// ❌ Quên set constructor
function Dog(name) {
    this.name = name;
}
Dog.prototype = Object.create(Animal.prototype);
// Dog.prototype.constructor bây giờ là Animal!

// ✅ Luôn set constructor
Dog.prototype.constructor = Dog;
```

### 2. Mutating Prototype Sau Khi Tạo Instances

```javascript
function Person(name) {
    this.name = name;
}

const person = new Person("John");

// ✅ Thêm method vào prototype
Person.prototype.greet = function() {
    return `Hello, I'm ${this.name}`;
};

// Method có sẵn cho tất cả instances (kể cả đã tạo trước đó)
person.greet(); // "Hello, I'm John"
```

### 3. Confusing `this` Context

```javascript
class Person {
    constructor(name) {
        this.name = name;
    }
    
    greet() {
        return `Hello, I'm ${this.name}`;
    }
}

const person = new Person("John");

// ❌ Lost context
const greet = person.greet;
greet(); // Error: Cannot read property 'name' of undefined

// ✅ Bind context
const boundGreet = person.greet.bind(person);
boundGreet(); // "Hello, I'm John"

// ✅ Arrow function giữ context
class Person {
    constructor(name) {
        this.name = name;
    }
    
    greet = () => {
        return `Hello, I'm ${this.name}`;
    }
}
```

## Practical Example: Building A Simple Framework

```javascript
// ✅ Base Component class
class Component {
    constructor(element) {
        this.element = element;
    }
    
    render() {
        throw new Error("render() must be implemented");
    }
    
    mount() {
        this.render();
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Override in subclasses
    }
}

// ✅ Button Component
class Button extends Component {
    constructor(element, onClick) {
        super(element);
        this.onClick = onClick;
    }
    
    render() {
        this.element.innerHTML = `
            <button class="btn">Click me</button>
        `;
    }
    
    setupEventListeners() {
        const btn = this.element.querySelector('.btn');
        btn.addEventListener('click', this.onClick);
    }
}

// ✅ Modal Component
class Modal extends Component {
    constructor(element, title, content) {
        super(element);
        this.title = title;
        this.content = content;
    }
    
    render() {
        this.element.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h2>${this.title}</h2>
                    <button class="close-btn">×</button>
                </div>
                <div class="modal-body">
                    ${this.content}
                </div>
            </div>
        `;
    }
    
    setupEventListeners() {
        const closeBtn = this.element.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => {
            this.element.style.display = 'none';
        });
    }
}

// Usage
const button = new Button(
    document.querySelector('#button-container'),
    () => alert('Clicked!')
);
button.mount();

const modal = new Modal(
    document.querySelector('#modal-container'),
    "Title",
    "Content here"
);
modal.mount();
```

## Takeaway Cho Sinh Viên

1. **Prototypes là core của JavaScript** - Mọi object đều có prototype
2. **Prototype chain** - JavaScript tìm properties theo chain
3. **Classes là syntax sugar** - Vẫn dựa trên prototypes
4. **Inheritance qua prototypes** - Hiểu cách hoạt động để debug tốt hơn
5. **Practice với real projects** - Xây dựng components với inheritance

## Kết Luận

Prototypes là một trong những khái niệm quan trọng nhất trong JavaScript. Hiểu rõ cách prototypes hoạt động sẽ giúp bạn:
- Debug tốt hơn
- Viết code hiệu quả hơn
- Hiểu cách frameworks hoạt động
- Tận dụng tối đa sức mạnh của JavaScript

Đừng như tôi lúc đầu - chỉ học surface level mà không hiểu sâu về prototypes!

**Thử thách:** Hãy xây dựng một hệ thống component đơn giản sử dụng prototype inheritance. Đây là cách tốt nhất để hiểu sâu về prototypes!


