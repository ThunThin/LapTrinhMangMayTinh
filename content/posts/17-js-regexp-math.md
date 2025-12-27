---
title: "JavaScript RegExp & Math Object: Xử Lý Text Và Tính Toán"
date: 2025-01-01
tags: ["JavaScript", "RegExp", "Math", "String Manipulation", "Advanced"]
categories: ["JavaScript"]
summary: "RegExp và Math object là những công cụ mạnh mẽ trong JavaScript. Bài viết này chia sẻ cách sử dụng chúng hiệu quả, dựa trên Cisco JavaScript Essentials 2."
draft: false
---

## RegExp: Pattern Matching Mạnh Mẽ

Regular Expressions (RegExp) là một công cụ mạnh mẽ để tìm kiếm và thay thế patterns trong text. Mặc dù có vẻ phức tạp, nhưng một khi hiểu rõ, bạn sẽ thấy chúng rất hữu ích.

## RegExp Basics

### Tạo RegExp

```javascript
// ✅ Cách 1: RegExp literal
const pattern = /hello/;

// ✅ Cách 2: RegExp constructor
const pattern = new RegExp("hello");

// ✅ Flags
const pattern1 = /hello/i; // Case insensitive
const pattern2 = /hello/g; // Global (tìm tất cả matches)
const pattern3 = /hello/m; // Multiline
const pattern4 = /hello/gi; // Multiple flags
```

### Basic Patterns

```javascript
// ✅ Literal match
const pattern = /hello/;
pattern.test("hello world"); // true
pattern.test("Hello world"); // false (case sensitive)

// ✅ Case insensitive
const pattern = /hello/i;
pattern.test("Hello world"); // true

// ✅ Character classes
const pattern = /[0-9]/; // Match any digit
pattern.test("abc123"); // true

const pattern = /[a-z]/; // Match any lowercase letter
pattern.test("ABC"); // false

const pattern = /[a-zA-Z0-9]/; // Match alphanumeric
pattern.test("Hello123"); // true

// ✅ Negated character class
const pattern = /[^0-9]/; // Match anything except digits
pattern.test("123"); // false
pattern.test("abc"); // true
```

## Common Patterns

### Digits và Numbers

```javascript
// ✅ Match digits
const digitPattern = /\d/; // Same as [0-9]
digitPattern.test("abc123"); // true

// ✅ Match non-digits
const nonDigitPattern = /\D/; // Same as [^0-9]
nonDigitPattern.test("123"); // false

// ✅ Match word characters
const wordPattern = /\w/; // [a-zA-Z0-9_]
wordPattern.test("hello_123"); // true

// ✅ Match whitespace
const spacePattern = /\s/; // Space, tab, newline
spacePattern.test("hello world"); // true

// ✅ Match phone number
const phonePattern = /\d{3}-\d{3}-\d{4}/;
phonePattern.test("123-456-7890"); // true
```

### Quantifiers

```javascript
// ✅ * - Zero or more
const pattern = /ab*/; // a followed by zero or more b
pattern.test("a"); // true
pattern.test("ab"); // true
pattern.test("abb"); // true

// ✅ + - One or more
const pattern = /ab+/; // a followed by one or more b
pattern.test("a"); // false
pattern.test("ab"); // true
pattern.test("abb"); // true

// ✅ ? - Zero or one
const pattern = /ab?/; // a followed by zero or one b
pattern.test("a"); // true
pattern.test("ab"); // true
pattern.test("abb"); // true (matches "ab")

// ✅ {n} - Exactly n times
const pattern = /\d{3}/; // Exactly 3 digits
pattern.test("123"); // true
pattern.test("12"); // false

// ✅ {n,m} - Between n and m times
const pattern = /\d{2,4}/; // 2 to 4 digits
pattern.test("12"); // true
pattern.test("1234"); // true
pattern.test("12345"); // true (matches first 4)

// ✅ {n,} - n or more times
const pattern = /\d{3,}/; // 3 or more digits
pattern.test("123"); // true
pattern.test("12345"); // true
```

