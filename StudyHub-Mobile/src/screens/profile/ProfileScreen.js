import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { logout } from "../../store/slices/authSlice";
import { mockUser } from "../../mock";
import { userApi } from "../../services/userApi";
import { persistor } from "../../store/store";

const ProfileScreen = ({ navigation }) => {
  const { user } = useSelector((state) => state.auth);
  const [userInfo, setUserInfo] = useState(null);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    totalTests: 0,
    passedTests: 0,
    averageScore: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileData = await userApi.getProfile(user._id);
        setUserInfo(profileData.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    try {
      // Sử dụng mock user stats
      setStats({
        totalCourses: mockUser.stats.totalCourses,
        completedCourses: mockUser.stats.completedCourses,
        totalTests: mockUser.stats.totalTests,
        passedTests: mockUser.stats.completedTests,
        averageScore: mockUser.stats.averageScore,
      });
    } catch (error) {
      console.error("Error loading user stats:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserStats();
    setRefreshing(false);
  };

  const handleLogout = (navigation) => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            // 1️⃣ Reset Redux state
            dispatch(logout());

            // 2️⃣ Xóa dữ liệu persist
            await persistor.purge();

            // 3️⃣ Reset navigation stack về Login
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });

            console.log("✅ User logged out successfully");
          } catch (error) {
            console.error("❌ Error during logout:", error);
          }
        },
      },
    ]);
  };

  const handleCertificate = () => {
    // Navigate to certificate screen
    navigation.navigate("CertificatesList", { userInfo });
  };

  const handleEditProfile = () => {
    // Navigate to edit profile screen
    navigation.navigate("EditProfile", { userInfo });
  };

  const handleHistoryTest = () => {
    // Navigate to history test screen
    navigation.navigate("CompletedTests", { userInfo });
  };

  const MenuItem = ({ icon, title, subtitle, onPress, showArrow = true }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <View style={styles.menuIcon}>
          <Ionicons name={icon} size={20} color="#3B82F6" />
        </View>
        <View style={styles.menuContent}>
          <Text style={styles.menuTitle}>{title}</Text>
          {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {showArrow && (
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      )}
    </TouchableOpacity>
  );

  const StatCard = ({ title, value, icon, color = "#3B82F6" }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Ionicons name={icon} size={24} color={color} />
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color="#3B82F6" />
        </View>
        <Text style={styles.userName}>{userInfo?.fullName}</Text>
        <Text style={styles.userEmail}>{userInfo?.email}</Text>
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Your Progress</Text>
        <View style={styles.statsGrid}>
          <StatCard
            title="Courses"
            value={`${stats.completedCourses}/${stats.totalCourses}`}
            icon="book"
            color="#3B82F6"
          />
          <StatCard
            title="Tests"
            value={`${stats.passedTests}/${stats.totalTests}`}
            icon="clipboard"
            color="#10B981"
          />
          <StatCard
            title="Average Score"
            value={`${stats.averageScore}%`}
            icon="trophy"
            color="#F59E0B"
          />
        </View>
      </View>

      {/* Menu Section */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Account</Text>

        <MenuItem
          icon="person-outline"
          title="Edit Profile"
          subtitle="Update your personal information"
          onPress={handleEditProfile}
        />

        <MenuItem
          icon="ribbon-outline"
          title="Certificates"
          subtitle="View your earned certificates"
          onPress={handleCertificate}
        />

        <MenuItem
          icon="information-circle-outline"
          title="Result Test"
          subtitle="View your test results"
          onPress={handleHistoryTest}
        />

        <MenuItem
          icon="notifications-outline"
          title="Notifications"
          subtitle="Manage your notification preferences"
          onPress={() =>
            Alert.alert(
              "Coming Soon",
              "Notifications feature will be available soon"
            )
          }
        />

        <MenuItem
          icon="help-circle-outline"
          title="Help & Support"
          subtitle="Get help and contact support"
          onPress={() =>
            Alert.alert(
              "Coming Soon",
              "Help & Support feature will be available soon"
            )
          }
        />

        <MenuItem
          icon="information-circle-outline"
          title="About"
          subtitle="App version and information"
          onPress={() => Alert.alert("About", "StudyHub Mobile v1.0.0")}
        />
      </View>

      {/* Logout Button */}
      <View style={styles.logoutSection}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    backgroundColor: "#EBF4FF",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: "#6B7280",
  },
  statsSection: {
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    borderLeftWidth: 4,
    alignItems: "center",
  },
  statTitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 8,
    textAlign: "center",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
    marginTop: 4,
  },
  menuSection: {
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    backgroundColor: "#EBF4FF",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1F2937",
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  logoutSection: {
    padding: 20,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEF2F2",
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  logoutButtonText: {
    color: "#EF4444",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default ProfileScreen;
