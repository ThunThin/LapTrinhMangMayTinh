---
title: "JavaScript DOM: Từ Manipulation Đến Modern Practices"
date: 2024-12-21
tags: ["JavaScript", "DOM", "Frontend", "Web Development"]
categories: ["JavaScript"]
summary: "DOM manipulation là một trong những kỹ năng cơ bản nhất của frontend developer. Bài viết này chia sẻ cách mình đã học từ jQuery đến vanilla JavaScript và modern practices."
draft: false
---

## Từ jQuery Đến Vanilla JavaScript

Khi mới học JavaScript, tôi đã dùng jQuery vì nó "dễ":

```javascript
// jQuery - dễ nhưng không cần thiết nữa
$('#button').click(function() {
    $('#content').fadeIn();
});
```

Nhưng sau này, tôi nhận ra: **Vanilla JavaScript đã đủ mạnh**, không cần jQuery nữa. Bài viết này chia sẻ cách làm việc với DOM một cách hiện đại.

## DOM Là Gì?

DOM (Document Object Model) là representation của HTML document dưới dạng tree structure. JavaScript có thể:
- **Truy cập** elements
- **Thay đổi** content và styles
- **Thêm/xóa** elements
- **Lắng nghe** events

## 1. Selecting Elements

### Old Way (vẫn hoạt động)

```javascript
// ✅ getElementById - nhanh nhất
const element = document.getElementById('myId');

// ✅ getElementsByClassName - trả về HTMLCollection
const elements = document.getElementsByClassName('myClass');

// ✅ getElementsByTagName - trả về HTMLCollection
const divs = document.getElementsByTagName('div');

// ⚠️ querySelector - linh hoạt nhưng chậm hơn
const first = document.querySelector('.myClass');
const all = document.querySelectorAll('.myClass'); // NodeList
```

### Modern Way: querySelector

```javascript
// ✅ querySelector - CSS selector syntax
const element = document.querySelector('#myId');
const firstClass = document.querySelector('.myClass');
const firstDiv = document.querySelector('div');

// ✅ querySelectorAll - trả về NodeList (không live)
const allClasses = document.querySelectorAll('.myClass');
const allDivs = document.querySelectorAll('div.container');
```

**Lưu ý:** `querySelectorAll` trả về NodeList (không live), khác với `getElementsByClassName` trả về HTMLCollection (live).

## 2. Manipulating Content

### Text Content

```javascript
// ✅ textContent - an toàn, không parse HTML
const element = document.querySelector('#myDiv');
element.textContent = 'Hello World';

// ⚠️ innerHTML - parse HTML, có thể nguy hiểm
element.innerHTML = '<strong>Hello</strong>'; // Renders HTML

// ❌ innerHTML với user input - XSS vulnerability!
const userInput = '<img src=x onerror="alert(\'XSS\')">';
element.innerHTML = userInput; // Nguy hiểm!

// ✅ innerText - chỉ text visible (không bao gồm hidden)
element.innerText = 'Hello World';
```

### Attributes

```javascript
const link = document.querySelector('a');

// ✅ getAttribute / setAttribute
link.getAttribute('href');
link.setAttribute('href', 'https://example.com');
link.setAttribute('target', '_blank');

// ✅ Direct property access (cho standard attributes)
link.href = 'https://example.com';
link.className = 'active';
link.id = 'myLink';

// ✅ classList cho classes
link.classList.add('active');
link.classList.remove('inactive');
link.classList.toggle('active');
link.classList.contains('active'); // true/false
```

### Styles

```javascript
const element = document.querySelector('#myDiv');

// ✅ style property - inline styles
element.style.color = 'red';
element.style.backgroundColor = 'blue';
element.style.fontSize = '20px';

// ✅ CSS custom properties
element.style.setProperty('--primary-color', '#ff0000');

// ✅ Computed styles
const computedStyle = window.getComputedStyle(element);
const color = computedStyle.color;
```

## 3. Creating và Removing Elements

### Creating Elements

```javascript
// ✅ createElement
const div = document.createElement('div');
div.textContent = 'Hello';
div.className = 'my-class';

// ✅ appendChild
const container = document.querySelector('#container');
container.appendChild(div);

// ✅ insertBefore
const newDiv = document.createElement('div');
const firstChild = container.firstChild;
container.insertBefore(newDiv, firstChild);

// ✅ Modern: insertAdjacentHTML
container.insertAdjacentHTML('beforeend', '<div>New</div>');
// Positions: beforebegin, afterbegin, beforeend, afterend
```

### Removing Elements

```javascript
// ✅ removeChild
const element = document.querySelector('#toRemove');
element.parentNode.removeChild(element);

// ✅ Modern: remove() - dễ hơn
element.remove();

// ✅ remove all children
const container = document.querySelector('#container');
container.innerHTML = ''; // Quick but not best practice

// ✅ Better: remove each child
while (container.firstChild) {
    container.removeChild(container.firstChild);
}
```

## 4. Event Handling

### addEventListener

