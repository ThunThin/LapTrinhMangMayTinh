---
title: "Java Streams API: Xử Lý Dữ Liệu Theo Cách Functional"
date: 2024-12-26
tags: ["Java", "Streams", "Functional Programming", "Collections", "Advanced"]
categories: ["Java"]
summary: "Streams API là một trong những tính năng mạnh mẽ nhất của Java 8+. Bài viết này chia sẻ cách mình đã học Streams từ cách tiếp cận imperative đến functional programming style."
draft: false
---

## Từ Imperative Đến Functional

Trước khi học Streams, tôi đã từng viết code như thế này:

```java
// ❌ Imperative style - verbose và dễ bug
List<String> names = Arrays.asList("John", "Jane", "Bob", "Alice");
List<String> filtered = new ArrayList<>();
for (String name : names) {
    if (name.length() > 3) {
        String upper = name.toUpperCase();
        filtered.add(upper);
    }
}
```

Với Streams, code trở nên ngắn gọn và dễ đọc hơn:

```java
// ✅ Functional style - concise và declarative
List<String> filtered = names.stream()
    .filter(name -> name.length() > 3)
    .map(String::toUpperCase)
    .collect(Collectors.toList());
```

## Streams Là Gì?

Stream là một sequence of elements hỗ trợ các operations:
- **Intermediate operations**: filter, map, sorted, distinct, limit...
- **Terminal operations**: collect, forEach, reduce, findFirst, anyMatch...

**Đặc điểm quan trọng:**
- **Lazy evaluation**: Chỉ execute khi có terminal operation
- **Non-mutating**: Không thay đổi source collection
- **Can be consumed only once**: Mỗi stream chỉ dùng được một lần

## Intermediate Operations

### filter() - Lọc Elements

```java
// ✅ Filter elements theo điều kiện
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

List<Integer> evens = numbers.stream()
    .filter(n -> n % 2 == 0)
    .collect(Collectors.toList());
// [2, 4, 6, 8, 10]

// Filter với multiple conditions
List<String> names = Arrays.asList("John", "Jane", "Bob", "Alice", "Jack");
List<String> filtered = names.stream()
    .filter(name -> name.length() > 3)
    .filter(name -> name.startsWith("J"))
    .collect(Collectors.toList());
// [John, Jane, Jack]
```

### map() - Transform Elements

```java
// ✅ Transform mỗi element
List<String> names = Arrays.asList("john", "jane", "bob");
List<String> upper = names.stream()
    .map(String::toUpperCase)
    .collect(Collectors.toList());
// [JOHN, JANE, BOB]

// Map sang type khác
List<String> numbers = Arrays.asList("1", "2", "3", "4", "5");
List<Integer> integers = numbers.stream()
    .map(Integer::parseInt)
    .collect(Collectors.toList());
// [1, 2, 3, 4, 5]

// Map với complex transformation
List<Person> people = Arrays.asList(
    new Person("John", 30),
    new Person("Jane", 25)
);
List<String> names = people.stream()
    .map(Person::getName)
    .collect(Collectors.toList());
```

### flatMap() - Flatten Nested Collections

```java
// ✅ Flatten nested collections
List<List<String>> nested = Arrays.asList(
    Arrays.asList("a", "b"),
    Arrays.asList("c", "d"),
    Arrays.asList("e", "f")
);

List<String> flat = nested.stream()
    .flatMap(List::stream)
    .collect(Collectors.toList());
// [a, b, c, d, e, f]

// Practical example: Get all tags from posts
List<Post> posts = getPosts();
List<String> allTags = posts.stream()
    .flatMap(post -> post.getTags().stream())
    .distinct()
    .collect(Collectors.toList());
```

### distinct() - Remove Duplicates

```java
// ✅ Remove duplicates
List<Integer> numbers = Arrays.asList(1, 2, 2, 3, 3, 3, 4);
List<Integer> unique = numbers.stream()
    .distinct()
    .collect(Collectors.toList());
// [1, 2, 3, 4]

// Distinct với custom objects (cần override equals/hashCode)
List<Person> people = Arrays.asList(
    new Person("John", 30),
    new Person("John", 30),
    new Person("Jane", 25)
);
List<Person> unique = people.stream()
    .distinct()
    .collect(Collectors.toList());
```

### sorted() - Sort Elements

