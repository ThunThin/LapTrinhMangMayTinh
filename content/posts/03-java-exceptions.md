---
title: "Java Exceptions: Từ Try-Catch Đến Best Practices"
date: 2024-12-17
tags: ["Java", "Exceptions", "Error Handling", "Best Practices"]
categories: ["Java"]
summary: "Exception handling là một trong những phần khó nhất khi học Java. Bài viết này chia sẻ cách mình đã học từ việc bỏ qua exceptions đến việc xử lý chúng một cách chuyên nghiệp."
draft: false
---

## Câu Chuyện Về NullPointerException Đầu Tiên

Tôi nhớ như in lần đầu tiên gặp `NullPointerException`:

```java
String name = null;
System.out.println(name.length()); // 💥 NullPointerException!
```

Lúc đó, tôi chỉ biết thêm `if (name != null)` mà không hiểu tại sao. Sau này, tôi mới nhận ra: **Exception handling không chỉ là fix bug, mà là cách thiết kế code an toàn**.

## Hiểu Về Exception Hierarchy

Trước khi học cách xử lý, tôi cần hiểu cấu trúc:

```
Throwable
├── Error (không nên catch)
│   ├── OutOfMemoryError
│   └── StackOverflowError
│
└── Exception
    ├── RuntimeException (Unchecked)
    │   ├── NullPointerException
    │   ├── ArrayIndexOutOfBoundsException
    │   ├── IllegalArgumentException
    │   └── ClassCastException
    │
    └── Checked Exceptions (phải handle)
        ├── IOException
        ├── FileNotFoundException
        └── SQLException
```

**Quan trọng:** 
- **Checked exceptions:** Compiler bắt buộc phải handle (try-catch hoặc throws)
- **Unchecked exceptions:** Không bắt buộc, nhưng nên handle

## Những Sai Lầm Ban Đầu

### 1. Bỏ Qua Exceptions Hoàn Toàn

```java
// ❌ Code đầu tiên của tôi
public void readFile(String filename) {
    FileReader file = new FileReader(filename); // Compiler error!
    // Tôi không biết tại sao không compile được
}
```

### 2. Catch Mọi Thứ Mà Không Làm Gì

```java
// ❌ Cực kỳ nguy hiểm!
try {
    processData();
} catch (Exception e) {
    // Bỏ qua - không biết lỗi gì xảy ra
}
```

### 3. Catch Quá Rộng

```java
// ❌ Catch Exception chung chung
try {
    int result = divide(a, b);
    saveToFile(result);
} catch (Exception e) {
    // Không biết lỗi ở đâu: divide hay saveToFile?
    System.out.println("Có lỗi xảy ra");
}
```

## Cách Tôi Đã Học Lại

### Bước 1: Hiểu Khi Nào Nên Throw Exception

Thay vì trả về `null` hoặc giá trị đặc biệt, tôi học cách throw exception:

```java
// ❌ Cách cũ - không rõ ràng
public User findUser(String id) {
    User user = database.find(id);
    if (user == null) {
        return null; // Caller không biết tại sao null
    }
    return user;
}

// ✅ Cách mới - rõ ràng
public User findUser(String id) throws UserNotFoundException {
    User user = database.find(id);
    if (user == null) {
        throw new UserNotFoundException("User not found: " + id);
    }
    return user;
}
```

### Bước 2: Tạo Custom Exceptions

Thay vì dùng exception chung chung, tôi tạo custom exceptions:

```java
// Custom exception cho business logic
public class InsufficientBalanceException extends Exception {
    private double currentBalance;
    private double requiredAmount;
    
    public InsufficientBalanceException(double currentBalance, double requiredAmount) {
        super(String.format("Balance: %.2f, Required: %.2f", 
              currentBalance, requiredAmount));
        this.currentBalance = currentBalance;
        this.requiredAmount = requiredAmount;
    }
    
    public double getCurrentBalance() {
        return currentBalance;
    }
    
    public double getRequiredAmount() {
        return requiredAmount;
    }
}

// Sử dụng
public void withdraw(double amount) throws InsufficientBalanceException {
    if (amount > balance) {
        throw new InsufficientBalanceException(balance, amount);
    }
    balance -= amount;
}
```

### Bước 3: Xử Lý Exception Đúng Cách

