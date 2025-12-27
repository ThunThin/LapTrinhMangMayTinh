---
title: "Java Multithreading: Hiểu Concurrency Và Parallelism"
date: 2024-12-28
tags: ["Java", "Multithreading", "Concurrency", "Threads", "Advanced"]
categories: ["Java"]
summary: "Multithreading là một trong những chủ đề khó nhất của Java. Bài viết này chia sẻ cách mình đã học từ basic threads đến ExecutorService và concurrent collections."
draft: false
---

## Tại Sao Cần Multithreading?

Khi viết ứng dụng, có những tác vụ tốn thời gian:
- Đọc file lớn
- Gọi API
- Xử lý hình ảnh
- Tính toán phức tạp

Nếu làm tuần tự, ứng dụng sẽ bị "đơ". Multithreading giúp thực hiện nhiều tác vụ cùng lúc.

## Thread Basics

### Tạo Thread

```java
// ✅ Cách 1: Extend Thread class
class MyThread extends Thread {
    @Override
    public void run() {
        System.out.println("Thread running: " + Thread.currentThread().getName());
    }
}

MyThread thread = new MyThread();
thread.start(); // Bắt đầu thread mới

// ✅ Cách 2: Implement Runnable interface (Recommended)
class MyRunnable implements Runnable {
    @Override
    public void run() {
        System.out.println("Thread running: " + Thread.currentThread().getName());
    }
}

Thread thread = new Thread(new MyRunnable());
thread.start();

// ✅ Cách 3: Lambda expression
Thread thread = new Thread(() -> {
    System.out.println("Thread running: " + Thread.currentThread().getName());
});
thread.start();
```

### Thread States

```java
// Thread có các states:
// NEW - Thread được tạo nhưng chưa start
// RUNNABLE - Thread đang chạy hoặc sẵn sàng chạy
// BLOCKED - Thread đang chờ monitor lock
// WAITING - Thread đang chờ không giới hạn
// TIMED_WAITING - Thread đang chờ có giới hạn thời gian
// TERMINATED - Thread đã kết thúc

Thread thread = new Thread(() -> {
    // Do work
});
System.out.println(thread.getState()); // NEW

thread.start();
System.out.println(thread.getState()); // RUNNABLE

thread.join(); // Chờ thread kết thúc
System.out.println(thread.getState()); // TERMINATED
```

## Synchronization

### Vấn Đề: Race Condition

```java
// ❌ Race condition - kết quả không đúng
class Counter {
    private int count = 0;
    
    public void increment() {
        count++; // Not atomic!
    }
    
    public int getCount() {
        return count;
    }
}

// Nhiều threads cùng increment → kết quả sai
Counter counter = new Counter();
Thread t1 = new Thread(() -> {
    for (int i = 0; i < 1000; i++) {
        counter.increment();
    }
});
Thread t2 = new Thread(() -> {
    for (int i = 0; i < 1000; i++) {
        counter.increment();
    }
});

t1.start();
t2.start();
t1.join();
t2.join();

System.out.println(counter.getCount()); // Có thể không phải 2000!
```

### Synchronized Methods

```java
// ✅ Synchronized method - chỉ một thread được chạy tại một thời điểm
class Counter {
    private int count = 0;
    
    public synchronized void increment() {
        count++;
    }
    
    public synchronized int getCount() {
        return count;
    }
}
```

### Synchronized Blocks

```java
// ✅ Synchronized block - lock một phần code
class Counter {
    private int count = 0;
    private final Object lock = new Object();
    
    public void increment() {
        synchronized (lock) {
            count++;
        }
    }
    
    public int getCount() {
        synchronized (lock) {
            return count;
        }
    }
}
```

### Volatile Keyword

```java
// ✅ Volatile - đảm bảo visibility giữa threads
class SharedData {
    private volatile boolean flag = false;
    
    public void setFlag(boolean value) {
        this.flag = value; // Changes visible to all threads immediately
    }
    
    public boolean getFlag() {
        return flag; // Always reads latest value
    }
}
```

## ExecutorService - Modern Approach

### ThreadPool

```java
// ✅ ExecutorService - quản lý thread pool
ExecutorService executor = Executors.newFixedThreadPool(5);

// Submit tasks
Future<String> future = executor.submit(() -> {
    Thread.sleep(1000);
    return "Task completed";
});

// Get result
try {
    String result = future.get(); // Blocking call
    System.out.println(result);
} catch (InterruptedException | ExecutionException e) {
    e.printStackTrace();
}

// Shutdown
executor.shutdown();
executor.awaitTermination(60, TimeUnit.SECONDS);
```

