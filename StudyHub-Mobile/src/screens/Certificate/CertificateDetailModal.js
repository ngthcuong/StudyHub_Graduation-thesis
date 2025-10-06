import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";

const CertificateDetailModal = ({ visible, onClose, certificate }) => {
  // fake data nếu chưa truyền certificate
  const fakeCertificate = certificate || {
    certCode: "CERT-250928-1N6U3T",
    issueDate: "2025-09-28",
    certHash:
      "0xa34b8f2c71d09b2a3c84d8a1e52c41e212b7a8c9b0af3d0efb893acdf12c9a8f",
    metadataURI: "https://studyhub.ai/certificates/CERT-250928-1N6U3T",
    network: "Polygon",
    learnerAddress: "0x98F...12ab",
    issuer: "0xABcdEF12...88Aa",
    courseName: "English for IT Professionals",
    duration: "60 hours",
  };

  const user = { fullName: "Nguyen Van A" };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <SafeAreaView style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Certificate Details</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color="#555" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Certificate Info */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="ribbon-outline" size={20} color="#007bff" />
                <Text style={styles.sectionTitle}>Certificate Information</Text>
              </View>

              <InfoRow
                label="Certificate Code"
                value={fakeCertificate.certCode}
              />
              <InfoRow
                label="Issue Date"
                value={formatDate(fakeCertificate.issueDate)}
              />
              <InfoRow
                label="Hash Code"
                value={fakeCertificate.certHash}
                mono
              />
              <InfoRow
                label="Metadata URI"
                value={fakeCertificate.metadataURI}
                mono
              />
              <View style={styles.row}>
                <Text style={styles.label}>Blockchain Network</Text>
                <View style={styles.badge}>
                  <View style={styles.dot} />
                  <Text style={styles.badgeText}>
                    {fakeCertificate.network}
                  </Text>
                </View>
              </View>
            </View>

            {/* Student Info */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Feather name="user" size={20} color="#007bff" />
                <Text style={styles.sectionTitle}>Student Information</Text>
              </View>

              <InfoRow label="Student Name" value={user.fullName} />
              <InfoRow
                label="Student Address"
                value={fakeCertificate.learnerAddress}
              />
            </View>

            {/* Issuer Info */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Feather name="briefcase" size={20} color="#007bff" />
                <Text style={styles.sectionTitle}>Issuing Organization</Text>
              </View>

              <InfoRow label="Organization Name" value="StudyHub" />
              <InfoRow
                label="Organization Address"
                value={fakeCertificate.issuer}
              />
            </View>

            {/* Course Info */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="book-outline" size={20} color="#007bff" />
                <Text style={styles.sectionTitle}>Course Information</Text>
              </View>

              <InfoRow label="Course Name" value={fakeCertificate.courseName} />
              <InfoRow label="Duration" value={fakeCertificate.duration} />
            </View>

            {/* OK Button */}
            <TouchableOpacity style={styles.okButton} onPress={onClose}>
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

// Component hiển thị label + value
const InfoRow = ({ label, value, mono }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={[styles.value, mono && styles.mono]} numberOfLines={2}>
      {value}
    </Text>
  </View>
);

export default CertificateDetailModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  modal: {
    width: "100%",
    maxHeight: "90%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 15,
    elevation: 6,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingBottom: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  section: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontWeight: "600",
    color: "#007bff",
    marginLeft: 6,
  },
  row: {
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    color: "#666",
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    fontWeight: "500",
    color: "#222",
  },
  mono: {
    fontFamily: "monospace",
    color: "#444",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E6F7EC",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    color: "#10893E",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  dot: {
    width: 6,
    height: 6,
    backgroundColor: "#10893E",
    borderRadius: 3,
    marginRight: 6,
  },
  okButton: {
    marginTop: 10,
    backgroundColor: "#007bff",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  okButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
