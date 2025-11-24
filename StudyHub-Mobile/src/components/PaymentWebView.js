import React from "react";
import { View, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";

const PaymentWebView = ({ route, navigation }) => {
  const { url } = route.params;

  if (!url) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>There is no payment URL</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, marginVertical: 30 }}>
      <WebView
        source={{ uri: url }}
        startInLoadingState={true}
        renderLoading={() => (
          <ActivityIndicator size="large" style={{ marginTop: 20 }} />
        )}
        onNavigationStateChange={(navState) => {
          if (navState.url.includes("payment-success")) {
            navigation.replace("PaymentSuccess");
          }
          if (navState.url.includes("payment-cancel")) {
            navigation.replace("PaymentCancel");
          }
        }}
      />
    </View>
  );
};

export default PaymentWebView;
