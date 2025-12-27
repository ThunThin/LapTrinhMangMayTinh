---
title: "Java Design Patterns: Giải Pháp Cho Các Vấn Đề Thường Gặp"
date: 2024-12-30
tags: ["Java", "Design Patterns", "OOP", "Best Practices", "Architecture"]
categories: ["Java"]
summary: "Design patterns là các giải pháp đã được chứng minh cho các vấn đề thiết kế phần mềm thường gặp. Bài viết này giới thiệu các design patterns quan trọng nhất trong Java."
draft: false
---

## Tại Sao Cần Design Patterns?

Khi làm việc với code, bạn sẽ gặp các vấn đề lặp lại:
- Tạo objects phức tạp
- Quản lý state
- Giao tiếp giữa objects
- Tối ưu performance

Design patterns là các giải pháp đã được chứng minh cho những vấn đề này.

## Creational Patterns

### Singleton Pattern

```java
// ✅ Đảm bảo chỉ có một instance
public class DatabaseConnection {
    private static DatabaseConnection instance;
    
    private DatabaseConnection() {
        // Private constructor
    }
    
    public static synchronized DatabaseConnection getInstance() {
        if (instance == null) {
            instance = new DatabaseConnection();
        }
        return instance;
    }
}

// ✅ Thread-safe với double-checked locking
public class DatabaseConnection {
    private static volatile DatabaseConnection instance;
    
    private DatabaseConnection() {}
    
    public static DatabaseConnection getInstance() {
        if (instance == null) {
            synchronized (DatabaseConnection.class) {
                if (instance == null) {
                    instance = new DatabaseConnection();
                }
            }
        }
        return instance;
    }
}

// ✅ Enum singleton (best practice)
public enum DatabaseConnection {
    INSTANCE;
    
    public void connect() {
        // Connection logic
    }
}
```

### Factory Pattern

```java
// ✅ Factory để tạo objects
interface Animal {
    void makeSound();
}

class Dog implements Animal {
    @Override
    public void makeSound() {
        System.out.println("Woof!");
    }
}

class Cat implements Animal {
    @Override
    public void makeSound() {
        System.out.println("Meow!");
    }
}

class AnimalFactory {
    public static Animal createAnimal(String type) {
        switch (type.toLowerCase()) {
            case "dog":
                return new Dog();
            case "cat":
                return new Cat();
            default:
                throw new IllegalArgumentException("Unknown animal type");
        }
    }
}

// Usage
Animal dog = AnimalFactory.createAnimal("dog");
dog.makeSound(); // Woof!
```

### Builder Pattern

```java
// ✅ Builder để tạo objects phức tạp
public class User {
    private String name;
    private String email;
    private int age;
    private String address;
    
    private User(Builder builder) {
        this.name = builder.name;
        this.email = builder.email;
        this.age = builder.age;
        this.address = builder.address;
    }
    
    public static class Builder {
        private String name;
        private String email;
        private int age;
        private String address;
        
        public Builder name(String name) {
            this.name = name;
            return this;
        }
        
        public Builder email(String email) {
            this.email = email;
            return this;
        }
        
        public Builder age(int age) {
            this.age = age;
            return this;
        }
        
        public Builder address(String address) {
            this.address = address;
            return this;
        }
        
        public User build() {
            return new User(this);
        }
    }
}

// Usage
User user = new User.Builder()
    .name("John")
    .email("john@example.com")
    .age(30)
    .address("123 Main St")
    .build();
```

## Structural Patterns

### Adapter Pattern

```java
// ✅ Adapter để tích hợp interface không tương thích
interface MediaPlayer {
    void play(String audioType, String fileName);
}

interface AdvancedMediaPlayer {
    void playVlc(String fileName);
    void playMp4(String fileName);
}

class VlcPlayer implements AdvancedMediaPlayer {
    @Override
    public void playVlc(String fileName) {
        System.out.println("Playing vlc file: " + fileName);
    }
    
    @Override
    public void playMp4(String fileName) {
        // Do nothing
    }
}

class MediaAdapter implements MediaPlayer {
    private AdvancedMediaPlayer advancedPlayer;
    
    public MediaAdapter(String audioType) {
        if (audioType.equalsIgnoreCase("vlc")) {
            advancedPlayer = new VlcPlayer();
        }
    }
    
    @Override
    public void play(String audioType, String fileName) {
        if (audioType.equalsIgnoreCase("vlc")) {
            advancedPlayer.playVlc(fileName);
        }
    }
}

class AudioPlayer implements MediaPlayer {
    private MediaAdapter adapter;
    
    @Override
    public void play(String audioType, String fileName) {
        if (audioType.equalsIgnoreCase("mp3")) {
            System.out.println("Playing mp3 file: " + fileName);
        } else if (audioType.equalsIgnoreCase("vlc") || audioType.equalsIgnoreCase("mp4")) {
            adapter = new MediaAdapter(audioType);
            adapter.play(audioType, fileName);
        }
    }
}
```

### Decorator Pattern