```javascript
// ✅ addEventListener - modern way
const button = document.querySelector('#myButton');

button.addEventListener('click', function(event) {
    console.log('Clicked!');
    console.log(event.target); // Element that triggered event
});

// ✅ Arrow function
button.addEventListener('click', (event) => {
    console.log('Clicked!');
});

// ✅ Named function (better for removal)
function handleClick(event) {
    console.log('Clicked!');
}
button.addEventListener('click', handleClick);
button.removeEventListener('click', handleClick); // Remove listener
```

### Event Object

```javascript
button.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default behavior
    event.stopPropagation(); // Stop event bubbling
    
    console.log(event.type); // "click"
    console.log(event.target); // Element that triggered
    console.log(event.currentTarget); // Element with listener
    console.log(event.clientX, event.clientY); // Mouse position
});
```

### Event Delegation

```javascript
// ❌ Add listener to each element - không hiệu quả
const items = document.querySelectorAll('.item');
items.forEach(item => {
    item.addEventListener('click', handleClick);
});

// ✅ Event delegation - add listener to parent
const list = document.querySelector('#list');
list.addEventListener('click', function(event) {
    if (event.target.classList.contains('item')) {
        handleClick(event);
    }
});

// ✅ Modern: matches() method
list.addEventListener('click', function(event) {
    if (event.target.matches('.item')) {
        handleClick(event);
    }
});
```

## 5. Traversing DOM

```javascript
const element = document.querySelector('.myElement');

// ✅ Parent
element.parentElement;
element.parentNode;

// ✅ Children
element.children; // HTMLCollection (only elements)
element.childNodes; // NodeList (includes text nodes)

// ✅ Siblings
element.nextElementSibling;
element.previousElementSibling;
element.nextSibling; // Includes text nodes
element.previousSibling;

// ✅ First/Last
element.firstElementChild;
element.lastElementChild;
element.firstChild;
element.lastChild;
```

## 6. Modern Practices

### Template Literals cho HTML

```javascript
// ✅ Template literals - dễ đọc hơn
const user = { name: 'John', age: 30 };

const html = `
    <div class="user-card">
        <h2>${user.name}</h2>
        <p>Age: ${user.age}</p>
    </div>
`;

container.innerHTML = html;
```

### Document Fragments

```javascript
// ✅ DocumentFragment - hiệu quả khi thêm nhiều elements
const fragment = document.createDocumentFragment();

for (let i = 0; i < 100; i++) {
    const div = document.createElement('div');
    div.textContent = `Item ${i}`;
    fragment.appendChild(div);
}

container.appendChild(fragment); // Chỉ reflow một lần!
```

### Data Attributes

```javascript
// ✅ data-* attributes - lưu data trong HTML
<div id="user" data-user-id="123" data-user-role="admin"></div>

// Access trong JavaScript
const userDiv = document.querySelector('#user');
const userId = userDiv.dataset.userId; // "123"
const userRole = userDiv.dataset.userRole; // "admin"

// Set data attribute
userDiv.dataset.userStatus = 'active';
```

## Common Mistakes Tôi Đã Mắc

### 1. Query Trước Khi DOM Ready

```javascript
// ❌ Script chạy trước khi DOM load
const element = document.querySelector('#myDiv'); // null!

// ✅ Wait for DOM ready
document.addEventListener('DOMContentLoaded', function() {
    const element = document.querySelector('#myDiv'); // Works!
});

// ✅ Hoặc đặt script ở cuối body
```

### 2. Query Nhiều Lần

```javascript
// ❌ Query nhiều lần - không hiệu quả
document.querySelector('#button').addEventListener('click', function() {
    document.querySelector('#content').style.display = 'block';
    document.querySelector('#content').textContent = 'Hello';
});

// ✅ Cache elements
const button = document.querySelector('#button');
const content = document.querySelector('#content');

button.addEventListener('click', function() {
    content.style.display = 'block';
    content.textContent = 'Hello';
});
```

### 3. Memory Leaks

```javascript
// ❌ Không remove event listeners
function setup() {
    const button = document.querySelector('#button');
    button.addEventListener('click', handleClick);
    // Listener vẫn tồn tại ngay cả khi element bị remove!
}

// ✅ Remove listeners khi không cần
function cleanup() {
    const button = document.querySelector('#button');
    button.removeEventListener('click', handleClick);
}
```

## Takeaway Cho Sinh Viên

1. **Học vanilla JavaScript trước** - Không cần jQuery
2. **Hiểu event delegation** - Hiệu quả hơn nhiều
3. **Cache DOM queries** - Tránh query nhiều lần
4. **Sử dụng modern methods** - querySelector, classList, etc.
5. **Practice với real projects** - Làm website thực tế

## Kết Luận

DOM manipulation là kỹ năng cơ bản nhưng quan trọng của frontend developer. Hiểu rõ cách làm việc với DOM sẽ giúp bạn viết code hiệu quả và maintainable hơn. Đừng như tôi lúc đầu - phụ thuộc vào jQuery mà không hiểu DOM!

**Thử thách:** Hãy tạo một todo app chỉ dùng vanilla JavaScript và DOM APIs. Đây là cách tốt để practice!



