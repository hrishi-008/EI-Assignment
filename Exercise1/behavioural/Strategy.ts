// Strategy interface
interface PaymentStrategy {
    pay(amount: number): void;
  }
  
  // Concrete Strategies
  class CreditCardPayment implements PaymentStrategy {
    pay(amount: number): void {
      console.log(`Paid ${amount} using Credit Card`);
    }
  }
  
  class PayPalPayment implements PaymentStrategy {
    pay(amount: number): void {
      console.log(`Paid ${amount} using PayPal`);
    }
  }
  
  class BitcoinPayment implements PaymentStrategy {
    pay(amount: number): void {
      console.log(`Paid ${amount} using Bitcoin`);
    }
  }
  
  // Context (Payment system)
  class PaymentSystem {
    private strategy: PaymentStrategy;
  
    constructor(strategy: PaymentStrategy) {
      this.strategy = strategy;
    }
  
    public setStrategy(strategy: PaymentStrategy): void {
      this.strategy = strategy;
    }
  
    public checkout(amount: number): void {
      this.strategy.pay(amount);
    }
  }
  
  // Usage
  const payment = new PaymentSystem(new CreditCardPayment());
  payment.checkout(100); // Paid 100 using Credit Card
  
  payment.setStrategy(new PayPalPayment());
  payment.checkout(200); // Paid 200 using PayPal
  
  payment.setStrategy(new BitcoinPayment());
  payment.checkout(300); // Paid 300 using Bitcoin
  