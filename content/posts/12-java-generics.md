---
title: "Java Generics: Type Safety Và Code Reusability"
date: 2024-12-27
tags: ["Java", "Generics", "Type Safety", "Advanced", "Best Practices"]
categories: ["Java"]
summary: "Generics là một trong những tính năng quan trọng nhất của Java nhưng lại khó hiểu. Bài viết này giải thích chi tiết cách Generics hoạt động và cách sử dụng đúng cách."
draft: false
---

## Vấn Đề: Type Safety

Trước khi có Generics, tôi đã từng viết code như thế này:

```java
// ❌ Không type-safe - có thể gây ClassCastException
List list = new ArrayList();
list.add("Hello");
list.add(123); // Có thể add bất kỳ type nào

String str = (String) list.get(0); // Phải cast
Integer num = (Integer) list.get(1); // Runtime error nếu cast sai!
```

Với Generics, code trở nên type-safe:

```java
// ✅ Type-safe - compiler kiểm tra type
List<String> list = new ArrayList<>();
list.add("Hello");
list.add(123); // Compile error!

String str = list.get(0); // Không cần cast
```

## Generics Là Gì?

Generics cho phép bạn định nghĩa classes, interfaces, và methods với **type parameters**. Điều này giúp:
- **Type safety**: Compiler kiểm tra type tại compile time
- **Code reusability**: Một class có thể dùng cho nhiều types
- **No casting**: Không cần cast khi lấy elements

## Basic Generics Syntax

### Generic Class

```java
// ✅ Generic class với type parameter T
public class Box<T> {
    private T item;
    
    public void setItem(T item) {
        this.item = item;
    }
    
    public T getItem() {
        return item;
    }
}

// Usage
Box<String> stringBox = new Box<>();
stringBox.setItem("Hello");
String str = stringBox.getItem(); // Type-safe

Box<Integer> intBox = new Box<>();
intBox.setItem(123);
Integer num = intBox.getItem(); // Type-safe
```

### Generic Interface

```java
// ✅ Generic interface
public interface Repository<T> {
    void save(T entity);
    T findById(Long id);
    List<T> findAll();
}

// Implementation
public class UserRepository implements Repository<User> {
    @Override
    public void save(User entity) {
        // Implementation
    }
    
    @Override
    public User findById(Long id) {
        // Implementation
    }
    
    @Override
    public List<User> findAll() {
        // Implementation
    }
}
```

### Generic Method

```java
// ✅ Generic method
public class Utils {
    public static <T> T getFirst(List<T> list) {
        if (list.isEmpty()) {
            return null;
        }
        return list.get(0);
    }
    
    public static <T> void swap(List<T> list, int i, int j) {
        T temp = list.get(i);
        list.set(i, list.get(j));
        list.set(j, temp);
    }
}

// Usage
List<String> names = Arrays.asList("John", "Jane");
String first = Utils.getFirst(names); // Type inference

List<Integer> numbers = Arrays.asList(1, 2, 3);
Integer firstNum = Utils.getFirst(numbers);
```

## Bounded Type Parameters

### Upper Bound

```java
// ✅ Upper bound - T phải là Number hoặc subclass của Number
public class NumberBox<T extends Number> {
    private T number;
    
    public double getDoubleValue() {
        return number.doubleValue(); // Safe vì Number có doubleValue()
    }
}

// Usage
NumberBox<Integer> intBox = new NumberBox<>(); // OK
NumberBox<Double> doubleBox = new NumberBox<>(); // OK
NumberBox<String> stringBox = new NumberBox<>(); // Compile error!
```

### Multiple Bounds

```java
// ✅ Multiple bounds - T phải implement cả Comparable và Serializable
public class SortedList<T extends Comparable<T> & Serializable> {
    private List<T> items;
    
    public void add(T item) {
        items.add(item);
        Collections.sort(items); // Safe vì T implements Comparable
    }
}
```

## Wildcards

### Unbounded Wildcard (?)

```java
// ✅ Unbounded wildcard - accept any type
public void printList(List<?> list) {
    for (Object item : list) {
        System.out.println(item);
    }
}

// Usage
printList(Arrays.asList(1, 2, 3)); // OK
printList(Arrays.asList("a", "b", "c")); // OK
```

### Upper Bounded Wildcard (? extends)

```java
// ✅ Upper bounded wildcard - accept Number và subclasses
public double sum(List<? extends Number> numbers) {
    double total = 0;
    for (Number num : numbers) {
        total += num.doubleValue();
    }
    return total;
}

// Usage
sum(Arrays.asList(1, 2, 3)); // OK - Integer extends Number
sum(Arrays.asList(1.5, 2.5, 3.5)); // OK - Double extends Number
```

### Lower Bounded Wildcard (? super)

```java
// ✅ Lower bounded wildcard - accept Integer và superclasses
public void addNumbers(List<? super Integer> list) {
    list.add(1);
    list.add(2);
    list.add(3);
}

// Usage
List<Number> numbers = new ArrayList<>();
addNumbers(numbers); // OK - Number is superclass of Integer

List<Object> objects = new ArrayList<>();
addNumbers(objects); // OK - Object is superclass of Integer
```

