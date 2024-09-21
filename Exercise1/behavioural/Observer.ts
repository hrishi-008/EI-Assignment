// Subject (Weather Station)
interface Subject {
    attach(observer: Observer): void;
    detach(observer: Observer): void;
    notify(): void;
  }
  
  // Observer
  interface Observer {
    update(temperature: number, humidity: number): void;
  }
  
  // Concrete Subject (Weather Station)
  class WeatherStation implements Subject {
    private observers: Observer[] = [];
    private temperature: number = 0;
    private humidity: number = 0;
  
    public attach(observer: Observer): void {
      this.observers.push(observer);
    }
  
    public detach(observer: Observer): void {
      this.observers = this.observers.filter((obs) => obs !== observer);
    }
  
    public notify(): void {
      for (const observer of this.observers) {
        observer.update(this.temperature, this.humidity);
      }
    }
  
    public setWeatherData(temp: number, humidity: number): void {
      this.temperature = temp;
      this.humidity = humidity;
      this.notify();
    }
  }
  
  // Concrete Observers (Display Boards)
  class TemperatureDisplay implements Observer {
    update(temperature: number): void {
      console.log(`Temperature Display: Temperature is now ${temperature}°C`);
    }
  }
  
  class HumidityDisplay implements Observer {
    update(_: number, humidity: number): void {
      console.log(`Humidity Display: Humidity is now ${humidity}%`);
    }
  }
  
  // Usage
  const weatherStation = new WeatherStation();
  
  const tempDisplay = new TemperatureDisplay();
  const humidityDisplay = new HumidityDisplay();
  
  weatherStation.attach(tempDisplay);
  weatherStation.attach(humidityDisplay);
  
  weatherStation.setWeatherData(25, 70); // Both displays get updated
  weatherStation.setWeatherData(30, 60); // Both displays get updated again
  