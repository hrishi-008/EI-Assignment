"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var readline = require("readline");
var OfficeFacility = /** @class */ (function () {
    function OfficeFacility() {
        this.rooms = new Map();
    }
    OfficeFacility.getInstance = function () {
        if (!OfficeFacility.instance) {
            OfficeFacility.instance = new OfficeFacility();
        }
        return OfficeFacility.instance;
    };
    OfficeFacility.prototype.configureRooms = function (roomCount) {
        this.rooms.clear();
        for (var i = 1; i <= roomCount; i++) {
            var roomName = "Room ".concat(i);
            this.rooms.set(roomName, new Room(roomName));
        }
        return "Office configured with ".concat(roomCount, " meeting rooms: ").concat(Array.from(this.rooms.keys()).join(", "), ".");
    };
    OfficeFacility.prototype.setRoomCapacity = function (roomName, capacity) {
        var room = this.rooms.get(roomName);
        if (room && capacity > 0) {
            room.maxCapacity = capacity;
            return "".concat(roomName, " maximum capacity set to ").concat(capacity, ".");
        }
        return "Invalid room name or capacity.";
    };
    OfficeFacility.prototype.getRoom = function (roomName) {
        return this.rooms.get(roomName);
    };
    OfficeFacility.prototype.getAllRooms = function () {
        return Array.from(this.rooms.values());
    };
    return OfficeFacility;
}());
var RoomStatistics = /** @class */ (function () {
    function RoomStatistics() {
        this.totalBookings = 0;
        this.totalOccupancyTime = 0; // in minutes
        this.totalBookingTime = 0; // in minutes
    }
    RoomStatistics.prototype.addBooking = function (duration) {
        this.totalBookings++;
        this.totalBookingTime += duration;
    };
    RoomStatistics.prototype.addOccupancyTime = function (duration) {
        this.totalOccupancyTime += duration;
    };
    return RoomStatistics;
}());
var Room = /** @class */ (function () {
    function Room(name) {
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
    Object.defineProperty(Room.prototype, "isOccupied", {
        get: function () {
            return this._isOccupied;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Room.prototype, "bookings", {
        get: function () {
            return this._bookings;
        },
        enumerable: false,
        configurable: true
    });
    Room.prototype.addOccupants = function (count) {
        var currentTime = new Date();
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
        return "".concat(this.name, " is now ").concat(this._isOccupied ? "occupied" : "unoccupied", " by ").concat(this._currentOccupancy, " persons. AC and lights turned ").concat(this._isOccupied ? "on" : "off", ".");
    };
    Room.prototype.checkAndReleaseBooking = function () {
        if (!this._isOccupied && this.lastOccupiedTime) {
            var timeDiff = (new Date().getTime() - this.lastOccupiedTime.getTime()) / 60000;
            if (timeDiff > 5) {
                if (this._bookings.length > 0) {
                    this._bookings.shift();
                    this.lastOccupiedTime = null;
                    return "Room ".concat(this.name, " is now unoccupied. Booking released. AC and lights off.");
                }
            }
        }
        return null;
    };
    Room.prototype.addBooking = function (startTime, duration) {
        if (this.isTimeSlotAvailable(startTime, duration)) {
            var booking = new Booking(this, startTime, duration);
            this._bookings.push(booking);
            this.statistics.addBooking(duration);
            return true;
        }
        return false;
    };
    Room.prototype.removeLastBooking = function () {
        return this._bookings.pop();
    };
    Room.prototype.isTimeSlotAvailable = function (startTime, duration) {
        var endTime = new Date(startTime.getTime() + duration * 60000);
        return !this._bookings.some(function (booking) { return startTime < booking.endTime && endTime > booking.startTime; });
    };
    Room.prototype.addObserver = function (observer) {
        this.observers.push(observer);
    };
    Room.prototype.notifyObservers = function () {
        var _this = this;
        this.observers.forEach(function (observer) { return observer.update(_this); });
    };
    Room.prototype.getStatistics = function () {
        return "Room ".concat(this.name, " Statistics:\n  Total Bookings: ").concat(this.statistics.totalBookings, "\n  Total Occupancy Time: ").concat(this.statistics.totalOccupancyTime.toFixed(2), " minutes\n  Total Booking Time: ").concat(this.statistics.totalBookingTime, " minutes");
    };
    return Room;
}());
var ACController = /** @class */ (function () {
    function ACController() {
    }
    ACController.prototype.update = function (room) {
        console.log("AC in ".concat(room.name, " turned ").concat(room.isOccupied ? "on" : "off"));
    };
    return ACController;
}());
var LightController = /** @class */ (function () {
    function LightController() {
    }
    LightController.prototype.update = function (room) {
        console.log("Lights in ".concat(room.name, " turned ").concat(room.isOccupied ? "on" : "off"));
    };
    return LightController;
}());
var Booking = /** @class */ (function () {
    function Booking(room, startTime, duration) {
        this.room = room;
        this.startTime = startTime;
        this.duration = duration;
    }
    Object.defineProperty(Booking.prototype, "endTime", {
        get: function () {
            return new Date(this.startTime.getTime() + this.duration * 60000);
        },
        enumerable: false,
        configurable: true
    });
    return Booking;
}());
var BookingSystem = /** @class */ (function () {
    function BookingSystem() {
        this.office = OfficeFacility.getInstance();
        this.startAutoReleaseInterval();
    }
    BookingSystem.prototype.bookRoom = function (roomName, startTime, duration) {
        var room = this.office.getRoom(roomName);
        if (room) {
            if (room.addBooking(startTime, duration)) {
                return "".concat(roomName, " booked from ").concat(startTime.toLocaleTimeString(), " for ").concat(duration, " minutes.");
            }
            else {
                return "".concat(roomName, " is already booked during this time. Cannot book.");
            }
        }
        return "Invalid room name.";
    };
    BookingSystem.prototype.cancelBooking = function (roomName) {
        var room = this.office.getRoom(roomName);
        if (room) {
            var canceledBooking = room.removeLastBooking();
            if (canceledBooking) {
                return "Booking for ".concat(roomName, " cancelled successfully.");
            }
            return "".concat(roomName, " is not booked. Cannot cancel booking.");
        }
        return "Invalid room name.";
    };
    BookingSystem.prototype.startAutoReleaseInterval = function () {
        var _this = this;
        setInterval(function () {
            _this.office.getAllRooms().forEach(function (room) {
                var releaseMessage = room.checkAndReleaseBooking();
                if (releaseMessage) {
                    console.log(releaseMessage);
                }
            });
        }, 60000); // Check every minute
    };
    return BookingSystem;
}());
var CLI = /** @class */ (function () {
    function CLI() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        this.office = OfficeFacility.getInstance();
        this.bookingSystem = new BookingSystem();
        this.initializeOffice();
    }
    CLI.prototype.initializeOffice = function () {
        console.log(this.office.configureRooms(3));
        console.log(this.office.setRoomCapacity("Room 1", 10));
        console.log(this.office.setRoomCapacity("Room 2", 8));
        console.log(this.office.setRoomCapacity("Room 3", 6));
        this.office.getAllRooms().forEach(function (room) {
            room.addObserver(new ACController());
            room.addObserver(new LightController());
        });
    };
    CLI.prototype.start = function () {
        this.showMenu();
    };
    CLI.prototype.showMenu = function () {
        var _this = this;
        console.log("\n--- Smart Office System ---");
        console.log("1. Show all rooms");
        console.log("2. Book a room");
        console.log("3. Cancel a booking");
        console.log("4. Add occupants to a room");
        console.log("5. Show room statistics");
        console.log("6. Exit");
        this.rl.question("Enter your choice: ", function (choice) {
            return _this.handleChoice(choice);
        });
    };
    CLI.prototype.handleChoice = function (choice) {
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
    };
    CLI.prototype.showAllRooms = function () {
        console.log("\nAll Rooms:");
        this.office.getAllRooms().forEach(function (room) {
            console.log("".concat(room.name, " - Capacity: ").concat(room.maxCapacity, ", Occupied: ").concat(room.isOccupied));
        });
    };
    CLI.prototype.bookRoom = function () {
        var _this = this;
        this.rl.question("Enter room name: ", function (roomName) {
            _this.rl.question("Enter start time (HH:MM): ", function (startTimeStr) {
                _this.rl.question("Enter duration in minutes: ", function (durationStr) {
                    var _a = startTimeStr.split(":").map(Number), hours = _a[0], minutes = _a[1];
                    var startTime = new Date();
                    startTime.setHours(hours, minutes);
                    var duration = parseInt(durationStr);
                    var result = _this.bookingSystem.bookRoom(roomName, startTime, duration);
                    console.log(result);
                    _this.showMenu();
                });
            });
        });
    };
    CLI.prototype.cancelBooking = function () {
        var _this = this;
        this.rl.question("Enter room name to cancel booking: ", function (roomName) {
            var result = _this.bookingSystem.cancelBooking(roomName);
            console.log(result);
            _this.showMenu();
        });
    };
    CLI.prototype.addOccupants = function () {
        var _this = this;
        this.rl.question("Enter room name: ", function (roomName) {
            _this.rl.question("Enter number of occupants to add (use negative for removing): ", function (countStr) {
                var count = parseInt(countStr);
                var room = _this.office.getRoom(roomName);
                if (room) {
                    console.log(room.addOccupants(count));
                }
                else {
                    console.log("".concat(roomName, " does not exist."));
                }
                _this.showMenu();
            });
        });
    };
    CLI.prototype.showRoomStatistics = function () {
        var _this = this;
        this.rl.question("Enter room name: ", function (roomName) {
            var room = _this.office.getRoom(roomName);
            if (room) {
                console.log(room.getStatistics());
            }
            else {
                console.log("".concat(roomName, " does not exist."));
            }
            _this.showMenu();
        });
    };
    CLI.prototype.exit = function () {
        console.log("Thank you for using the Smart Office System. Goodbye!");
        this.rl.close();
        process.exit(0);
    };
    return CLI;
}());
function main() {
    var cli = new CLI();
    cli.start();
}
main();