### Different Thread Pools

```java
// ✅ Fixed thread pool
ExecutorService fixedPool = Executors.newFixedThreadPool(10);

// ✅ Cached thread pool - tự động tạo threads khi cần
ExecutorService cachedPool = Executors.newCachedThreadPool();

// ✅ Single thread executor - chỉ một thread
ExecutorService singleThread = Executors.newSingleThreadExecutor();

// ✅ Scheduled executor - chạy định kỳ
ScheduledExecutorService scheduled = Executors.newScheduledThreadPool(5);
scheduled.schedule(() -> {
    System.out.println("Task executed");
}, 5, TimeUnit.SECONDS);

scheduled.scheduleAtFixedRate(() -> {
    System.out.println("Repeated task");
}, 0, 1, TimeUnit.SECONDS);
```

## Concurrent Collections

### ConcurrentHashMap

```java
// ✅ Thread-safe HashMap
ConcurrentHashMap<String, Integer> map = new ConcurrentHashMap<>();

// Multiple threads có thể đọc/ghi an toàn
map.put("key1", 1);
map.put("key2", 2);

Integer value = map.get("key1"); // Thread-safe

// Atomic operations
map.compute("key1", (k, v) -> v == null ? 1 : v + 1);
```

### BlockingQueue

```java
// ✅ Thread-safe queue với blocking operations
BlockingQueue<String> queue = new LinkedBlockingQueue<>();

// Producer thread
new Thread(() -> {
    try {
        queue.put("Item 1");
        queue.put("Item 2");
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
}).start();

// Consumer thread
new Thread(() -> {
    try {
        String item = queue.take(); // Blocking - chờ đến khi có item
        System.out.println("Consumed: " + item);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
}).start();
```

### CountDownLatch

```java
// ✅ Đợi nhiều threads hoàn thành
CountDownLatch latch = new CountDownLatch(3);

for (int i = 0; i < 3; i++) {
    new Thread(() -> {
        // Do work
        latch.countDown(); // Giảm count
    }).start();
}

latch.await(); // Chờ đến khi count = 0
System.out.println("All threads completed");
```

## CompletableFuture - Modern Async

```java
// ✅ CompletableFuture - modern async programming
CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
    return "Hello";
});

future.thenApply(s -> s + " World")
      .thenAccept(System.out::println);

// Chaining
CompletableFuture.supplyAsync(() -> fetchUser(1))
    .thenApply(user -> processUser(user))
    .thenCompose(processed -> saveUser(processed))
    .thenAccept(saved -> System.out.println("Saved: " + saved))
    .exceptionally(throwable -> {
        System.err.println("Error: " + throwable.getMessage());
        return null;
    });
```

## Common Mistakes Tôi Đã Mắc

### 1. Deadlock

```java
// ❌ Deadlock - hai threads chờ nhau
Thread t1 = new Thread(() -> {
    synchronized (lock1) {
        synchronized (lock2) {
            // Do work
        }
    }
});

Thread t2 = new Thread(() -> {
    synchronized (lock2) {
        synchronized (lock1) { // Deadlock!
            // Do work
        }
    }
});

// ✅ Luôn lock theo cùng một thứ tự
Thread t1 = new Thread(() -> {
    synchronized (lock1) {
        synchronized (lock2) {
            // Do work
        }
    }
});

Thread t2 = new Thread(() -> {
    synchronized (lock1) { // Cùng thứ tự
        synchronized (lock2) {
            // Do work
        }
    }
});
```

### 2. Shared Mutable State

```java
// ❌ Shared mutable state - không thread-safe
class Counter {
    public int count = 0; // Public mutable field!
}

// ✅ Immutable hoặc synchronized
class Counter {
    private int count = 0;
    
    public synchronized void increment() {
        count++;
    }
}
```

## Takeaway Cho Sinh Viên

1. **Hiểu thread lifecycle** - NEW, RUNNABLE, BLOCKED, TERMINATED
2. **Synchronization quan trọng** - Tránh race conditions
3. **Dùng ExecutorService** - Quản lý threads tốt hơn
4. **Concurrent collections** - Thread-safe alternatives
5. **Practice với real scenarios** - File processing, API calls

## Kết Luận

Multithreading là một chủ đề phức tạp nhưng quan trọng trong Java. Hiểu rõ threads, synchronization, và concurrent collections sẽ giúp bạn viết ứng dụng hiệu quả và thread-safe.

**Thử thách:** Hãy tạo một ứng dụng đọc nhiều file song song và tổng hợp kết quả. Đây là cách tốt nhất để practice multithreading!


