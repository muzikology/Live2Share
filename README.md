# StudentShare - Flutter Mobile App

A cross-platform mobile application for South African students seeking shared accommodation outside university residences.

## Features

- **Accommodation Search**: Filter by location, university, accommodation type, and budget
- **Roommate Profiles**: View current residents with student details and lifestyle preferences  
- **Rent Split Calculator**: Calculate shared costs and individual payments
- **Application System**: Students can apply with move-in dates and budget preferences
- **Student-Specific Types**: Houses, communes, apartments, and backyard rooms

## Technology Stack

- **Framework**: Flutter 3.10+
- **State Management**: Riverpod
- **Navigation**: GoRouter
- **HTTP Client**: Dio
- **UI**: Material Design 3
- **Backend**: Express.js API (existing)

## Project Structure

```
lib/
├── core/
│   ├── models/          # Data models (Accommodation, StudentUser, Application)
│   ├── services/        # API service layer
│   └── theme/           # App theming
├── features/
│   ├── home/            # Home page
│   ├── accommodations/  # Accommodation listing, details, search
│   └── applications/    # Application management
└── main.dart           # App entry point
```

## Getting Started

### Prerequisites

- Flutter SDK 3.10 or higher
- Dart SDK 3.0 or higher
- Android Studio or VS Code with Flutter extension

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   flutter pub get
   ```

3. Ensure the backend API is running on `http://localhost:5000`

4. Run the app:
   ```bash
   flutter run
   ```

## API Integration

The app connects to the existing Express.js backend API:

- `GET /api/accommodations` - List accommodations with filters
- `GET /api/accommodations/:id` - Get accommodation details
- `GET /api/accommodations/:id/roommates` - Get current roommates
- `POST /api/applications` - Submit accommodation application

## Target Users

- South African university students seeking shared accommodation
- Property owners and landlords targeting student tenants
- Students looking for compatible roommates and cost-sharing arrangements

## Platform Support

- Android (Primary target)
- iOS (Cross-platform ready)
- Web (Flutter web support available)

## Contributing

This is a specialized platform for South African students. When contributing:

1. Maintain focus on student accommodation use cases
2. Include South African universities, provinces, and local context
3. Prioritize mobile-first responsive design
4. Follow Flutter best practices and Material Design guidelines