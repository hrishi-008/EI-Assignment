import * as readline from "readline";

class OfficeFacility {
  private static instance: OfficeFacility;
  private rooms: Map<string, Room> = new Map();

  private constructor() {}

  public static getInstance(): OfficeFacility {
    if (!OfficeFacility.instance) {
      OfficeFacility.instance = new OfficeFacility();
    }
    return OfficeFacility.instance;
  }

  public configureRooms(roomCount: number): string {
    this.rooms.clear();
    for (let i = 1; i <= roomCount; i++) {
      const roomName = `Room ${i}`;
      this.rooms.set(roomName, new Room(roomName));
    }
    return `Office configured with ${roomCount} meeting rooms: ${Array.from(
      this.rooms.keys()
    ).join(", ")}.`;
  }

  public setRoomCapacity(roomName: string, capacity: number): string {
    const room = this.rooms.get(roomName);
    if (room && capacity > 0) {
      room.maxCapacity = capacity;
      return `${roomName} maximum capacity set to ${capacity}.`;
    }
    return "Invalid room name or capacity.";
  }

  public getRoom(roomName: string): Room | undefined {
    return this.rooms.get(roomName);
  }

  public getAllRooms(): Room[] {
    return Array.from(this.rooms.values());
  }
}

class RoomStatistics {
  public totalBookings: number = 0;
  public totalOccupancyTime: number = 0; // in minutes
  public totalBookingTime: number = 0; // in minutes

  public addBooking(duration: number): void {
    this.totalBookings++;
    this.totalBookingTime += duration;
  }

  public addOccupancyTime(duration: number): void {
    this.totalOccupancyTime += duration;
  }
}

class Room {
  public maxCapacity: number = 10;
  private _currentOccupancy: number = 0;
  private _isOccupied: boolean = false;
  private _acOn: boolean = false;
  private _lightsOn: boolean = false;
  private _bookings: Booking[] = [];
  private observers: Observer[] = [];
  private lastOccupiedTime: Date | null = null;
  private lastStatusChangeTime: Date = new Date();
  public statistics: RoomStatistics = new RoomStatistics();

  constructor(public name: string) {}

  get isOccupied(): boolean {
    return this._isOccupied;
  }

  get bookings(): ReadonlyArray<Booking> {
    return this._bookings;
  }

  public addOccupants(count: number): string {
    const currentTime = new Date();
    if (this._isOccupied) {
      this.statistics.addOccupancyTime(
        (currentTime.getTime() - this.lastStatusChangeTime.getTime()) / 60000
      );
    }

    this._currentOccupancy += count;
    if (this._currentOccupancy >= 2 && !this._isOccupied) {
      this._isOccupied = true;
      this.lastOccupiedTime = currentTime;
      this.lastStatusChangeTime = currentTime;
      this.notifyObservers();
    } else if (this._currentOccupancy < 2 && this._isOccupied) {
      this._isOccupied = false;
      this.lastOccupiedTime = null;
      this.lastStatusChangeTime = currentTime;
      this.notifyObservers();
    }

    return `${this.name} is now ${
      this._isOccupied ? "occupied" : "unoccupied"
    } by ${this._currentOccupancy} persons. AC and lights turned ${
      this._isOccupied ? "on" : "off"
    }.`;
  }

  public checkAndReleaseBooking(): string | null {
    if (!this._isOccupied && this.lastOccupiedTime) {
      const timeDiff =
        (new Date().getTime() - this.lastOccupiedTime.getTime()) / 60000;
      if (timeDiff > 5) {
        if (this._bookings.length > 0) {
          this._bookings.shift();
          this.lastOccupiedTime = null;
          return `Room ${this.name} is now unoccupied. Booking released. AC and lights off.`;
        }
      }
    }
    return null;
  }

  public addBooking(startTime: Date, duration: number): boolean {
    if (this.isTimeSlotAvailable(startTime, duration)) {
      const booking = new Booking(this, startTime, duration);
      this._bookings.push(booking);
      this.statistics.addBooking(duration);
      return true;
    }
    return false;
  }

  public removeLastBooking(): Booking | undefined {
    return this._bookings.pop();
  }

  private isTimeSlotAvailable(startTime: Date, duration: number): boolean {
    const endTime = new Date(startTime.getTime() + duration * 60000);
    return !this._bookings.some(
      (booking) => startTime < booking.endTime && endTime > booking.startTime
    );
  }

  public addObserver(observer: Observer): void {
    this.observers.push(observer);
  }

  private notifyObservers(): void {
    this.observers.forEach((observer) => observer.update(this));
  }

  public getStatistics(): string {
    return `Room ${this.name} Statistics:
  Total Bookings: ${this.statistics.totalBookings}
  Total Occupancy Time: ${this.statistics.totalOccupancyTime.toFixed(2)} minutes
  Total Booking Time: ${this.statistics.totalBookingTime} minutes`;
  }
}

interface Observer {
  update(room: Room): void;
}

class ACController implements Observer {
  update(room: Room): void {
    console.log(`AC in ${room.name} turned ${room.isOccupied ? "on" : "off"}`);
  }
}

