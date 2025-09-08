import { Drawer } from "expo-router/drawer";

export default function MainLayout() {
  return (
    <Drawer screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="home" options={{ title: "Trang chủ" }} />
      <Drawer.Screen name="coursesLayout" options={{ title: "Khóa học" }} />
      <Drawer.Screen name="profileLayout" options={{ title: "Cá nhân" }} />
    </Drawer>
  );
}
