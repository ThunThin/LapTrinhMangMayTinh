---
title: "JavaScript Async: Từ Callback Hell Đến async/await"
date: 2024-12-22
tags: ["JavaScript", "Async", "Promises", "async/await"]
categories: ["JavaScript"]
summary: "Asynchronous programming là một trong những phần khó nhất của JavaScript. Bài viết này chia sẻ hành trình từ callback hell đến Promises và async/await của mình."
draft: false
---

## Vấn Đề: JavaScript Là Single-Threaded

JavaScript chỉ có một thread, nhưng vẫn có thể làm nhiều việc cùng lúc nhờ **asynchronous programming**. Đây là một trong những điểm mạnh nhưng cũng là điểm khó nhất của JavaScript.

## Callback Hell - Vấn Đề Ban Đầu

Khi mới học async, tôi đã viết code như thế này:

```javascript
// ❌ Callback hell - khó đọc, khó maintain
getUser(userId, function(user) {
    getPosts(user.id, function(posts) {
        getComments(posts[0].id, function(comments) {
            getReplies(comments[0].id, function(replies) {
                // 4 levels deep - khó đọc!
                console.log(replies);
            });
        });
    });
});
```

**Vấn đề:**
- Khó đọc và hiểu
- Khó handle errors
- Khó maintain
- Khó test

## Promises - Giải Pháp Đầu Tiên

### Tạo Promise

```javascript
// ✅ Tạo Promise
function getUser(userId) {
    return new Promise(function(resolve, reject) {
        // Simulate async operation
        setTimeout(function() {
            if (userId) {
                resolve({ id: userId, name: 'John' });
            } else {
                reject(new Error('User not found'));
            }
        }, 1000);
    });
}

// Sử dụng
getUser(123)
    .then(function(user) {
        console.log(user);
    })
    .catch(function(error) {
        console.error(error);
    });
```

### Promise Chaining

```javascript
// ✅ Promise chaining - dễ đọc hơn callback
getUser(userId)
    .then(function(user) {
        return getPosts(user.id);
    })
    .then(function(posts) {
        return getComments(posts[0].id);
    })
    .then(function(comments) {
        return getReplies(comments[0].id);
    })
    .then(function(replies) {
        console.log(replies);
    })
    .catch(function(error) {
        console.error(error); // Handle tất cả errors ở đây
    });
```

### Promise Methods

```javascript
// ✅ Promise.all - chờ tất cả promises
Promise.all([
    getUser(1),
    getUser(2),
    getUser(3)
])
.then(function(users) {
    console.log(users); // Array of 3 users
})
.catch(function(error) {
    // Nếu một promise fail, tất cả fail
    console.error(error);
});

// ✅ Promise.allSettled - chờ tất cả, không fail nếu một cái fail
Promise.allSettled([
    getUser(1),
    getUser(2),
    getUser(999) // Not found
])
.then(function(results) {
    results.forEach(function(result) {
        if (result.status === 'fulfilled') {
            console.log(result.value);
        } else {
            console.error(result.reason);
        }
    });
});

// ✅ Promise.race - lấy kết quả của promise đầu tiên resolve
Promise.race([
    fetch('/api/slow'),
    fetch('/api/fast')
])
.then(function(result) {
    console.log(result); // Kết quả của /api/fast
});
```

## async/await - Modern Solution

### Cú Pháp

```javascript
// ✅ async/await - dễ đọc như synchronous code
async function getRepliesForUser(userId) {
    try {
        const user = await getUser(userId);
        const posts = await getPosts(user.id);
        const comments = await getComments(posts[0].id);
        const replies = await getReplies(comments[0].id);
        
        return replies;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// Sử dụng
getRepliesForUser(123)
    .then(function(replies) {
        console.log(replies);
    });
```

### Lưu Ý Quan Trọng

```javascript
// ❌ Sequential - chậm
async function fetchSequential() {
    const user1 = await fetch('/api/user/1'); // Chờ 1s
    const user2 = await fetch('/api/user/2'); // Chờ thêm 1s
    const user3 = await fetch('/api/user/3'); // Chờ thêm 1s
    // Tổng: 3s
}

// ✅ Parallel - nhanh
async function fetchParallel() {
    const [user1, user2, user3] = await Promise.all([
        fetch('/api/user/1'),
        fetch('/api/user/2'),
        fetch('/api/user/3')
    ]);
    // Tổng: 1s (chạy song song)
}
```

## Real-World Examples

### Fetch API

