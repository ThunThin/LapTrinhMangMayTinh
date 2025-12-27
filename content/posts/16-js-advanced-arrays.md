---
title: "JavaScript Advanced Array Methods: Từ Basics Đến Mastery"
date: 2024-12-31
tags: ["JavaScript", "Arrays", "Functional Programming", "Advanced", "Methods"]
categories: ["JavaScript"]
summary: "Array methods là một trong những tính năng mạnh mẽ nhất của JavaScript. Bài viết này đi sâu vào các advanced array methods từ Cisco JavaScript Essentials 2."
draft: false
---

## Tại Sao Array Methods Quan Trọng?

Arrays là một trong những data structures được dùng nhiều nhất trong JavaScript. Hiểu rõ array methods sẽ giúp bạn:
- Viết code functional và declarative
- Xử lý data hiệu quả hơn
- Code ngắn gọn và dễ đọc hơn

## Core Array Methods

### map() - Transform Elements

```javascript
// ✅ Transform mỗi element
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
// [2, 4, 6, 8, 10]

// Transform objects
const users = [
    { name: "John", age: 30 },
    { name: "Jane", age: 25 }
];
const names = users.map(user => user.name);
// ["John", "Jane"]

// Transform với index
const indexed = numbers.map((n, index) => `${index}: ${n}`);
// ["0: 1", "1: 2", "2: 3", "3: 4", "4: 5"]
```

### filter() - Filter Elements

```javascript
// ✅ Filter elements theo điều kiện
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const evens = numbers.filter(n => n % 2 === 0);
// [2, 4, 6, 8, 10]

// Filter objects
const users = [
    { name: "John", age: 30 },
    { name: "Jane", age: 25 },
    { name: "Bob", age: 17 }
];
const adults = users.filter(user => user.age >= 18);
// [{ name: "John", age: 30 }, { name: "Jane", age: 25 }]

// Multiple conditions
const filtered = numbers.filter(n => n > 3 && n < 8);
// [4, 5, 6, 7]
```

### reduce() - Accumulate Values

```javascript
// ✅ Reduce to single value
const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce((acc, n) => acc + n, 0);
// 15

// Reduce objects
const users = [
    { name: "John", age: 30 },
    { name: "Jane", age: 25 }
];
const totalAge = users.reduce((acc, user) => acc + user.age, 0);
// 55

// Build object từ array
const names = ["John", "Jane", "Bob"];
const nameMap = names.reduce((acc, name, index) => {
    acc[name] = index;
    return acc;
}, {});
// { John: 0, Jane: 1, Bob: 2 }

// Flatten array
const nested = [[1, 2], [3, 4], [5, 6]];
const flat = nested.reduce((acc, arr) => [...acc, ...arr], []);
// [1, 2, 3, 4, 5, 6]
```

## Advanced Array Methods

### flatMap() - Map và Flatten

```javascript
// ✅ Map rồi flatten
const words = ["hello world", "foo bar"];
const letters = words.flatMap(word => word.split(" "));
// ["hello", "world", "foo", "bar"]

// Practical: Get all tags from posts
const posts = [
    { title: "Post 1", tags: ["js", "web"] },
    { title: "Post 2", tags: ["java", "backend"] },
    { title: "Post 3", tags: ["js", "frontend"] }
];
const allTags = posts.flatMap(post => post.tags);
// ["js", "web", "java", "backend", "js", "frontend"]

// Remove duplicates
const uniqueTags = [...new Set(allTags)];
// ["js", "web", "java", "backend", "frontend"]
```

### find() & findIndex() - Find Elements

```javascript
// ✅ Find first matching element
const users = [
    { id: 1, name: "John", active: true },
    { id: 2, name: "Jane", active: false },
    { id: 3, name: "Bob", active: true }
];

const activeUser = users.find(user => user.active);
// { id: 1, name: "John", active: true }

const user = users.find(user => user.id === 2);
// { id: 2, name: "Jane", active: false }

// Find index
const index = users.findIndex(user => user.id === 2);
// 1
```

### some() & every() - Boolean Checks

```javascript
// ✅ Check if any element matches
const numbers = [1, 2, 3, 4, 5];
const hasEven = numbers.some(n => n % 2 === 0);
// true

const hasNegative = numbers.some(n => n < 0);
// false

// Check if all elements match
const allPositive = numbers.every(n => n > 0);
// true

const allEven = numbers.every(n => n % 2 === 0);
// false

// Practical: Validate form
const formData = {
    name: "John",
    email: "john@example.com",
    age: 30
};
const isValid = Object.values(formData).every(value => value !== "");
// true
```

### sort() - Sort Elements

```javascript
// ✅ Sort numbers
const numbers = [3, 1, 4, 1, 5, 9, 2, 6];
numbers.sort((a, b) => a - b);
// [1, 1, 2, 3, 4, 5, 6, 9]

numbers.sort((a, b) => b - a); // Reverse
// [9, 6, 5, 4, 3, 2, 1, 1]

// Sort strings
const names = ["John", "Jane", "Bob", "Alice"];
names.sort();
// ["Alice", "Bob", "Jane", "John"]

names.sort((a, b) => a.length - b.length);
// ["Bob", "John", "Jane", "Alice"]

// Sort objects
const users = [
    { name: "John", age: 30 },
    { name: "Jane", age: 25 },
    { name: "Bob", age: 35 }
];
users.sort((a, b) => a.age - b.age);
// Sort by age ascending

users.sort((a, b) => b.age - a.age);
// Sort by age descending

users.sort((a, b) => a.name.localeCompare(b.name));
// Sort by name alphabetically
```

### slice() & splice() - Extract/Modify

