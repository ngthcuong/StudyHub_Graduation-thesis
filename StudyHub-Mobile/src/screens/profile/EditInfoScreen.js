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
  KeyboardAvoidingView,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { userApi } from "../../services/userApi";
import { authApi } from "../../services/authApi";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { Picker } from "@react-native-picker/picker";
import { isAddress } from "ethers";

// MỚI: Định nghĩa 2 mảng dữ liệu cho Picker
const TOEIC_LEVELS = [
  { label: "choise TOEIC", value: "" },
  { label: "10 - 250 (Beginner - A1)", value: "10-250" },
  { label: "255 - 400 (Elementary - A2)", value: "255-400" },
  { label: "405 - 600 (Intermediate - B1)", value: "405-600" },
  { label: "605 - 780 (Upper-Intermediate - B2)", value: "605-780" },
  { label: "785 - 900 (Advanced - C1)", value: "785-900" },
  { label: "905 - 990 (Proficiency - C2)", value: "905-990" },
];

const IELTS_LEVELS = [
  { label: "choise IELTS", value: "" },
  { label: "0-3.5 (Beginner - A1/A2)", value: "0-3.5" },
  { label: "4.0-5.0 (Elementary - B1 Low)", value: "4.0-5.0" },
  { label: "5.5-6.0 (Intermediate - B1/B2)", value: "5.5-6.0" },
  { label: "6.5-7.0 (Upper-Intermediate - B2/C1)", value: "6.5-7.0" },
  { label: "7.5-8.0 (Advanced - C1)", value: "7.5-8.0" },
  { label: "8.5-9.0 (Expert - C2)", value: "8.5-9.0" },
];

