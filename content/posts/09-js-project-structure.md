---
title: "JavaScript Project Structure: Từ Chaos Đến Organization"
date: 2024-12-23
tags: ["JavaScript", "Project Structure", "Best Practices", "Organization"]
categories: ["JavaScript"]
summary: "Tổ chức code là một kỹ năng quan trọng nhưng thường bị bỏ qua. Bài viết này chia sẻ cách mình đã học tổ chức JavaScript project từ một đống file hỗn độn đến structure chuyên nghiệp."
draft: false
---

## Vấn Đề: Một File JavaScript Khổng Lồ

Khi mới học JavaScript, tôi đã từng viết tất cả code vào một file:

```javascript
// app.js - 2000 dòng code!
// Functions, event handlers, API calls, utilities...
// Tất cả lộn xộn trong một file
```

Khi project lớn lên, tôi không thể tìm được code mình cần. Đó là lúc tôi nhận ra: **Tổ chức code quan trọng như viết code**.

## Nguyên Tắc Tổ Chức Code

### 1. Separation of Concerns

Mỗi file/module chỉ làm một việc:
- **UI logic** → components/
- **Business logic** → services/
- **Data access** → api/
- **Utilities** → utils/

### 2. DRY (Don't Repeat Yourself)

Tách code lặp lại thành functions/modules riêng.

### 3. Scalability

Structure phải dễ mở rộng khi project lớn lên.

## Project Structure Cơ Bản

### Structure 1: Feature-Based (Recommended)

```
project/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── main.js
│   ├── config/
│   │   └── constants.js
│   ├── api/
│   │   ├── userApi.js
│   │   └── postApi.js
│   ├── services/
│   │   ├── authService.js
│   │   └── dataService.js
│   ├── components/
│   │   ├── header.js
│   │   ├── sidebar.js
│   │   └── modal.js
│   ├── utils/
│   │   ├── helpers.js
│   │   ├── validators.js
│   │   └── formatters.js
│   └── models/
│       ├── User.js
│       └── Post.js
```

### Structure 2: Layer-Based

```
project/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── main.js
│   ├── presentation/    # UI layer
│   │   ├── components/
│   │   └── views/
│   ├── business/        # Business logic layer
│   │   └── services/
│   ├── data/           # Data layer
│   │   └── repositories/
│   └── shared/         # Shared utilities
│       └── utils/
```

## Chi Tiết Từng Folder

### 1. config/ - Configuration

```javascript
// config/constants.js
export const API_BASE_URL = 'https://api.example.com';
export const API_TIMEOUT = 5000;
export const MAX_RETRIES = 3;

// config/settings.js
export const settings = {
    theme: 'dark',
    language: 'vi',
    itemsPerPage: 10
};
```

### 2. api/ - API Calls

```javascript
// api/userApi.js
import { API_BASE_URL } from '../config/constants.js';

export async function getUser(userId) {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch user');
    }
    return await response.json();
}

export async function createUser(userData) {
    const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    return await response.json();
}

// api/postApi.js
export async function getPosts() {
    // ...
}

export async function createPost(postData) {
    // ...
}
```

### 3. services/ - Business Logic

```javascript
// services/authService.js
import { getUser } from '../api/userApi.js';
import { saveToken, getToken, removeToken } from '../utils/storage.js';

export class AuthService {
    async login(username, password) {
        try {
            const user = await getUser(username);
            if (user.password === password) {
                saveToken(user.token);
                return user;
            }
            throw new Error('Invalid credentials');
        } catch (error) {
            throw new Error('Login failed');
        }
    }
    
    logout() {
        removeToken();
    }
    
    isAuthenticated() {
        return getToken() !== null;
    }
}

// services/dataService.js
export class DataService {
    async fetchAndProcessData() {
        // Business logic here
    }
}
```

### 4. components/ - UI Components

```javascript
// components/header.js
export class Header {
    constructor(container) {
        this.container = container;
        this.render();
    }
    
    render() {
        this.container.innerHTML = `
            <header>
                <nav>
                    <a href="/">Home</a>
                    <a href="/about">About</a>
                </nav>
            </header>
        `;
    }
}

// components/modal.js
export class Modal {
    constructor(title, content) {
        this.title = title;
        this.content = content;
    }
    
    show() {
        // Show modal logic
    }
    
    hide() {
        // Hide modal logic
    }
}
```

### 5. utils/ - Utilities

```javascript
// utils/helpers.js
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export function formatDate(date) {
    return new Date(date).toLocaleDateString('vi-VN');
}

// utils/validators.js
export function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

export function validatePassword(password) {
    return password.length >= 8;
}

// utils/storage.js
export function saveToken(token) {
    localStorage.setItem('token', token);
}

export function getToken() {
    return localStorage.getItem('token');
}

export function removeToken() {
    localStorage.removeItem('token');
}
```

