import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import { Alert, Platform } from "react-native";

/**
 * Save certificate directly to device gallery
 * Simple approach - just like iChat project
 */
export const saveCertificateToGallery = async (certificate, viewShotRef) => {
  try {
    if (!viewShotRef || !viewShotRef.current) {
      throw new Error("ViewShot reference not found");
    }

    // Request permission
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please grant permission to save images to your gallery."
      );
      return false;
    }

    // Capture the view as image
    const uri = await viewShotRef.current.capture();

    if (!uri) {
      throw new Error("Failed to capture certificate image");
    }

    // Save directly to library - simple approach like iChat
    await MediaLibrary.saveToLibraryAsync(uri);

    Alert.alert(
      "Success!",
      `Certificate saved to ${Platform.OS === "ios" ? "Photos" : "Gallery"}!`
    );

    return true;
  } catch (error) {
    console.error("Error saving certificate:", error);
    Alert.alert("Error", "Failed to save certificate. Please try again.");
    return false;
  }
};

/**
 * Share certificate image (opens share dialog)
 */
export const shareCertificateImage = async (certificate, viewShotRef) => {
  try {
    if (!viewShotRef || !viewShotRef.current) {
      throw new Error("ViewShot reference not found");
    }

    // Capture the view as image
    const uri = await viewShotRef.current.capture();

    if (!uri) {
      throw new Error("Failed to capture certificate image");
    }

    // Check if sharing is available
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert("Not Available", "Sharing is not available on this device.");
      return false;
    }

    // Open share dialog
    await Sharing.shareAsync(uri, {
      mimeType: "image/png",
      dialogTitle: "Share Certificate",
      UTI: "public.png",
    });

    return true;
  } catch (error) {
    console.error("Error sharing certificate:", error);
    Alert.alert("Error", "Failed to share certificate. Please try again.");
    return false;
  }
};