const EditInfoScreen = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  const route = useRoute();
  const { userInfo } = route.params || {};
  console.log("User info from route params:", userInfo);

  const pickImage = async () => {
    // xin quyền truy cập
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "Bạn cần cấp quyền để chọn ảnh!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      // cập nhật state formData với ảnh mới
      handleChange("avatarUrl", result.assets[0].uri);
    }
  };

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
    walletAddress: userInfo?.walletAddress || "",
    // SỬA 1: Thêm avatarUrl vào state
    avatarUrl: userInfo?.avatarUrl || null,
    // SỬA 2: Thêm currentLevel (dưới dạng phẳng)
    currentLevelToeic: userInfo?.currentLevel?.TOEIC || "",
    currentLevelIelts: userInfo?.currentLevel?.IELTS || "",
  });

  // cập nhật dữ liệu
  const handleChange = (key, value) => {
    // Nếu là fullName thì kiểm tra
    if (key === "fullName") {
      const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/; // cho phép chữ cái và khoảng trắng
      if (value && !nameRegex.test(value)) {
        Alert.alert(
          "❌ Input error",
          "Full name cannot contain numbers or special characters."
        );
        return; // không cập nhật giá trị sai
      }
    }

    // Kiểm tra email
    if (key === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value)) {
        Alert.alert(
          "❌ Email error",
          "Please enter a valid email address (ví dụ: abc@gmail.com)."
        );
        return;
      }
    }

    // Kiểm tra số điện thoại
    if (key === "phone") {
      const phoneRegex = /^(0|\+84)[0-9]{9}$/; // cho phép 0xxxxxxxxx hoặc +84xxxxxxxxx
      if (value && !phoneRegex.test(value)) {
        Alert.alert(
          "❌ Phone number error",
          "Please enter a valid Vietnamese phone number."
        );
        return;
      }
    }

    if (key === "walletAddress") {
      if (value) {
        try {
          const isValid = isAddress(value.trim());
          if (!isValid) {
            Alert.alert(
              "❌ Wallet Address Error",
              "Please enter a valid Ethereum wallet address.\n\nFormat: 0x followed by 40 hexadecimal characters.\nExample: 0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
            );
            return;
          }
        } catch (error) {
          Alert.alert(
            "❌ Wallet Address Error",
            "Invalid Ethereum wallet address format."
          );
          return;
        }
      }
    }

    setFormData({ ...formData, [key]: value });
  };

  const handleEdit = () => setIsEditing(true);

  // SỬA 3: Cập nhật handleCancel để reset state
  const handleCancel = () => {
    Alert.alert("Hủy thay đổi", "Các thay đổi chưa được lưu sẽ mất.");
    setIsEditing(false);
    // Reset state về ban đầu
    setFormData({
      fullName: userInfo?.fullName || "Nguyen Van A",
      email: userInfo?.email || "abc@gmail.com",
      phone: userInfo?.phone || "0123456789",
      dob: userInfo?.dob || "2000-01-01T00:00:00.000Z",
      gender: userInfo?.gender || "male",
      organization: userInfo?.organization || "ABC Corp",
      walletAddress: userInfo?.walletAddress || "",
      avatarUrl: userInfo?.avatarUrl || null,
      currentLevelToeic: userInfo?.currentLevel?.TOEIC || "",
      currentLevelIelts: userInfo?.currentLevel?.IELTS || "",
    });
  };

  // SỬA 4: Cập nhật handleSave để "gói" currentLevel
  const handleSave = async () => {
    // Tách các trường currentLevel phẳng ra
    const { currentLevelToeic, currentLevelIelts, ...restOfFormData } =
      formData;

    // Tạo payload mới đúng với schema
    const payload = {
      ...restOfFormData, // Gồm fullName, email, phone, avatarUrl...
      currentLevel: {
        TOEIC: currentLevelToeic,
        IELTS: currentLevelIelts,
      },
    };

    console.log("Saving data:", payload);
    await userApi.updateProfile(payload); // Gửi payload đã được cấu trúc lại
    setIsEditing(false);
  };

  const handleChangePassword = async (
    currentPassword,
    newPassword,
    confirmPassword
  ) => {
    if (newPassword !== confirmPassword) {
      Alert.alert("❌ Lỗi", "Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      await authApi.changePassword({ currentPassword, newPassword });
      Alert.alert("✅ Thành công", "Đổi mật khẩu thành công");
      setIsShowModal(false);
    } catch (error) {
      console.error("Change password error:", error);
      Alert.alert("❌ Thất bại", "Không thể đổi mật khẩu");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 100 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Avatar + Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            {/* SỬA 5: Đọc ảnh từ state và thêm placeholder */}
            <Image
              source={{
                uri:
                  formData.avatarUrl ||
                  "https://placehold.co/96x96/E0E0E0/BDBDBD?text=N/A",
              }}
              style={styles.avatar}
            />
            <TouchableOpacity
              style={styles.editAvatarButton}
              onPress={pickImage}
              disabled={!isEditing} // Chỉ cho sửa khi isEditing
            >
              <Ionicons name="pencil-outline" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Nút hành động */}
        <View style={styles.formContainer}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.passwordButton}
              onPress={() => setIsShowModal(true)}
            >
              <Text style={[styles.buttonText, { color: "#1e3a8a" }]}>
                Change Password
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          {/* Họ tên */}
          <View style={styles.formField}>
            <Text style={styles.label}>Full Name</Text>
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
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.disabledInput]}
              value={formData.phone}
              editable={isEditing}
              keyboardType="phone-pad"
              onChangeText={(text) => handleChange("phone", text)}
            />
          </View>

          {/* DOB */}
          <View style={styles.formField}>
            <Text style={styles.label}>Date of Birth</Text>
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
                maximumDate={new Date()}
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
            <Text style={styles.label}>Gender</Text>
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
                    {formData.gender === g && (
                      <View style={styles.radioInner} />
                    )}
                  </View>
                  <Text style={styles.radioLabel}>
                    {g === "male" ? "Male" : "Female"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Organization */}
          <View style={styles.formField}>
            <Text style={styles.label}>Organization</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.disabledInput]}
              value={formData.organization}
              editable={isEditing}
              onChangeText={(text) => handleChange("organization", text)}
            />
          </View>

          {/* MỚI: Current Level - TOEIC (Dropdown) */}
          <View style={styles.formField}>
            <Text style={styles.label}>Current Level (TOEIC)</Text>
            <View
              style={[
                styles.pickerContainer,
                !isEditing && styles.disabledPickerContainer,
              ]}
            >
              <Picker
                selectedValue={formData.currentLevelToeic}
                style={styles.picker}
                onValueChange={(itemValue) =>
                  handleChange("currentLevelToeic", itemValue)
                }
                enabled={isEditing} // Chỉ cho phép thay đổi khi 'isEditing'
              >
                {TOEIC_LEVELS.map((level) => (
                  <Picker.Item
                    key={level.value}
                    label={level.label}
                    value={level.value}
                    color={level.value === "" ? "#9CA3AF" : "#000"} // Màu placeholder
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* MỚI: Current Level - IELTS (Dropdown) */}
          <View style={styles.formField}>
            <Text style={styles.label}>Current Level (IELTS)</Text>
            <View
              style={[
                styles.pickerContainer,
                !isEditing && styles.disabledPickerContainer,
              ]}
            >
              <Picker
                selectedValue={formData.currentLevelIelts}
                style={styles.picker}
                onValueChange={(itemValue) =>
                  handleChange("currentLevelIelts", itemValue)
                }
                enabled={isEditing}
              >
                {IELTS_LEVELS.map((level) => (
                  <Picker.Item
                    key={level.value}
                    label={level.label}
                    value={level.value}
                    color={level.value === "" ? "#9CA3AF" : "#000"} // Màu placeholder
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Wallet Address */}
          <View style={styles.formField}>
            <Text style={styles.label}>Wallet Address</Text>

            <View style={styles.inputRow}>
              <TextInput
                style={[
                  styles.input,
                  !isEditing && styles.disabledInput,
                  { flex: 1 },
                ]}
                value={formData.walletAddress}
                editable={isEditing}
                onChangeText={(text) => handleChange("walletAddress", text)}
              />

              {/* Nút Copy */}
              <TouchableOpacity
                style={styles.copyButton}
                onPress={() => {
                  Clipboard.setStringAsync(formData.walletAddress);
                  Alert.alert(
                    "Copied",
                    "Wallet address has been copied to clipboard."
                  );
                }}
              >
                <Ionicons name="copy-outline" size={22} color="#2563EB" />
              </TouchableOpacity>
            </View>
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
              <Text style={styles.modalTitle}>
                <Ionicons
                  name="lock-closed-outline"
                  size={24}
                  color="#1e3a8a"
                />{" "}
                Change Password
              </Text>

              {/* Current Password */}
              <Text style={styles.modalLabel}>Current Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Enter current password"
                  secureTextEntry={!showCurrentPassword}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  <Ionicons
                    name={
                      showCurrentPassword ? "eye-off-outline" : "eye-outline"
                    }
                    style={styles.eyeIcon}
                  />
                </TouchableOpacity>
              </View>

              {/* New Password */}
              <Text style={styles.modalLabel}>New Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Enter new password"
                  secureTextEntry={!showPassword}
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    style={styles.eyeIcon}
                  />
                </TouchableOpacity>
              </View>

              {/* Confirm Password */}
              <Text style={styles.modalLabel}>Confirm Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Enter confirm password"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={
                      showConfirmPassword ? "eye-off-outline" : "eye-outline"
                    }
                    style={styles.eyeIcon}
                  />
                </TouchableOpacity>
              </View>

              {/* Nút */}
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => setIsShowModal(false)}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalSaveButton}
                  onPress={() => {
                    handleChangePassword(
                      currentPassword,
                      newPassword,
                      confirmPassword
                    );
                  }}
                >
                  <Text style={styles.modalSaveText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
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
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  copyButton: {
    marginLeft: 8,
    padding: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  disabledInput: { backgroundColor: "#e5e7eb" },

  // MỚI: Style cho Picker
  pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    justifyContent: "center",
  },
  disabledPickerContainer: {
    backgroundColor: "#e5e7eb",
  },
  picker: {
    color: "#000",
    // Căn chỉnh Picker
    marginVertical: Platform.OS === "ios" ? -8 : 0,
  },
  // Hết style Picker

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
    padding: 20,
    borderRadius: 16,
    width: "85%",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#1e3a8a",
  },
  modalLabel: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 6,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  modalCancelButton: {
    backgroundColor: "#e5e7eb",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  modalCancelText: {
    fontSize: 16,
    color: "#374151",
  },
  modalSaveButton: {
    backgroundColor: "#16a34a",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  modalSaveText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },

  inputWrapper: {
    position: "relative",
    marginBottom: 16,
  },
  modalInput: {
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#d1d5db",
    paddingRight: 40, // chừa chỗ cho icon
  },
  eyeButton: {
    position: "absolute",
    right: 10,
    top: "30%",
  },
  eyeIcon: {
    fontSize: 18,
  },
});

export default EditInfoScreen;
