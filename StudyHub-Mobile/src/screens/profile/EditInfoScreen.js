import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Platform,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { userApi } from "../../services/userApi";

const EditInfoScreen = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const route = useRoute();
  const { userInfo } = route.params || {};

  const formatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // dữ liệu form
  const [formData, setFormData] = useState({
    fullName: userInfo?.fullName || "Nguyen Van A",
    email: userInfo?.email || "abc@gmail.com",
    phone: userInfo?.phone || "0123456789",
    dob: userInfo?.dob || "2000-01-01T00:00:00.000Z",
    gender: userInfo?.gender || "male",
    organization: userInfo?.organization || "ABC Corp",
    walletAddress:
      userInfo?.walletAddress || "0x1234567890abcdef1234567890abcdef12345678",
  });

  // cập nhật dữ liệu
  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    Alert.alert("Hủy thay đổi", "Các thay đổi chưa được lưu sẽ mất.");
    setIsEditing(false);
  };

  const handleSave = async () => {
    await userApi.updateProfile(formData);
    setIsEditing(false);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Avatar + Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: userInfo?.avatarUrl || "https://via.placeholder.com/150",
            }}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.editAvatarButton}>
            <Text style={{ color: "#fff", fontSize: 12 }}>✎</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Nút hành động */}
      <View style={styles.formContainer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Text style={styles.buttonText}>Cập nhật thông tin</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.passwordButton}
            onPress={() => setIsShowModal(true)}
          >
            <Text style={[styles.buttonText, { color: "#1e3a8a" }]}>
              Đổi mật khẩu
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        {/* Họ tên */}
        <View style={styles.formField}>
          <Text style={styles.label}>Họ và tên</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.disabledInput]}
            value={formData.fullName}
            editable={isEditing}
            onChangeText={(text) => handleChange("fullName", text)}
          />
        </View>

        {/* Email */}
        <View style={styles.formField}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.disabledInput]}
            value={formData.email}
            editable={isEditing}
            onChangeText={(text) => handleChange("email", text)}
          />
        </View>

        {/* Phone */}
        <View style={styles.formField}>
          <Text style={styles.label}>Số điện thoại</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.disabledInput]}
            value={formData.phone}
            editable={isEditing}
            onChangeText={(text) => handleChange("phone", text)}
          />
        </View>

        {/* DOB */}
        <View style={styles.formField}>
          <Text style={styles.label}>Ngày sinh</Text>
          <TouchableOpacity
            style={[styles.input, { justifyContent: "center" }]}
            onPress={() => isEditing && setShowDatePicker(true)}
          >
            <Text>{formatDate(formData.dob)}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={new Date(formData.dob)}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  handleChange("dob", selectedDate.toISOString());
                }
              }}
            />
          )}
        </View>

        {/* Gender */}
        <View style={styles.formField}>
          <Text style={styles.label}>Giới tính</Text>
          <View style={{ flexDirection: "row", gap: 16 }}>
            {["male", "female"].map((g) => (
              <TouchableOpacity
                key={g}
                style={styles.radioContainer}
                disabled={!isEditing}
                onPress={() => handleChange("gender", g)}
              >
                <View
                  style={[
                    styles.radioOuter,
                    formData.gender === g && styles.radioOuterSelected,
                  ]}
                >
                  {formData.gender === g && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioLabel}>
                  {g === "male" ? "Nam" : "Nữ"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Organization */}
        <View style={styles.formField}>
          <Text style={styles.label}>Tổ chức</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.disabledInput]}
            value={formData.organization}
            editable={isEditing}
            onChangeText={(text) => handleChange("organization", text)}
          />
        </View>

        {/* Wallet Address */}
        <View style={styles.formField}>
          <Text style={styles.label}>Địa chỉ ví</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.disabledInput]}
            value={formData.walletAddress}
            editable={isEditing}
            onChangeText={(text) => handleChange("walletAddress", text)}
          />
        </View>

        {/* Nút Lưu / Hủy */}
        {isEditing && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.buttonText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.buttonText}>Lưu</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Modal đổi mật khẩu */}
      {isShowModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Đổi mật khẩu</Text>
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu mới"
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder="Xác nhận mật khẩu"
              secureTextEntry
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsShowModal(false)}
              >
                <Text style={styles.buttonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => {
                  Alert.alert("Đổi mật khẩu", "Đã đổi mật khẩu thành công!");
                  setIsShowModal(false);
                }}
              >
                <Text style={styles.buttonText}>Lưu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6" },
  header: {
    height: 120,
    backgroundColor: "#3b82f6",
    position: "relative",
  },
  avatarContainer: { position: "absolute", bottom: -48, left: 16 },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    borderColor: "#fff",
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "#f97316",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: { padding: 16, marginTop: 48 },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  editButton: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  passwordButton: {
    flex: 1,
    alignItems: "center",
    borderColor: "#2563eb",
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
  },
  buttonText: { color: "#fff", fontSize: 16 },
  formField: { marginBottom: 16 },
  label: { fontSize: 14, color: "#374151", marginBottom: 4 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  disabledInput: { backgroundColor: "#e5e7eb" },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
  },
  cancelButton: {
    backgroundColor: "#6b7280",
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: "#16a34a",
    padding: 12,
    borderRadius: 8,
  },
  // radio
  radioContainer: { flexDirection: "row", alignItems: "center" },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },
  radioOuterSelected: { borderColor: "#2563eb" },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#2563eb",
  },
  radioLabel: { fontSize: 16, marginRight: 12 },

  // modal custom
  modalOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
  },
});

export default EditInfoScreen;
