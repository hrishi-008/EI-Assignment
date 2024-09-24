
# Design Patterns in TypeScript

This repository demonstrates several **Design Patterns** implemented in **TypeScript**. Each design pattern is categorized into one of three types: **Creational**, **Structural**, and **Behavioral**.

## Project Structure

The project is organized into subfolders, with each folder containing TypeScript files that demonstrate specific design patterns.

```
.
├── behavioural/
│   ├── observer.ts
│   └── strategy.ts
├── creational/
│   ├── factory-method.ts
│   └── singleton.ts
├── structural/
│   ├── adapter.ts
│   └── decorator.ts
└── README.md
```

### 1. **Behavioral Design Patterns**

These patterns focus on communication between objects and how they interact.

- **Observer Pattern (`observer.ts`)**: 
  - The Observer pattern defines a subscription mechanism to allow multiple objects (observers) to listen to an event and respond when the subject changes its state. This pattern is ideal for event-driven systems like notifications.
  
- **Strategy Pattern (`strategy.ts`)**: 
  - The Strategy pattern allows selecting algorithms at runtime. Instead of implementing a single algorithm directly, code receives run-time instructions on which in a family of algorithms to use.

### 2. **Creational Design Patterns**

These patterns deal with object creation mechanisms, trying to create objects in a manner suitable for the situation.

- **Factory Method (`factory-method.ts`)**:
  - The Factory Method pattern defines an interface for creating objects, but allows subclasses to alter the type of objects that will be created, decoupling the instantiation process from the client.

- **Singleton Pattern (`singleton.ts`)**:
  - The Singleton pattern ensures that a class has only one instance and provides a global point of access to it. Useful when only one object of a particular class is needed to coordinate actions.

### 3. **Structural Design Patterns**

These patterns focus on how objects are composed and how they can form larger structures.

- **Adapter Pattern (`adapter.ts`)**:
  - The Adapter pattern allows two incompatible interfaces to work together by acting as a bridge. It translates one interface into another that a client expects.

- **Decorator Pattern (`decorator.ts`)**:
  - The Decorator pattern allows behavior to be added to individual objects, either statically or dynamically, without affecting the behavior of other objects from the same class. It’s often used to modify classes in a flexible and scalable way.

## How to Run the Code

1. Install TypeScript (if you haven't already):

   ```bash
   npm install typescript --save-dev
   ```

2. Compile the TypeScript files:

   ```bash
   npx tsc <file-name.ts>
   ```

   For example, to compile the `observer.ts` file:

   ```bash
   npx tsc behavioural/observer.ts
   ```

3. Run the compiled JavaScript:

   ```bash
   node behavioural/observer.js
   ```

4. You can follow the same steps to compile and run the other TypeScript files.

## Contributing

If you’d like to contribute to this repository, feel free to fork the project and submit a pull request!

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
