import React, { useState, useEffect, useCallback, useMemo } from "react";
import CertificateDetailModal from "../../components/CertificateDetailModal";
import { useGetAllCertificatesQuery } from "../../services/certificateApi";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  TextField,
  InputAdornment,
  Avatar,
  Button,
  Select,
  MenuItem,
  Stack,
  LinearProgress,
} from "@mui/material";
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  EmojiEvents as CertificateIcon,
  FilterAltOutlined,
  FilterAltOffOutlined,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import CertificateVerificationBadge from "../../components/CertificateVerificationBadge";

const Certificate = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState("All");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredCertificates, setFilteredCertificates] = useState([]);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [openDetailModal, setOpenDetailModal] = useState(false);

  const {
    data: apiCertificates,
    isLoading,
    error,
    refetch,
  } = useGetAllCertificatesQuery();

  const certificates = useMemo(() => {
    const certs = apiCertificates?.certificates || [];
    return certs;
  }, [apiCertificates]);

  const verificationSummary = useMemo(() => {
    return (
      apiCertificates?.verificationSummary || {
        total: 0,
        trusted: 0,
        warning: 0,
        rejected: 0,
      }
    );
  }, [apiCertificates]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClearAll = () => {
    setSearchTerm("");
    setVerificationStatus("All");
    setStartDate(null);
    setEndDate(null);
  };

  const filterCertificates = useCallback(() => {
    // Ensure certificates is always an array
    if (!Array.isArray(certificates)) {
      setFilteredCertificates([]);
      return;
    }

    let filtered = [...certificates];

    // Filter by search term (certificate ID, course name, or student name)
    if (searchTerm) {
      filtered = filtered.filter(
        (cert) =>
          cert?.certificateCode
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          cert?.course?.title
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          cert?.student?.fullName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Filter by verification status
    if (verificationStatus && verificationStatus !== "All") {
      filtered = filtered.filter((cert) => {
        const trustLevel = cert.verification?.trustLevel?.toLowerCase();
        if (verificationStatus === "Trusted") return trustLevel === "trusted";
        if (verificationStatus === "Warning") return trustLevel === "warning";
        if (verificationStatus === "Rejected") return trustLevel === "rejected";
        if (verificationStatus === "Unknown") return trustLevel === "unknown";
        return true;
      });
    }

    // Filter by date range
    if (startDate && endDate) {
      filtered = filtered.filter((cert) => {
        const issueDate = new Date(cert?.validity?.issueDate || cert.createdAt);
        return issueDate >= startDate && issueDate <= endDate;
      });
    } else if (startDate) {
      filtered = filtered.filter((cert) => {
        const issueDate = new Date(cert?.validity?.issueDate || cert.createdAt);
        return issueDate >= startDate;
      });
    } else if (endDate) {
      filtered = filtered.filter((cert) => {
        const issueDate = new Date(cert?.validity?.issueDate || cert.createdAt);
        return issueDate <= endDate;
      });
    }

    setFilteredCertificates(filtered);
    setPage(0);
  }, [certificates, searchTerm, verificationStatus, startDate, endDate]);

  // View certificate details
  const handleViewDetails = (certificate) => {
    setSelectedCertificate(certificate);
    setOpenDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setOpenDetailModal(false);
    setSelectedCertificate(null);
  };

  // Filter certificates
  useEffect(() => {
    // Only filter if certificates is available and valid
    if (certificates && Array.isArray(certificates)) {
      filterCertificates();
    }
  }, [certificates, filterCertificates]);

  // Format date for display
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, color: "#1f2937", mb: 1 }}
        >
          Certificate Management
        </Typography>
        <Typography variant="body2" sx={{ color: "#6b7280" }}>
          View and manage all issued certificates
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Card
          sx={{
            flex: 1,
            borderRadius: 3,
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Total Certificates
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {isLoading ? "..." : certificates.length}
                </Typography>
              </Box>
              <Box
                sx={{
                  backgroundColor: "#dbeafe",
                  borderRadius: 2,
                  p: 1.5,
                }}
              >
                <CertificateIcon sx={{ color: "#1976d2", fontSize: 32 }} />
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card
          sx={{
            flex: 1,
            borderRadius: 3,
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Verified & Trusted
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: "#10b981" }}
                >
                  {isLoading ? "..." : verificationSummary.trusted}
                </Typography>
              </Box>
              <Box
                sx={{
                  backgroundColor: "#d1fae5",
                  borderRadius: 2,
                  p: 1.5,
                }}
              >
                <CertificateIcon sx={{ color: "#10b981", fontSize: 32 }} />
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card
          sx={{
            flex: 1,
            borderRadius: 3,
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  With Warnings
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: "#f59e0b" }}
                >
                  {isLoading ? "..." : verificationSummary.warning}
                </Typography>
              </Box>
              <Box
                sx={{
                  backgroundColor: "#fef3c7",
                  borderRadius: 2,
                  p: 1.5,
                }}
              >
                <CertificateIcon sx={{ color: "#f59e0b", fontSize: 32 }} />
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card
          sx={{
            flex: 1,
            borderRadius: 3,
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Invalid/Rejected
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: "#ef4444" }}
                >
                  {isLoading ? "..." : verificationSummary.rejected}
                </Typography>
              </Box>
              <Box
                sx={{
                  backgroundColor: "#fee2e2",
                  borderRadius: 2,
                  p: 1.5,
                }}
              >
                <CertificateIcon sx={{ color: "#ef4444", fontSize: 32 }} />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Table Card */}
      <Card
        sx={{ borderRadius: 3, boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)" }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Search and Filters */}
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems="center"
            className="w-full mb-4"
          >
            <TextField
              fullWidth
              placeholder="Search certificates by course, student name, or certificate ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
                minWidth: 220,
              }}
            />
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setShowFilter((v) => !v)}
              sx={{ textTransform: "none", fontWeight: 600, minWidth: 100 }}
              startIcon={
                !showFilter ? <FilterAltOutlined /> : <FilterAltOffOutlined />
              }
            >
              Filters
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleClearAll}
              sx={{ textTransform: "none", minWidth: 100 }}
            >
              Clear All
            </Button>
            <Typography
              variant="body2"
              color="#64748b"
              sx={{ minWidth: 100, textAlign: "center" }}
            >
              {filteredCertificates.length} of {certificates.length} items
            </Typography>
          </Stack>

          {/* Filters Panel */}
          {showFilter && (
            <Box sx={{ mb: 3, p: 2, bgcolor: "#f9fafb", borderRadius: 2 }}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                alignItems="center"
              >
                {/* Verification Status Filter */}
                <Box sx={{ minWidth: 200 }}>
                  <Typography variant="body2" color="#64748b" sx={{ mb: 0.5 }}>
                    Verification Status
                  </Typography>
                  <Select
                    value={verificationStatus}
                    onChange={(e) => setVerificationStatus(e.target.value)}
                    size="small"
                    fullWidth
                  >
                    <MenuItem value="All">
                      All
                      {verificationSummary && (
                        <Typography
                          component="span"
                          variant="caption"
                          sx={{ ml: 1, color: "#94a3b8" }}
                        >
                          ({verificationSummary.total || 0})
                        </Typography>
                      )}
                    </MenuItem>
                    <MenuItem value="Trusted">
                      Trusted
                      {verificationSummary && (
                        <Typography
                          component="span"
                          variant="caption"
                          sx={{ ml: 1, color: "#94a3b8" }}
                        >
                          ({verificationSummary.trusted || 0})
                        </Typography>
                      )}
                    </MenuItem>
                    <MenuItem value="Warning">
                      Warning
                      {verificationSummary && (
                        <Typography
                          component="span"
                          variant="caption"
                          sx={{ ml: 1, color: "#94a3b8" }}
                        >
                          ({verificationSummary.warning || 0})
                        </Typography>
                      )}
                    </MenuItem>
                    <MenuItem value="Rejected">
                      Rejected
                      {verificationSummary && (
                        <Typography
                          component="span"
                          variant="caption"
                          sx={{ ml: 1, color: "#94a3b8" }}
                        >
                          ({verificationSummary.rejected || 0})
                        </Typography>
                      )}
                    </MenuItem>
                    <MenuItem value="Unknown">Unknown</MenuItem>
                  </Select>
                </Box>

                {/* Date Range */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" color="#64748b" sx={{ mb: 0.5 }}>
                    Issue Date Range
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="From Date"
                        value={startDate}
                        onChange={(newDate) => {
                          if (newDate) {
                            const date = new Date(newDate);
                            date.setHours(0, 0, 0, 0);
                            setStartDate(date);
                            if (endDate && endDate < date) {
                              setEndDate(null);
                            }
                          } else {
                            setStartDate(null);
                          }
                        }}
                        format="dd/MM/yyyy"
                        maxDate={endDate || new Date()}
                        slotProps={{ textField: { size: "small" } }}
                      />
                      <DatePicker
                        label="To Date"
                        value={endDate}
                        onChange={(newDate) => {
                          if (newDate) {
                            const date = new Date(newDate);
                            date.setHours(23, 59, 59, 999);
                            setEndDate(date);
                          } else {
                            setEndDate(null);
                          }
                        }}
                        format="dd/MM/yyyy"
                        minDate={startDate || undefined}
                        maxDate={new Date()}
                        slotProps={{
                          textField: {
                            size: "small",
                            error: startDate && endDate && endDate < startDate,
                            helperText:
                              startDate && endDate && endDate < startDate
                                ? "To Date must be after From Date"
                                : "",
                          },
                        }}
                      />
                    </LocalizationProvider>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        setStartDate(null);
                        setEndDate(null);
                      }}
                      sx={{ textTransform: "none" }}
                    >
                      Clear
                    </Button>
                  </Stack>
                </Box>
              </Stack>
            </Box>
          )}

          {/* Table */}
          {isLoading ? (
            <LinearProgress />
          ) : error ? (
            <Box sx={{ p: 3, textAlign: "center", color: "error.main" }}>
              <Typography>
                Error loading certificates. Please try again.
              </Typography>
              <Button onClick={refetch} sx={{ mt: 2 }}>
                Retry
              </Button>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f9fafb" }}>
                    <TableCell sx={{ fontWeight: 600 }}>
                      Certificate ID
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Student</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Course</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Issue Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Verification</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCertificates.length > 0 ? (
                    filteredCertificates
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((cert) => (
                        <TableRow key={cert.certificateCode || cert.id} hover>
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, color: "#1976d2" }}
                            >
                              {cert.certificateCode}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 600 }}
                              >
                                {cert.student?.name || "N/A"}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {cert.course?.title || "N/A"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {cert.validity?.issueDate
                                ? formatDate(cert.validity.issueDate)
                                : "N/A"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <CertificateVerificationBadge
                              verification={cert.verification}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              onClick={() => handleViewDetails(cert)}
                              sx={{
                                color: "#1976d2",
                                "&:hover": { backgroundColor: "#dbeafe" },
                              }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">
                          {certificates.length === 0
                            ? "No certificates available"
                            : "No certificates match the filter criteria"}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Pagination */}
          <TablePagination
            component="div"
            count={filteredCertificates.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </CardContent>
      </Card>

      {/* Certificate Detail Modal */}
      <CertificateDetailModal
        open={openDetailModal}
        onClose={handleCloseDetailModal}
        certificate={selectedCertificate}
      />
    </Box>
  );
};

export default Certificate;
