---
title: "Java Annotations: Metadata Và Reflection"
date: 2024-12-29
tags: ["Java", "Annotations", "Reflection", "Metadata", "Frameworks"]
categories: ["Java"]
summary: "Annotations là cách Java thêm metadata vào code. Bài viết này giải thích cách annotations hoạt động và cách tạo custom annotations."
draft: false
---

## Annotations Là Gì?

Annotations là metadata được thêm vào code để cung cấp thông tin cho compiler, runtime, hoặc các tools khác. Chúng không thay đổi logic của code, chỉ cung cấp thông tin.

```java
// ✅ Built-in annotations
@Override
public String toString() {
    return "Hello";
}

@Deprecated
public void oldMethod() {
    // ...
}

@SuppressWarnings("unchecked")
List list = new ArrayList();
```

## Built-in Annotations

### @Override

```java
// ✅ Đảm bảo method override đúng
class Parent {
    public void method() {
        System.out.println("Parent");
    }
}

class Child extends Parent {
    @Override
    public void method() { // Compiler kiểm tra có override đúng không
        System.out.println("Child");
    }
    
    @Override
    public void wrongMethod() { // Compile error - không có method này trong Parent
        // ...
    }
}
```

### @Deprecated

```java
// ✅ Đánh dấu method không nên dùng nữa
@Deprecated
public void oldMethod() {
    // ...
}

@Deprecated(since = "1.5", forRemoval = true)
public void veryOldMethod() {
    // ...
}
```

### @SuppressWarnings

```java
// ✅ Suppress compiler warnings
@SuppressWarnings("unchecked")
List list = new ArrayList(); // No warning về unchecked

@SuppressWarnings({"unchecked", "deprecation"})
public void method() {
    // Suppress multiple warnings
}
```

## Custom Annotations

### Tạo Annotation

```java
// ✅ Custom annotation
@interface Author {
    String name();
    String date();
    int version() default 1;
}

// Usage
@Author(name = "John", date = "2024-12-29", version = 2)
public class MyClass {
    // ...
}

// ✅ Marker annotation (không có parameters)
@interface Test {
}

@Test
public void testMethod() {
    // ...
}

// ✅ Single value annotation
@interface Version {
    int value();
}

@Version(1)
public class MyClass {
    // ...
}
```

### Retention Policy

```java
// ✅ Retention policy - khi nào annotation tồn tại
@Retention(RetentionPolicy.SOURCE) // Chỉ tồn tại tại source code
@interface SourceOnly {
}

@Retention(RetentionPolicy.CLASS) // Tồn tại trong bytecode
@interface ClassLevel {
}

@Retention(RetentionPolicy.RUNTIME) // Tồn tại tại runtime (có thể dùng reflection)
@interface RuntimeLevel {
}
```

### Target

```java
// ✅ Target - annotation có thể dùng ở đâu
@Target(ElementType.METHOD)
@interface MethodOnly {
}

@Target({ElementType.METHOD, ElementType.FIELD})
@interface MethodOrField {
}

// ElementType values:
// TYPE - class, interface, enum
// FIELD - field
// METHOD - method
// PARAMETER - parameter
// CONSTRUCTOR - constructor
// LOCAL_VARIABLE - local variable
```

## Reflection Và Annotations

```java
// ✅ Đọc annotations tại runtime
@Author(name = "John", date = "2024-12-29")
public class MyClass {
    @Test
    public void testMethod() {
        // ...
    }
}

// Read class annotation
Class<?> clazz = MyClass.class;
Author author = clazz.getAnnotation(Author.class);
if (author != null) {
    System.out.println("Author: " + author.name());
    System.out.println("Date: " + author.date());
}

// Read method annotation
Method method = clazz.getMethod("testMethod");
Test test = method.getAnnotation(Test.class);
if (test != null) {
    System.out.println("Method has @Test annotation");
}
```

## Practical Examples

### Example 1: Validation Annotation

```java
// ✅ Custom validation annotation
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@interface NotNull {
    String message() default "Field cannot be null";
}

@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@interface Min {
    int value();
    String message() default "Value too small";
}

// Usage
class User {
    @NotNull(message = "Name is required")
    private String name;
    
    @Min(value = 18, message = "Age must be at least 18")
    private int age;
}

// Validator
class Validator {
    public static void validate(Object obj) throws ValidationException {
        Class<?> clazz = obj.getClass();
        Field[] fields = clazz.getDeclaredFields();
        
        for (Field field : fields) {
            field.setAccessible(true);
            
            // Check @NotNull
            NotNull notNull = field.getAnnotation(NotNull.class);
            if (notNull != null) {
                try {
                    Object value = field.get(obj);
                    if (value == null) {
                        throw new ValidationException(notNull.message());
                    }
                } catch (IllegalAccessException e) {
                    e.printStackTrace();
                }
            }
            
            // Check @Min
            Min min = field.getAnnotation(Min.class);
            if (min != null) {
                try {
                    Object value = field.get(obj);
                    if (value instanceof Number) {
                        int intValue = ((Number) value).intValue();
                        if (intValue < min.value()) {
                            throw new ValidationException(min.message());
                        }
                    }
                } catch (IllegalAccessException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
```

### Example 2: API Mapping Annotation

```java
// ✅ REST API mapping annotations
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@interface GET {
    String value();
}

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@interface POST {
    String value();
}

@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
@interface PathVariable {
    String value();
}

// Usage
class UserController {
    @GET("/users/{id}")
    public User getUser(@PathVariable("id") Long id) {
        return userService.findById(id);
    }
    
    @POST("/users")
    public User createUser(User user) {
        return userService.save(user);
    }
}
```

## Framework Annotations

### Spring Framework

```java
// ✅ Spring annotations
@Component
public class UserService {
    // ...
}

@Service
public class OrderService {
    @Autowired
    private UserService userService;
    
    @Transactional
    public void processOrder(Order order) {
        // ...
    }
}

@RestController
@RequestMapping("/api/users")
public class UserController {
    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        // ...
    }
}
```

### JPA Annotations

```java
// ✅ JPA annotations
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_name", nullable = false, length = 100)
    private String name;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Order> orders;
}
```

## Common Mistakes Tôi Đã Mắc

### 1. Quên Retention Policy

```java
// ❌ Annotation không tồn tại tại runtime
@Retention(RetentionPolicy.SOURCE)
@interface MyAnnotation {
}

// Reflection không tìm thấy
MyAnnotation ann = clazz.getAnnotation(MyAnnotation.class); // null!

// ✅ Dùng RUNTIME nếu cần reflection
@Retention(RetentionPolicy.RUNTIME)
@interface MyAnnotation {
}
```

### 2. Wrong Target

```java
// ❌ Annotation không thể dùng ở đây
@Target(ElementType.METHOD)
@interface MethodOnly {
}

@MethodOnly // Compile error - không thể dùng ở class
public class MyClass {
}
```

## Takeaway Cho Sinh Viên

1. **Annotations là metadata** - Không thay đổi logic code
2. **Retention policy quan trọng** - Quyết định khi nào annotation tồn tại
3. **Reflection để đọc annotations** - Tại runtime
4. **Frameworks dùng annotations nhiều** - Spring, JPA, etc.
5. **Practice với custom annotations** - Tạo validator, API mapper

## Kết Luận

Annotations là một tính năng mạnh mẽ của Java giúp thêm metadata vào code. Từ built-in annotations đến custom annotations, hiểu rõ annotations sẽ giúp bạn làm việc với frameworks tốt hơn.

**Thử thách:** Hãy tạo một custom validation annotation và validator để validate objects. Đây là cách tốt nhất để hiểu annotations!


