import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import authApi from "../services/authApi";

const schema = yup.object({
  email: yup
    .string()
    .required("Vui lòng nhập email")
    .matches(
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
      "Email phải đúng định dạng (ví dụ: ten@gmail.com)"
    ),
  password: yup
    .string()
    .required("Vui lòng nhập mật khẩu")
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .matches(/[A-Z]/, "Mật khẩu phải chứa ít nhất 1 chữ hoa")
    .matches(/[a-z]/, "Mật khẩu phải chứa ít nhất 1 chữ thường")
    .matches(/[0-9]/, "Mật khẩu phải chứa ít nhất 1 số")
    .matches(/[@$!%*?&._-]/, "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt"),
});

export default function LoginScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const router = useRouter(); // 👈 Dùng để điều hướng

  const onSubmit = async (data: any) => {
    try {
      const response = await authApi.login({
        email: data.email,
        password: data.password,
      });

      console.log("Login response: ", response.data);

      if (response) {
        router.push("/main/home");
      }
    } catch (error) {
      // Show specific error message if available
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as any).response === "object" &&
        (error as any).response !== null &&
        "data" in (error as any).response &&
        typeof (error as any).response.data === "object" &&
        (error as any).response.data !== null &&
        "error" in (error as any).response.data
      ) {
        alert(`Lỗi đăng nhập: ${(error as any).response.data.error}`);
      } else {
        alert("Đã có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.");
      }
    }
  };

  const handleGoogleLogin = () => {
    console.log("Login bằng Google...");
    // 👉 TODO: tích hợp Google OAuth
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập tài khoản</Text>

      {/* Email */}
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

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

      {/* Nút Login */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>Đăng nhập</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
        <FontAwesome name="google" size={24} color="red" />
        <Text style={{ marginLeft: 8 }}>Đăng nhập với Google</Text>
      </TouchableOpacity>

      {/* Link Sign Up */}
      <View style={styles.footer}>
        <Text>{"Chưa có tài khoản? "}</Text>
        <Link href="/auth/register" style={styles.link}>
          Đăng ký
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
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
  error: {
    color: "red",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  link: {
    color: "#007AFF",
    fontWeight: "bold",
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
