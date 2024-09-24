# Smart Office System

## Overview

The Smart Office System is a TypeScript-based application designed to manage meeting rooms in an office environment. It provides features for room booking, occupancy tracking, and automated control of air conditioning and lighting based on room usage.

## Features

- Room management (configuration, capacity setting)
- Room booking and cancellation
- Occupancy tracking
- Automated AC and lighting control
- Room usage statistics
- Command-line interface for user interaction

## Prerequisites

To run this application, you need to have the following installed on your system:

- Node.js (version 12.0 or higher)
- TypeScript (version 4.0 or higher)

## Installation

1. Clone this repository or download the `smart_office_system.ts` file.
2. Open a terminal and navigate to the directory containing the file.
3. Install the required dependencies:
   ```
   npm install @types/node
   ```

## Compilation

Compile the TypeScript file to JavaScript:

```
tsc smart_office_system.ts
```

## Usage

Run the compiled JavaScript file:

```
node smart_office_system.js
```

This will start the command-line interface for the Smart Office System. Follow the on-screen prompts to interact with the system.

## Available Commands

1. Show all rooms
2. Book a room
3. Cancel a booking
4. Add occupants to a room
5. Show room statistics
6. Exit

## Code Structure

- `OfficeFacility`: Singleton class managing the entire office
- `Room`: Represents individual meeting rooms
- `RoomStatistics`: Tracks usage statistics for each room
- `Booking`: Represents a room booking
- `BookingSystem`: Handles room bookings and cancellations
- `ACController` and `LightController`: Observer classes for automated control
- `CLI`: Provides the command-line interface for user interaction

## Contributing

Contributions to improve the Smart Office System are welcome. Please follow these steps:

1. Fork the repository
2. Create a new branch for your feature
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## Contact

For any queries or suggestions, please open an issue in the GitHub repository.
