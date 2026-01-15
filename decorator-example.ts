// Зберігаємо метадані про те, які параметри треба обгорнути
const greetingMetadata: Map<string, Set<number>> = new Map();

// Декоратор параметра - ставиться ПЕРЕД формальним аргументом
function AddGreeting(target: any, propertyKey: string, parameterIndex: number) {
  console.log(`\n🔹 @AddGreeting (parameter decorator):`);
  console.log(`   propertyKey (назва методу): "${propertyKey}"`);
  console.log(`   parameterIndex (індекс параметра): ${parameterIndex}`);

  const key = propertyKey;
  if (!greetingMetadata.has(key)) {
    greetingMetadata.set(key, new Set());
  }
  greetingMetadata.get(key)!.add(parameterIndex);
}

// Декоратор методу - обробляє позначені параметри
function ProcessGreeting(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  console.log(`\n🔸 @ProcessGreeting (method decorator):`);
  console.log(`   propertyKey (назва методу): "${propertyKey}"`);

  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    console.log(`\n   ⚡ descriptor.value викликається! args:`, args);

    const indexes = greetingMetadata.get(propertyKey);

    if (indexes) {
      // Модифікуємо тільки позначені параметри
      args = args.map((arg, index) => {
        if (indexes.has(index) && typeof arg === 'string') {
          console.log(
            `      Модифікуємо arg[${index}]: "${arg}" -> "Hello, ${arg}!"`,
          );
          return `Hello, ${arg}!`; // Додаємо Hello, і !
        }
        return arg;
      });
    }

    console.log(`      Викликаємо оригінальний метод з args:`, args);
    // Викликаємо оригінальний метод з модифікованими аргументами
    return originalMethod.apply(this, args);
  };

  return descriptor;
}

// Клас з методами
class Greeter {
  @ProcessGreeting
  greet(@AddGreeting name: string) {
    //     ↑ декоратор ПЕРЕД формальним аргументом
    // Метод просто друкує те, що отримав
    console.log(name);
  }

  @ProcessGreeting
  greetTwo(@AddGreeting firstName: string, @AddGreeting lastName: string) {
    //       ↑ декоратори ПЕРЕД кожним аргументом
    console.log(firstName);
    console.log(lastName);
  }

  @ProcessGreeting
  greetMixed(@AddGreeting name: string, age: number) {
    //         ↑ тільки name має декоратор
    console.log(`${name}, Age: ${age}`);
  }
}

// Тестуємо
console.log('\n=== Тест 1: один параметр ===');
const greeter = new Greeter();
greeter.greet('John');
// Виведе: Hello, John!

console.log("\n=== Тест 2: інше ім'я ===");
greeter.greet('Maria');
// Виведе: Hello, Maria!

console.log('\n=== Тест 3: два параметри з декораторами ===');
greeter.greetTwo('John', 'Doe');
// Виведе:
// Hello, John!
// Hello, Doe!

console.log('\n=== Тест 4: мікс (тільки перший параметр з декоратором) ===');
greeter.greetMixed('Alice', 25);
// Виведе: Hello, Alice!, Age: 25
