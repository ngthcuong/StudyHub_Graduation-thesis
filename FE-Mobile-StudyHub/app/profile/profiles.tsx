import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

const UserProfile: React.FC = () => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false); // ✅ modal đổi mật khẩu

  // state để chỉnh sửa form
  const [formData, setFormData] = useState({
    name: "Nguyễn Văn An",
    email: "nguyenvanan@email.com",
    phone: "+84 123 456 789",
    gender: "Nam",
    dob: "15/03/1990",
  });

  const [passwordData, setPasswordData] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = () => {
    console.log("Thông tin mới:", formData);
    setModalVisible(false);
  };

  const handleChangePassword = () => {
    if (
      !passwordData.current ||
      !passwordData.newPass ||
      !passwordData.confirm
    ) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    if (passwordData.newPass !== passwordData.confirm) {
      alert("Mật khẩu xác nhận không khớp");
      return;
    }
    // TODO: call API đổi mật khẩu
    console.log("Đổi mật khẩu:", passwordData);
    setPasswordModalVisible(false);
    setPasswordData({ current: "", newPass: "", confirm: "" });
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          {/* Nút quay lại */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <FontAwesome name="arrow-left" size={24} style={styles.backText} />
          </TouchableOpacity>

          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>User</Text>
            </View>
            <TouchableOpacity style={styles.editBtn}>
              <Text style={styles.editIcon}>✏️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Name and Email */}
          <View style={styles.userInfo}>
            <Text style={styles.name}>{formData.name}</Text>
            <Text style={styles.email}>{formData.email}</Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.primaryBtnText}>Cập nhật</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => setPasswordModalVisible(true)} // ✅ mở modal đổi mật khẩu
            >
              <Text style={styles.secondaryBtnText}>Đổi mật khẩu</Text>
            </TouchableOpacity>
          </View>

          {/* Form hiển thị thông tin */}
          <View style={styles.form}>
            {[
              { label: "Họ và tên", value: formData.name },
              { label: "Email", value: formData.email },
              { label: "Số điện thoại", value: formData.phone },
              { label: "Giới tính", value: formData.gender },
              { label: "Ngày sinh", value: formData.dob },
            ].map((item, index) => (
              <View key={index} style={styles.formGroup}>
                <Text style={styles.label}>{item.label}</Text>
                <TextInput
                  style={styles.input}
                  value={item.value}
                  editable={false}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Modal cập nhật thông tin */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cập nhật thông tin</Text>

            {/* Họ và tên */}
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(val) => handleChange("name", val)}
              placeholder="Họ và tên"
            />

            {/* Email */}
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(val) => handleChange("email", val)}
              placeholder="Email"
            />

            {/* Số điện thoại */}
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(val) => handleChange("phone", val)}
              placeholder="Số điện thoại"
            />

            {/* Giới tính */}
            <Text style={styles.label}>Giới tính</Text>
            <View style={styles.radioGroup}>
              {["Nam", "Nữ"].map((g) => (
                <TouchableOpacity
                  key={g}
                  style={styles.radioItem}
                  onPress={() => handleChange("gender", g)}
                >
                  <View
                    style={[
                      styles.radioCircle,
                      formData.gender === g && styles.radioSelected,
                    ]}
                  />
                  <Text style={styles.radioText}>{g}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Ngày sinh */}
            <TextInput
              style={styles.input}
              value={formData.dob}
              onChangeText={(val) => handleChange("dob", val)}
              placeholder="Ngày sinh"
            />

            {/* Nút hành động */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.secondaryBtnText}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.primaryBtn} onPress={handleSave}>
                <Text style={styles.primaryBtnText}>Lưu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ✅ Modal đổi mật khẩu */}
      <Modal
        visible={passwordModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Đổi mật khẩu</Text>

            <TextInput
              style={styles.input}
              secureTextEntry
              placeholder="Mật khẩu hiện tại"
              value={passwordData.current}
              onChangeText={(val) =>
                setPasswordData({ ...passwordData, current: val })
              }
            />

            <TextInput
              style={styles.input}
              secureTextEntry
              placeholder="Mật khẩu mới"
              value={passwordData.newPass}
              onChangeText={(val) =>
                setPasswordData({ ...passwordData, newPass: val })
              }
            />

            <TextInput
              style={styles.input}
              secureTextEntry
              placeholder="Xác nhận mật khẩu mới"
              value={passwordData.confirm}
              onChangeText={(val) =>
                setPasswordData({ ...passwordData, confirm: val })
              }
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={() => setPasswordModalVisible(false)}
              >
                <Text style={styles.secondaryBtnText}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={handleChangePassword}
              >
                <Text style={styles.primaryBtnText}>Đổi</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  // ... giữ nguyên phần style ở code trước
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    backgroundColor: "#2563eb",
    height: 160,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backBtn: {
    position: "absolute",
    top: 40,
    left: 16,
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 30,
  },
  backText: { fontSize: 18, color: "white", fontWeight: "600" },
  avatarWrapper: { position: "absolute", bottom: -40 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  avatarText: { color: "#fff", fontWeight: "bold", fontSize: 22 },
  editBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#f97316",
    borderRadius: 20,
    padding: 6,
    borderWidth: 2,
    borderColor: "#fff",
    elevation: 3,
  },
  editIcon: { fontSize: 14 },
  content: { padding: 20, marginTop: 60 },
  userInfo: { alignItems: "center", marginBottom: 20 },
  name: { fontSize: 22, fontWeight: "700", color: "#111827" },
  email: { fontSize: 14, color: "#6b7280" },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 20,
  },
  primaryBtn: {
    backgroundColor: "#2563eb",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 2,
  },
  primaryBtnText: { color: "#fff", fontWeight: "600" },
  secondaryBtn: {
    borderColor: "#d1d5db",
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  secondaryBtnText: { color: "#374151", fontWeight: "600" },
  form: { marginTop: 10 },
  formGroup: { marginBottom: 16 },
  label: { fontWeight: "600", color: "#374151", marginBottom: 6 },
  input: {
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#111827",
    fontSize: 14,
    marginBottom: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "100%",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: "#fff",
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 20,
  },
  radioGroup: { flexDirection: "row", gap: 20, marginVertical: 10 },
  radioItem: { flexDirection: "row", alignItems: "center" },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#2563eb",
    marginRight: 8,
  },
  radioSelected: { backgroundColor: "#2563eb" },
  radioText: { fontSize: 14, color: "#111827" },
});

export default UserProfile;