```java
// ✅ Sort natural order
List<Integer> numbers = Arrays.asList(3, 1, 4, 1, 5, 9, 2, 6);
List<Integer> sorted = numbers.stream()
    .sorted()
    .collect(Collectors.toList());
// [1, 1, 2, 3, 4, 5, 6, 9]

// Sort với Comparator
List<String> names = Arrays.asList("John", "Jane", "Bob", "Alice");
List<String> sorted = names.stream()
    .sorted(Comparator.comparing(String::length))
    .collect(Collectors.toList());
// [Bob, John, Jane, Alice]

// Sort reverse order
List<Integer> numbers = Arrays.asList(3, 1, 4, 1, 5);
List<Integer> sorted = numbers.stream()
    .sorted(Comparator.reverseOrder())
    .collect(Collectors.toList());
// [5, 4, 3, 1, 1]
```

### limit() & skip() - Pagination

```java
// ✅ Limit số lượng elements
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
List<Integer> first5 = numbers.stream()
    .limit(5)
    .collect(Collectors.toList());
// [1, 2, 3, 4, 5]

// Skip elements
List<Integer> skip5 = numbers.stream()
    .skip(5)
    .collect(Collectors.toList());
// [6, 7, 8, 9, 10]

// Pagination example
int page = 2;
int pageSize = 5;
List<Integer> page2 = numbers.stream()
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .collect(Collectors.toList());
// [6, 7, 8, 9, 10]
```

## Terminal Operations

### collect() - Collect Results

```java
// ✅ Collect to List
List<String> list = names.stream()
    .filter(n -> n.length() > 3)
    .collect(Collectors.toList());

// Collect to Set
Set<String> set = names.stream()
    .collect(Collectors.toSet());

// Collect to Map
Map<String, Integer> map = people.stream()
    .collect(Collectors.toMap(
        Person::getName,
        Person::getAge
    ));

// Collect with grouping
Map<Integer, List<Person>> byAge = people.stream()
    .collect(Collectors.groupingBy(Person::getAge));

// Collect with counting
Map<String, Long> countByName = names.stream()
    .collect(Collectors.groupingBy(
        Function.identity(),
        Collectors.counting()
    ));
```

### forEach() - Perform Action

```java
// ✅ Perform action cho mỗi element
names.stream()
    .filter(n -> n.length() > 3)
    .forEach(System.out::println);

// forEach với custom action
people.stream()
    .filter(p -> p.getAge() > 18)
    .forEach(person -> {
        System.out.println(person.getName());
        sendEmail(person);
    });
```

### reduce() - Accumulate Values

```java
// ✅ Reduce to single value
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
int sum = numbers.stream()
    .reduce(0, Integer::sum);
// 15

// Reduce với custom accumulator
String concatenated = names.stream()
    .reduce("", (acc, name) -> acc + name + ", ");

// Reduce với identity và combiner
int product = numbers.stream()
    .reduce(1, (a, b) -> a * b);
// 120
```

### findFirst() & findAny() - Find Elements

```java
// ✅ Find first matching element
Optional<String> first = names.stream()
    .filter(n -> n.startsWith("J"))
    .findFirst();

if (first.isPresent()) {
    System.out.println(first.get());
}

// Find any (useful for parallel streams)
Optional<String> any = names.stream()
    .filter(n -> n.length() > 3)
    .findAny();
```

### anyMatch(), allMatch(), noneMatch() - Boolean Checks

```java
// ✅ Check if any element matches
boolean hasLongName = names.stream()
    .anyMatch(n -> n.length() > 10);

// Check if all elements match
boolean allAdults = people.stream()
    .allMatch(p -> p.getAge() >= 18);

// Check if no element matches
boolean noMinors = people.stream()
    .noneMatch(p -> p.getAge() < 18);
```

### count() - Count Elements

```java
// ✅ Count elements
long count = names.stream()
    .filter(n -> n.length() > 3)
    .count();
```

## Practical Examples

### Example 1: Process Orders

```java
// ✅ Process orders với Streams
List<Order> orders = getOrders();

// Get total revenue
double totalRevenue = orders.stream()
    .filter(Order::isCompleted)
    .mapToDouble(Order::getTotal)
    .sum();

// Get top 5 customers by spending
List<Customer> topCustomers = orders.stream()
    .collect(Collectors.groupingBy(
        Order::getCustomer,
        Collectors.summingDouble(Order::getTotal)
    ))
    .entrySet().stream()
    .sorted(Map.Entry.<Customer, Double>comparingByValue().reversed())
    .limit(5)
    .map(Map.Entry::getKey)
    .collect(Collectors.toList());

// Get products sold more than 100 units
List<Product> popularProducts = orders.stream()
    .flatMap(order -> order.getItems().stream())
    .collect(Collectors.groupingBy(
        OrderItem::getProduct,
        Collectors.summingInt(OrderItem::getQuantity)
    ))
    .entrySet().stream()
    .filter(entry -> entry.getValue() > 100)
    .map(Map.Entry::getKey)
    .collect(Collectors.toList());
```

