---
title: "JavaScript Error Handling: Từ Try-Catch Đến Best Practices"
date: 2025-01-04
tags: ["JavaScript", "Error Handling", "Try-Catch", "Debugging", "Best Practices"]
categories: ["JavaScript"]
summary: "Error handling là một kỹ năng quan trọng nhưng thường bị bỏ qua. Bài viết này chia sẻ cách handle errors đúng cách trong JavaScript."
draft: false
---

## Tại Sao Error Handling Quan Trọng?

Khi code chạy, có nhiều thứ có thể sai:
- Network requests fail
- User input invalid
- Files không tồn tại
- Null/undefined references

Nếu không handle errors đúng cách, ứng dụng sẽ crash và user experience sẽ tệ.

## Try-Catch-Finally

### Basic Try-Catch

```javascript
// ✅ Basic try-catch
try {
    // Code có thể throw error
    const result = riskyOperation();
    console.log(result);
} catch (error) {
    // Handle error
    console.error("Error occurred:", error.message);
}

// ✅ Multiple catch blocks (không có trong JS, nhưng có thể check error type)
try {
    riskyOperation();
} catch (error) {
    if (error instanceof TypeError) {
        console.error("Type error:", error);
    } else if (error instanceof ReferenceError) {
        console.error("Reference error:", error);
    } else {
        console.error("Unknown error:", error);
    }
}
```

### Finally Block

```javascript
// ✅ Finally - luôn execute
try {
    const data = fetchData();
    processData(data);
} catch (error) {
    console.error("Error:", error);
} finally {
    // Luôn chạy, dù có error hay không
    cleanup();
    closeConnection();
}
```

## Throwing Errors

### Throw Custom Errors

```javascript
// ✅ Throw error
function divide(a, b) {
    if (b === 0) {
        throw new Error("Cannot divide by zero");
    }
    return a / b;
}

try {
    divide(10, 0);
} catch (error) {
    console.error(error.message); // "Cannot divide by zero"
}

// ✅ Custom error classes
class ValidationError extends Error {
    constructor(message, field) {
        super(message);
        this.name = "ValidationError";
        this.field = field;
    }
}

function validateUser(user) {
    if (!user.name) {
        throw new ValidationError("Name is required", "name");
    }
    if (!user.email) {
        throw new ValidationError("Email is required", "email");
    }
}
```

## Error Types

### Built-in Error Types

```javascript
// ✅ TypeError - wrong type
const obj = null;
obj.property; // TypeError: Cannot read property 'property' of null

// ✅ ReferenceError - variable không tồn tại
console.log(nonExistentVar); // ReferenceError: nonExistentVar is not defined

// ✅ SyntaxError - syntax sai
eval("const x = ;"); // SyntaxError

// ✅ RangeError - value ngoài range
new Array(-1); // RangeError: Invalid array length

// ✅ URIError - invalid URI
decodeURIComponent("%"); // URIError
```

## Error Handling Patterns

### Pattern 1: Graceful Degradation

```javascript
// ✅ Graceful degradation - fallback khi có error
function loadUserPreferences() {
    try {
        const preferences = JSON.parse(localStorage.getItem('preferences'));
        return preferences;
    } catch (error) {
        console.warn("Failed to load preferences, using defaults");
        return getDefaultPreferences();
    }
}
```

### Pattern 2: Error Logging

```javascript
// ✅ Log errors để debug
function processOrder(order) {
    try {
        validateOrder(order);
        chargePayment(order);
        sendConfirmation(order);
    } catch (error) {
        // Log error để debug
        console.error("Order processing failed:", {
            error: error.message,
            stack: error.stack,
            orderId: order.id,
            timestamp: new Date().toISOString()
        });
        
        // Notify user
        showErrorMessage("Failed to process order. Please try again.");
        
        // Re-throw để caller biết
        throw error;
    }
}
```

### Pattern 3: Retry Logic

```javascript
// ✅ Retry với exponential backoff
async function fetchWithRetry(url, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            if (i === maxRetries - 1) {
                throw error; // Last retry failed
            }
            
            // Wait before retry (exponential backoff)
            const delay = Math.pow(2, i) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}
```

## Async Error Handling

### Promises

```javascript
// ✅ Handle errors trong Promises
fetch('/api/data')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error("Fetch failed:", error);
    });
```

### async/await

```javascript
// ✅ Handle errors với async/await
async function fetchData() {
    try {
        const response = await fetch('/api/data');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Fetch failed:", error);
        throw error; // Re-throw để caller handle
    }
}

// Usage
try {
    const data = await fetchData();
    processData(data);
} catch (error) {
    showErrorMessage("Failed to load data");
}
```

## Global Error Handlers

### window.onerror

```javascript
// ✅ Global error handler
window.onerror = function(message, source, lineno, colno, error) {
    console.error("Global error:", {
        message,
        source,
        lineno,
        colno,
        error
    });
    
    // Send to error tracking service
    sendToErrorTracking({
        message,
        source,
        lineno,
        colno,
        stack: error?.stack
    });
    
    return true; // Prevent default error handling
};
```

