---
title: "Tại Sao Java OOP Là Nền Tảng Quan Trọng Cho Sinh Viên CNTT"
date: 2024-12-15
tags: ["Java", "OOP", "Beginner", "Fundamentals"]
categories: ["Java"]
summary: "Hiểu về OOP trong Java không chỉ là học cú pháp, mà là học cách tư duy như một kỹ sư phần mềm. Bài viết này chia sẻ cách mình đã học OOP từ những sai lầm ban đầu."
draft: false
---

## Tại Sao Tôi Chọn Bắt Đầu Với OOP?

Khi mới học Java, tôi đã từng nghĩ OOP chỉ là cách viết code "đẹp hơn" một chút. Nhưng sau nhiều lần debug và refactor code, tôi nhận ra: **OOP không phải là công cụ, mà là cách tư duy**.

## Những Sai Lầm Ban Đầu Của Tôi

### 1. Tạo Class Nhưng Không Hiểu Mục Đích

Lúc đầu, tôi tạo class chỉ vì "phải có class":

```java
// ❌ Cách làm sai - Class không có ý nghĩa
public class Student {
    String name;
    int age;
    
    public void printInfo() {
        System.out.println(name + " " + age);
    }
}

public class Main {
    public static void main(String[] args) {
        Student s = new Student();
        s.name = "Nguyen Van A";
        s.age = 20;
        s.printInfo();
    }
}
```

**Vấn đề:** Tôi không hiểu tại sao cần class, tại sao không dùng struct như C?

### 2. Không Hiểu Encapsulation

Tôi để tất cả fields là `public`, ai cũng có thể truy cập:

```java
// ❌ Không an toàn
public class BankAccount {
    public double balance; // Nguy hiểm!
}
```

Một ngày, bạn tôi vô tình viết:
```java
account.balance = -1000; // Số dư âm? Không hợp lý!
```

## Cách Tôi Đã Học Lại Từ Đầu

### Bước 1: Hiểu "Tại Sao" Trước "Như Thế Nào"

Thay vì học thuộc 4 tính chất của OOP, tôi tự hỏi:
- **Encapsulation:** Tại sao cần che giấu dữ liệu?
- **Inheritance:** Khi nào nên dùng kế thừa?
- **Polymorphism:** Lợi ích thực sự là gì?
- **Abstraction:** Abstract class vs Interface khác nhau như thế nào?

### Bước 2: Viết Code Thực Tế

Tôi bắt đầu với một project nhỏ: **Hệ thống quản lý thư viện**.

```java
// ✅ Cách làm đúng - Encapsulation
public class Book {
    private String title;
    private String author;
    private boolean isAvailable;
    
    // Constructor
    public Book(String title, String author) {
        this.title = title;
        this.author = author;
        this.isAvailable = true;
    }
    
    // Getter methods
    public String getTitle() {
        return title;
    }
    
    public boolean isAvailable() {
        return isAvailable;
    }
    
    // Business logic methods
    public void borrow() {
        if (isAvailable) {
            isAvailable = false;
            System.out.println("Đã mượn sách: " + title);
        } else {
            System.out.println("Sách đã được mượn!");
        }
    }
    
    public void returnBook() {
        isAvailable = true;
        System.out.println("Đã trả sách: " + title);
    }
}
```

**Bài học:** Encapsulation giúp đảm bảo dữ liệu luôn hợp lệ và logic nghiệp vụ được tập trung.

### Bước 3: Áp Dụng Inheritance Đúng Cách

Thay vì kế thừa mọi thứ, tôi học cách phân tích:

```java
// Base class - chứa những gì chung
public abstract class LibraryItem {
    protected String title;
    protected String id;
    protected boolean isAvailable;
    
    public LibraryItem(String title, String id) {
        this.title = title;
        this.id = id;
        this.isAvailable = true;
    }
    
    // Abstract method - mỗi loại item có cách xử lý khác
    public abstract int getLoanPeriod();
    
    public void borrow() {
        if (isAvailable) {
            isAvailable = false;
            System.out.println("Đã mượn: " + title);
        }
    }
}

// Derived classes
public class Book extends LibraryItem {
    private String author;
    
    public Book(String title, String author, String id) {
        super(title, id);
        this.author = author;
    }
    
    @Override
    public int getLoanPeriod() {
        return 14; // Sách mượn 14 ngày
    }
}

public class DVD extends LibraryItem {
    private int duration; // phút
    
    public DVD(String title, int duration, String id) {
        super(title, id);
        this.duration = duration;
    }
    
    @Override
    public int getLoanPeriod() {
        return 7; // DVD mượn 7 ngày
    }
}
```

**Bài học:** Inheritance giúp tái sử dụng code và thể hiện mối quan hệ "is-a".

## Những Insight Quan Trọng

### 1. OOP Giúp Code Dễ Bảo Trì

Khi cần thay đổi logic của Book, tôi chỉ sửa một chỗ thay vì tìm khắp nơi trong code.

### 2. OOP Giúp Làm Việc Nhóm

Mỗi người có thể làm việc trên một class riêng mà không ảnh hưởng nhau.

### 3. OOP Chuẩn Bị Cho Framework

Khi học Spring Boot sau này, tôi hiểu ngay tại sao cần `@Component`, `@Service` vì chúng dựa trên OOP.

## Takeaway Cho Sinh Viên

1. **Đừng học thuộc lòng** - Hãy tự hỏi "tại sao" trước mỗi concept
2. **Làm project nhỏ** - Áp dụng OOP vào project thực tế
3. **Đọc code của người khác** - GitHub là nơi học tốt nhất
4. **Refactor code cũ** - Chuyển code procedural sang OOP

## Kết Luận

OOP không phải là công cụ để "làm code đẹp", mà là cách tư duy để giải quyết vấn đề phức tạp bằng cách chia nhỏ thành các đối tượng có trách nhiệm rõ ràng. Học OOP đúng cách sẽ giúp bạn tự tin hơn khi học framework và làm việc với codebase lớn.

**Câu hỏi cho bạn:** Bạn đã từng gặp khó khăn gì khi học OOP? Hãy chia sẻ trong comment!



