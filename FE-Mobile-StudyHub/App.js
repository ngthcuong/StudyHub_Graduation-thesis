import React from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import LoginScreen from "./src/common/screens/auth/LoginScreen";
import RegisterScreen from "./src/common/screens/auth/RegisterScreen";
import HomeScreen from "./src/common/screens/home/HomeScreen";
import ProfileScreen from "./src/common/screens/profile/ProfileScreen";
import AssessmentScreen from "./src/common/screens/tests/AssessmentScreen";
import MultilExerciseScreen from "./src/common/screens/tests/MultilExerciseScreen";
import AssessmentListScreen from "./src/common/screens/tests/AssessmentListScreen";
import FillExerciseScreen from "./src/common/screens/tests/FillExerciseScreen";
import TestResultsScreen from "./src/common/screens/tests/TestResultsScreen";

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isLoggedIn ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Assessment" component={AssessmentScreen} />
          <Stack.Screen name="TestResults" component={TestResultsScreen} />
          <Stack.Screen
            name="MultilExercise"
            component={MultilExerciseScreen}
          />
          <Stack.Screen name="FillExercise" component={FillExerciseScreen} />
          <Stack.Screen
            name="AssessmentList"
            component={AssessmentListScreen}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
