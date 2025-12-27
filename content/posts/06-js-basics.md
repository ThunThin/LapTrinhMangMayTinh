---
title: "JavaScript Fundamentals: Những Điều Sinh Viên Phải Nắm Vững"
date: 2024-12-20
tags: ["JavaScript", "Fundamentals", "Beginner", "Basics"]
categories: ["JavaScript"]
summary: "JavaScript có nhiều điểm đặc biệt mà nếu không hiểu rõ sẽ gây confusion. Bài viết này chia sẻ những fundamentals quan trọng mà mình đã học từ những sai lầm ban đầu."
draft: false
---

## Tại Sao JavaScript Lại "Kỳ Lạ"?

Khi chuyển từ Java sang JavaScript, tôi cảm thấy bối rối:

```javascript
// Tại sao lại như thế này?
[] + [] // ""
[] + {} // "[object Object]"
{} + [] // 0
{} + {} // NaN

// Và tại sao?
0.1 + 0.2 === 0.3 // false!
```

JavaScript có nhiều "quirks" mà nếu không hiểu rõ sẽ gây bug. Bài viết này chia sẻ những fundamentals quan trọng nhất.

## 1. Variables: var, let, const

### Vấn Đề Với var

```javascript
// ❌ var có function scope, không có block scope
function example() {
    if (true) {
        var x = 10;
    }
    console.log(x); // 10 - vẫn truy cập được!
}

// ✅ let và const có block scope
function example() {
    if (true) {
        let x = 10;
        const y = 20;
    }
    console.log(x); // ReferenceError!
    console.log(y); // ReferenceError!
}
```

### Hoisting

```javascript
// ❌ var được hoisted nhưng giá trị là undefined
console.log(x); // undefined (không phải ReferenceError!)
var x = 10;

// ✅ let và const được hoisted nhưng không thể truy cập (Temporal Dead Zone)
console.log(x); // ReferenceError!
let x = 10;
```

### Best Practice

```javascript
// ✅ Luôn dùng const, chỉ dùng let khi cần thay đổi giá trị
const PI = 3.14159; // Không bao giờ thay đổi
let counter = 0; // Cần thay đổi

// ❌ Không bao giờ dùng var
var oldWay = "Don't use this";
```

## 2. Data Types Và Type Coercion

### Primitive Types

JavaScript có 7 primitive types:
- `string`
- `number`
- `boolean`
- `null`
- `undefined`
- `symbol`
- `bigint`

### Type Coercion - Nguồn Gốc Của Confusion

```javascript
// ❌ Type coercion tự động
"5" + 3 // "53" (string concatenation)
"5" - 3 // 2 (number subtraction)
"5" * 3 // 15 (number multiplication)

// So sánh
"5" == 5 // true (loose equality)
"5" === 5 // false (strict equality)

// Truthy và Falsy
if ([]) {
    console.log("Array is truthy!");
}

if (0) {
    console.log("This won't run");
}

// Falsy values: false, 0, "", null, undefined, NaN
```

### Best Practice: Luôn Dùng Strict Equality

```javascript
// ✅ Luôn dùng === và !==
if (value === 5) {
    // ...
}

// ❌ Tránh == và !=
if (value == 5) {
    // Có thể gây bug do type coercion
}
```

## 3. Functions: Các Cách Khai Báo

### Function Declaration

```javascript
// ✅ Hoisted - có thể gọi trước khi khai báo
sayHello(); // "Hello!"

function sayHello() {
    console.log("Hello!");
}
```

### Function Expression

```javascript
// ❌ Không hoisted - không thể gọi trước
sayHello(); // TypeError!

const sayHello = function() {
    console.log("Hello!");
};
```

### Arrow Functions

