import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { CommonActions } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const PaymentCancel = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        <Ionicons name="close-circle" size={48} color="red" /> Payment canceled
        successfully
      </Text>
      <Text style={styles.subtitle}>
        You have canceled the transaction or an error occurred during the
        payment process.
      </Text>

      <TouchableOpacity
        style={styles.buttonHome}
        onPress={() => {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                { name: "Home" },
                { name: "Courses" }, // Tab Courses, sẽ reset stack
              ],
            })
          );
        }} // Quay về home
      >
        <Text style={styles.buttonTextHome}>Go home </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#E53935",
  },
  subtitle: { fontSize: 16, textAlign: "center", marginBottom: 40 },
  buttonRetry: {
    backgroundColor: "#E53935",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  buttonHome: {
    borderColor: "#555",
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonTextHome: { color: "#555", fontSize: 16, fontWeight: "bold" },
});

export default PaymentCancel;