### Unhandled Promise Rejection

```javascript
// ✅ Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(event) {
    console.error("Unhandled promise rejection:", event.reason);
    
    // Send to error tracking
    sendToErrorTracking({
        type: "unhandledrejection",
        reason: event.reason,
        promise: event.promise
    });
    
    // Prevent default handling
    event.preventDefault();
});
```

## Practical Examples

### Example 1: Form Validation

```javascript
// ✅ Form validation với error handling
class FormValidator {
    validate(formData) {
        const errors = {};
        
        try {
            // Validate name
            if (!formData.name || formData.name.trim().length === 0) {
                errors.name = "Name is required";
            }
            
            // Validate email
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!formData.email || !emailPattern.test(formData.email)) {
                errors.email = "Invalid email format";
            }
            
            // Validate age
            const age = parseInt(formData.age);
            if (isNaN(age) || age < 18 || age > 120) {
                errors.age = "Age must be between 18 and 120";
            }
            
            if (Object.keys(errors).length > 0) {
                throw new ValidationError("Form validation failed", errors);
            }
            
            return { valid: true };
            
        } catch (error) {
            if (error instanceof ValidationError) {
                return {
                    valid: false,
                    errors: error.field
                };
            }
            throw error;
        }
    }
}
```

### Example 2: API Error Handling

```javascript
// ✅ API error handling
class ApiClient {
    async request(url, options = {}) {
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new ApiError(
                    errorData.message || `HTTP ${response.status}`,
                    response.status,
                    errorData
                );
            }
            
            return await response.json();
            
        } catch (error) {
            if (error instanceof ApiError) {
                // Handle API errors
                if (error.status === 401) {
                    // Unauthorized - redirect to login
                    redirectToLogin();
                } else if (error.status === 404) {
                    // Not found
                    showNotFoundError();
                } else {
                    // Other API errors
                    showErrorMessage(error.message);
                }
                throw error;
            } else if (error instanceof TypeError && error.message.includes('fetch')) {
                // Network error
                showNetworkError();
                throw new NetworkError("Network request failed", error);
            } else {
                // Unknown error
                console.error("Unexpected error:", error);
                throw error;
            }
        }
    }
}

class ApiError extends Error {
    constructor(message, status, data) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.data = data;
    }
}

class NetworkError extends Error {
    constructor(message, originalError) {
        super(message);
        this.name = "NetworkError";
        this.originalError = originalError;
    }
}
```

## Best Practices

### 1. Be Specific với Error Messages

```javascript
// ❌ Vague error message
throw new Error("Error occurred");

// ✅ Specific error message
throw new Error("Failed to save user: email already exists");
```

### 2. Don't Swallow Errors

```javascript
// ❌ Swallowing errors - không biết có lỗi
try {
    riskyOperation();
} catch (error) {
    // Silent failure - bad!
}

// ✅ Log hoặc re-throw
try {
    riskyOperation();
} catch (error) {
    console.error("Operation failed:", error);
    throw error; // Re-throw để caller biết
}
```

### 3. Use Error Boundaries (React)

```javascript
// ✅ Error boundary trong React
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    
    static getDerivedStateFromError(error) {
        return { hasError: true };
    }
    
    componentDidCatch(error, errorInfo) {
        console.error("Error caught:", error, errorInfo);
        // Send to error tracking
    }
    
    render() {
        if (this.state.hasError) {
            return <h1>Something went wrong.</h1>;
        }
        return this.props.children;
    }
}
```

## Common Mistakes Tôi Đã Mắc

### 1. Catching và Ignoring

```javascript
// ❌ Catch nhưng không làm gì
try {
    riskyOperation();
} catch (error) {
    // Ignore - không biết có lỗi!
}

// ✅ Handle hoặc log
try {
    riskyOperation();
} catch (error) {
    console.error("Operation failed:", error);
    // Handle error appropriately
}
```

### 2. Catching Quá Rộng

```javascript
// ❌ Catch tất cả errors
try {
    // Many operations
} catch (error) {
    // Handle tất cả errors giống nhau - không tốt
}

// ✅ Catch specific errors
try {
    // Operations
} catch (error) {
    if (error instanceof ValidationError) {
        // Handle validation errors
    } else if (error instanceof NetworkError) {
        // Handle network errors
    } else {
        // Handle other errors
    }
}
```

## Takeaway Cho Sinh Viên

1. **Always handle errors** - Đừng để ứng dụng crash
2. **Be specific** - Error messages rõ ràng
3. **Log errors** - Để debug sau này
4. **Use try-catch** - Cho synchronous code
5. **Handle async errors** - .catch() hoặc try-catch với async/await

## Kết Luận

Error handling là một kỹ năng quan trọng của JavaScript developer. Từ try-catch đến async error handling, hiểu rõ cách handle errors sẽ giúp bạn viết ứng dụng robust và user-friendly hơn.

**Thử thách:** Hãy thêm error handling vào một API client của bạn. Đây là cách tốt nhất để practice error handling!