```javascript
// ✅ Ngắn gọn, không có this binding
const add = (a, b) => a + b;

const greet = name => `Hello, ${name}!`;

const process = (data) => {
    // Multiple lines
    const result = data.map(item => item * 2);
    return result;
};

// ⚠️ Arrow functions không có this
const obj = {
    name: "John",
    regularFunction: function() {
        console.log(this.name); // "John"
    },
    arrowFunction: () => {
        console.log(this.name); // undefined (this là window/global)
    }
};
```

## 4. Objects Và Arrays

### Object Literal

```javascript
// ✅ Object literal
const user = {
    name: "John",
    age: 30,
    greet() {
        return `Hello, I'm ${this.name}`;
    }
};

// Access properties
user.name; // "John"
user["name"]; // "John" (useful for dynamic keys)

// Destructuring
const { name, age } = user;
console.log(name, age); // "John" 30

// Object methods
Object.keys(user); // ["name", "age", "greet"]
Object.values(user); // ["John", 30, function]
Object.entries(user); // [["name", "John"], ["age", 30], ["greet", function]]
```

### Arrays - Basic Methods

```javascript
// ✅ Array methods cơ bản
const numbers = [1, 2, 3, 4, 5];

// map - transform each element
const doubled = numbers.map(n => n * 2); // [2, 4, 6, 8, 10]

// filter - keep elements that match condition
const evens = numbers.filter(n => n % 2 === 0); // [2, 4]

// reduce - accumulate values
const sum = numbers.reduce((acc, n) => acc + n, 0); // 15

// find - find first matching element
const found = numbers.find(n => n > 3); // 4

// some - check if any element matches
const hasEven = numbers.some(n => n % 2 === 0); // true

// every - check if all elements match
const allPositive = numbers.every(n => n > 0); // true

// forEach - iterate over elements
numbers.forEach((n, index) => {
    console.log(`${index}: ${n}`);
});
```

### Advanced Array Methods (Cisco JS Essentials 2)

```javascript
// ✅ flatMap - map rồi flatten
const words = ["hello world", "foo bar"];
const letters = words.flatMap(word => word.split(" "));
// ["hello", "world", "foo", "bar"]

// ✅ sort - sắp xếp (mutates array!)
const numbers = [3, 1, 4, 1, 5];
numbers.sort((a, b) => a - b); // [1, 1, 3, 4, 5]

// ✅ reverse - đảo ngược (mutates array!)
const arr = [1, 2, 3];
arr.reverse(); // [3, 2, 1]

// ✅ slice - copy một phần array (không mutate)
const arr = [1, 2, 3, 4, 5];
arr.slice(1, 3); // [2, 3] - từ index 1 đến 3 (không bao gồm 3)

// ✅ splice - thêm/xóa elements (mutates array!)
const arr = [1, 2, 3, 4, 5];
arr.splice(2, 1, 99); // Xóa 1 element từ index 2, thêm 99
// arr bây giờ là [1, 2, 99, 4, 5]

// ✅ concat - nối arrays (không mutate)
const arr1 = [1, 2];
const arr2 = [3, 4];
const combined = arr1.concat(arr2); // [1, 2, 3, 4]

// ✅ includes - check if array contains value
const arr = [1, 2, 3];
arr.includes(2); // true
arr.includes(5); // false

// ✅ indexOf / lastIndexOf - tìm index của value
const arr = [1, 2, 3, 2];
arr.indexOf(2); // 1
arr.lastIndexOf(2); // 3

// ✅ join - convert array thành string
const arr = ["Hello", "World"];
arr.join(" "); // "Hello World"
arr.join("-"); // "Hello-World"
```

## 5. Scope Và Closures

### Scope

```javascript
// Global scope
const globalVar = "I'm global";

function outer() {
    // Function scope
    const outerVar = "I'm in outer";
    
    function inner() {
        // Inner function scope
        const innerVar = "I'm in inner";
        console.log(globalVar); // Accessible
        console.log(outerVar); // Accessible
        console.log(innerVar); // Accessible
    }
    
    inner();
    // console.log(innerVar); // ReferenceError!
}

