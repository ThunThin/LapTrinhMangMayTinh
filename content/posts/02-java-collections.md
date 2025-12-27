---
title: "Java Collections: Từ Confusion Đến Mastery"
date: 2024-12-16
tags: ["Java", "Collections", "Data Structures", "Practice"]
categories: ["Java"]
summary: "ArrayList hay LinkedList? HashMap hay TreeMap? Bài viết này chia sẻ cách mình đã học Collections Framework một cách có hệ thống và áp dụng vào thực tế."
draft: false
---

## Vấn Đề Ban Đầu: Quá Nhiều Lựa Chọn!

Khi mới học Java Collections, tôi cảm thấy choáng ngợp:
- ArrayList vs LinkedList vs Vector?
- HashMap vs TreeMap vs LinkedHashMap?
- Set vs List vs Queue?

Tôi đã từng dùng `ArrayList` cho mọi thứ vì "nó hoạt động được". Nhưng đó là cách làm sai!

## Cách Tôi Đã Học Collections Framework

### Bước 1: Hiểu Cấu Trúc Phân Cấp

Thay vì học từng class riêng lẻ, tôi học theo hierarchy:

```
Collection
├── List (có thứ tự, cho phép duplicate)
│   ├── ArrayList (truy cập nhanh, thêm/xóa chậm ở giữa)
│   ├── LinkedList (thêm/xóa nhanh, truy cập chậm)
│   └── Vector (thread-safe nhưng deprecated)
│
├── Set (không có thứ tự, không duplicate)
│   ├── HashSet (nhanh nhất, không có thứ tự)
│   ├── LinkedHashSet (giữ thứ tự insert)
│   └── TreeSet (có thứ tự, chậm hơn)
│
└── Queue (FIFO)
    └── PriorityQueue

Map (không extends Collection)
├── HashMap (nhanh nhất, không có thứ tự)
├── LinkedHashMap (giữ thứ tự insert)
└── TreeMap (có thứ tự, chậm hơn)
```

### Bước 2: Học Khi Nào Dùng Cái Gì

Tôi tự đặt câu hỏi trước khi chọn:

**Câu hỏi 1:** Có cần thứ tự không?
- Có → List hoặc LinkedHashSet/LinkedHashMap
- Không → HashSet/HashMap

**Câu hỏi 2:** Có cần duplicate không?
- Có → List
- Không → Set

**Câu hỏi 3:** Thao tác nào nhiều nhất?
- Truy cập theo index → ArrayList
- Thêm/xóa ở đầu/cuối → LinkedList
- Tìm kiếm nhanh → HashMap/HashSet

## Ví Dụ Thực Tế: Hệ Thống Quản Lý Đơn Hàng

### Scenario 1: Lưu Danh Sách Sản Phẩm

```java
// ✅ Dùng ArrayList vì:
// - Cần thứ tự (hiển thị theo thứ tự thêm vào)
// - Có thể duplicate (cùng sản phẩm mua nhiều lần)
// - Truy cập theo index để hiển thị

List<Product> products = new ArrayList<>();
products.add(new Product("Laptop", 15000000));
products.add(new Product("Mouse", 500000));
products.add(new Product("Laptop", 15000000)); // Duplicate OK

// Hiển thị
for (int i = 0; i < products.size(); i++) {
    System.out.println((i + 1) + ". " + products.get(i));
}
```

### Scenario 2: Lưu Danh Sách ID Đã Xem

```java
// ✅ Dùng HashSet vì:
// - Không cần thứ tự
// - Không cho duplicate (xem rồi không cần lưu lại)
// - Tìm kiếm nhanh O(1)

Set<String> viewedProductIds = new HashSet<>();
viewedProductIds.add("P001");
viewedProductIds.add("P002");
viewedProductIds.add("P001"); // Bị bỏ qua

// Kiểm tra đã xem chưa
if (viewedProductIds.contains("P001")) {
    System.out.println("Đã xem sản phẩm này");
}
```

### Scenario 3: Lưu Thông Tin Sản Phẩm Theo ID

