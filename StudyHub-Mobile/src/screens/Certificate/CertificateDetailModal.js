import React from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";

const CertificateDetailScreen = () => {
  const route = useRoute();
  const { item } = route.params || {};

  const transactionHash = "0x1234abcd5678ef90";
  const metadata =
    "ipfs://bafkreie34gv3dkrf4mknwpqhadn25v6hglqiz42iebfqjacpz5oea";

  const handleCopy = async (text) => {
    await Clipboard.setStringAsync(text);
    Alert.alert("Just copied", "Content has been copied to clipboard!");
  };

  const handleDownload = () => {
    Alert.alert("Download", "Downloading certificate image...");
  };
  const handleOk = () => {
    Alert.alert("OK", "You pressed OK.");
  };

  return (
    <ScrollView style={styles.container}>
      {/* Thông Tin Chứng Chỉ */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Certificate Information</Text>
        <View style={styles.field}>
          <Text style={styles.label}>Certificate Code:</Text>
          <Text style={styles.value}>CERT-251001-9CVK21</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Issue Date:</Text>
          <Text style={styles.value}>02/10/2025</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Transaction Hash:</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={transactionHash}
              editable={false}
            />
            <TouchableOpacity onPress={() => handleCopy(transactionHash)}>
              <Ionicons name="copy-outline" size={22} color="#007bff" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Metadata:</Text>
          <View style={styles.inputContainer}>
            <TextInput style={styles.input} value={metadata} editable={false} />
            <TouchableOpacity onPress={() => handleCopy(metadata)}>
              <Ionicons name="copy-outline" size={22} color="#007bff" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Blockchain Network:</Text>
          <Text style={styles.value}>SEPOLIA</Text>
        </View>
      </View>

      {/* Student Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Student Information</Text>
        <View style={styles.field}>
          <Text style={styles.label}>Student Name:</Text>
          <Text style={styles.value}>Nguyễn Thành Cương</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Student Address:</Text>
          <Text style={styles.value}>
            0xA1587E706e6Da463E7d63702147705e7BE722164
          </Text>
        </View>
      </View>

      {/* Issuer Organization */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Issuer Organization</Text>
        <View style={styles.field}>
          <Text style={styles.label}>Organization Name:</Text>
          <Text style={styles.value}>StudyHub</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Organization Address:</Text>
          <Text style={styles.value}>
            0xDd8585206D51f17Ea82c5767FeA5f7805015f0E
          </Text>
        </View>
      </View>

      {/* Course Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Course Information</Text>
        <View style={styles.field}>
          <Text style={styles.label}>Course Name:</Text>
          <Text style={styles.value}>Blockchain Development Fundamentals</Text>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button, styles.green]}
          onPress={() => handleDownload()}
        >
          <Text style={styles.buttonText}>Download Image</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.blue]}
          onPress={() => handleOk()}
        >
          <Text style={styles.buttonText}>OK</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default CertificateDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 10,
  },
  section: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  sectionTitle: {
    color: "#0055cc",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  field: {
    marginVertical: 6,
  },
  label: {
    fontWeight: "bold",
    color: "#444",
    fontSize: 14,
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    color: "#333",
    flexWrap: "wrap",
  },
  input: {
    backgroundColor: "#f1f1f1",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 6,
    fontSize: 13,
    textAlign: "right",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
    marginBottom: 30,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  green: {
    backgroundColor: "#28a745",
  },
  blue: {
    backgroundColor: "#007bff",
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 8,
  },
  input: {
    flex: 1,
    fontSize: 13,
    paddingVertical: 6,
    color: "#333",
  },
});
