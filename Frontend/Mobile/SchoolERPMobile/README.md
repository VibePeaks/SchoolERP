# SchoolERP Mobile

A React Native mobile application for SchoolERP that provides role-based access for parents, teachers, drivers, and administrators.

## Features

- **Unified App**: Single application supporting all user roles
- **Role-Based Navigation**: Dynamic UI based on user permissions
- **Identical Theme**: Matches the web application's design system
- **Real-time Features**: Push notifications, GPS tracking, live updates
- **Offline Support**: Core functionality works without internet
- **Cross-Platform**: iOS and Android support

## Project Structure

```
Mobile/SchoolERPMobile/
├── src/
│   ├── components/     # Reusable UI components
│   ├── screens/        # Screen components
│   ├── navigation/     # Navigation configuration
│   ├── services/       # API services and utilities
│   ├── types/          # TypeScript type definitions
│   ├── theme.ts        # Theme configuration
│   └── App.tsx         # Main app component
├── android/            # Android native code
├── ios/                # iOS native code
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── index.js            # App entry point
```

## Setup Instructions

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **iOS Setup:**
   ```bash
   cd ios && pod install && cd ..
   ```

3. **Android Setup:**
   - Ensure Android SDK is installed
   - Configure environment variables

4. **Run Development Server:**
   ```bash
   npm start
   ```

5. **Run on Device/Emulator:**
   ```bash
   # iOS
   npm run ios

   # Android
   npm run android
   ```

## Architecture

### Theme System
The app uses an identical color scheme and design tokens as the web application, ensuring a consistent user experience across platforms.

### Navigation
- **Stack Navigation**: Authentication and main app flow
- **Tab Navigation**: Role-based bottom tabs
- **Dynamic Routing**: UI adapts based on user role and permissions

### State Management
- React Context for global state
- AsyncStorage for offline data persistence
- Redux Toolkit for complex state scenarios

### API Integration
- Axios for HTTP requests
- Automatic token refresh
- Error handling and retry logic

## User Roles

### 👨‍👩‍👧‍👦 Parent
- Child dashboard with attendance/grades
- Bus tracking with notifications
- Fee payments and communication

### 👨‍🏫 Teacher
- Class attendance marking
- Grade entry and assignment management
- Parent communication tools

### 🚐 Driver
- Route management and GPS tracking
- Student check-in/check-out
- Emergency reporting

### 🏫 Admin/Principal
- Full system management
- User administration
- Reports and analytics

## Development Guidelines

- **TypeScript**: Strict typing for all components
- **Component Structure**: Functional components with hooks
- **Styling**: StyleSheet with theme integration
- **Code Organization**: Feature-based folder structure
- **Testing**: Jest and React Native Testing Library
- **Linting**: ESLint with React Native rules

## Contributing

1. Follow the established code style
2. Write tests for new features
3. Update documentation as needed
4. Ensure compatibility across platforms

## Deployment

- **iOS**: App Store Connect
- **Android**: Google Play Console
- **CI/CD**: Automated builds and releases
