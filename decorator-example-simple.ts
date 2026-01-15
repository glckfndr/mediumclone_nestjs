// Один method decorator - модифікує ВСІ string параметри
function AddGreeting(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    // Модифікуємо всі string аргументи автоматично
    const modifiedArgs = args.map((arg) => {
      if (typeof arg === 'string') {
        return `Hello, ${arg}!`;
      }
      return arg;
    });

    return originalMethod.apply(this, modifiedArgs);
  };

  return descriptor;
}

// Клас з методами
class Greeter {
  @AddGreeting // ← Тільки ОДИН декоратор!
  greet(name: string) {
    console.log(name);
  }

  @AddGreeting // ← Тільки ОДИН декоратор!
  greetTwo(firstName: string, lastName: string) {
    console.log(firstName);
    console.log(lastName);
  }
}

// Тестуємо
console.log('=== Один декоратор ===');
const greeter = new Greeter();
greeter.greet('John');
// Виведе: Hello, John!

console.log('\n=== Два параметри ===');
greeter.greetTwo('John', 'Doe');
// Виведе:
// Hello, John!
// Hello, Doe!
