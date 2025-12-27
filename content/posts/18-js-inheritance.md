---
title: "JavaScript Inheritance: Từ Prototypes Đến ES6 Classes"
date: 2025-01-02
tags: ["JavaScript", "Inheritance", "Classes", "OOP", "Prototypes"]
categories: ["JavaScript"]
summary: "Inheritance là một trong những khái niệm quan trọng nhất của OOP. Bài viết này giải thích cách inheritance hoạt động trong JavaScript, từ prototypes đến ES6 classes."
draft: false
---

## Tại Sao Cần Inheritance?

Khi xây dựng ứng dụng, bạn sẽ có nhiều objects chia sẻ chung behavior:

```javascript
// ❌ Duplicate code
class Dog {
    constructor(name) {
        this.name = name;
    }
    
    eat() {
        return `${this.name} is eating`;
    }
    
    sleep() {
        return `${this.name} is sleeping`;
    }
    
    bark() {
        return "Woof!";
    }
}

class Cat {
    constructor(name) {
        this.name = name;
    }
    
    eat() {
        return `${this.name} is eating`;
    }
    
    sleep() {
        return `${this.name} is sleeping`;
    }
    
    meow() {
        return "Meow!";
    }
}
```

Với inheritance, bạn có thể tái sử dụng code:

```javascript
// ✅ Inheritance - tái sử dụng code
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

class Dog extends Animal {
    bark() {
        return "Woof!";
    }
}

class Cat extends Animal {
    meow() {
        return "Meow!";
    }
}
```

## Prototype-Based Inheritance

### Constructor Functions

```javascript
// ✅ Base constructor
function Animal(name) {
    this.name = name;
}

Animal.prototype.eat = function() {
    return `${this.name} is eating`;
};

Animal.prototype.sleep = function() {
    return `${this.name} is sleeping`;
};

// ✅ Derived constructor
function Dog(name, breed) {
    Animal.call(this, name); // Call parent constructor
    this.breed = breed;
}

// Set up prototype chain
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

// Add Dog-specific methods
Dog.prototype.bark = function() {
    return "Woof!";
};

// Usage
const dog = new Dog("Buddy", "Golden Retriever");
console.log(dog.eat()); // "Buddy is eating" - từ Animal
console.log(dog.bark()); // "Woof!" - từ Dog
```

### Object.create()

```javascript
// ✅ Inheritance với Object.create()
const animal = {
    eat() {
        return `${this.name} is eating`;
    },
    
    sleep() {
        return `${this.name} is sleeping`;
    }
};

const dog = Object.create(animal);
dog.name = "Buddy";
dog.bark = function() {
    return "Woof!";
};

console.log(dog.eat()); // "Buddy is eating"
console.log(dog.bark()); // "Woof!"
```

## ES6 Class Inheritance

### Basic Inheritance

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
        return "Woof!";
    }
}

// Usage
const dog = new Dog("Buddy", "Golden Retriever");
console.log(dog.eat()); // "Buddy is eating"
console.log(dog.bark()); // "Woof!"
```

### Method Overriding

```javascript
// ✅ Override parent method
class Animal {
    makeSound() {
        return "Some sound";
    }
}

class Dog extends Animal {
    makeSound() {
        return "Woof!";
    }
}

class Cat extends Animal {
    makeSound() {
        return "Meow!";
    }
}

const dog = new Dog();
const cat = new Cat();
console.log(dog.makeSound()); // "Woof!"
console.log(cat.makeSound()); // "Meow!"
```

### Calling Parent Methods

```javascript
// ✅ Call parent method với super
class Animal {
    constructor(name) {
        this.name = name;
    }
    
    introduce() {
        return `I am ${this.name}`;
    }
}

class Dog extends Animal {
    constructor(name, breed) {
        super(name);
        this.breed = breed;
    }
    
    introduce() {
        return `${super.introduce()} and I'm a ${this.breed}`;
    }
}

const dog = new Dog("Buddy", "Golden Retriever");
console.log(dog.introduce());
// "I am Buddy and I'm a Golden Retriever"
```

## Abstract Classes và Methods

```javascript
// ✅ Abstract class pattern
class Shape {
    constructor(color) {
        if (this.constructor === Shape) {
            throw new Error("Cannot instantiate abstract class");
        }
        this.color = color;
    }
    
    // Abstract method - must be implemented by subclasses
    getArea() {
        throw new Error("getArea() must be implemented");
    }
    
    // Concrete method
    getColor() {
        return this.color;
    }
}

class Circle extends Shape {
    constructor(color, radius) {
        super(color);
        this.radius = radius;
    }
    
    getArea() {
        return Math.PI * this.radius * this.radius;
    }
}