class LightController implements Observer {
  update(room: Room): void {
    console.log(
      `Lights in ${room.name} turned ${room.isOccupied ? "on" : "off"}`
    );
  }
}

class Booking {
  constructor(
    public room: Room,
    public startTime: Date,
    public duration: number
  ) {}

  public get endTime(): Date {
    return new Date(this.startTime.getTime() + this.duration * 60000);
  }
}

class BookingSystem {
  private office: OfficeFacility = OfficeFacility.getInstance();

  constructor() {
    this.startAutoReleaseInterval();
  }

  public bookRoom(roomName: string, startTime: Date, duration: number): string {
    const room = this.office.getRoom(roomName);
    if (room) {
      if (room.addBooking(startTime, duration)) {
        return `${roomName} booked from ${startTime.toLocaleTimeString()} for ${duration} minutes.`;
      } else {
        return `${roomName} is already booked during this time. Cannot book.`;
      }
    }
    return "Invalid room name.";
  }

  public cancelBooking(roomName: string): string {
    const room = this.office.getRoom(roomName);
    if (room) {
      const canceledBooking = room.removeLastBooking();
      if (canceledBooking) {
        return `Booking for ${roomName} cancelled successfully.`;
      }
      return `${roomName} is not booked. Cannot cancel booking.`;
    }
    return "Invalid room name.";
  }

  private startAutoReleaseInterval(): void {
    setInterval(() => {
      this.office.getAllRooms().forEach((room) => {
        const releaseMessage = room.checkAndReleaseBooking();
        if (releaseMessage) {
          console.log(releaseMessage);
        }
      });
    }, 60000); // Check every minute
  }
}

class CLI {
  private rl: readline.Interface;
  private office: OfficeFacility;
  private bookingSystem: BookingSystem;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    this.office = OfficeFacility.getInstance();
    this.bookingSystem = new BookingSystem();
    this.initializeOffice();
  }

  private initializeOffice() {
    console.log(this.office.configureRooms(3));
    console.log(this.office.setRoomCapacity("Room 1", 10));
    console.log(this.office.setRoomCapacity("Room 2", 8));
    console.log(this.office.setRoomCapacity("Room 3", 6));

    this.office.getAllRooms().forEach((room) => {
      room.addObserver(new ACController());
      room.addObserver(new LightController());
    });
  }

  public start() {
    this.showMenu();
  }

  private showMenu() {
    console.log("\n--- Smart Office System ---");
    console.log("1. Show all rooms");
    console.log("2. Book a room");
    console.log("3. Cancel a booking");
    console.log("4. Add occupants to a room");
    console.log("5. Show room statistics");
    console.log("6. Exit");
    this.rl.question("Enter your choice: ", (choice) =>
      this.handleChoice(choice)
    );
  }

  private handleChoice(choice: string) {
    switch (choice) {
      case "1":
        this.showAllRooms();
        break;
      case "2":
        this.bookRoom();
        break;
      case "3":
        this.cancelBooking();
        break;
      case "4":
        this.addOccupants();
        break;
      case "5":
        this.showRoomStatistics();
        break;
      case "6":
        this.exit();
        return;
      default:
        console.log("Invalid choice. Please try again.");
    }
    this.showMenu();
  }

  private showAllRooms() {
    console.log("\nAll Rooms:");
    this.office.getAllRooms().forEach((room) => {
      console.log(
        `${room.name} - Capacity: ${room.maxCapacity}, Occupied: ${room.isOccupied}`
      );
    });
  }

  private bookRoom() {
    this.rl.question("Enter room name: ", (roomName) => {
      this.rl.question("Enter start time (HH:MM): ", (startTimeStr) => {
        this.rl.question("Enter duration in minutes: ", (durationStr) => {
          const [hours, minutes] = startTimeStr.split(":").map(Number);
          const startTime = new Date();
          startTime.setHours(hours, minutes);
          const duration = parseInt(durationStr);

          const result = this.bookingSystem.bookRoom(
            roomName,
            startTime,
            duration
          );
          console.log(result);
          this.showMenu();
        });
      });
    });
  }

  private cancelBooking() {
    this.rl.question("Enter room name to cancel booking: ", (roomName) => {
      const result = this.bookingSystem.cancelBooking(roomName);
      console.log(result);
      this.showMenu();
    });
  }

  private addOccupants() {
    this.rl.question("Enter room name: ", (roomName) => {
      this.rl.question(
        "Enter number of occupants to add (use negative for removing): ",
        (countStr) => {
          const count = parseInt(countStr);
          const room = this.office.getRoom(roomName);
          if (room) {
            console.log(room.addOccupants(count));
          } else {
            console.log(`${roomName} does not exist.`);
          }
          this.showMenu();
        }
      );
    });
  }

  private showRoomStatistics() {
    this.rl.question("Enter room name: ", (roomName) => {
      const room = this.office.getRoom(roomName);
      if (room) {
        console.log(room.getStatistics());
      } else {
        console.log(`${roomName} does not exist.`);
      }
      this.showMenu();
    });
  }

  private exit() {
    console.log("Thank you for using the Smart Office System. Goodbye!");
    this.rl.close();
    process.exit(0);
  }
}

function main() {
  const cli = new CLI();
  cli.start();
}

main();
