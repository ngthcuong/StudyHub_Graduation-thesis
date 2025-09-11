import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "../screens/home/HomeScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";

type DrawerParamList = {
  Home: undefined;
  Profile: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

export default function AppDrawer() {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
    </Drawer.Navigator>
  );
}
