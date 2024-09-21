// smart_office_system.ts
class OfficeFacility {
    constructor() {
        this.rooms = new Map();
    }
    static getInstance() {
        if (!OfficeFacility.instance) {
            OfficeFacility.instance = new OfficeFacility();
        }
        return OfficeFacility.instance;
    }
    configureRooms(roomCount) {
        this.rooms.clear();
        for (let i = 1; i <= roomCount; i++) {
            const roomName = `Room ${i}`;
            this.rooms.set(roomName, new Room(roomName));
        }
        return `Office configured with ${roomCount} meeting rooms: ${Array.from(this.rooms.keys()).join(", ")}.`;
    }
    setRoomCapacity(roomName, capacity) {
        const room = this.rooms.get(roomName);
        if (room && capacity > 0) {
            room.maxCapacity = capacity;
            return `${roomName} maximum capacity set to ${capacity}.`;
        }
        return "Invalid room name or capacity.";
    }
    getRoom(roomName) {
        return this.rooms.get(roomName);
    }
    getAllRooms() {
        return Array.from(this.rooms.values());
    }
}
class RoomStatistics {
    constructor() {
        this.totalBookings = 0;
        this.totalOccupancyTime = 0; // in minutes
        this.totalBookingTime = 0; // in minutes
    }
    addBooking(duration) {
        this.totalBookings++;
        this.totalBookingTime += duration;
    }
    addOccupancyTime(duration) {
        this.totalOccupancyTime += duration;
    }
}
class Room {
    constructor(name) {
        this.name = name;
        this.maxCapacity = 10;
        this._currentOccupancy = 0;
        this._isOccupied = false;
        this._acOn = false;
        this._lightsOn = false;
        this._bookings = [];
        this.observers = [];
        this.lastOccupiedTime = null;
        this.lastStatusChangeTime = new Date();
        this.statistics = new RoomStatistics();
    }
    get isOccupied() {
        return this._isOccupied;
    }
    get bookings() {
        return this._bookings;
    }
    addOccupants(count) {
        const currentTime = new Date();
        if (this._isOccupied) {
            this.statistics.addOccupancyTime((currentTime.getTime() - this.lastStatusChangeTime.getTime()) / 60000);
        }
        this._currentOccupancy += count;
        if (this._currentOccupancy >= 2 && !this._isOccupied) {
            this._isOccupied = true;
            this.lastOccupiedTime = currentTime;
            this.lastStatusChangeTime = currentTime;
            this.notifyObservers();
        }
        else if (this._currentOccupancy < 2 && this._isOccupied) {
            this._isOccupied = false;
            this.lastOccupiedTime = null;
            this.lastStatusChangeTime = currentTime;
            this.notifyObservers();
        }
        return `${this.name} is now ${this._isOccupied ? "occupied" : "unoccupied"} by ${this._currentOccupancy} persons. AC and lights turned ${this._isOccupied ? "on" : "off"}.`;
    }
    checkAndReleaseBooking() {
        if (!this._isOccupied && this.lastOccupiedTime) {
            const timeDiff = (new Date().getTime() - this.lastOccupiedTime.getTime()) / 60000;
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
    addBooking(startTime, duration) {
        if (this.isTimeSlotAvailable(startTime, duration)) {
            const booking = new Booking(this, startTime, duration);
            this._bookings.push(booking);
            this.statistics.addBooking(duration);
            return true;
        }
        return false;
    }
    removeLastBooking() {
        return this._bookings.pop();
    }
    isTimeSlotAvailable(startTime, duration) {
        const endTime = new Date(startTime.getTime() + duration * 60000);
        return !this._bookings.some((booking) => startTime < booking.endTime && endTime > booking.startTime);
    }
    addObserver(observer) {
        this.observers.push(observer);
    }
    notifyObservers() {
        this.observers.forEach((observer) => observer.update(this));
    }
    getStatistics() {
        return `Room ${this.name} Statistics:
  Total Bookings: ${this.statistics.totalBookings}
  Total Occupancy Time: ${this.statistics.totalOccupancyTime.toFixed(2)} minutes
  Total Booking Time: ${this.statistics.totalBookingTime} minutes`;
    }
}
class ACController {
    update(room) {
        // Simulate AC control
        console.log(`AC in ${room.name} turned ${room.isOccupied ? "on" : "off"}`);
    }
}
class LightController {
    update(room) {
        // Simulate light control
        console.log(`Lights in ${room.name} turned ${room.isOccupied ? "on" : "off"}`);
    }
}
class Booking {
    constructor(room, startTime, duration) {
        this.room = room;
        this.startTime = startTime;
        this.duration = duration;
    }
    get endTime() {
        return new Date(this.startTime.getTime() + this.duration * 60000);
    }
}
class BookingSystem {
    constructor() {
        this.office = OfficeFacility.getInstance();
        this.startAutoReleaseInterval();
    }
    bookRoom(roomName, startTime, duration) {
        const room = this.office.getRoom(roomName);
        if (room) {
            if (room.addBooking(startTime, duration)) {
                return `${roomName} booked from ${startTime.toLocaleTimeString()} for ${duration} minutes.`;
            }
            else {
                return `${roomName} is already booked during this time. Cannot book.`;
            }
        }
        return "Invalid room name.";
    }
    cancelBooking(roomName) {
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
    startAutoReleaseInterval() {
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
class BookRoomCommand {
    constructor(bookingSystem, roomName, startTime, duration) {
        this.bookingSystem = bookingSystem;
        this.roomName = roomName;
        this.startTime = startTime;
        this.duration = duration;
    }
    execute() {
        return this.bookingSystem.bookRoom(this.roomName, this.startTime, this.duration);
    }
}
class CancelBookingCommand {
    constructor(bookingSystem, roomName) {
        this.bookingSystem = bookingSystem;
        this.roomName = roomName;
    }
    execute() {
        return this.bookingSystem.cancelBooking(this.roomName);
    }
}
class AddOccupantCommand {
    constructor(office, roomName, count) {
        this.office = office;
        this.roomName = roomName;
        this.count = count;
    }
    execute() {
        const room = this.office.getRoom(this.roomName);
        if (room) {
            return room.addOccupants(this.count);
        }
        return `${this.roomName} does not exist.`;
    }
}
// Main application
function main() {
    const office = OfficeFacility.getInstance();
    const bookingSystem = new BookingSystem();
    // Configure office
    console.log(office.configureRooms(3));
    console.log(office.setRoomCapacity("Room 1", 10));
    // Add observers
    office.getAllRooms().forEach((room) => {
        room.addObserver(new ACController());
        room.addObserver(new LightController());
    });
    // Example usage
    const commands = [
        new AddOccupantCommand(office, "Room 1", 2),
        new BookRoomCommand(bookingSystem, "Room 1", new Date(), 60),
        new CancelBookingCommand(bookingSystem, "Room 1"),
        new AddOccupantCommand(office, "Room 1", -2),
    ];
    commands.forEach((command) => console.log(command.execute()));
    // Keep the main thread running to allow the auto-release interval to work
    setInterval(() => {
        console.log("System running...");
        office.getAllRooms().forEach((room) => console.log(room.getStatistics()));
    }, 10000);
}
main();
