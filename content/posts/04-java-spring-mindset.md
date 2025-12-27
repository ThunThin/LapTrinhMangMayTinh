---
title: "Từ Java Core Đến Spring: Thay Đổi Tư Duy Lập Trình"
date: 2024-12-18
tags: ["Java", "Spring", "Framework", "Mindset"]
categories: ["Java"]
summary: "Học Spring không chỉ là học một framework, mà là học cách tư duy về kiến trúc phần mềm. Bài viết này chia sẻ hành trình từ Java thuần đến Spring Boot của mình."
draft: false
---

## Câu Hỏi Lớn: Tại Sao Cần Spring?

Khi mới học Spring, tôi đã từng hỏi: "Java thuần đã đủ rồi, tại sao cần Spring?"

Câu trả lời đến khi tôi làm project thực tế và nhận ra:
- Quản lý dependencies thủ công quá phức tạp
- Code lặp lại nhiều (boilerplate)
- Khó test và maintain

Spring giúp tôi tập trung vào **business logic** thay vì infrastructure code.

## Hành Trình Từ Java Core Đến Spring

### Giai Đoạn 1: Java Thuần - Mọi Thứ Tự Làm

```java
// ❌ Code Java thuần - quản lý dependencies thủ công
public class UserService {
    private UserRepository userRepository;
    private EmailService emailService;
    
    // Phải tự tạo dependencies
    public UserService() {
        this.userRepository = new UserRepositoryImpl();
        this.emailService = new EmailService();
    }
    
    public void registerUser(User user) {
        userRepository.save(user);
        emailService.sendWelcomeEmail(user.getEmail());
    }
}

// Vấn đề:
// - Khó test (không thể mock dependencies)
// - Tight coupling
// - Khó thay đổi implementation
```

### Giai Đoạn 2: Dependency Injection Thủ Công

```java
// ✅ Tốt hơn - Constructor injection
public class UserService {
    private UserRepository userRepository;
    private EmailService emailService;
    
    // Dependencies được inject từ bên ngoài
    public UserService(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }
    
    public void registerUser(User user) {
        userRepository.save(user);
        emailService.sendWelcomeEmail(user.getEmail());
    }
}

// Sử dụng:
UserRepository repo = new UserRepositoryImpl();
EmailService email = new EmailService();
UserService service = new UserService(repo, email);

// Tốt hơn nhưng vẫn phải quản lý thủ công
```

### Giai Đoạn 3: Spring - IoC Container Quản Lý

```java
// ✅ Spring quản lý mọi thứ
@Service
public class UserService {
    private final UserRepository userRepository;
    private final EmailService emailService;
    
    // Spring tự động inject dependencies
    public UserService(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }
    
    public void registerUser(User user) {
        userRepository.save(user);
        emailService.sendWelcomeEmail(user.getEmail());
    }
}

@Repository
public class UserRepositoryImpl implements UserRepository {
    // Spring tự động tạo instance
}

@Service
public class EmailService {
    // Spring tự động tạo instance
}

// Spring tự động:
// 1. Tạo các beans
// 2. Inject dependencies
// 3. Quản lý lifecycle
```

## Những Concept Quan Trọng Của Spring

### 1. Inversion of Control (IoC)

**Trước:** Bạn kiểm soát việc tạo objects
**Sau:** Spring container kiểm soát việc tạo objects

```java
// ❌ Trước: Bạn kiểm soát
UserService service = new UserService(new UserRepository(), new EmailService());

// ✅ Sau: Spring kiểm soát
@Autowired
UserService service; // Spring tự động tạo và inject
```

### 2. Dependency Injection (DI)

Có 3 cách inject dependencies:

```java
// 1. Constructor Injection (Recommended)
@Service
public class UserService {
    private final UserRepository repository;
    
    public UserService(UserRepository repository) {
        this.repository = repository;
    }
}

// 2. Field Injection (Không khuyến khích)
@Service
public class UserService {
    @Autowired
    private UserRepository repository;
}

// 3. Setter Injection
@Service
public class UserService {
    private UserRepository repository;
    
    @Autowired
    public void setRepository(UserRepository repository) {
        this.repository = repository;
    }
}
```

**Tại sao Constructor Injection tốt nhất?**
- Bắt buộc phải có dependencies (không thể null)
- Dễ test (truyền mock vào constructor)
- Immutable (final fields)

### 3. Aspect-Oriented Programming (AOP)

Spring AOP giúp tách cross-cutting concerns:

```java
// ❌ Trước: Logging rải rác khắp nơi
@Service
public class UserService {
    public void registerUser(User user) {
        logger.info("Registering user: " + user.getEmail());
        // Business logic
        logger.info("User registered successfully");
    }
    
    public void deleteUser(Long id) {
        logger.info("Deleting user: " + id);
        // Business logic
        logger.info("User deleted successfully");
    }
}

// ✅ Sau: Tách logging ra AOP
@Service
public class UserService {
    public void registerUser(User user) {
        // Chỉ business logic
    }
    
    public void deleteUser(Long id) {
        // Chỉ business logic
    }
}

@Aspect
@Component
public class LoggingAspect {
    @Around("@annotation(Loggable)")
    public Object log(ProceedingJoinPoint joinPoint) throws Throwable {
        logger.info("Method: " + joinPoint.getSignature().getName());
        Object result = joinPoint.proceed();
        logger.info("Method completed");
        return result;
    }
}
```

## Spring Boot: Convention Over Configuration

Spring Boot giúp tôi không cần cấu hình nhiều:

```java
// ✅ Spring Boot - chỉ cần annotation
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}

// Tự động:
// - Embedded Tomcat server
// - Auto-configuration
// - Starter dependencies
```

### Spring Boot Starters

Thay vì tự config dependencies, Spring Boot cung cấp starters:

```xml
<!-- Chỉ cần một dependency -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<!-- Tự động bao gồm:
     - Spring MVC
     - Embedded Tomcat
     - Jackson (JSON)
     - Validation
     - ...
-->
```

## Thay Đổi Tư Duy Khi Học Spring

### 1. Từ "Làm Thế Nào" Sang "Làm Gì"

**Trước:** Tôi phải tự làm mọi thứ
```java
// Tự tạo connection pool
// Tự config transaction
// Tự quản lý sessions
```

**Sau:** Tôi chỉ cần khai báo "tôi muốn gì"
```java
@Transactional
public void transferMoney(Account from, Account to, double amount) {
    // Spring tự động quản lý transaction
}
```

### 2. Từ Procedural Sang Declarative

**Trước:** Code từng bước một
```java
Connection conn = getConnection();
try {
    conn.setAutoCommit(false);
    // Do work
    conn.commit();
} catch (Exception e) {
    conn.rollback();
} finally {
    conn.close();
}
```

**Sau:** Khai báo behavior
```java
@Transactional
public void doWork() {
    // Spring tự động quản lý transaction
}
```

### 3. Từ Tight Coupling Sang Loose Coupling

**Trước:** Code phụ thuộc vào implementation cụ thể
```java
public class UserService {
    private MySQLUserRepository repository; // Tight coupling
}
```

**Sau:** Code phụ thuộc vào interface
```java
public class UserService {
    private UserRepository repository; // Loose coupling
    // Có thể thay đổi implementation dễ dàng
}
```

## Best Practices Tôi Đã Học

### 1. Luôn Dùng Interface Cho Dependencies

```java
// ✅ Đúng
@Service
public class UserService {
    private final UserRepository repository; // Interface
}

// ❌ Sai
@Service
public class UserService {
    private final UserRepositoryImpl repository; // Concrete class
}
```

### 2. Sử Dụng @Transactional Đúng Cách

```java
// ✅ Đúng: Ở service layer
@Service
@Transactional
public class UserService {
    public void transferMoney(Account from, Account to, double amount) {
        // Multiple database operations
    }
}

// ❌ Sai: Ở repository layer
@Repository
@Transactional // Không nên
public class UserRepository {
}
```

### 3. Tách Business Logic Khỏi Controller

```java
// ✅ Đúng: Controller chỉ nhận request và gọi service
@RestController
public class UserController {
    private final UserService userService;
    
    @PostMapping("/users")
    public ResponseEntity<User> createUser(@RequestBody UserDTO dto) {
        User user = userService.createUser(dto);
        return ResponseEntity.ok(user);
    }
}

// ❌ Sai: Business logic trong controller
@RestController
public class UserController {
    @PostMapping("/users")
    public ResponseEntity<User> createUser(@RequestBody UserDTO dto) {
        // Business logic ở đây - SAI!
        if (dto.getEmail() == null) {
            throw new IllegalArgumentException();
        }
        // ...
    }
}
```

## Takeaway Cho Sinh Viên

1. **Học Java Core trước** - Spring chỉ là tool, Java là foundation
2. **Hiểu IoC và DI** - Đây là core concepts của Spring
3. **Làm project thực tế** - Áp dụng Spring vào project để hiểu sâu
4. **Đọc Spring documentation** - Rất chi tiết và hữu ích
5. **Học Spring Boot sau** - Nó làm mọi thứ dễ hơn

## Kết Luận

Học Spring không chỉ là học một framework, mà là học cách tư duy về:
- **Separation of Concerns** - Tách biệt các phần
- **Dependency Management** - Quản lý dependencies
- **Configuration** - Cấu hình ứng dụng
- **Testing** - Viết test dễ dàng hơn

Spring giúp tôi viết code clean hơn, maintainable hơn, và professional hơn. Đó là bước chuyển từ "sinh viên code" sang "developer code".

**Lời khuyên:** Đừng vội học Spring khi chưa vững Java Core. Nắm vững OOP, Collections, và Exceptions trước. Spring sẽ dễ hiểu hơn nhiều!



