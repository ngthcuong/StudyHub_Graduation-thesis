# StudyHub Mobile App

A React Native mobile application built with Expo for the StudyHub learning platform. This app provides students with access to courses, tests, and learning materials on their mobile devices.

## Features

### Authentication

- User registration and login
- Password reset functionality
- Secure token-based authentication
- Persistent login state

### Course Management

- Browse available courses
- View course details and descriptions
- Enroll in courses
- Track learning progress
- Access course materials and videos

### Testing System

- Take multiple choice tests
- Fill-in-the-blank exercises
- Real-time test timer
- View test results and scores
- Retake failed tests

### User Profile

- View personal information
- Track learning statistics
- Manage account settings
- Logout functionality

## Technology Stack

- **React Native** - Mobile app framework
- **Expo** - Development platform and tools
- **React Navigation** - Navigation library
- **Redux Toolkit** - State management
- **Redux Persist** - State persistence
- **Axios** - HTTP client
- **Expo Vector Icons** - Icon library

## Project Structure

```
src/
├── navigation/          # Navigation configuration
│   ├── AppNavigator.js  # Main app navigator
│   └── MainNavigator.js # Tab navigator
├── screens/            # Screen components
│   ├── auth/           # Authentication screens
│   ├── home/           # Home and dashboard screens
│   ├── courses/        # Course-related screens
│   ├── tests/          # Test-related screens
│   └── profile/        # Profile screens
├── store/              # Redux store configuration
│   ├── store.js        # Store setup
│   └── slices/         # Redux slices
├── services/           # API services
│   ├── api.js          # Base API configuration
│   ├── authApi.js      # Authentication API
│   ├── courseApi.js    # Course API
│   └── testApi.js      # Test API
└── components/         # Reusable components
```

## Installation

1. **Prerequisites**

   - Node.js (v16 or higher)
   - npm or yarn
   - Expo CLI
   - iOS Simulator (for iOS development)
   - Android Studio (for Android development)

2. **Install Expo CLI**

   ```bash
   npm install -g @expo/cli
   ```

3. **Install Dependencies**

   ```bash
   cd StudyHub-Mobile
   npm install
   ```

4. **Start the Development Server**

   ```bash
   npm start
   ```

5. **Run on Device/Simulator**
   - For iOS: `npm run ios`
   - For Android: `npm run android`
   - For Web: `npm run web`

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
API_BASE_URL=http://localhost:5000/api
```

### Backend Connection

Update the API base URL in `src/services/api.js` to match your backend server:

```javascript
const API_BASE_URL = "YOUR_BACKEND_URL/api";
```

## Usage

### Authentication Flow

1. **Registration**: Users can create new accounts with email and password
2. **Login**: Existing users can sign in with their credentials
3. **Password Reset**: Users can reset forgotten passwords via email

### Course Management

1. **Browse Courses**: View all available courses in the courses tab
2. **Course Details**: Tap on a course to view detailed information
3. **Enrollment**: Enroll in courses to access content
4. **Learning**: Access course materials and track progress

### Testing System

1. **Test List**: View all available tests in the tests tab
2. **Test Information**: Review test details and instructions
3. **Take Test**: Complete tests with real-time timer
4. **View Results**: See scores and performance breakdown

## API Integration

The app integrates with the StudyHub backend API. Make sure your backend server is running and accessible.

### API Endpoints Used

- **Authentication**: `/auth/login`, `/auth/register`, `/auth/refreshToken`
- **Courses**: `/courses`, `/courses/:id`, `/courses/:id/lessons`
- **Tests**: `/tests`, `/tests/:id`, `/tests/:id/attempts`

## Development

### Code Structure

- **Screens**: Each screen is a separate component in the `screens/` directory
- **Navigation**: Navigation structure is defined in the `navigation/` directory
- **State Management**: Redux store and slices are in the `store/` directory
- **API Services**: API calls are organized in the `services/` directory

### Styling

The app uses React Native StyleSheet for styling with a consistent design system:

- Primary color: #3B82F6 (Blue)
- Success color: #10B981 (Green)
- Error color: #EF4444 (Red)
- Warning color: #F59E0B (Orange)

### State Management

- **Authentication**: User login state, tokens, and user information
- **Courses**: Course data, enrollment status, and progress
- **Tests**: Test data, attempts, and results
- **UI State**: Loading states, error messages, and form data

## Building for Production

### Android

1. **Generate APK**

   ```bash
   expo build:android
   ```

2. **Generate AAB (for Play Store)**
   ```bash
   expo build:android -t app-bundle
   ```

### iOS

1. **Generate IPA**
   ```bash
   expo build:ios
   ```

## Troubleshooting

### Common Issues

1. **Metro bundler issues**: Clear cache with `expo start -c`
2. **Dependencies conflicts**: Delete `node_modules` and reinstall
3. **iOS build issues**: Ensure Xcode is properly configured
4. **Android build issues**: Check Android SDK and build tools

### Debug Mode

Enable debug mode in development:

```javascript
// In App.js
console.disableYellowBox = true; // Disable yellow box warnings
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.
