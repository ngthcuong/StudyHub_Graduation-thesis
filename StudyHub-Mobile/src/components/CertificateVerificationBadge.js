import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const getBadgeProps = (verification) => {
  if (!verification)
    return {
      icon: "help-circle-outline",
      color: "#6b7280",
      label: "Unknown",
    };
  const { trustLevel, status } = verification;
  switch (status?.severity || trustLevel) {
    case "success":
    case "trusted":
      return {
        icon: "checkmark-circle-outline",
        color: "#22c55e",
        label: status?.label || "Trusted",
      };
    case "warning":
      return {
        icon: "warning-outline",
        color: "#f59e0b",
        label: status?.label || "Warning",
      };
    case "error":
    case "rejected":
      return {
        icon: "close-circle-outline",
        color: "#ef4444",
        label: status?.label || "Rejected",
      };
    default:
      return {
        icon: "help-circle-outline",
        color: "#6b7280",
        label: status?.label || trustLevel || "Unknown",
      };
  }
};

const CertificateVerificationBadge = ({ verification }) => {
  const { icon, color, label } = getBadgeProps(verification);
  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Ionicons name={icon} size={18} color="#fff" style={{ marginRight: 6 }} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
    alignSelf: "flex-start",
  },
  label: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
});

export default CertificateVerificationBadge;
