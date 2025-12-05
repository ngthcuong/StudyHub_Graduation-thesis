import React, { useState, useEffect, useCallback, useMemo } from "react";
import CertificateDetailModal from "../../components/CertificateDetailModal";
import { useGetCertificateByWalletAddressQuery } from "../../services/certificateApi";
import { useSelector } from "react-redux";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
  LinearProgress,
  Stack,
  InputAdornment,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { FilterAltOffOutlined, FilterAltOutlined } from "@mui/icons-material";
import CertificateTemplate from "../../components/CertificateTemplate";
import CertificateVerificationBadge from "../../components/CertificateVerificationBadge";

const statusOptions = ["All", "Trusted", "Warning", "Rejected", "Unknown"];

export default function Certificate() {
  const [filteredCertificates, setFilteredCertificates] = useState([]);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [status, setStatus] = useState("All");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);

  const [certificateToDelete, setCertificateToDelete] = useState(null);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [openDetailModal, setOpenDetailModal] = useState(false);

  const [showFilter, setShowFilter] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const walletAddress = user?.walletAddress;

  const {
    data: apiCertificates,
    isLoading,
    error,
    refetch,
  } = useGetCertificateByWalletAddressQuery(walletAddress);

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

  const handleClearAll = () => {
    setSearchKeyword("");
    setStatus("All");
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

    // Filter by keyword (certificate ID or course name)
    if (searchKeyword) {
      filtered = filtered.filter(
        (cert) =>
          cert?.certCode?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          cert?.courseName?.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    // Filter by verification status
    if (status && status !== "All") {
      filtered = filtered.filter((cert) => {
        const trustLevel = cert.verification?.trustLevel?.toLowerCase();
        if (status === "Trusted") return trustLevel === "trusted";
        if (status === "Warning") return trustLevel === "warning";
        if (status === "Rejected") return trustLevel === "rejected";
        if (status === "Unknown") return trustLevel === "unknown";
        return true;
      });
    }

    // Filter by date range
    if (startDate && endDate) {
      filtered = filtered.filter((cert) => {
        const issueDate = new Date(cert.issueDate || cert.createdAt);
        return issueDate >= startDate && issueDate <= endDate;
      });
    } else if (startDate) {
      filtered = filtered.filter((cert) => {
        const issueDate = new Date(cert.issueDate || cert.createdAt);
        return issueDate >= startDate;
      });
    } else if (endDate) {
      filtered = filtered.filter((cert) => {
        const issueDate = new Date(cert.issueDate || cert.createdAt);
        return issueDate <= endDate;
      });
    }

    setFilteredCertificates(filtered);
    setPage(0);
  }, [certificates, searchKeyword, status, startDate, endDate]);

  // Handle filtering when filter criteria change
  useEffect(() => {
    // Only filter if certificates is available and valid
    if (certificates && Array.isArray(certificates)) {
      filterCertificates();
    }
  }, [certificates, filterCertificates]);

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Format date for display
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Delete certificate handlers
  // const handleOpenDeleteDialog = (certificate) => {
  //   setCertificateToDelete(certificate);
  //   setOpenDialog(true);
  // };

  const handleCloseDeleteDialog = () => {
    setOpenDialog(false);
    setCertificateToDelete(null);
  };

  const handleDeleteCertificate = () => {
    setOpenDialog(false);
    refetch();
  };

  // View certificate details
  const handleViewDetails = (certificate) => {
    setSelectedCertificate(certificate);
    setOpenDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setOpenDetailModal(false);
    setSelectedCertificate(null);
  };

  // Add new certificate
  // const handleAddCertificate = () => {};

  return (
    <div className="w-full bg-white min-h-screen">
      <Box className="container mx-auto px-4 py-6">
        {/* Search and Filters */}
        <Box className="bg-white rounded-xl shadow p-4 mb-4">
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems="center"
            className="w-full"
          >
            <TextField
              placeholder="Search your certificate with keyword..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              fullWidth
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ minWidth: 220 }}
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

          {/* Bộ lọc chỉ hiện khi showFilter = true */}
          {showFilter && (
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              alignItems="center"
            >
              {/* Verification Status Filter */}
              <Box className="flex flex-col w-full md:w-auto">
                <Typography variant="body2" color="#64748b" sx={{ mb: 0.5 }}>
                  Verification Status
                </Typography>
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  size="small"
                  sx={{ minWidth: 160 }}
                >
                  {statusOptions.map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
                      {opt !== "All" && verificationSummary && (
                        <Typography
                          component="span"
                          variant="caption"
                          sx={{ ml: 1, color: "#94a3b8" }}
                        >
                          ({verificationSummary[opt.toLowerCase()] || 0})
                        </Typography>
                      )}
                    </MenuItem>
                  ))}
                </Select>
              </Box>

              {/* Issued Date Range */}
              <div className="flex flex-col w-full mt-4 p-4 rounded-lg">
                <Typography
                  variant="body2"
                  className="text-gray-700 font-medium mb-3"
                >
                  Select date range:
                </Typography>
                <div className="flex flex-wrap items-center gap-4">
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
                      className="bg-white"
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
                      className="bg-white"
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
                    className="text-blue-600 border-blue-600 hover:bg-blue-50 !normal-case"
                  >
                    Clear range
                  </Button>
                </div>
              </div>
            </Stack>
          )}
        </Box>

        {/* Add New Certificate Button */}
        {/* <Box className="flex items-center mb-4 w-full justify-end">
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleAddCertificate}
            className="bg-blue-600 hover:bg-blue-700 !normal-case"
          >
            Add Certificate
          </Button>
        </Box> */}

        {/* Certificates Table */}
        {isLoading ? (
          <Box className="my-8 text-center">
            <LinearProgress className="mb-4" />
            <Typography>Loading certificates...</Typography>
          </Box>
        ) : error ? (
          <Box className="text-center py-8 bg-red-50 rounded-lg">
            <Typography variant="h6" className="text-red-500 mb-2">
              Error loading certificates
            </Typography>
            <Typography variant="body2" className="text-red-400">
              {error?.data?.message || "Failed to load certificates"}
            </Typography>
          </Box>
        ) : (
          <>
            {filteredCertificates.length > 0 ? (
              <TableContainer component={Paper} className="shadow-md">
                <Table aria-label="certificates table">
                  <TableHead className="bg-blue-50">
                    <TableRow>
                      <TableCell className="font-bold text-blue-800">
                        Certificate Code
                      </TableCell>
                      <TableCell className="font-bold text-blue-800">
                        Course Name
                      </TableCell>
                      <TableCell className="font-bold text-blue-800">
                        Issue Date
                      </TableCell>
                      <TableCell className="font-bold text-blue-800">
                        Verification
                      </TableCell>
                      <TableCell className="font-bold text-blue-800 !text-center">
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredCertificates
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((certificate, index) => (
                        <TableRow key={index} hover>
                          <TableCell className="font-medium">
                            {certificate.certificateCode}
                          </TableCell>
                          <TableCell>{certificate.course.title}</TableCell>
                          <TableCell>
                            {formatDate(certificate.validity.issueDate)}
                          </TableCell>
                          <TableCell>
                            <CertificateVerificationBadge
                              verification={certificate.verification}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip title="View Details">
                              <IconButton
                                color="primary"
                                onClick={() => handleViewDetails(certificate)}
                                size="small"
                              >
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>

                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={filteredCertificates.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableContainer>
            ) : (
              <Box className="text-center py-8 bg-gray-50 rounded-lg">
                <Typography variant="h6" className="text-gray-500 mb-2">
                  No certificates found
                </Typography>
                <Typography variant="body2" className="text-gray-400">
                  {certificates.length > 0
                    ? "Try adjusting your search or filter criteria"
                    : "You haven't added any certificates yet"}
                </Typography>
              </Box>
            )}
          </>
        )}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle className="text-red-600">Delete Certificate</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete certificate{" "}
            <b>{certificateToDelete?.id}</b> for course{" "}
            <b>{certificateToDelete?.courseName}</b>? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteCertificate}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Certificate Detail Modal */}
      <CertificateDetailModal
        open={openDetailModal}
        onClose={handleCloseDetailModal}
        certificate={selectedCertificate}
      />

      {/* <CertificateTemplate
        open={openDetailModal}
        onClose={handleCloseDetailModal}
        certificate={selectedCertificate}
      /> */}
    </div>
  );
}