```java
// ✅ Dùng HashMap vì:
// - Cần ánh xạ ID → Product
// - Tìm kiếm nhanh O(1)
// - Không cần thứ tự

Map<String, Product> productMap = new HashMap<>();
productMap.put("P001", new Product("Laptop", 15000000));
productMap.put("P002", new Product("Mouse", 500000));

// Tìm sản phẩm theo ID
Product laptop = productMap.get("P001");
if (laptop != null) {
    System.out.println("Tìm thấy: " + laptop.getName());
}
```

### Scenario 4: Hiển Thị Sản Phẩm Theo Giá Tăng Dần

```java
// ✅ Dùng TreeMap vì:
// - Cần thứ tự (theo giá)
// - Tự động sắp xếp

Map<Double, Product> productsByPrice = new TreeMap<>();
productsByPrice.put(15000000.0, new Product("Laptop", 15000000));
productsByPrice.put(500000.0, new Product("Mouse", 500000));
productsByPrice.put(2000000.0, new Product("Keyboard", 2000000));

// Tự động sắp xếp theo giá tăng dần
for (Map.Entry<Double, Product> entry : productsByPrice.entrySet()) {
    System.out.println(entry.getValue().getName() + ": " + entry.getKey());
}
// Output:
// Mouse: 500000.0
// Keyboard: 2000000.0
// Laptop: 15000000.0
```

## Những Sai Lầm Tôi Đã Mắc Phải

### 1. Dùng ArrayList Cho Mọi Thứ

```java
// ❌ Sai: Dùng ArrayList để tìm kiếm
List<Product> products = new ArrayList<>();
// ... thêm 1000 sản phẩm

// Tìm sản phẩm theo ID - O(n) - CHẬM!
for (Product p : products) {
    if (p.getId().equals("P001")) {
        return p;
    }
}

// ✅ Đúng: Dùng HashMap - O(1) - NHANH!
Map<String, Product> productMap = new HashMap<>();
Product p = productMap.get("P001");
```

### 2. Không Hiểu Time Complexity

Tôi không biết tại sao `ArrayList.get(index)` nhanh nhưng `LinkedList.get(index)` chậm. Sau khi học về Big O, tôi hiểu:

- `ArrayList.get(index)`: O(1) - truy cập trực tiếp
- `LinkedList.get(index)`: O(n) - phải duyệt từ đầu

### 3. Dùng Vector Thay Vì ArrayList

```java
// ❌ Vector là synchronized (thread-safe) nhưng deprecated
Vector<String> vec = new Vector<>();

// ✅ Dùng ArrayList, nếu cần thread-safe thì dùng Collections.synchronizedList()
List<String> list = new ArrayList<>();
List<String> syncList = Collections.synchronizedList(list);
```

## Best Practices Tôi Đã Học

### 1. Luôn Khai Báo Interface, Không Phải Implementation

```java
// ✅ Đúng
List<String> list = new ArrayList<>();
Map<String, Integer> map = new HashMap<>();

// ❌ Sai
ArrayList<String> list = new ArrayList<>();
HashMap<String, Integer> map = new HashMap<>();
```

**Lý do:** Dễ thay đổi implementation sau này.

### 2. Sử Dụng Diamond Operator (Java 7+)

```java
// ✅ Đúng - Java 7+
List<String> list = new ArrayList<>();

// ❌ Dài dòng
List<String> list = new ArrayList<String>();
```

### 3. Sử Dụng Enhanced For Loop

```java
// ✅ Đúng - đơn giản, dễ đọc
for (Product p : products) {
    System.out.println(p);
}

// ❌ Phức tạp không cần thiết
for (int i = 0; i < products.size(); i++) {
    System.out.println(products.get(i));
}
```

## Takeaway Cho Sinh Viên

1. **Học Time Complexity** - Hiểu Big O notation giúp chọn đúng collection
2. **Làm nhiều bài tập** - Practice với các scenario khác nhau
3. **Đọc JavaDoc** - Hiểu rõ behavior của mỗi method
4. **Profile code** - Đo performance để biết collection nào phù hợp

## Kết Luận

Collections Framework là một trong những phần quan trọng nhất của Java. Hiểu rõ khi nào dùng cái gì sẽ giúp bạn viết code hiệu quả và performant hơn. Đừng như tôi lúc đầu - dùng ArrayList cho mọi thứ!

**Thử thách:** Hãy refactor một project cũ của bạn, thay thế các collection không phù hợp bằng collection đúng. Bạn sẽ thấy sự khác biệt!



