import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import authApi from "../../../api/authApi";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

// ✅ schema validation
const schema = yup.object({
  fullName: yup.string().required("Họ tên là bắt buộc").min(2).trim(),
  email: yup.string().required("Email là bắt buộc").email("Email không hợp lệ"),
  phone: yup
    .string()
    .required("Số điện thoại là bắt buộc")
    .matches(/^(\+?[0-9]{1,4})?[0-9]{9,15}$/, "SĐT không hợp lệ"),
  dob: yup
    .date()
    .required("Ngày sinh là bắt buộc")
    .max(new Date(), "Ngày sinh không hợp lệ"),
  gender: yup.string().required("Vui lòng chọn giới tính"),
  password: yup
    .string()
    .required("Mật khẩu là bắt buộc")
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .matches(
      /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/,
      "Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt"
    ),
  confirmPassword: yup
    .string()
    .required("Vui lòng nhập lại mật khẩu")
    .oneOf([yup.ref("password")], "Mật khẩu không khớp"),
});

export default function RegisterScreen() {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      dob: new Date(),
      gender: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Navigation
  const navigation: any = useNavigation();

  const onSubmit = async (data: any) => {
    try {
      const { confirmPassword, ...registerData } = data;
      const formattedData = {
        ...registerData,
        dob: new Date(registerData.dob).toISOString().split("T")[0],
      };
      console.log("Dữ liệu đăng ký:", formattedData);

      const response = await authApi.register(formattedData);
      if (response) {
        navigation.navigate("Login");
      }
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as any).response === "object" &&
        (error as any).response !== null &&
        "data" in (error as any).response
      ) {
        console.error("Lỗi đăng ký:", (error as any).response.data);

        Alert.alert(
          "Đăng ký thất bại",
          JSON.stringify((error as any).response.data), // 👉 hiện lỗi server trả về
          [{ text: "OK" }]
        );
      } else {
        console.error("Lỗi đăng ký:", error);

        Alert.alert(
          "Đăng ký thất bại",
          error instanceof Error
            ? error.message
            : "Có lỗi xảy ra. Vui lòng thử lại!",
          [{ text: "OK" }]
        );
      }
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Đăng ký tài khoản</Text>

      {/* Họ tên */}
      <Controller
        control={control}
        name="fullName"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Họ và tên"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.fullName && (
        <Text style={styles.error}>{errors.fullName.message}</Text>
      )}

      {/* Email */}
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

      {/* Số điện thoại */}
      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Số điện thoại"
            keyboardType="phone-pad"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.phone && <Text style={styles.error}>{errors.phone.message}</Text>}

      {/* Ngày sinh */}
      <Controller
        control={control}
        name="dob"
        render={({ field: { onChange, value } }) => (
          <>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowDatePicker(true)}
            >
              <Text>
                {value
                  ? typeof value === "string"
                    ? value
                    : value instanceof Date
                    ? value.toISOString().split("T")[0]
                    : "Chọn ngày sinh"
                  : "Chọn ngày sinh"}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={value ? new Date(value) : new Date()}
                mode="date"
                display="spinner"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    const isoDate = selectedDate.toISOString().split("T")[0];
                    onChange(isoDate);
                  }
                }}
              />
            )}
          </>
        )}
      />
      {errors.dob && <Text style={styles.error}>{errors.dob.message}</Text>}

      {/* Giới tính */}
      <Text style={styles.label}>Giới tính</Text>
      <View style={styles.genderContainer}>
        <Controller
          control={control}
          name="gender"
          render={({ field: { onChange, value } }) => (
            <>
              {["male", "female"].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.genderOption}
                  onPress={() => onChange(option)}
                >
                  <View
                    style={[
                      styles.radioCircle,
                      value === option && styles.radioSelected,
                    ]}
                  />
                  <Text style={styles.genderLabel}>
                    {option === "male" ? "Nam" : "Nữ"}
                  </Text>
                </TouchableOpacity>
              ))}
            </>
          )}
        />
      </View>
      {errors.gender && (
        <Text style={styles.error}>{errors.gender.message}</Text>
      )}

      {/* Mật khẩu */}
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu"
            secureTextEntry
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.password && (
        <Text style={styles.error}>{errors.password.message}</Text>
      )}

      {/* Nhập lại mật khẩu */}
      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Nhập lại mật khẩu"
            secureTextEntry
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.confirmPassword && (
        <Text style={styles.error}>{errors.confirmPassword.message}</Text>
      )}

      {/* Nút đăng ký */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>
          {isSubmitting ? "Đang xử lý..." : "Đăng ký"}
        </Text>
      </TouchableOpacity>

      {/* Social login */}
      <View style={styles.socialWrapper}>
        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="google" size={20} color="red" />
          <Text style={styles.socialText}>Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <MaterialIcons name="facebook" size={20} color="blue" />
          <Text style={styles.socialText}>Facebook</Text>
        </TouchableOpacity>
      </View>

      {/* Link sang login */}
      <Text style={styles.footerText}>
        Đã có tài khoản?{" "}
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.link}>Đăng nhập</Text>
        </TouchableOpacity>
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f9fafb",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  link: {
    color: "#007AFF",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    fontSize: 15,
  },
  label: { marginBottom: 6, fontWeight: "500" },
  button: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 12,
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  error: { color: "red", marginBottom: 5, fontSize: 12 },
  genderContainer: {
    flexDirection: "row", // Nam/Nữ nằm ngang
    marginTop: 5,
    marginBottom: 10,
  },

  genderOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },

  radioCircle: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#4f46e5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },

  radioSelected: {
    backgroundColor: "#4f46e5",
  },

  genderLabel: {
    fontSize: 15,
    color: "#374151",
  },

  socialWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  socialText: { marginLeft: 6, fontSize: 14 },
  footerText: { marginTop: 16, textAlign: "center", fontSize: 14 },
});