```javascript
// ✅ Fetch với async/await
async function fetchUser(userId) {
    try {
        const response = await fetch(`/api/users/${userId}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const user = await response.json();
        return user;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw error;
    }
}
```

### Error Handling

```javascript
// ✅ Proper error handling
async function processOrder(orderId) {
    try {
        const order = await fetchOrder(orderId);
        
        if (!order) {
            throw new Error('Order not found');
        }
        
        const payment = await processPayment(order);
        const confirmation = await sendConfirmation(order, payment);
        
        return confirmation;
        
    } catch (error) {
        // Handle different error types
        if (error instanceof NetworkError) {
            console.error('Network error:', error);
            // Retry logic
        } else if (error instanceof ValidationError) {
            console.error('Validation error:', error);
            // Show user-friendly message
        } else {
            console.error('Unexpected error:', error);
            // Log to error tracking service
        }
        throw error; // Re-throw để caller handle
    }
}
```

### Loading States

```javascript
// ✅ Handle loading states
async function loadData() {
    const loadingElement = document.querySelector('#loading');
    const contentElement = document.querySelector('#content');
    const errorElement = document.querySelector('#error');
    
    try {
        // Show loading
        loadingElement.style.display = 'block';
        contentElement.style.display = 'none';
        errorElement.style.display = 'none';
        
        // Fetch data
        const data = await fetch('/api/data');
        const json = await data.json();
        
        // Show content
        contentElement.textContent = JSON.stringify(json);
        contentElement.style.display = 'block';
        loadingElement.style.display = 'none';
        
    } catch (error) {
        // Show error
        errorElement.textContent = error.message;
        errorElement.style.display = 'block';
        loadingElement.style.display = 'none';
    }
}
```

## Common Patterns

### Retry Logic

```javascript
// ✅ Retry với exponential backoff
async function fetchWithRetry(url, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(url);
            if (response.ok) {
                return await response.json();
            }
            throw new Error(`HTTP ${response.status}`);
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            
            // Wait before retry (exponential backoff)
            await new Promise(resolve => 
                setTimeout(resolve, Math.pow(2, i) * 1000)
            );
        }
    }
}
```

### Timeout

```javascript
// ✅ Add timeout to promise
function fetchWithTimeout(url, timeout = 5000) {
    return Promise.race([
        fetch(url),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), timeout)
        )
    ]);
}
```

### Sequential với Accumulation

```javascript
// ✅ Process array sequentially với accumulation
async function processUsers(userIds) {
    const results = [];
    
    for (const userId of userIds) {
        const user = await getUser(userId);
        results.push(user);
    }
    
    return results;
}

// ✅ Hoặc dùng reduce
async function processUsersReduce(userIds) {
    return userIds.reduce(async (accPromise, userId) => {
        const acc = await accPromise;
        const user = await getUser(userId);
        acc.push(user);
        return acc;
    }, Promise.resolve([]));
}
```

## Common Mistakes Tôi Đã Mắc

### 1. Quên await

```javascript
// ❌ Quên await - trả về Promise thay vì value
async function getData() {
    const data = fetch('/api/data'); // Missing await!
    return data; // Returns Promise, not data
}

// ✅ Đúng
async function getData() {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
}
```

### 2. Không Handle Errors

```javascript
// ❌ Không handle errors
async function process() {
    const data = await fetch('/api/data'); // Có thể throw error
    processData(data); // Không chạy được nếu fetch fail
}

// ✅ Handle errors
async function process() {
    try {
        const data = await fetch('/api/data');
        processData(data);
    } catch (error) {
        console.error('Failed to process:', error);
    }
}
```

### 3. Sequential Khi Có Thể Parallel

```javascript
// ❌ Sequential không cần thiết
async function loadData() {
    const user = await fetchUser();
    const posts = await fetchPosts();
    const comments = await fetchComments();
    // Chậm hơn cần thiết
}

// ✅ Parallel
async function loadData() {
    const [user, posts, comments] = await Promise.all([
        fetchUser(),
        fetchPosts(),
        fetchComments()
    ]);
    // Nhanh hơn nhiều
}
```

## Takeaway Cho Sinh Viên

1. **Hiểu Event Loop** - Hiểu cách JavaScript xử lý async
2. **Practice với Promises** - Hiểu Promise trước khi dùng async/await
3. **Luôn handle errors** - Dùng try/catch hoặc .catch()
4. **Tối ưu performance** - Dùng Promise.all khi có thể
5. **Đọc code async** - Practice đọc và viết async code

## Kết Luận

Asynchronous programming là một kỹ năng quan trọng của JavaScript developer. Từ callback hell đến Promises và async/await, mỗi bước đều giúp code dễ đọc và maintain hơn. Hiểu rõ async sẽ giúp bạn viết code hiệu quả và handle các tình huống phức tạp.

**Thử thách:** Hãy refactor một đoạn code callback hell thành async/await. Bạn sẽ thấy sự khác biệt!