outer();
```

### Closures

```javascript
// ✅ Closure - function nhớ biến của scope cha
function createCounter() {
    let count = 0;
    
    return function() {
        count++;
        return count;
    };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3

// count vẫn tồn tại mặc dù createCounter đã return!
```

### Practical Example: Module Pattern

```javascript
// ✅ Sử dụng closure để tạo private variables
const userModule = (function() {
    let users = []; // Private
    
    return {
        addUser(user) {
            users.push(user);
        },
        getUsers() {
            return [...users]; // Return copy
        },
        getUserCount() {
            return users.length;
        }
    };
})();

userModule.addUser({ name: "John" });
console.log(userModule.getUsers()); // [{ name: "John" }]
console.log(userModule.users); // undefined (private)
```

## 6. this Keyword

`this` trong JavaScript phụ thuộc vào cách function được gọi:

```javascript
// ✅ Regular function - this là object gọi function
const obj = {
    name: "John",
    greet: function() {
        console.log(this.name); // "John"
    }
};
obj.greet();

// ❌ Lost context
const greet = obj.greet;
greet(); // undefined (this là window/global)

// ✅ Bind context
const boundGreet = obj.greet.bind(obj);
boundGreet(); // "John"

// ✅ Arrow function - this từ lexical scope
const obj2 = {
    name: "Jane",
    greet: function() {
        setTimeout(() => {
            console.log(this.name); // "Jane" (arrow function giữ this)
        }, 1000);
    }
};
obj2.greet();
```

## 7. Asynchronous JavaScript

### Callbacks

```javascript
// ❌ Callback hell
getData(function(data) {
    processData(data, function(result) {
        saveData(result, function(saved) {
            sendEmail(saved, function() {
                console.log("Done!");
            });
        });
    });
});

// ✅ Promises
getData()
    .then(processData)
    .then(saveData)
    .then(sendEmail)
    .then(() => console.log("Done!"))
    .catch(error => console.error(error));
```

### async/await

```javascript
// ✅ async/await - dễ đọc hơn
async function process() {
    try {
        const data = await getData();
        const result = await processData(data);
        const saved = await saveData(result);
        await sendEmail(saved);
        console.log("Done!");
    } catch (error) {
        console.error(error);
    }
}
```

## Common Mistakes Tôi Đã Mắc

### 1. Không Hiểu Reference vs Value

```javascript
// ❌ Objects và arrays là reference
const arr1 = [1, 2, 3];
const arr2 = arr1;
arr2.push(4);
console.log(arr1); // [1, 2, 3, 4] - arr1 cũng thay đổi!

// ✅ Copy array
const arr3 = [...arr1]; // Spread operator
const arr4 = arr1.slice(); // Slice method
const arr5 = Array.from(arr1); // Array.from
```

### 2. Sử Dụng var Trong Loop

```javascript
// ❌ Tất cả callbacks dùng cùng một i
for (var i = 0; i < 3; i++) {
    setTimeout(() => {
        console.log(i); // 3, 3, 3 (không phải 0, 1, 2!)
    }, 100);
}

// ✅ Dùng let
for (let i = 0; i < 3; i++) {
    setTimeout(() => {
        console.log(i); // 0, 1, 2
    }, 100);
}
```

## Takeaway Cho Sinh Viên

1. **Luôn dùng const/let** - Không bao giờ dùng var
2. **Luôn dùng ===** - Tránh type coercion bugs
3. **Hiểu closures** - Rất quan trọng trong JavaScript
4. **Học array methods** - map, filter, reduce là core
5. **Practice async/await** - Modern JavaScript standard

## Kết Luận

JavaScript có nhiều điểm đặc biệt, nhưng một khi hiểu rõ fundamentals, bạn sẽ thấy nó rất mạnh mẽ và linh hoạt. Đừng như tôi lúc đầu - chỉ học surface level mà không hiểu sâu!

**Thử thách:** Hãy viết một function sử dụng closures để tạo một module quản lý state đơn giản. Đây là cách tốt để hiểu closures!


