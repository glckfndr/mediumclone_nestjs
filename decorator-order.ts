// Декоратори з нумерацією для відстеження порядку
let counter = 0;

// Parameter decorator
function ParamDec(name: string) {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    console.log(
      `${++counter}. Parameter decorator @${name} - метод: ${propertyKey}, параметр: ${parameterIndex}`,
    );
  };
}

// Method decorator
function MethodDec(name: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    console.log(
      `${++counter}. Method decorator @${name} - метод: ${propertyKey}`,
    );
    return descriptor;
  };
}

// Class decorator
function ClassDec(name: string) {
  return function (constructor: Function) {
    console.log(
      `${++counter}. Class decorator @${name} - клас: ${constructor.name}`,
    );
  };
}

// Тестовий клас
@ClassDec('ClassDecorator')
class TestClass {
  @MethodDec('Method1')
  method1(@ParamDec('Param1-0') a: string, @ParamDec('Param1-1') b: string) {
    console.log('method1 виконується');
  }

  @MethodDec('Method2')
  method2(@ParamDec('Param2-0') x: number) {
    console.log('method2 виконується');
  }
}

console.log('\n=== Декоратори виконалися при завантаженні класу ===\n');
console.log('Тепер викликаємо методи:\n');

const instance = new TestClass();
instance.method1('hello', 'world');
instance.method2(42);
