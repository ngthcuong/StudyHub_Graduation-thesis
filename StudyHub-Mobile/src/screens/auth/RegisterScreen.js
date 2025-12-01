import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { registerUser, clearError } from "../../store/slices/authSlice";

// MỚI: Thêm 2 import cho Date Picker và Dropdown (Picker)
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

const RegisterScreen = ({ navigation }) => {
  // MỚI: Cập nhật state formData
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    dateOfBirth: null,
    gender: "",
    goalType: "TOEIC", // Đặt mặc định là TOEIC
    targetScore: "",
    timeFrame: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // MỚI: Thêm state cho Date Picker
  const [showDatePicker, setShowDatePicker] = useState(false);

  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  // MỚI: Cập nhật handleInputChange với logic validation
  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      // --- BẮT ĐẦU LOGIC VALIDATION MỚI ---

      // 1. Nếu người dùng đang nhập Target Score
      if (field === "targetScore") {
        const goalType = prev.goalType; // Lấy goalType từ state trước đó
        const maxScore = goalType === "TOEIC" ? 990 : 9;

        // Nếu người dùng xóa (input rỗng), cho phép
        if (value === "") {
          return { ...prev, [field]: value };
        }

        // Chỉ cho phép số và 1 dấu chấm (cho IELTS)
        let cleanedValue = value.replace(/[^0-9.]/g, "");

        // Nếu là TOEIC, không cho phép dấu chấm
        if (goalType === "TOEIC") {
          cleanedValue = cleanedValue.replace(/\./g, "");
        }

        // Chỉ cho phép 1 dấu chấm
        if ((cleanedValue.match(/\./g) || []).length > 1) {
          cleanedValue = prev.targetScore; // Giữ giá trị cũ nếu nhập sai (vd: 8.5.5)
        }

        const numericValue = parseFloat(cleanedValue);

        // Nếu giá trị nhập vào không phải là số (sau khi clean)
        if (isNaN(numericValue)) {
          return { ...prev, [field]: "" }; // Reset nếu nhập "abc"
        }

        // Nếu giá trị số vượt quá max, tự động sửa nó về giá trị max
        if (numericValue > maxScore) {
          return { ...prev, [field]: String(maxScore) };
        }

        // Nếu hợp lệ, cập nhật giá trị đã clean
        return { ...prev, [field]: cleanedValue };
      }

      // 2. Nếu người dùng đổi Goal Type, reset Target Score
      if (field === "goalType") {
        return { ...prev, [field]: value, targetScore: "" };
      }

      // --- KẾT THÚC LOGIC MỚI ---

      // Logic cũ: Cập nhật bình thường cho các trường khác
      return { ...prev, [field]: value };
    });
  };

  // MỚI: Thêm hàm xử lý cho Date Picker
  const onDateChange = (event, selectedDate) => {
    // Ẩn picker trên iOS
    setShowDatePicker(Platform.OS === "ios");
    if (event.type === "set" && selectedDate) {
      // event.type === 'set' nghĩa là người dùng đã bấm 'OK'
      setFormData((prev) => ({ ...prev, dateOfBirth: selectedDate }));
    }
  };

  const handleRegister = async () => {
    // Lấy tất cả dữ liệu, bao gồm cả 3 trường mục tiêu
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      phoneNumber,
      dateOfBirth,
      gender,
      goalType,
      targetScore,
      timeFrame,
    } = formData;

    // ... (Toàn bộ phần validation (kiểm tra) của bạn giữ nguyên) ...

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !phoneNumber ||
      !dateOfBirth ||
      !gender ||
      !targetScore ||
      !timeFrame
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if (!passwordRegex.test(password)) {
      Alert.alert(
        "Error",
        "Password must be at least 6 characters, include uppercase, lowercase, number and special character"
      );
      return;
    }

    // MỚI: Tạo chuỗi mục tiêu (goal string)
    // Dùng 3 biến: targetScore, goalType, và timeFrame
    const goalString = `I want to get ${targetScore} ${goalType} in ${timeFrame} months.`;

    // Gọi action registerUser với tất cả dữ liệu cần thiết
    try {
      await dispatch(
        registerUser({
          fullName: `${firstName} ${lastName}`,
          email,
          password,
          phone: phoneNumber,
          dob: dateOfBirth.toISOString(),
          role: "student", // Mặc định là student
          gender,
          // MỚI: Gán goalString vào trường 'learningGoals' (hoặc 'goal')
          learningGoals: goalString,
        })
      ).unwrap();
      // Navigation sẽ được AppNavigator xử lý dựa vào auth state
    } catch (error) {
      Alert.alert("Registration Failed", error);
    }
  };

  const handleLogin = () => {
    navigation.navigate("Login");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Ionicons name="school" size={80} color="#3B82F6" />
          <Text style={styles.title}>StudyHub</Text>
          <Text style={styles.subtitle}>Create your account</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.nameContainer}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
              <Ionicons
                name="person-outline"
                size={20}
                color="#6B7280"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="First Name"
                value={formData.firstName}
                onChangeText={(value) => handleInputChange("firstName", value)}
                autoCapitalize="words"
              />
            </View>
            <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
              <Ionicons
                name="person-outline"
                size={20}
                color="#6B7280"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={formData.lastName}
                onChangeText={(value) => handleInputChange("lastName", value)}
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="#6B7280"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={formData.email}
              onChangeText={(value) => handleInputChange("email", value)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* MỚI: Thêm trường Số điện thoại */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="call-outline"
              size={20}
              color="#6B7280"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChangeText={(value) => handleInputChange("phoneNumber", value)}
              keyboardType="phone-pad"
            />
          </View>

          {/* MỚI: Thêm trường Ngày sinh (dùng TouchableOpacity) */}
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <View style={styles.inputContainer}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color="#6B7280"
                style={styles.inputIcon}
              />
              <Text
                style={[
                  styles.input,
                  !formData.dateOfBirth && styles.placeholderText,
                ]}
              >
                {formData.dateOfBirth
                  ? formData.dateOfBirth.toLocaleDateString()
                  : "Date of Birth"}
              </Text>
            </View>
          </TouchableOpacity>

          {/* MỚI: Component Date Picker (sẽ hiển thị khi showDatePicker là true) */}
          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={formData.dateOfBirth || new Date()} // Phải có giá trị default
              mode="date"
              display="default"
              onChange={onDateChange}
              maximumDate={new Date(Date.now() - 315360000000)} // Ít nhất 10 tuổi
            />
          )}

          {/* MỚI: Thêm trường Giới tính (dùng Picker) */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="transgender-outline"
              size={20}
              color="#6B7280"
              style={styles.inputIcon}
            />
            <Picker
              selectedValue={formData.gender}
              style={styles.picker}
              onValueChange={(itemValue) =>
                handleInputChange("gender", itemValue)
              }
            >
              <Picker.Item label="Select Gender" value="" color="#6B7280" />
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
            </Picker>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#6B7280"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={formData.password}
              onChangeText={(value) => handleInputChange("password", value)}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={20}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#6B7280"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChangeText={(value) =>
                handleInputChange("confirmPassword", value)
              }
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                size={20}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>

          {/* MỚI: Khu vực "Your Goal" */}
          <Text style={styles.sectionTitle}>Your Goal</Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="flag-outline"
              size={20}
              color="#6B7280"
              style={styles.inputIcon}
            />
            <Picker
              selectedValue={formData.goalType}
              style={styles.picker}
              onValueChange={(itemValue) =>
                handleInputChange("goalType", itemValue)
              }
            >
              <Picker.Item label="TOEIC" value="TOEIC" />
              <Picker.Item label="IELTS" value="IELTS" />
            </Picker>
          </View>

          <View style={styles.nameContainer}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
              <Ionicons
                name="trophy-outline"
                size={20}
                color="#6B7280"
                style={styles.inputIcon}
              />
              {/* MỚI: Cập nhật TextInput cho Target Score */}
              <TextInput
                style={styles.input}
                // MỚI: placeholder động
                placeholder={
                  formData.goalType === "TOEIC"
                    ? "Target Score (Max 990)"
                    : "Target Score (Max 9.0)"
                }
                value={formData.targetScore}
                onChangeText={(value) =>
                  handleInputChange("targetScore", value)
                }
                // MỚI: keyboardType động (TOEIC chỉ cần số, IELTS cần số thập phân)
                keyboardType={
                  formData.goalType === "TOEIC" ? "number-pad" : "decimal-pad"
                }
              />
            </View>
            <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
              <Ionicons
                name="time-outline"
                size={20}
                color="#6B7280"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Time (Months)"
                value={formData.timeFrame}
                onChangeText={(value) => handleInputChange("timeFrame", value)}
                keyboardType="number-pad"
              />
            </View>
          </View>
          {/* Hết khu vực "Your Goal" */}

          <TouchableOpacity
            style={[
              styles.registerButton,
              isLoading && styles.registerButtonDisabled,
            ]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.registerButtonText}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1F2937",
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 8,
  },
  form: {
    width: "100%",
  },
  nameContainer: {
    flexDirection: "row",
    // MỚI: Bỏ marginBottom để áp dụng cho inputContainer bên dưới
    // marginBottom: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12, // MỚI: Giảm padding một chút
    borderWidth: 1,
    borderColor: "#E5E7EB",
    // MỚI: Đảm bảo chiều cao cố định
    minHeight: 50,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1F2937",
  },
  // MỚI: Style cho Picker
  picker: {
    flex: 1,
    color: "#1F2937",
    // Hack nhỏ để căn chỉnh text của Picker
    marginVertical: -8,
    marginHorizontal: -8,
  },
  // MỚI: Style cho placeholder của Date Input
  placeholderText: {
    color: "#9CA3AF", // Màu placeholder
  },
  eyeIcon: {
    padding: 4,
  },
  // MỚI: Style cho tiêu đề khu vực "Your Goal"
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
    textAlign: "center",
  },
  registerButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 24,
    // MỚI: Thêm marginTop để tách khỏi form
    marginTop: 8,
  },
  registerButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    color: "#6B7280",
    fontSize: 14,
  },
  loginLink: {
    color: "#3B82F6",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default RegisterScreen;