### Anchors

```javascript
// ✅ ^ - Start of string
const pattern = /^hello/;
pattern.test("hello world"); // true
pattern.test("world hello"); // false

// ✅ $ - End of string
const pattern = /world$/;
pattern.test("hello world"); // true
pattern.test("world hello"); // false

// ✅ \b - Word boundary
const pattern = /\bhello\b/;
pattern.test("hello world"); // true
pattern.test("helloworld"); // false
```

## String Methods với RegExp

### test() & exec()

```javascript
// ✅ test() - returns boolean
const pattern = /\d+/;
pattern.test("abc123"); // true
pattern.test("abc"); // false

// ✅ exec() - returns match details
const pattern = /\d+/;
const result = pattern.exec("abc123def456");
// result[0] = "123"
// result.index = 3
// result.input = "abc123def456"
```

### match()

```javascript
// ✅ match() - find matches
const str = "Hello 123 World 456";
const matches = str.match(/\d+/);
// ["123"] - chỉ match đầu tiên

const allMatches = str.match(/\d+/g); // Global flag
// ["123", "456"] - tất cả matches
```

### replace()

```javascript
// ✅ replace() - replace matches
const str = "Hello World";
str.replace("World", "JavaScript");
// "Hello JavaScript"

// Với RegExp
const str = "Hello World World";
str.replace(/World/g, "JavaScript");
// "Hello JavaScript JavaScript"

// Replace với function
const str = "Hello 123 World 456";
str.replace(/\d+/g, (match) => parseInt(match) * 2);
// "Hello 246 World 912"
```

### search()

```javascript
// ✅ search() - find index of first match
const str = "Hello World";
str.search(/World/); // 6
str.search(/world/i); // 6 (case insensitive)
str.search(/xyz/); // -1 (not found)
```

### split()

```javascript
// ✅ split() - split by pattern
const str = "Hello,World,JavaScript";
str.split(",");
// ["Hello", "World", "JavaScript"]

// Với RegExp
const str = "Hello123World456JavaScript";
str.split(/\d+/);
// ["Hello", "World", "JavaScript"]
```

## Practical Examples

### Email Validation

```javascript
// ✅ Email validation
function isValidEmail(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}

isValidEmail("john@example.com"); // true
isValidEmail("invalid.email"); // false
isValidEmail("test@"); // false
```

### Phone Number Formatting

```javascript
// ✅ Format phone number
function formatPhone(phone) {
    const cleaned = phone.replace(/\D/g, ""); // Remove non-digits
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return phone;
}

formatPhone("1234567890"); // "123-456-7890"
formatPhone("(123) 456-7890"); // "123-456-7890"
```

### Extract Data

```javascript
// ✅ Extract data từ text
const text = "Order #12345: Total $99.99, Date: 2024-12-31";

// Extract order number
const orderMatch = text.match(/#(\d+)/);
const orderNumber = orderMatch ? orderMatch[1] : null; // "12345"

// Extract price
const priceMatch = text.match(/\$(\d+\.\d+)/);
const price = priceMatch ? parseFloat(priceMatch[1]) : null; // 99.99

// Extract date
const dateMatch = text.match(/(\d{4}-\d{2}-\d{2})/);
const date = dateMatch ? dateMatch[1] : null; // "2024-12-31"
```

## Math Object

### Basic Math Operations

```javascript
// ✅ Constants
Math.PI; // 3.141592653589793
Math.E; // 2.718281828459045
Math.SQRT2; // 1.4142135623730951

// ✅ Rounding
Math.round(4.7); // 5
Math.round(4.4); // 4
Math.floor(4.7); // 4 (round down)
Math.ceil(4.2); // 5 (round up)
Math.trunc(4.7); // 4 (remove decimal)

// ✅ Min/Max
Math.min(1, 2, 3, 4, 5); // 1
Math.max(1, 2, 3, 4, 5); // 5

// Với arrays
Math.min(...[1, 2, 3, 4, 5]); // 1
Math.max(...[1, 2, 3, 4, 5]); // 5
```