### Example 2: Data Transformation

```java
// ✅ Transform data structure
List<User> users = getUsers();

// Convert to DTOs
List<UserDTO> dtos = users.stream()
    .map(user -> new UserDTO(
        user.getId(),
        user.getName(),
        user.getEmail()
    ))
    .collect(Collectors.toList());

// Group by department
Map<String, List<User>> byDepartment = users.stream()
    .collect(Collectors.groupingBy(User::getDepartment));

// Get statistics
IntSummaryStatistics stats = users.stream()
    .mapToInt(User::getAge)
    .summaryStatistics();
// stats.getAverage(), stats.getMax(), stats.getMin(), stats.getSum()
```

### Example 3: Complex Filtering

```java
// ✅ Complex filtering và transformation
List<Product> products = getProducts();

// Get discounted products with reviews > 4.5
List<ProductDTO> featured = products.stream()
    .filter(p -> p.getDiscount() > 0)
    .filter(p -> p.getAverageRating() > 4.5)
    .filter(p -> p.getStock() > 0)
    .sorted(Comparator.comparing(Product::getDiscount).reversed())
    .limit(10)
    .map(p -> new ProductDTO(
        p.getName(),
        p.getPrice() * (1 - p.getDiscount()),
        p.getAverageRating()
    ))
    .collect(Collectors.toList());
```

## Parallel Streams

```java
// ✅ Parallel processing cho large datasets
List<Integer> numbers = generateLargeList();

// Sequential
long sum1 = numbers.stream()
    .mapToLong(Integer::longValue)
    .sum();

// Parallel
long sum2 = numbers.parallelStream()
    .mapToLong(Integer::longValue)
    .sum();

// ⚠️ Lưu ý: Parallel streams không phải lúc nào cũng nhanh hơn
// Chỉ dùng khi:
// - Dataset lớn (> 10,000 elements)
// - Operations expensive
// - No shared mutable state
```

## Common Mistakes Tôi Đã Mắc

### 1. Reusing Stream

```java
// ❌ Stream chỉ dùng được một lần
Stream<String> stream = names.stream();
List<String> list = stream.collect(Collectors.toList());
List<String> list2 = stream.collect(Collectors.toList()); // IllegalStateException!

// ✅ Tạo stream mới mỗi lần
List<String> list = names.stream().collect(Collectors.toList());
List<String> list2 = names.stream().collect(Collectors.toList());
```

### 2. Forgetting Terminal Operation

```java
// ❌ Không có terminal operation - không execute
names.stream()
    .filter(n -> n.length() > 3)
    .map(String::toUpperCase);
// Không có gì xảy ra!

// ✅ Cần terminal operation
names.stream()
    .filter(n -> n.length() > 3)
    .map(String::toUpperCase)
    .collect(Collectors.toList());
```

### 3. Mutating State

```java
// ❌ Mutating external state trong stream
List<String> result = new ArrayList<>();
names.stream()
    .forEach(name -> result.add(name.toUpperCase())); // Side effect!

// ✅ Dùng collect thay vì forEach
List<String> result = names.stream()
    .map(String::toUpperCase)
    .collect(Collectors.toList());
```

## Takeaway Cho Sinh Viên

1. **Streams giúp code declarative hơn** - Nói "làm gì" thay vì "làm như thế nào"
2. **Lazy evaluation** - Chỉ execute khi cần
3. **Immutable** - Không thay đổi source collection
4. **Composable** - Có thể chain nhiều operations
5. **Practice với real data** - Áp dụng vào project thực tế

## Kết Luận

Streams API là một công cụ mạnh mẽ giúp code Java trở nên functional và dễ đọc hơn. Từ filtering, mapping đến complex data transformations, Streams giúp bạn viết code ngắn gọn và maintainable hơn.

**Thử thách:** Hãy refactor một đoạn code imperative của bạn thành Streams. Bạn sẽ thấy sự khác biệt!