```javascript
// ✅ slice() - extract (không mutate)
const numbers = [1, 2, 3, 4, 5];
const first3 = numbers.slice(0, 3);
// [1, 2, 3] - numbers không thay đổi

const last2 = numbers.slice(-2);
// [4, 5]

const middle = numbers.slice(1, 4);
// [2, 3, 4]

// ✅ splice() - modify (mutates array)
const arr = [1, 2, 3, 4, 5];
arr.splice(2, 1); // Xóa 1 element từ index 2
// arr = [1, 2, 4, 5]

arr.splice(2, 0, 3); // Thêm 3 vào index 2
// arr = [1, 2, 3, 4, 5]

arr.splice(2, 1, 99); // Thay thế element tại index 2
// arr = [1, 2, 99, 4, 5]
```

## Chaining Methods

```javascript
// ✅ Chain multiple methods
const users = [
    { name: "John", age: 30, active: true },
    { name: "Jane", age: 25, active: false },
    { name: "Bob", age: 35, active: true },
    { name: "Alice", age: 20, active: true }
];

// Get names of active users, sorted by age
const result = users
    .filter(user => user.active)
    .sort((a, b) => a.age - b.age)
    .map(user => user.name);
// ["Alice", "John", "Bob"]

// Calculate average age of active users
const avgAge = users
    .filter(user => user.active)
    .map(user => user.age)
    .reduce((acc, age, index, arr) => {
        acc += age;
        if (index === arr.length - 1) {
            return acc / arr.length;
        }
        return acc;
    }, 0);
// 28.33
```

## Practical Examples

### Example 1: Data Processing

```javascript
// ✅ Process và transform data
const orders = [
    { id: 1, items: [{ name: "Laptop", price: 1000 }, { name: "Mouse", price: 20 }], status: "completed" },
    { id: 2, items: [{ name: "Keyboard", price: 50 }], status: "pending" },
    { id: 3, items: [{ name: "Monitor", price: 300 }, { name: "Stand", price: 100 }], status: "completed" }
];

// Get total revenue from completed orders
const revenue = orders
    .filter(order => order.status === "completed")
    .flatMap(order => order.items)
    .reduce((acc, item) => acc + item.price, 0);
// 1420

// Get unique product names
const products = orders
    .flatMap(order => order.items)
    .map(item => item.name)
    .filter((name, index, arr) => arr.indexOf(name) === index);
// ["Laptop", "Mouse", "Keyboard", "Monitor", "Stand"]
```

### Example 2: Search và Filter

```javascript
// ✅ Advanced search
const products = [
    { name: "Laptop", category: "Electronics", price: 1000, inStock: true },
    { name: "Book", category: "Education", price: 20, inStock: true },
    { name: "Phone", category: "Electronics", price: 800, inStock: false },
    { name: "Tablet", category: "Electronics", price: 500, inStock: true }
];

function searchProducts(products, query) {
    const lowerQuery = query.toLowerCase();
    return products.filter(product => 
        product.name.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery)
    );
}

function filterProducts(products, filters) {
    return products.filter(product => {
        if (filters.category && product.category !== filters.category) {
            return false;
        }
        if (filters.minPrice && product.price < filters.minPrice) {
            return false;
        }
        if (filters.maxPrice && product.price > filters.maxPrice) {
            return false;
        }
        if (filters.inStock !== undefined && product.inStock !== filters.inStock) {
            return false;
        }
        return true;
    });
}

// Usage
const electronics = filterProducts(products, { category: "Electronics", inStock: true });
const affordable = filterProducts(products, { maxPrice: 600, inStock: true });
```

## Performance Considerations

```javascript
// ⚠️ Chaining nhiều methods có thể chậm với large arrays
const largeArray = Array.from({ length: 1000000 }, (_, i) => i);

// ❌ Chậm - tạo nhiều intermediate arrays
const result = largeArray
    .filter(n => n % 2 === 0)
    .map(n => n * 2)
    .filter(n => n > 1000)
    .slice(0, 10);

// ✅ Nhanh hơn - single pass
const result2 = [];
for (let i = 0; i < largeArray.length && result2.length < 10; i++) {
    const n = largeArray[i];
    if (n % 2 === 0) {
        const doubled = n * 2;
        if (doubled > 1000) {
            result2.push(doubled);
        }
    }
}
```

## Common Mistakes Tôi Đã Mắc

### 1. Mutating trong map/filter

```javascript
// ❌ Mutating original array
const numbers = [1, 2, 3];
numbers.map(n => {
    numbers.push(n * 2); // Side effect!
    return n;
});

// ✅ Pure functions - không mutate
const doubled = numbers.map(n => n * 2);
```

### 2. Quên return trong reduce

```javascript
// ❌ Quên return accumulator
const sum = numbers.reduce((acc, n) => {
    acc + n; // Missing return!
}, 0);

// ✅ Luôn return accumulator
const sum = numbers.reduce((acc, n) => {
    return acc + n;
}, 0);
```

## Takeaway Cho Sinh Viên

1. **Array methods là functional** - Pure functions, không mutate
2. **Chaining methods** - Code ngắn gọn và dễ đọc
3. **Practice với real data** - Áp dụng vào project thực tế
4. **Hiểu performance** - Chaining có thể chậm với large arrays
5. **Combine methods** - Sử dụng nhiều methods cùng lúc

## Kết Luận

Array methods là một trong những tính năng mạnh mẽ nhất của JavaScript. Từ map, filter, reduce đến các advanced methods như flatMap và sort, hiểu rõ array methods sẽ giúp bạn viết code functional và hiệu quả hơn.

**Thử thách:** Hãy refactor một đoạn code sử dụng loops thành array methods. Bạn sẽ thấy code ngắn gọn và dễ đọc hơn!