### Power và Roots

```javascript
// ✅ Power
Math.pow(2, 3); // 8
2 ** 3; // 8 (ES6 exponentiation operator)

// ✅ Square root
Math.sqrt(16); // 4
Math.sqrt(2); // 1.4142135623730951

// ✅ Cube root
Math.cbrt(8); // 2
Math.cbrt(27); // 3
```

### Trigonometric Functions

```javascript
// ✅ Trigonometric (angles in radians)
Math.sin(Math.PI / 2); // 1
Math.cos(0); // 1
Math.tan(Math.PI / 4); // ~1

// Convert degrees to radians
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

Math.sin(toRadians(90)); // 1

// Inverse trigonometric
Math.asin(1); // π/2
Math.acos(1); // 0
Math.atan(1); // π/4
```

### Random Numbers

```javascript
// ✅ Random number between 0 and 1
Math.random(); // 0.0 to 0.999...

// Random integer between min and max (inclusive)
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

randomInt(1, 10); // Random number from 1 to 10

// Random element from array
function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

randomElement(["red", "green", "blue"]); // Random color
```

### Absolute Value và Sign

```javascript
// ✅ Absolute value
Math.abs(-5); // 5
Math.abs(5); // 5

// ✅ Sign
Math.sign(-5); // -1
Math.sign(5); // 1
Math.sign(0); // 0
```

## Practical Examples

### Example 1: Calculate Distance

```javascript
// ✅ Calculate distance between two points
function calculateDistance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

calculateDistance(0, 0, 3, 4); // 5
```

### Example 2: Generate Random Password

```javascript
// ✅ Generate random password
function generatePassword(length = 12) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

generatePassword(16); // Random 16-character password
```

### Example 3: Format Currency

```javascript
// ✅ Format number as currency
function formatCurrency(amount, currency = "USD") {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency
    }).format(amount);
}

formatCurrency(1234.56); // "$1,234.56"
formatCurrency(1234.56, "EUR"); // "€1,234.56"
```

## Common Mistakes Tôi Đã Mắc

### 1. Greedy vs Lazy Quantifiers

```javascript
// ❌ Greedy - matches as much as possible
const str = "<div>Hello</div><div>World</div>";
str.match(/<div>.*<\/div>/);
// Matches entire string: "<div>Hello</div><div>World</div>"

// ✅ Lazy - matches as little as possible
str.match(/<div>.*?<\/div>/);
// Matches first: "<div>Hello</div>"
```

### 2. Forgetting Global Flag

```javascript
// ❌ Chỉ replace đầu tiên
const str = "hello hello hello";
str.replace(/hello/, "hi");
// "hi hello hello"

// ✅ Replace tất cả
str.replace(/hello/g, "hi");
// "hi hi hi"
```

### 3. Not Escaping Special Characters

```javascript
// ❌ Special characters cần escape
const pattern = /./; // Matches any character, not literal dot!

// ✅ Escape special characters
const pattern = /\./; // Matches literal dot
const pattern2 = /\$/; // Matches literal dollar sign
```

## Takeaway Cho Sinh Viên

1. **RegExp mạnh mẽ nhưng phức tạp** - Practice với real examples
2. **Math object cho calculations** - Hiểu các methods cơ bản
3. **Combine RegExp với string methods** - Rất mạnh mẽ
4. **Test patterns** - Dùng online tools để test RegExp
5. **Start simple** - Bắt đầu với patterns đơn giản

## Kết Luận

RegExp và Math object là những công cụ quan trọng trong JavaScript. Từ pattern matching đến mathematical calculations, hiểu rõ chúng sẽ giúp bạn xử lý text và tính toán hiệu quả hơn.

**Thử thách:** Hãy tạo một form validator sử dụng RegExp để validate email, phone, và password. Đây là cách tốt nhất để practice RegExp!


