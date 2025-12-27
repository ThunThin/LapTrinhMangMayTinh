---
title: "Clean Code trong Java: Từ Code \"Chạy Được\" Đến Code \"Đẹp\""
date: 2024-12-19
tags: ["Java", "Clean Code", "Best Practices", "Code Quality"]
categories: ["Java"]
summary: "Clean code không chỉ là code đẹp, mà là code dễ đọc, dễ hiểu, dễ maintain. Bài viết này chia sẻ những nguyên tắc clean code mà mình đã học và áp dụng."
draft: false
---

## Câu Chuyện Về Code Review Đầu Tiên

Lần đầu tiên code của tôi được review, tôi nhận được comment:

> "Code này chạy được, nhưng khó đọc quá. Tôi phải đọc 3 lần mới hiểu bạn đang làm gì."

Đó là lúc tôi nhận ra: **Code không chỉ cần chạy được, mà còn cần dễ đọc**.

## Clean Code Là Gì?

Clean code là code:
- **Dễ đọc** - Người khác đọc hiểu ngay
- **Dễ hiểu** - Không cần comment nhiều
- **Dễ maintain** - Sửa đổi không sợ break
- **Dễ test** - Viết unit test dễ dàng

## Những Nguyên Tắc Quan Trọng

### 1. Đặt Tên Có Ý Nghĩa

```java
// ❌ Tên không rõ ràng
public void calc(int a, int b) {
    int c = a + b;
    return c;
}

// ✅ Tên rõ ràng, tự giải thích
public int calculateTotal(int price, int quantity) {
    int total = price * quantity;
    return total;
}
```

**Quy tắc:**
- Tên biến/phương thức phải nói lên mục đích
- Tránh tên ngắn gọn như `x`, `y`, `temp`
- Sử dụng động từ cho methods: `getUser()`, `calculateTotal()`
- Sử dụng danh từ cho classes: `UserService`, `OrderRepository`

### 2. Functions Nên Nhỏ Và Làm Một Việc

```java
// ❌ Function quá dài, làm nhiều việc
public void processOrder(Order order) {
    // Validate
    if (order == null) {
        throw new IllegalArgumentException();
    }
    if (order.getItems().isEmpty()) {
        throw new IllegalArgumentException();
    }
    
    // Calculate total
    double total = 0;
    for (OrderItem item : order.getItems()) {
        total += item.getPrice() * item.getQuantity();
    }
    
    // Apply discount
    if (total > 1000000) {
        total = total * 0.9;
    }
    
    // Save to database
    order.setTotal(total);
    orderRepository.save(order);
    
    // Send email
    emailService.send(order.getCustomerEmail(), "Order confirmed");
}

// ✅ Tách thành nhiều functions nhỏ
public void processOrder(Order order) {
    validateOrder(order);
    double total = calculateTotal(order);
    total = applyDiscount(total);
    saveOrder(order, total);
    sendConfirmationEmail(order);
}

private void validateOrder(Order order) {
    if (order == null) {
        throw new IllegalArgumentException("Order cannot be null");
    }
    if (order.getItems().isEmpty()) {
        throw new IllegalArgumentException("Order must have at least one item");
    }
}

private double calculateTotal(Order order) {
    return order.getItems().stream()
        .mapToDouble(item -> item.getPrice() * item.getQuantity())
        .sum();
}

private double applyDiscount(double total) {
    return total > 1000000 ? total * 0.9 : total;
}

private void saveOrder(Order order, double total) {
    order.setTotal(total);
    orderRepository.save(order);
}

private void sendConfirmationEmail(Order order) {
    emailService.send(order.getCustomerEmail(), "Order confirmed");
}
```

### 3. Tránh Comment Không Cần Thiết

```java
// ❌ Comment không cần thiết - code đã tự giải thích
// Calculate total
double total = price * quantity;

// Save user to database
userRepository.save(user);

// ✅ Code tự giải thích, không cần comment
double total = calculateOrderTotal(order);
userRepository.save(user);

// ✅ Comment chỉ khi cần giải thích "tại sao", không phải "làm gì"
// Use TreeMap instead of HashMap to maintain sorted order
Map<String, Product> products = new TreeMap<>();
```

### 4. Xử Lý Lỗi Rõ Ràng

```java
// ❌ Xử lý lỗi không rõ ràng
public User getUser(String id) {
    try {
        return userRepository.findById(id);
    } catch (Exception e) {
        return null; // Không biết lỗi gì
    }
}

// ✅ Xử lý lỗi rõ ràng
public User getUser(String id) throws UserNotFoundException {
    try {
        User user = userRepository.findById(id);
        if (user == null) {
            throw new UserNotFoundException("User not found: " + id);
        }
        return user;
    } catch (DatabaseException e) {
        logger.error("Database error while fetching user: " + id, e);
        throw new UserServiceException("Failed to fetch user", e);
    }
}
```

