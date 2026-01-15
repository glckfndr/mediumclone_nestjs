// 1️⃣ CLASS DECORATOR - 1 аргумент
function ClassDecorator(constructor: Function) {
  console.log('\n1. CLASS DECORATOR');
  console.log('   Аргументів: 1');
  console.log('   - constructor:', constructor.name);
}

// 2️⃣ METHOD DECORATOR - 3 аргументи
function MethodDecorator(
  target: any, // прототип класу
  propertyKey: string, // назва методу
  descriptor: PropertyDescriptor, // дескриптор методу
) {
  console.log('\n2. METHOD DECORATOR');
  console.log('   Аргументів: 3');
  console.log('   - target:', target.constructor.name);
  console.log('   - propertyKey:', propertyKey);
  console.log('   - descriptor:', typeof descriptor);
}

// 3️⃣ PROPERTY DECORATOR - 2 аргументи
function PropertyDecorator(
  target: any, // прототип класу
  propertyKey: string, // назва властивості
) {
  console.log('\n3. PROPERTY DECORATOR');
  console.log('   Аргументів: 2');
  console.log('   - target:', target.constructor.name);
  console.log('   - propertyKey:', propertyKey);
}

// 4️⃣ PARAMETER DECORATOR - 3 аргументи
function ParameterDecorator(
  target: any, // прототип класу
  propertyKey: string, // назва методу
  parameterIndex: number, // індекс параметра
) {
  console.log('\n4. PARAMETER DECORATOR');
  console.log('   Аргументів: 3');
  console.log('   - target:', target.constructor.name);
  console.log('   - propertyKey:', propertyKey);
  console.log('   - parameterIndex:', parameterIndex);
}

// 5️⃣ ACCESSOR DECORATOR (getter/setter) - 3 аргументи
function AccessorDecorator(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  console.log('\n5. ACCESSOR DECORATOR');
  console.log('   Аргументів: 3');
  console.log('   - target:', target.constructor.name);
  console.log('   - propertyKey:', propertyKey);
  console.log('   - descriptor:', typeof descriptor);
}

// Використання всіх типів декораторів
@ClassDecorator
class MyClass {
  @PropertyDecorator
  name: string = 'John';

  @PropertyDecorator
  age: number = 25;

  private _email: string = '';

  @AccessorDecorator
  get email() {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  @MethodDecorator
  greet(@ParameterDecorator message: string) {
    console.log(`${this.name} says: ${message}`);
  }
}

console.log('\n========================================');
console.log('Всі декоратори виконалися!');
console.log('========================================\n');

const instance = new MyClass();
instance.greet('Hello!');
