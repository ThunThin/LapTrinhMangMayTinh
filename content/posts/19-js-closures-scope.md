---
title: "JavaScript Closures & Scope: Hiểu Sâu Về Variable Scope"
date: 2025-01-03
tags: ["JavaScript", "Closures", "Scope", "Functions", "Advanced"]
categories: ["JavaScript"]
summary: "Closures là một trong những khái niệm quan trọng nhất của JavaScript nhưng lại khó hiểu. Bài viết này giải thích chi tiết cách closures và scope hoạt động."
draft: false
---

## Scope: Nơi Variables Sống

Scope quyết định bạn có thể truy cập variables ở đâu. Hiểu scope là bước đầu tiên để hiểu closures.

### Global Scope

```javascript
// ✅ Global scope - accessible everywhere
const globalVar = "I'm global";

function test() {
    console.log(globalVar); // "I'm global"
}

test();
console.log(globalVar); // "I'm global"
```

### Function Scope

```javascript
// ✅ Function scope - chỉ accessible trong function
function test() {
    const functionVar = "I'm in function";
    console.log(functionVar); // "I'm in function"
}

test();
console.log(functionVar); // ReferenceError!
```

### Block Scope (let/const)

```javascript
// ✅ Block scope với let/const
if (true) {
    const blockVar = "I'm in block";
    console.log(blockVar); // "I'm in block"
}

console.log(blockVar); // ReferenceError!

// ✅ var có function scope, không phải block scope
if (true) {
    var functionScoped = "I'm function scoped";
}

console.log(functionScoped); // "I'm function scoped" - vẫn accessible!
```

## Closures: Functions Nhớ Scope

Closure là khi một function có thể truy cập variables từ scope cha ngay cả khi scope cha đã kết thúc.

### Basic Closure

```javascript
// ✅ Basic closure
function outer() {
    const outerVar = "I'm outer";
    
    function inner() {
        console.log(outerVar); // Access outerVar từ closure
    }
    
    return inner;
}

const innerFunc = outer();
innerFunc(); // "I'm outer" - vẫn access được outerVar!
```

### Practical Example: Counter

```javascript
// ✅ Counter với closure
function createCounter() {
    let count = 0; // Private variable
    
    return {
        increment() {
            count++;
            return count;
        },
        
        decrement() {
            count--;
            return count;
        },
        
        getCount() {
            return count;
        }
    };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.decrement()); // 1
console.log(counter.getCount()); // 1

// count không thể truy cập từ bên ngoài!
```

## Common Closure Patterns

### Module Pattern

```javascript
// ✅ Module pattern - tạo private variables
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
console.log(userModule.users); // undefined - private!
```

### Function Factories

```javascript
// ✅ Function factory - tạo functions với different configurations
function createMultiplier(multiplier) {
    return function(number) {
        return number * multiplier;
    };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15
```

### Event Handlers

```javascript
// ✅ Closure trong event handlers
function setupButtons() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach((button, index) => {
        button.addEventListener('click', function() {
            console.log(`Button ${index} clicked`);
            // index được capture trong closure
        });
    });
}
```

## The Classic Loop Problem

```javascript
// ❌ Classic problem - tất cả callbacks dùng cùng một i
for (var i = 0; i < 3; i++) {
    setTimeout(function() {
        console.log(i); // 3, 3, 3 (không phải 0, 1, 2!)
    }, 100);
}

// ✅ Solution 1: Dùng let (block scope)
for (let i = 0; i < 3; i++) {
    setTimeout(function() {
        console.log(i); // 0, 1, 2
    }, 100);
}

// ✅ Solution 2: IIFE (Immediately Invoked Function Expression)
for (var i = 0; i < 3; i++) {
    (function(index) {
        setTimeout(function() {
            console.log(index); // 0, 1, 2
        }, 100);
    })(i);
}

// ✅ Solution 3: Arrow function với let
for (let i = 0; i < 3; i++) {
    setTimeout(() => {
        console.log(i); // 0, 1, 2
    }, 100);
}
```

## Advanced Closure Examples

