import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

// Home Stack
import HomeScreen from "../screens/home/HomeScreen";
import DashboardScreen from "../screens/home/DashboardScreen";
import MyCoursesScreen from "../screens/courses/MyCoursesScreen";

// Courses Stack
import CoursesListScreen from "../screens/courses/CoursesListScreen";
import CourseDetailScreen from "../screens/courses/CourseDetailScreen";
import CourseVideoScreen from "../screens/courses/CourseVideoScreen";
import CoursePurchaseScreen from "../screens/courses/CoursePurchaseScreen";
import CourseTestScreen from "../screens/courses/CourseTestSrceen";

// Tests Stack
import AssessmentListScreen from "../screens/tests/AssessmentListScreen";
import AssessmentScreen from "../screens/tests/AssessmentScreen";
import FillExerciseScreen from "../screens/tests/FillExerciseScreen";
import MultilExerciseScreen from "../screens/tests/MultilExerciseScreen";
import TestResultsScreen from "../screens/tests/TestResultsScreen";

// Profile Stack
import ProfileScreen from "../screens/profile/ProfileScreen";
import EditInfoScreen from "../screens/profile/EditInfoScreen";

// Certificate Stack
import CertificateListScreen from "../screens/Certificate/CertificateListScreen";
import CertificateDetailScreen from "../screens/Certificate/CertificateDetailModal";

// History Test Screen
import HistoryTestResultScreen from "../screens/tests/HistoryTestResultScreen";
import CompletedTestsScreen from "../screens/tests/CompletedTestsScreen";
import MultilExerciseCustomScreen from "../screens/tests/MultilExerciseCustomScreen";

// custom navigators
import AssessmentCustomScreen from "../screens/tests/AssessmentCustomScreen";

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const CoursesStack = createStackNavigator();
const TestsStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const CertificateStack = createStackNavigator();

// Home Stack Navigator
const HomeStackNavigator = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen
      name="HomeMain"
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    <HomeStack.Screen
      name="Dashboard"
      component={DashboardScreen}
      options={{ title: "Dashboard" }}
    />
    <HomeStack.Screen
      name="MyCourses"
      component={MyCoursesScreen}
      options={{ title: "My Courses" }}
    />
  </HomeStack.Navigator>
);

// Courses Stack Navigator
const CoursesStackNavigator = () => (
  <CoursesStack.Navigator>
    <CoursesStack.Screen
      name="CoursesList"
      component={CoursesListScreen}
      options={{ title: "Courses" }}
    />
    <CoursesStack.Screen
      name="CourseDetail"
      component={CourseDetailScreen}
      options={{ title: "Course Detail" }}
    />
    <CoursesStack.Screen
      name="CourseVideo"
      component={CourseVideoScreen}
      options={{ title: "Lesson" }}
    />
    <CoursesStack.Screen
      name="CoursePurchase"
      component={CoursePurchaseScreen}
      options={{ title: "Course Purchase" }}
    />
    <CoursesStack.Screen
      name="CourseTest"
      component={CourseTestScreen}
      options={{ title: "Course Test" }}
    />
  </CoursesStack.Navigator>
);

// Tests Stack Navigator
const TestsStackNavigator = () => (
  <TestsStack.Navigator>
    <TestsStack.Screen
      name="AssessmentList"
      component={AssessmentListScreen}
      options={{ title: "Assessments" }}
    />
    <TestsStack.Screen
      name="Assessment"
      component={AssessmentScreen}
      options={{ title: "Assessment" }}
    />
    <TestsStack.Screen
      name="FillExercise"
      component={FillExerciseScreen}
      options={{ title: "Fill Exercise" }}
    />
    <TestsStack.Screen
      name="MultilExercise"
      component={MultilExerciseScreen}
      options={{ title: "Multiple Choice" }}
    />
    <TestsStack.Screen
      name="MultilExerciseCustom"
      component={MultilExerciseCustomScreen}
      options={{ title: "Multiple Choice Custom" }}
    />
    <TestsStack.Screen
      name="TestResults"
      component={TestResultsScreen}
      options={{ title: "Test Results" }}
    />
    <TestsStack.Screen
      name="AssessmentCustom"
      component={AssessmentCustomScreen}
      options={{ title: "Assessment Custom" }}
    />
  </TestsStack.Navigator>
);

// Profile Stack Navigator
const ProfileStackNavigator = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen
      name="ProfileMain"
      component={ProfileScreen}
      options={{ title: "Profile" }}
    />
    <ProfileStack.Screen
      name="EditProfile"
      component={EditInfoScreen}
      options={{ title: "Edit Profile" }}
    />
    <ProfileStack.Screen
      name="CertificatesList"
      component={CertificateListScreen}
      options={{ title: "CertificatesList" }}
    />
    <ProfileStack.Screen
      name="CertificateDetail"
      component={CertificateDetailScreen}
      options={{ title: "Certificate Detail" }}
    />

    <ProfileStack.Screen
      name="HistoryTest"
      component={HistoryTestResultScreen}
      options={{ title: "History Test" }}
    />

    <ProfileStack.Screen
      name="CompletedTests"
      component={CompletedTestsScreen}
      options={{ title: "Completed Tests" }}
    />
    <ProfileStack.Screen
      name="TestResults"
      component={TestResultsScreen}
      options={{ title: "Test Results" }}
    />
  </ProfileStack.Navigator>
);

// Main Tab Navigator
const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Courses") {
            iconName = focused ? "book" : "book-outline";
          } else if (route.name === "Tests") {
            iconName = focused ? "clipboard" : "clipboard-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#3B82F6",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Courses" component={CoursesStackNavigator} />
      <Tab.Screen name="Tests" component={TestsStackNavigator} />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
};

export default MainNavigator;
