import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { CommonActions } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";

const PaymentSuccess = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        <MaterialIcons name="celebration" size={48} color="gold" />
        Payment successful!
      </Text>
      <Text style={styles.subtitle}>
        Thank you for purchasing the course. You can start learning now.
      </Text>

      <TouchableOpacity
        style={styles.button}
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
        }} // Or course screen
      >
        <Text style={styles.buttonText}>Go to Home</Text>
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
    color: "#4CAF50",
  },
  subtitle: { fontSize: 16, textAlign: "center", marginBottom: 40 },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default PaymentSuccess;