class Rectangle extends Shape {
    constructor(color, width, height) {
        super(color);
        this.width = width;
        this.height = height;
    }
    
    getArea() {
        return this.width * this.height;
    }
}

// Usage
const circle = new Circle("red", 5);
console.log(circle.getArea()); // ~78.54

const rectangle = new Rectangle("blue", 4, 6);
console.log(rectangle.getArea()); // 24
```

## Multiple Inheritance (Mixins)

```javascript
// ✅ Mixins - simulate multiple inheritance
const CanFly = {
    fly() {
        return `${this.name} is flying`;
    }
};

const CanSwim = {
    swim() {
        return `${this.name} is swimming`;
    }
};

class Bird {
    constructor(name) {
        this.name = name;
    }
}

// Mix in behaviors
Object.assign(Bird.prototype, CanFly);

class Duck extends Bird {
    constructor(name) {
        super(name);
    }
}

// Mix in additional behavior
Object.assign(Duck.prototype, CanSwim);

const duck = new Duck("Donald");
console.log(duck.fly()); // "Donald is flying"
console.log(duck.swim()); // "Donald is swimming"
```

## instanceof và isPrototypeOf

```javascript
// ✅ Check inheritance
class Animal {}
class Dog extends Animal {}
class Cat extends Animal {}

const dog = new Dog();
const cat = new Cat();

dog instanceof Dog; // true
dog instanceof Animal; // true
dog instanceof Cat; // false

Animal.prototype.isPrototypeOf(dog); // true
Dog.prototype.isPrototypeOf(dog); // true
```

## Practical Examples

### Example 1: UI Components

```javascript
// ✅ Component hierarchy
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

class Button extends Component {
    constructor(element, onClick) {
        super(element);
        this.onClick = onClick;
    }
    
    render() {
        this.element.innerHTML = '<button class="btn">Click me</button>';
    }
    
    setupEventListeners() {
        const btn = this.element.querySelector('.btn');
        btn.addEventListener('click', this.onClick);
    }
}

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
                <div class="modal-body">${this.content}</div>
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
```

### Example 2: Payment Methods

```javascript
// ✅ Payment hierarchy
class PaymentMethod {
    constructor(amount) {
        this.amount = amount;
    }
    
    process() {
        throw new Error("process() must be implemented");
    }
    
    validate() {
        return this.amount > 0;
    }
}

class CreditCardPayment extends PaymentMethod {
    constructor(amount, cardNumber, cvv) {
        super(amount);
        this.cardNumber = cardNumber;
        this.cvv = cvv;
    }
    
    validate() {
        return super.validate() && 
               this.cardNumber.length === 16 && 
               this.cvv.length === 3;
    }
    
    process() {
        if (!this.validate()) {
            throw new Error("Invalid credit card");
        }
        return `Processing $${this.amount} with credit card ${this.cardNumber}`;
    }
}

class PayPalPayment extends PaymentMethod {
    constructor(amount, email) {
        super(amount);
        this.email = email;
    }
    
    validate() {
        return super.validate() && 
               this.email.includes("@");
    }
    
    process() {
        if (!this.validate()) {
            throw new Error("Invalid PayPal email");
        }
        return `Processing $${this.amount} with PayPal ${this.email}`;
    }
}
```

## Common Mistakes Tôi Đã Mắc

### 1. Quên super()

```javascript
// ❌ Quên gọi super() trong constructor
class Dog extends Animal {
    constructor(name, breed) {
        this.breed = breed; // Error! Must call super() first
    }
}

// ✅ Gọi super() trước
class Dog extends Animal {
    constructor(name, breed) {
        super(name);
        this.breed = breed;
    }
}
```

### 2. Wrong Prototype Chain

```javascript
// ❌ Wrong prototype setup
Dog.prototype = Animal.prototype; // Wrong! Shares same prototype

// ✅ Create new object
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;
```

## Takeaway Cho Sinh Viên

1. **Inheritance giúp tái sử dụng code** - Tránh duplicate
2. **ES6 classes là syntax sugar** - Vẫn dựa trên prototypes
3. **super() quan trọng** - Gọi parent constructor và methods
4. **Practice với real examples** - UI components, payment methods
5. **Hiểu prototype chain** - Giúp debug tốt hơn

## Kết Luận

Inheritance là một trong những khái niệm quan trọng nhất của OOP. Từ prototype-based inheritance đến ES6 classes, hiểu rõ inheritance sẽ giúp bạn viết code tái sử dụng và maintainable hơn.

**Thử thách:** Hãy tạo một hệ thống component với inheritance. Đây là cách tốt nhất để hiểu inheritance!


