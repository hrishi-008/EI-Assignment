// Product Interface
interface Vehicle {
    drive(): void;
  }
  
  // Concrete Products
  class Car implements Vehicle {
    drive(): void {
      console.log("Driving a car!");
    }
  }
  
  class Bike implements Vehicle {
    drive(): void {
      console.log("Riding a bike!");
    }
  }
  
  // Creator (Factory Method)
  abstract class VehicleFactory {
    abstract createVehicle(): Vehicle;
  
    public operateVehicle(): void {
      const vehicle = this.createVehicle();
      vehicle.drive();
    }
  }
  
  // Concrete Factories
  class CarFactory extends VehicleFactory {
    createVehicle(): Vehicle {
      return new Car();
    }
  }
  
  class BikeFactory extends VehicleFactory {
    createVehicle(): Vehicle {
      return new Bike();
    }
  }
  
  // Usage
  const carFactory = new CarFactory();
  carFactory.operateVehicle(); // Output: Driving a car!
  
  const bikeFactory = new BikeFactory();
  bikeFactory.operateVehicle(); // Output: Riding a bike!
  