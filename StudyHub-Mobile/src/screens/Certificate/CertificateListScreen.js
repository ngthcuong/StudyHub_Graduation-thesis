import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";

const CertificateListScreen = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const route = useRoute();
  const { userInfo } = route.params || {};

  const certificates = [
    {
      id: "1",
      code: "CERT-251001-9CVK2I",
      course: "Blockchain Development Fundamentals",
      date: "02/10/2025",
    },
    {
      id: "2",
      code: "CERT-251002-2PV4WT",
      course: "English for IT Professionals",
      date: "03/10/2025",
    },
    {
      id: "3",
      code: "CERT-251002-1TAZZN",
      course: "English for IT Professionals",
      date: "03/10/2025",
    },
    {
      id: "4",
      code: "CERT-251002-222YGZ",
      course: "English for IT Professionals",
      date: "03/10/2025",
    },
    {
      id: "5",
      code: "CERT-251003-VYCZEG",
      course: "English for IT Professionals",
      date: "03/10/2025",
    },
  ];

  const filtered = certificates.filter(
    (item) =>
      item.code.toLowerCase().includes(search.toLowerCase()) ||
      item.course.toLowerCase().includes(search.toLowerCase())
  );

  const handleView = (item) => {
    navigation.navigate("CertificateDetail", { item });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Thanh tìm kiếm */}
      <View style={styles.searchBar}>
        <View style={styles.searchInput}>
          <Ionicons name="search" size={20} color="#888" />
          <TextInput
            placeholder="Search your certificate..."
            style={styles.input}
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Feather name="filter" size={18} color="#fff" />
          <Text style={styles.filterText}>Filters</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => setSearch("")}
        >
          <Feather name="x-circle" size={18} color="#007bff" />
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>

      {/* Bộ lọc thông tin */}
      <Text style={styles.filterInfo}>
        {filtered.length} of {certificates.length} items
      </Text>

      {/* Danh sách chứng chỉ */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.code}>{item.code}</Text>
              <Text style={styles.course}>{item.course}</Text>
              <View style={styles.dateRow}>
                <Ionicons name="calendar-outline" size={18} color="#888" />
                <Text style={styles.date}>{item.date}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.viewButton}
              onPress={() => handleView(item)}
            >
              <Ionicons name="eye-outline" size={24} color="#007bff" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No certificates found.</Text>
        }
      />

      {/* Phân trang */}
      <View style={styles.pagination}>
        <Text style={styles.paginationText}>
          Rows per page: <Text style={{ fontWeight: "600" }}>5</Text>
        </Text>
        <Text style={styles.paginationText}>
          1-{filtered.length} of {certificates.length}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default CertificateListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 15,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  input: {
    flex: 1,
    marginLeft: 5,
    height: 40,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007bff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  filterText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 5,
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e9f0ff",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  clearText: {
    color: "#007bff",
    fontWeight: "600",
    marginLeft: 5,
  },
  filterInfo: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  code: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#333",
  },
  course: {
    color: "#666",
    marginTop: 2,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 5,
  },
  date: {
    color: "#999",
    marginTop: 2,
  },
  viewButton: {
    padding: 8,
  },
  empty: {
    textAlign: "center",
    color: "#777",
    marginTop: 20,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingTop: 10,
  },
  paginationText: {
    color: "#555",
  },

  // ===== Modal =====
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#007bff",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    gap: 8,
  },
  detailText: {
    fontSize: 15,
    color: "#333",
  },
  closeButton: {
    flexDirection: "row",
    backgroundColor: "#007bff",
    borderRadius: 8,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
});
