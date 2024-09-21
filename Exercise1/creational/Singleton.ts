// Singleton Class
class Logger {
    private static instance: Logger;
  
    private constructor() {} // private constructor to prevent direct instantiation
  
    public static getInstance(): Logger {
      if (!Logger.instance) {
        Logger.instance = new Logger();
        console.log("New Logger instance created.");
      }
      return Logger.instance;
    }
  
    public log(message: string): void {
      console.log(`Log: ${message}`);
    }
  }
  
  // Usage
  const logger1 = Logger.getInstance();
  logger1.log("First log entry.");
  
  const logger2 = Logger.getInstance();
  logger2.log("Second log entry.");
  
  // Check if both logger1 and logger2 are the same instance
  console.log(logger1 === logger2); // Output: true
  