### Memoization

```javascript
// ✅ Memoization với closure
function memoize(fn) {
    const cache = {}; // Private cache
    
    return function(...args) {
        const key = JSON.stringify(args);
        
        if (cache[key]) {
            console.log("Cache hit!");
            return cache[key];
        }
        
        console.log("Computing...");
        const result = fn(...args);
        cache[key] = result;
        return result;
    };
}

// Usage
const expensiveFunction = memoize(function(n) {
    let sum = 0;
    for (let i = 0; i < n; i++) {
        sum += i;
    }
    return sum;
});

expensiveFunction(1000000); // Computing...
expensiveFunction(1000000); // Cache hit!
```

### Partial Application

```javascript
// ✅ Partial application với closure
function add(a, b, c) {
    return a + b + c;
}

function partial(fn, ...fixedArgs) {
    return function(...remainingArgs) {
        return fn(...fixedArgs, ...remainingArgs);
    };
}

const add5 = partial(add, 5);
console.log(add5(10, 15)); // 30 (5 + 10 + 15)

const add5And10 = partial(add, 5, 10);
console.log(add5And10(15)); // 30 (5 + 10 + 15)
```

### Currying

```javascript
// ✅ Currying với closure
function curry(fn) {
    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn(...args);
        } else {
            return function(...nextArgs) {
                return curried(...args, ...nextArgs);
            };
        }
    };
}

function multiply(a, b, c) {
    return a * b * c;
}

const curriedMultiply = curry(multiply);
console.log(curriedMultiply(2)(3)(4)); // 24
console.log(curriedMultiply(2, 3)(4)); // 24
console.log(curriedMultiply(2)(3, 4)); // 24
```

## Scope Chain

```javascript
// ✅ Scope chain - JavaScript tìm variables theo chain
const global = "global";

function outer() {
    const outerVar = "outer";
    
    function middle() {
        const middleVar = "middle";
        
        function inner() {
            const innerVar = "inner";
            
            // Tìm variables theo chain: inner → middle → outer → global
            console.log(innerVar); // "inner" - từ inner scope
            console.log(middleVar); // "middle" - từ middle scope
            console.log(outerVar); // "outer" - từ outer scope
            console.log(global); // "global" - từ global scope
        }
        
        inner();
    }
    
    middle();
}

outer();
```

## Common Mistakes Tôi Đã Mắc

### 1. Closure với Mutable Variables

```javascript
// ❌ Closure capture reference, không phải value
const functions = [];
for (var i = 0; i < 3; i++) {
    functions.push(function() {
        return i; // Tất cả return 3!
    });
}

functions.forEach(fn => console.log(fn())); // 3, 3, 3

// ✅ Capture value với IIFE
const functions = [];
for (var i = 0; i < 3; i++) {
    functions.push((function(index) {
        return function() {
            return index; // Capture value
        };
    })(i));
}

functions.forEach(fn => console.log(fn())); // 0, 1, 2
```

### 2. Memory Leaks

```javascript
// ⚠️ Closure có thể gây memory leaks
function setup() {
    const largeData = new Array(1000000).fill(0);
    
    document.getElementById('button').addEventListener('click', function() {
        // Closure giữ reference đến largeData
        console.log("Clicked");
    });
}

// largeData không được garbage collected vì closure giữ reference!
```

## Takeaway Cho Sinh Viên

1. **Scope quyết định accessibility** - Hiểu global, function, block scope
2. **Closures nhớ scope** - Functions có thể access variables từ scope cha
3. **Practice với real examples** - Module pattern, memoization, currying
4. **Watch for memory leaks** - Closures có thể giữ references
5. **Understand scope chain** - JavaScript tìm variables theo chain

## Kết Luận

Closures và scope là những khái niệm cốt lõi của JavaScript. Hiểu rõ cách chúng hoạt động sẽ giúp bạn viết code tốt hơn và debug dễ dàng hơn.

**Thử thách:** Hãy tạo một module với private variables sử dụng closures. Đây là cách tốt nhất để hiểu closures!