```java
// ✅ Best practice: Catch cụ thể, xử lý phù hợp
public void processOrder(Order order) {
    try {
        validateOrder(order);
        processPayment(order);
        updateInventory(order);
        sendConfirmationEmail(order);
        
    } catch (InvalidOrderException e) {
        // Log và thông báo cho user
        logger.warn("Invalid order: " + e.getMessage());
        showErrorToUser("Đơn hàng không hợp lệ: " + e.getMessage());
        
    } catch (PaymentFailedException e) {
        // Rollback và thông báo
        logger.error("Payment failed", e);
        rollbackOrder(order);
        showErrorToUser("Thanh toán thất bại. Vui lòng thử lại.");
        
    } catch (EmailException e) {
        // Order đã thành công, chỉ lỗi email - log nhưng không fail
        logger.warn("Failed to send email", e);
        // Order vẫn thành công
        
    } catch (Exception e) {
        // Catch-all cho các lỗi không mong đợi
        logger.error("Unexpected error", e);
        rollbackOrder(order);
        showErrorToUser("Đã xảy ra lỗi. Vui lòng liên hệ support.");
    }
}
```

## Best Practices Tôi Đã Học

### 1. Try-With-Resources Cho Auto-Close

```java
// ✅ Tự động close - không lo leak resources
try (FileReader reader = new FileReader("data.txt");
     BufferedReader br = new BufferedReader(reader)) {
    
    String line;
    while ((line = br.readLine()) != null) {
        processLine(line);
    }
    
} catch (IOException e) {
    logger.error("Error reading file", e);
}
// FileReader và BufferedReader tự động được close
```

### 2. Finally Chỉ Cho Cleanup Code

```java
// ✅ Finally chỉ cho cleanup
Connection conn = null;
try {
    conn = getConnection();
    executeQuery(conn);
} catch (SQLException e) {
    logger.error("Database error", e);
} finally {
    // Luôn đóng connection
    if (conn != null) {
        try {
            conn.close();
        } catch (SQLException e) {
            logger.error("Error closing connection", e);
        }
    }
}

// Nhưng tốt hơn là dùng try-with-resources:
try (Connection conn = getConnection()) {
    executeQuery(conn);
} catch (SQLException e) {
    logger.error("Database error", e);
}
```

### 3. Không Catch Exception Rồi Bỏ Qua

```java
// ❌ Tuyệt đối không làm thế này
try {
    importantOperation();
} catch (Exception e) {
    // Bỏ qua - nguy hiểm!
}

// ✅ Luôn log hoặc xử lý
try {
    importantOperation();
} catch (Exception e) {
    logger.error("Operation failed", e);
    // Hoặc throw lại, hoặc xử lý phù hợp
}
```

### 4. Sử Dụng Exception Chaining

```java
// ✅ Giữ nguyên exception gốc
try {
    processData();
} catch (IOException e) {
    throw new DataProcessingException("Failed to process data", e);
    // Exception gốc được giữ trong cause
}
```

## Common Exceptions Và Cách Xử Lý

### NullPointerException

```java
// ❌ Dễ xảy ra
String name = user.getName();
int length = name.length(); // NPE nếu name = null

// ✅ Phòng ngừa
String name = user.getName();
if (name != null) {
    int length = name.length();
}

// ✅ Hoặc dùng Optional (Java 8+)
Optional<String> name = Optional.ofNullable(user.getName());
int length = name.map(String::length).orElse(0);
```

### ArrayIndexOutOfBoundsException

```java
// ❌ Dễ xảy ra
int[] arr = {1, 2, 3};
int value = arr[5]; // Exception!

// ✅ Kiểm tra bounds
if (index >= 0 && index < arr.length) {
    int value = arr[index];
}
```

### IllegalArgumentException

```java
// ✅ Validate input và throw exception rõ ràng
public void setAge(int age) {
    if (age < 0 || age > 150) {
        throw new IllegalArgumentException("Age must be between 0 and 150");
    }
    this.age = age;
}
```

## Takeaway Cho Sinh Viên

1. **Đừng bỏ qua exceptions** - Chúng là cách code báo lỗi
2. **Catch cụ thể** - Đừng catch Exception chung chung
3. **Log exceptions** - Giúp debug sau này
4. **Tạo custom exceptions** - Cho business logic rõ ràng
5. **Sử dụng try-with-resources** - Tự động quản lý resources

## Kết Luận

Exception handling là một kỹ năng quan trọng của Java developer. Xử lý đúng cách sẽ giúp code của bạn robust và dễ debug hơn. Đừng như tôi lúc đầu - bỏ qua exceptions hoặc catch mọi thứ mà không làm gì!

**Thử thách:** Hãy review code cũ của bạn, tìm những chỗ xử lý exception không đúng và refactor lại. Bạn sẽ học được nhiều điều!



