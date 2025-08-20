import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter, Link } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

// ✅ schema validation
const schema = yup.object({
  fullName: yup.string().required("Họ tên là bắt buộc").min(2),
  email: yup.string().required("Email là bắt buộc").email("Email không hợp lệ"),
  phone: yup
    .string()
    .required("Số điện thoại là bắt buộc")
    .matches(/^(\+?[0-9]{1,4})?[0-9]{9,15}$/, "SĐT không hợp lệ"),
  password: yup
    .string()
    .required("Mật khẩu là bắt buộc")
    .min(8, "Ít nhất 8 ký tự")
    .matches(/(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/, "Mật khẩu yếu"),
  confirmPassword: yup
    .string()
    .required("Nhập lại mật khẩu")
    .oneOf([yup.ref("password")], "Mật khẩu không khớp"),
});

export default function Register() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      console.log("Register data:", data);
      // gọi API đăng ký ở đây
      router.push("/auth/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
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

      {/* Mật khẩu */}
      {/* Password */}
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
      <TouchableOpacity style={styles.socialButton}>
        <FontAwesome name="google" size={24} color="red" />
        <Text style={{ marginLeft: 8 }}>Đăng ký với Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButton}>
        <MaterialIcons name="facebook" size={24} color="blue" />
        <Text style={{ marginLeft: 8 }}>Đăng ký với Facebook</Text>
      </TouchableOpacity>

      {/* Link sang login */}
      <Text style={{ marginTop: 16, textAlign: "center" }}>
        Đã có tài khoản?{" "}
        <Link href="/auth/login" style={{ color: "blue", fontWeight: "bold" }}>
          Đăng nhập ngay
        </Link>
      </Text>
    </View>
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
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  error: { color: "red", marginBottom: 5 },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
});
