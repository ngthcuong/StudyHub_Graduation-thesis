import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // ✅ Icon mũi tên
import { AntDesign } from "@expo/vector-icons"; // ✅ Icon Google

// ✅ Schema validate
const schema = yup.object({
  email: yup
    .string()
    .email("Email không hợp lệ")
    .required("Vui lòng nhập email"),
  password: yup
    .string()
    .min(6, "Mật khẩu ít nhất 6 ký tự")
    .required("Vui lòng nhập mật khẩu"),
});

export default function LoginScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: any) => {
    console.log("Dữ liệu đăng nhập:", data);
    // 👉 TODO: gọi API login từ backend (authService.login)
  };

  const handleGoogleLogin = () => {
    console.log("Login bằng Google...");
    // 👉 TODO: tích hợp Google OAuth
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

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
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {/* Nút Login bằng Google */}
      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
        <AntDesign
          name="google"
          size={20}
          color="black"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.googleText}>Login with Google</Text>
      </TouchableOpacity>

      {/* Link Sign Up */}
      <View style={styles.footer}>
        <Text>{"Don't have an account? "}</Text>
        <Link href="/auth/register" style={styles.link}>
          Sign up
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
    backgroundColor: "#000",
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
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  googleIcon: {
    width: 22,
    height: 22,
    marginRight: 8,
  },
  googleText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  link: {
    color: "#000",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
