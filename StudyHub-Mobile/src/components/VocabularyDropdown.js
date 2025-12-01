import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { MultiSelect } from "react-native-element-dropdown";

/**
 * vocabularyTopics: array of strings
 * selectedVocabulary: array (state in parent)
 * setSelectedVocabulary: setter in parent
 */

const VocabularyDropdown = ({
  vocabularyTopics = [],
  selectedVocabulary = [],
  setSelectedVocabulary,
}) => {
  const [isFocus, setIsFocus] = useState(false);

  const handleSelect = (items) => {
    console.log("Vocabulary MultiSelect onChange items:", items);

    if (!items) return;

    const arr = Array.isArray(items) ? items : [items];

    if (arr.length > 3) {
      const limited = arr.slice(0, 3);
      setSelectedVocabulary(limited);
      Alert.alert("Limit reached", "Only the first 3 topics are kept.");
      return;
    }

    setSelectedVocabulary(arr);
  };

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.label}>Vocabulary Topics (max 3)</Text>

      <MultiSelect
        style={[styles.dropdown, isFocus && { borderColor: "#2563EB" }]}
        data={vocabularyTopics.map((item) => ({ label: item, value: item }))}
        labelField="label"
        valueField="value"
        placeholder="Select up to 3 topics"
        search
        searchPlaceholder="Search topics..."
        value={selectedVocabulary}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={handleSelect}
        maxHeight={300}
        selectedTextStyle={styles.selectedTextStyle}
        placeholderStyle={styles.placeholderStyle}
        itemTextStyle={{ color: "#111827" }}
        selectedStyle={styles.selectedStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#374151",
    fontWeight: "500",
  },
  dropdown: {
    height: 50,
    borderColor: "#D1D5DB",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  selectedTextStyle: {
    fontSize: 14,
    color: "#111827",
  },
  placeholderStyle: {
    color: "#9CA3AF",
  },
  selectedStyle: {
    backgroundColor: "#E5F2FF",
  },
});

export default VocabularyDropdown;
