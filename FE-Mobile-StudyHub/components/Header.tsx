import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import NotificationBell from "./NotificationBell";

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  return (
    <View style={styles.header}>
      {/* Left: icon bars + logo */}
      <View style={styles.headerLeft}>
        <FontAwesome name="bars" size={28} color="white" />
        <Text style={styles.logoText}>{"StudyHub"}</Text>
      </View>

      {/* Right: bell + avatar */}
      <View style={styles.headerRight}>
        <NotificationBell count={3} />

        {/* Avatar */}
        <View style={{ position: "relative" }}>
          <TouchableOpacity
            style={[styles.iconBtn, styles.avatar]}
            onPress={() => setShowDropdown(!showDropdown)}
          >
            <Text style={styles.avatarText}>A</Text>
          </TouchableOpacity>

          {showDropdown && (
            <View style={styles.dropdown}>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => router.push("../profile/profiles")}
              >
                <Text>👤 Hồ sơ</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dropdownItem}>
                <Text>⚙️ Cài đặt</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dropdownItem}>
                <Text>🚪 Đăng xuất</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    backgroundColor: "#3355FF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  logoText: {
    fontWeight: "bold",
    fontSize: 20,
    color: "white",
  },
  iconBtn: {
    paddingHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#ccc",
  },
  avatarText: {
    fontWeight: "bold",
    lineHeight: 32,
    textAlign: "center",
    color: "#333",
    fontSize: 16,
  },
  dropdown: {
    position: "absolute",
    top: 40,
    right: 0,
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 100,
    minWidth: 150,
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});