```java
// ✅ Decorator để thêm behavior động
interface Coffee {
    String getDescription();
    double getCost();
}

class SimpleCoffee implements Coffee {
    @Override
    public String getDescription() {
        return "Simple coffee";
    }
    
    @Override
    public double getCost() {
        return 2.0;
    }
}

abstract class CoffeeDecorator implements Coffee {
    protected Coffee coffee;
    
    public CoffeeDecorator(Coffee coffee) {
        this.coffee = coffee;
    }
    
    @Override
    public String getDescription() {
        return coffee.getDescription();
    }
    
    @Override
    public double getCost() {
        return coffee.getCost();
    }
}

class MilkDecorator extends CoffeeDecorator {
    public MilkDecorator(Coffee coffee) {
        super(coffee);
    }
    
    @Override
    public String getDescription() {
        return coffee.getDescription() + ", Milk";
    }
    
    @Override
    public double getCost() {
        return coffee.getCost() + 0.5;
    }
}

// Usage
Coffee coffee = new SimpleCoffee();
coffee = new MilkDecorator(coffee);
System.out.println(coffee.getDescription()); // Simple coffee, Milk
System.out.println(coffee.getCost()); // 2.5
```

## Behavioral Patterns

### Observer Pattern

```java
// ✅ Observer để notify nhiều objects về changes
interface Observer {
    void update(String message);
}

interface Subject {
    void attach(Observer observer);
    void detach(Observer observer);
    void notifyObservers();
}

class NewsAgency implements Subject {
    private List<Observer> observers = new ArrayList<>();
    private String news;
    
    @Override
    public void attach(Observer observer) {
        observers.add(observer);
    }
    
    @Override
    public void detach(Observer observer) {
        observers.remove(observer);
    }
    
    @Override
    public void notifyObservers() {
        for (Observer observer : observers) {
            observer.update(news);
        }
    }
    
    public void setNews(String news) {
        this.news = news;
        notifyObservers();
    }
}

class NewsChannel implements Observer {
    private String name;
    
    public NewsChannel(String name) {
        this.name = name;
    }
    
    @Override
    public void update(String message) {
        System.out.println(name + " received: " + message);
    }
}

// Usage
NewsAgency agency = new NewsAgency();
agency.attach(new NewsChannel("Channel 1"));
agency.attach(new NewsChannel("Channel 2"));
agency.setNews("Breaking news!");
```

### Strategy Pattern

```java
// ✅ Strategy để chọn algorithm tại runtime
interface PaymentStrategy {
    void pay(double amount);
}

class CreditCardPayment implements PaymentStrategy {
    private String cardNumber;
    
    public CreditCardPayment(String cardNumber) {
        this.cardNumber = cardNumber;
    }
    
    @Override
    public void pay(double amount) {
        System.out.println("Paid " + amount + " using credit card: " + cardNumber);
    }
}

class PayPalPayment implements PaymentStrategy {
    private String email;
    
    public PayPalPayment(String email) {
        this.email = email;
    }
    
    @Override
    public void pay(double amount) {
        System.out.println("Paid " + amount + " using PayPal: " + email);
    }
}

class ShoppingCart {
    private PaymentStrategy paymentStrategy;
    
    public void setPaymentStrategy(PaymentStrategy strategy) {
        this.paymentStrategy = strategy;
    }
    
    public void checkout(double amount) {
        paymentStrategy.pay(amount);
    }
}

// Usage
ShoppingCart cart = new ShoppingCart();
cart.setPaymentStrategy(new CreditCardPayment("1234-5678"));
cart.checkout(100.0);
```

## When To Use Which Pattern?

### Singleton
- Khi chỉ cần một instance (Database connection, Logger)
- Khi cần global access point

### Factory
- Khi logic tạo object phức tạp
- Khi muốn tách creation logic khỏi business logic

### Builder
- Khi object có nhiều optional parameters
- Khi muốn object immutable nhưng flexible

### Observer
- Khi cần notify nhiều objects về changes
- Event-driven systems

### Strategy
- Khi có nhiều cách làm cùng một việc
- Khi muốn chọn algorithm tại runtime

## Common Mistakes Tôi Đã Mắc

### 1. Over-engineering

```java
// ❌ Dùng pattern khi không cần
class SimpleCalculator {
    // Không cần Strategy pattern cho simple operations
}

// ✅ Chỉ dùng khi thực sự cần
class ComplexPaymentProcessor {
    // Cần Strategy pattern vì có nhiều payment methods
}
```

### 2. Wrong Pattern Choice

```java
// ❌ Dùng Singleton khi không cần
class UserService {
    // Không nên là Singleton - có thể có nhiều instances
}

// ✅ Dùng đúng pattern
class DatabaseConnection {
    // Singleton hợp lý - chỉ cần một connection pool
}
```

## Takeaway Cho Sinh Viên

1. **Patterns là giải pháp, không phải mục đích** - Dùng khi cần, không phải vì "cool"
2. **Hiểu problem trước** - Pattern nào giải quyết vấn đề gì
3. **Practice với real projects** - Áp dụng vào code thực tế
4. **Đọc code của frameworks** - Spring, Hibernate dùng nhiều patterns
5. **Start simple** - Đừng over-engineer ngay từ đầu

## Kết Luận

Design patterns là các giải pháp đã được chứng minh cho các vấn đề thiết kế phần mềm. Hiểu và áp dụng đúng patterns sẽ giúp code của bạn maintainable và scalable hơn.

**Thử thách:** Hãy refactor một phần code của bạn sử dụng một design pattern phù hợp. Bạn sẽ thấy code tốt hơn!