### 5. Tránh Magic Numbers

```java
// ❌ Magic numbers - không biết ý nghĩa
if (age >= 18 && age <= 65) {
    // ...
}

double discount = total * 0.1;

// ✅ Sử dụng constants
private static final int MIN_ADULT_AGE = 18;
private static final int MAX_ADULT_AGE = 65;
private static final double DISCOUNT_RATE = 0.1;

if (age >= MIN_ADULT_AGE && age <= MAX_ADULT_AGE) {
    // ...
}

double discount = total * DISCOUNT_RATE;
```

### 6. Sử Dụng Optional Thay Vì Null

```java
// ❌ Trả về null
public User findUser(String id) {
    User user = userRepository.findById(id);
    return user; // Có thể null
}

// Sử dụng:
User user = findUser("123");
if (user != null) { // Phải check null
    System.out.println(user.getName());
}

// ✅ Trả về Optional
public Optional<User> findUser(String id) {
    return userRepository.findById(id);
}

// Sử dụng:
findUser("123")
    .ifPresent(user -> System.out.println(user.getName()));
```

## Code Smells Và Cách Sửa

### 1. Long Method

```java
// ❌ Method quá dài
public void processOrder(Order order) {
    // 100 dòng code...
}

// ✅ Tách thành nhiều methods nhỏ
public void processOrder(Order order) {
    validateOrder(order);
    calculateTotal(order);
    applyDiscount(order);
    saveOrder(order);
    sendNotification(order);
}
```

### 2. Large Class

```java
// ❌ Class quá lớn, làm quá nhiều việc
public class OrderService {
    // 50 methods...
    // Quản lý order, payment, inventory, email...
}

// ✅ Tách thành nhiều classes
public class OrderService {
    // Chỉ quản lý order
}

public class PaymentService {
    // Chỉ quản lý payment
}

public class InventoryService {
    // Chỉ quản lý inventory
}
```

### 3. Duplicate Code

```java
// ❌ Code lặp lại
public void processOrder1(Order order) {
    validateOrder(order);
    // ... specific logic 1
}

public void processOrder2(Order order) {
    validateOrder(order);
    // ... specific logic 2
}

// ✅ Extract common code
public void processOrder(Order order, OrderProcessor processor) {
    validateOrder(order);
    processor.process(order);
}
```

### 4. Feature Envy

```java
// ❌ Method của OrderService nhưng dùng nhiều User
public class OrderService {
    public void processOrder(Order order) {
        User user = order.getUser();
        String email = user.getEmail();
        String name = user.getName();
        // ... nhiều thao tác với user
    }
}

// ✅ Move logic vào User class
public class User {
    public void sendOrderConfirmation(Order order) {
        // Logic ở đây
    }
}
```

## Best Practices Tôi Đã Học

### 1. SOLID Principles

- **S**ingle Responsibility: Mỗi class chỉ làm một việc
- **O**pen/Closed: Mở rộng, đóng sửa đổi
- **L**iskov Substitution: Subclass có thể thay thế superclass
- **I**nterface Segregation: Interface nhỏ, cụ thể
- **D**ependency Inversion: Phụ thuộc vào abstraction

### 2. DRY (Don't Repeat Yourself)

```java
// ❌ Lặp lại code
public void processOrder1(Order order) {
    if (order == null) throw new IllegalArgumentException();
    // ...
}

public void processOrder2(Order order) {
    if (order == null) throw new IllegalArgumentException();
    // ...
}

// ✅ Extract common code
private void validateOrderNotNull(Order order) {
    if (order == null) {
        throw new IllegalArgumentException("Order cannot be null");
    }
}
```

### 3. KISS (Keep It Simple, Stupid)

```java
// ❌ Phức tạp không cần thiết
public boolean isAdult(int age) {
    return age >= 18 ? true : false;
}

// ✅ Đơn giản
public boolean isAdult(int age) {
    return age >= 18;
}
```

## Takeaway Cho Sinh Viên

1. **Đọc code của người khác** - GitHub, open source projects
2. **Code review** - Nhờ người khác review code của bạn
3. **Refactor thường xuyên** - Cải thiện code cũ
4. **Viết tests** - Giúp bạn nghĩ về design
5. **Đọc sách** - "Clean Code" của Robert C. Martin

## Kết Luận

Clean code không phải là mục tiêu cuối cùng, mà là một hành trình. Mỗi ngày code, tôi đều cố gắng viết code tốt hơn một chút. Nhớ rằng: **Code được đọc nhiều hơn được viết**, nên hãy viết cho người đọc, không chỉ cho compiler!

**Thử thách:** Hãy review một file code cũ của bạn và refactor lại theo các nguyên tắc clean code. Bạn sẽ thấy sự khác biệt!