## PECS Principle

**Producer Extends, Consumer Super**

```java
// ✅ Producer - chỉ đọc, dùng ? extends
public void processNumbers(List<? extends Number> numbers) {
    for (Number num : numbers) {
        // Chỉ đọc, không thêm
    }
}

// ✅ Consumer - chỉ ghi, dùng ? super
public void addIntegers(List<? super Integer> list) {
    list.add(1); // Chỉ thêm, không đọc
}

// ✅ Both - đọc và ghi, dùng exact type
public void swap(List<Integer> list, int i, int j) {
    Integer temp = list.get(i); // Đọc
    list.set(i, list.get(j)); // Ghi
    list.set(j, temp); // Ghi
}
```

## Type Erasure

```java
// ✅ Type erasure - Generics chỉ tồn tại tại compile time
List<String> stringList = new ArrayList<>();
List<Integer> intList = new ArrayList<>();

// Tại runtime, cả hai đều là List (không có type parameter)
System.out.println(stringList.getClass() == intList.getClass()); // true!

// ✅ Type information được erase, nhưng vẫn type-safe tại compile time
```

## Practical Examples

### Example 1: Generic Repository

```java
// ✅ Generic repository pattern
public interface Repository<T, ID> {
    T save(T entity);
    Optional<T> findById(ID id);
    List<T> findAll();
    void deleteById(ID id);
}

public class JpaRepository<T, ID> implements Repository<T, ID> {
    private Map<ID, T> storage = new HashMap<>();
    
    @Override
    public T save(T entity) {
        // Implementation
        return entity;
    }
    
    @Override
    public Optional<T> findById(ID id) {
        return Optional.ofNullable(storage.get(id));
    }
    
    @Override
    public List<T> findAll() {
        return new ArrayList<>(storage.values());
    }
    
    @Override
    public void deleteById(ID id) {
        storage.remove(id);
    }
}

// Usage
Repository<User, Long> userRepo = new JpaRepository<>();
Repository<Product, String> productRepo = new JpaRepository<>();
```

### Example 2: Generic Builder

```java
// ✅ Generic builder pattern
public class Builder<T> {
    private T instance;
    
    public Builder(Supplier<T> supplier) {
        this.instance = supplier.get();
    }
    
    public <V> Builder<T> with(Function<T, V> getter, V value) {
        // Set value using reflection or method reference
        return this;
    }
    
    public T build() {
        return instance;
    }
}

// Usage
User user = new Builder<>(User::new)
    .with(User::setName, "John")
    .with(User::setEmail, "john@example.com")
    .build();
```

### Example 3: Generic Utility Methods

```java
// ✅ Generic utility methods
public class CollectionUtils {
    // Find max element
    public static <T extends Comparable<T>> Optional<T> max(List<T> list) {
        if (list.isEmpty()) {
            return Optional.empty();
        }
        T max = list.get(0);
        for (T item : list) {
            if (item.compareTo(max) > 0) {
                max = item;
            }
        }
        return Optional.of(max);
    }
    
    // Filter và map
    public static <T, R> List<R> filterAndMap(
            List<T> list,
            Predicate<T> filter,
            Function<T, R> mapper) {
        return list.stream()
            .filter(filter)
            .map(mapper)
            .collect(Collectors.toList());
    }
}
```

## Common Mistakes Tôi Đã Mắc

### 1. Raw Types

```java
// ❌ Raw type - mất type safety
List list = new ArrayList();
list.add("Hello");
list.add(123); // No compile error!

// ✅ Generic type
List<String> list = new ArrayList<>();
list.add("Hello");
list.add(123); // Compile error!
```

### 2. Confusing Wildcards

```java
// ❌ Không thể add vào ? extends
List<? extends Number> numbers = new ArrayList<Integer>();
numbers.add(1); // Compile error!

// ✅ Dùng exact type hoặc ? super
List<Integer> numbers = new ArrayList<>();
numbers.add(1); // OK

List<? super Integer> numbers2 = new ArrayList<Number>();
numbers2.add(1); // OK
```

### 3. Type Erasure Confusion

```java
// ❌ Không thể check instanceof với generic type
if (list instanceof List<String>) { // Compile error!
    // ...
}

// ✅ Chỉ check raw type
if (list instanceof List) {
    // ...
}
```

## Takeaway Cho Sinh Viên

1. **Generics cung cấp type safety** - Compiler kiểm tra type tại compile time
2. **Wildcards cho flexibility** - ? extends cho producer, ? super cho consumer
3. **Type erasure** - Generics chỉ tồn tại tại compile time
4. **Practice với real examples** - Repository pattern, Builder pattern
5. **Hiểu PECS principle** - Producer Extends, Consumer Super

## Kết Luận

Generics là một tính năng mạnh mẽ giúp code Java type-safe và reusable hơn. Từ basic generics đến wildcards và bounded types, hiểu rõ Generics sẽ giúp bạn viết code tốt hơn và tránh được nhiều bugs.

**Thử thách:** Hãy tạo một generic repository cho một entity của bạn. Đây là cách tốt nhất để hiểu Generics!