### 6. models/ - Data Models

```javascript
// models/User.js
export class User {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.email = data.email;
    }
    
    getDisplayName() {
        return this.name || this.email;
    }
    
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            email: this.email
        };
    }
}

// models/Post.js
export class Post {
    constructor(data) {
        this.id = data.id;
        this.title = data.title;
        this.content = data.content;
        this.author = data.author;
        this.createdAt = new Date(data.createdAt);
    }
    
    getFormattedDate() {
        return this.createdAt.toLocaleDateString('vi-VN');
    }
}
```

## Module System: ES6 Modules

### Export

```javascript
// utils/helpers.js
// Named exports
export function helper1() { }
export function helper2() { }

// Default export
export default function mainHelper() { }

// Export multiple
export { helper1, helper2 };
```

### Import

```javascript
// main.js
// Named imports
import { helper1, helper2 } from './utils/helpers.js';

// Default import
import mainHelper from './utils/helpers.js';

// Import all
import * as helpers from './utils/helpers.js';
helpers.helper1();

// Rename imports
import { helper1 as h1 } from './utils/helpers.js';
```

## Main Entry Point

```javascript
// main.js - Entry point
import { Header } from './components/header.js';
import { AuthService } from './services/authService.js';
import { initializeApp } from './app.js';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

// app.js
import { Header } from './components/header.js';
import { Sidebar } from './components/sidebar.js';
import { AuthService } from './services/authService.js';

export function initializeApp() {
    // Initialize components
    const header = new Header(document.querySelector('#header'));
    const sidebar = new Sidebar(document.querySelector('#sidebar'));
    
    // Initialize services
    const authService = new AuthService();
    
    // Setup event listeners
    setupEventListeners(authService);
}

function setupEventListeners(authService) {
    // Event listeners here
}
```

## Best Practices

### 1. Naming Conventions

```javascript
// ✅ Files: camelCase hoặc kebab-case
userService.js
user-service.js

// ✅ Classes: PascalCase
class UserService { }

// ✅ Functions/Variables: camelCase
function getUserData() { }
const userData = { };

// ✅ Constants: UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';
```

### 2. File Size

- Mỗi file không quá 300-400 dòng
- Nếu quá dài, tách thành nhiều files nhỏ hơn

### 3. Index Files

```javascript
// utils/index.js - Re-export để dễ import
export { helper1, helper2 } from './helpers.js';
export { validateEmail, validatePassword } from './validators.js';

// Sử dụng
import { helper1, validateEmail } from './utils/index.js';
```

### 4. Documentation

```javascript
/**
 * User Service - Handles user authentication and management
 * @class
 */
export class UserService {
    /**
     * Login user with username and password
     * @param {string} username - User's username
     * @param {string} password - User's password
     * @returns {Promise<User>} User object if login successful
     * @throws {Error} If credentials are invalid
     */
    async login(username, password) {
        // Implementation
    }
}
```

## Common Mistakes Tôi Đã Mắc

### 1. Không Tổ Chức Từ Đầu

```javascript
// ❌ Tất cả trong một file
// app.js - 2000 dòng

// ✅ Tổ chức ngay từ đầu
// Tách thành nhiều modules
```

### 2. Circular Dependencies

```javascript
// ❌ File A import File B, File B import File A
// a.js
import { funcB } from './b.js';

// b.js
import { funcA } from './a.js';

// ✅ Tách shared code ra file riêng
// shared.js
export function sharedFunc() { }
```

### 3. Global Variables

```javascript
// ❌ Global variables
var currentUser = null;

// ✅ Module-level variables
// userService.js
let currentUser = null;

export function setCurrentUser(user) {
    currentUser = user;
}

export function getCurrentUser() {
    return currentUser;
}
```

## Takeaway Cho Sinh Viên

1. **Tổ chức từ đầu** - Đừng đợi đến khi code lộn xộn
2. **Separation of concerns** - Mỗi file một nhiệm vụ
3. **Sử dụng modules** - ES6 modules là standard
4. **Đặt tên rõ ràng** - Tên file phải nói lên nội dung
5. **Document code** - Comment và JSDoc

## Kết Luận

Tổ chức code là một kỹ năng quan trọng nhưng thường bị bỏ qua. Một project được tổ chức tốt sẽ dễ maintain, dễ mở rộng, và dễ làm việc nhóm hơn. Đừng như tôi lúc đầu - viết tất cả vào một file rồi phải refactor lại!

**Thử thách:** Hãy refactor một project cũ của bạn, tổ chức lại structure theo các nguyên tắc trên. Bạn sẽ thấy code dễ làm việc hơn nhiều!



