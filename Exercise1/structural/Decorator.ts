// Component Interface
interface Coffee {
    cost(): number;
    description(): string;
  }
  
  // Concrete Component
  class SimpleCoffee implements Coffee {
    cost(): number {
      return 5;
    }
  
    description(): string {
      return "Simple Coffee";
    }
  }
  
  // Decorator (Base Class for Add-ons)
  abstract class CoffeeDecorator implements Coffee {
    protected coffee: Coffee;
  
    constructor(coffee: Coffee) {
      this.coffee = coffee;
    }
  
    abstract cost(): number;
    abstract description(): string;
  }
  
  // Concrete Decorators
  class MilkDecorator extends CoffeeDecorator {
    cost(): number {
      return this.coffee.cost() + 2;
    }
  
    description(): string {
      return this.coffee.description() + ", Milk";
    }
  }
  
  class SugarDecorator extends CoffeeDecorator {
    cost(): number {
      return this.coffee.cost() + 1;
    }
  
    description(): string {
      return this.coffee.description() + ", Sugar";
    }
  }
  
  // Client Code
  let myCoffee: Coffee = new SimpleCoffee();
  console.log(myCoffee.description() + ": $" + myCoffee.cost()); // Output: Simple Coffee: $5
  
  // Add milk
  myCoffee = new MilkDecorator(myCoffee);
  console.log(myCoffee.description() + ": $" + myCoffee.cost()); // Output: Simple Coffee, Milk: $7
  
  // Add sugar
  myCoffee = new SugarDecorator(myCoffee);
  console.log(myCoffee.description() + ": $" + myCoffee.cost()); // Output: Simple Coffee, Milk, Sugar: $8
  