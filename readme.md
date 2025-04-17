# TAXI APP

## Overview
This is a taxi tracking and management application that provides real-time monitoring of TAXI NOW and SHARE TAXI vehicles. The application features a synchronized dual-view interface consisting of a map and a table, allowing users to efficiently track and manage their fleet of vehicles.

## Features

### Core Functionality
- **Dual View Interface**:
  - Interactive map displaying vehicle locations
  - Detailed table showing vehicle information
  - Synchronized views showing identical vehicles

### Vehicle Information Display
The application displays the following information for each vehicle:
- **Coordinates**: Current location (e.g., "12.234543 52.834729")
- **Licence plate**: Vehicle identification (e.g., "HHZ 234 1259")
- **Address**: Current location address (e.g., "Kroogblöcke 32, 22119 Hamburg")
- **Type**: Vehicle category ("TAXI NOW" or "SHARE TAXI")
- **State**: Operational status ("Active" or "Inactive")
- **Conditions**: 
  - Vehicle condition ("Bad conditions" or "Good conditions")
  - Fuel status ("Low fuel", "Medium fuel", or "Full fuel")

### Interactive Features
- **Synchronized Selection**:
  - Clicking a table row highlights the corresponding marker on the map
  - Clicking a map marker highlights the corresponding row in the table
- **Data Organization**:
  - Results sorted by "Licence plate"
  - Pagination showing up to 10 vehicles at a time

## Technical Requirements
- The app should load vehicles from the server (see "Server Setup" section)
- The vehicles displayed in the table and map must be identical
- Results must be sorted by "Licence plate"
- Pagination should be implemented to show a maximum of 10 vehicles at a time
- Interactive highlighting between table and map views must be implemented


