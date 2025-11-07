// GrammarDropdown.js
import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, Platform } from "react-native";
import { MultiSelect } from "react-native-element-dropdown";

/**
 * grammarTopics: array of strings
 * selectedGrammar: array (state in parent)
 * setSelectedGrammar: setter in parent
 *
 * Usage:
 * const [selectedGrammar, setSelectedGrammar] = useState([]);
 * <GrammarDropdown grammarTopics={grammarTopics} selectedGrammar={selectedGrammar} setSelectedGrammar={setSelectedGrammar} />
 */

const GrammarDropdown = ({
  grammarTopics = [],
  selectedGrammar = [],
  setSelectedGrammar,
}) => {
  const [isFocus, setIsFocus] = useState(false);

  const handleSelect = (items) => {
    console.log("MultiSelect onChange items:", items);

    // defensive: sometimes the lib calls onChange with undefined or non-array
    if (!items) {
      // ignore spurious calls
      return;
    }

    // if single value (string) convert to array
    const arr = Array.isArray(items) ? items : [items];

    // enforce max 3 items
    if (arr.length > 3) {
      // Option A: show alert and ignore adding the extra one
      // Alert.alert("Limit reached", "You can select up to 3 topics only.");
      // setSelectedGrammar(arr.slice(0, 3));

      // Option B (friendlier): keep first 3 selected and silently set
      const limited = arr.slice(0, 3);
      setSelectedGrammar(limited);
      // give subtle feedback
      Alert.alert("Limit reached", "Only the first 3 topics are kept.");
      return;
    }

    // normal case
    setSelectedGrammar(arr);
  };

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.label}>Grammar Topics (max 3)</Text>

      <MultiSelect
        style={[styles.dropdown, isFocus && { borderColor: "#2563EB" }]}
        data={grammarTopics.map((item) => ({ label: item, value: item }))}
        labelField="label"
        valueField="value"
        placeholder="Select up to 3 topics"
        search
        searchPlaceholder="Search topics..."
        value={selectedGrammar} // must be an array
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={handleSelect}
        maxHeight={300}
        selectedTextStyle={styles.selectedTextStyle}
        placeholderStyle={styles.placeholderStyle}
        itemTextStyle={{ color: "#111827" }}
        selectedStyle={styles.selectedStyle}
        // visibleSelectedItem={false} // optional
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
    // zIndex trên iOS thường ổn, trên Android cần xử lý container
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

export default GrammarDropdown;
