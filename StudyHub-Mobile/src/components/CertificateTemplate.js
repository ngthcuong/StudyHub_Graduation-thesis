import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Logo from "../../assets/Logo.jpg";

const CertificateTemplate = ({ certificate }) => {
  if (!certificate) return null;

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const issuerName =
    certificate?.issuer?.name ||
    certificate?.metadata?.issuer?.name ||
    "StudyHub";
  const certificateCode = certificate?.certificateCode || "N/A";
  const issueDate =
    certificate?.validity?.issueDate ||
    certificate?.metadata?.validity?.issueDate ||
    new Date();
  const studentName =
    certificate?.student?.name ||
    certificate?.metadata?.student?.name ||
    "Student Name";
  const courseTitle =
    certificate?.course?.title ||
    certificate?.metadata?.course?.title ||
    "Course Title";
  const courseType =
    certificate?.course?.type || certificate?.metadata?.course?.type || "N/A";
  const courseLevel =
    certificate?.course?.level || certificate?.metadata?.course?.level || "N/A";

  return (
    <View style={styles.container}>
      {/* Top border */}
      <View style={styles.topBorder} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconContainer}>
            <Ionicons name="checkmark-circle" size={32} color="#ffffff" />
          </View>
          <View>
            <Text style={styles.issuerName}>{issuerName}</Text>
            <Text style={styles.subtitle}>Certificate of Completion</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.certCodeLabel}>Certificate Code:</Text>
          <Text style={styles.certCode}>{certificateCode}</Text>
          <Text style={styles.issueDate}>
            Issue Date: {formatDate(issueDate)}
          </Text>
        </View>
      </View>

      {/* Title */}
      <View style={styles.titleSection}>
        <Text style={styles.mainTitle}>Certificate of Achievement</Text>
      </View>

      {/* Body */}
      <Text style={styles.bodyText}>This is to certify that</Text>
      <Text style={styles.studentName}>{studentName}</Text>
      <Text style={styles.bodyText}>has successfully completed the</Text>
      <Text style={styles.courseName}>{courseTitle}</Text>

      {/* Course Details */}
      <View style={styles.courseDetails}>
        <Text style={styles.detailText}>
          <Text style={styles.detailLabel}>Type:</Text> {courseType}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.detailLabel}>Level:</Text> {courseLevel}
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.sealContainer}>
          <View style={styles.seal}>
            <Image source={Logo} style={styles.logoImage} />
          </View>
          <Text style={styles.sealText}>Official Seal</Text>
        </View>
        <View style={styles.signatureContainer}>
          <View style={styles.signatureLine} />
          <Text style={styles.signatureName}>{issuerName}</Text>
          <Text style={styles.signatureTitle}>English learning system</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 1024,
    backgroundColor: "#f2f2f2",
    borderRadius: 6,
    padding: 60,
    paddingHorizontal: 80,
    position: "relative",
  },
  topBorder: {
    position: "absolute",
    top: 4,
    left: 4,
    right: 4,
    height: 4,
    backgroundColor: "#376bd5",
    borderRadius: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 60,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#1d4ed8",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  issuerName: {
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: -0.25,
    color: "#1e293b",
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22.4,
    color: "#64748b",
    marginTop: 4,
  },
  headerRight: {
    alignItems: "flex-end",
    minWidth: 170,
  },
  certCodeLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#475569",
    marginBottom: 4,
  },
  certCode: {
    fontSize: 16,
    lineHeight: 25.6,
    color: "#64748b",
  },
  issueDate: {
    fontSize: 16,
    lineHeight: 25.6,
    color: "#64748b",
  },
  titleSection: {
    alignItems: "center",
    marginBottom: 48,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: "500",
    letterSpacing: -0.8,
    color: "#1e293b",
  },
  bodyText: {
    textAlign: "center",
    fontSize: 18,
    color: "#475569",
    marginBottom: 20,
  },
  studentName: {
    textAlign: "center",
    fontSize: 40,
    fontWeight: "500",
    letterSpacing: 1,
    color: "#1d4599",
    marginBottom: 20,
  },
  courseName: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: "400",
    letterSpacing: -0.7,
    color: "#1e293b",
    marginBottom: 24,
  },
  courseDetails: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 32,
  },
  detailText: {
    fontSize: 18,
    color: "#475569",
  },
  detailLabel: {
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 64,
    marginBottom: 8,
  },
  sealContainer: {
    alignItems: "center",
    width: 160,
  },
  seal: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  logoImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  sealText: {
    marginTop: 8,
    fontSize: 14,
    letterSpacing: 0.25,
    color: "#64748b",
  },
  signatureContainer: {
    alignItems: "center",
    width: 240,
  },
  signatureLine: {
    width: "100%",
    height: 1,
    backgroundColor: "#e2e8f0",
    marginBottom: 8,
  },
  signatureName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#475569",
    marginBottom: 4,
  },
  signatureTitle: {
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 0.25,
    color: "#64748b",
  },
});

export default CertificateTemplate;
