import React, { useState, useEffect } from "react";
import HeaderHome from "./HeaderHome";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Chip,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
  LinearProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

// Mock data for certificates
const mockCertificates = [
  {
    id: "CERT001",
    courseName: "English Grammar Mastery",
    issueDate: new Date(2025, 3, 15),
    status: "verified",
  },
  {
    id: "CERT002",
    courseName: "TOEIC Speaking Skills",
    issueDate: new Date(2025, 5, 22),
    status: "pending",
  },
  {
    id: "CERT003",
    courseName: "Business English",
    issueDate: new Date(2025, 6, 10),
    status: "verified",
  },
  {
    id: "CERT004",
    courseName: "IELTS Writing",
    issueDate: new Date(2025, 7, 5),
    status: "verified",
  },
  {
    id: "CERT005",
    courseName: "Academic Vocabulary",
    issueDate: new Date(2025, 8, 18),
    status: "pending",
  },
  {
    id: "CERT006",
    courseName: "Conversational English",
    issueDate: new Date(2025, 8, 25),
    status: "verified",
  },
];

export default function Achievements() {
  const [certificates, setCertificates] = useState([]);
  const [filteredCertificates, setFilteredCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [certificateToDelete, setCertificateToDelete] = useState(null);
  const [showDateFilter, setShowDateFilter] = useState(false);

  // Certificate types for filter
  const certificateTypes = [
    { value: "", label: "All Types" },
    { value: "verified", label: "Verified" },
    { value: "pending", label: "Pending Verification" },
  ];

  // Load certificates data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCertificates(mockCertificates);
      setFilteredCertificates(mockCertificates);
      setLoading(false);
    }, 1000);
  }, []);

  // Handle filtering when filter criteria change
  useEffect(() => {
    filterCertificates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKeyword, typeFilter, startDate, endDate, certificates]);

  // Apply all filters
  const filterCertificates = () => {
    let filtered = [...certificates];

    // Filter by keyword (certificate ID or course name)
    if (searchKeyword) {
      filtered = filtered.filter(
        (cert) =>
          cert.id.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          cert.courseName.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    // Filter by certificate type/status
    if (typeFilter) {
      filtered = filtered.filter((cert) => cert.status === typeFilter);
    }

    // Filter by date range
    if (startDate && endDate) {
      filtered = filtered.filter((cert) => {
        const issueDate = new Date(cert.issueDate);
        return issueDate >= startDate && issueDate <= endDate;
      });
    } else if (startDate) {
      filtered = filtered.filter((cert) => {
        const issueDate = new Date(cert.issueDate);
        return issueDate >= startDate;
      });
    } else if (endDate) {
      filtered = filtered.filter((cert) => {
        const issueDate = new Date(cert.issueDate);
        return issueDate <= endDate;
      });
    }

    setFilteredCertificates(filtered);
    setPage(0);
  };

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
  const handleOpenDeleteDialog = (certificate) => {
    setCertificateToDelete(certificate);
    setOpenDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDialog(false);
    setCertificateToDelete(null);
  };

  const handleDeleteCertificate = () => {
    const updatedCertificates = certificates.filter(
      (cert) => cert.id !== certificateToDelete.id
    );
    setCertificates(updatedCertificates);
    setOpenDialog(false);
  };

  // View certificate details
  const handleViewDetails = (certificate) => {};

  // Add new certificate
  const handleAddCertificate = () => {};

  // Toggle date filter visibility
  const toggleDateFilter = () => {
    setShowDateFilter(!showDateFilter);
  };

  return (
    <div className="w-full bg-white min-h-screen">
      <Box className="container mx-auto px-4 py-6">
        {/* Filters */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between mb-4">
            <Typography variant="h6" className="text-blue-700 mb-3 sm:mb-0">
              <FilterAltIcon className="mr-2 align-middle" />
              Filter Certificates
            </Typography>

            {/* Search by keyword */}
            <div className="flex-grow sm:max-w-xs sm:ml-4">
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                placeholder="Search by ID or Name"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon className="mr-2 text-gray-400" />,
                }}
                className="bg-white"
              />
            </div>

            {/* Type filter */}
            <FormControl
              size="small"
              className="min-w-[160px] ml-0 sm:ml-4 mt-3 sm:mt-0"
            >
              <InputLabel id="type-filter-label">Certificate Status</InputLabel>
              <Select
                labelId="type-filter-label"
                id="type-filter"
                value={typeFilter}
                label="Certificate Status"
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-white"
              >
                {certificateTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Date filter toggle button */}
            <Button
              variant="outlined"
              color="primary"
              startIcon={<CalendarMonthIcon />}
              onClick={toggleDateFilter}
              className="mt-3 sm:mt-0 ml-0 sm:ml-4"
            >
              {showDateFilter ? "Hide Date Filter" : "Date Filter"}
            </Button>
          </div>

          {/* Date range filter */}
          {showDateFilter && (
            <div className="flex flex-wrap items-center mt-4">
              <TextField
                label="From Date"
                type="date"
                value={
                  startDate
                    ? new Date(startDate).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setStartDate(e.target.value ? new Date(e.target.value) : null)
                }
                className="bg-white mr-4 mb-2 sm:mb-0"
                size="small"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="To Date"
                type="date"
                value={
                  endDate ? new Date(endDate).toISOString().split("T")[0] : ""
                }
                onChange={(e) =>
                  setEndDate(e.target.value ? new Date(e.target.value) : null)
                }
                className="bg-white"
                size="small"
                InputLabelProps={{
                  shrink: true,
                }}
              />

              {(startDate || endDate) && (
                <Button
                  color="secondary"
                  size="small"
                  onClick={() => {
                    setStartDate(null);
                    setEndDate(null);
                  }}
                  className="ml-4"
                >
                  Clear Dates
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Add New Certificate Button */}
        <Box className="flex justify-between items-center mb-4">
          <Typography variant="body1" className="text-gray-600">
            Showing{" "}
            {filteredCertificates.length > 0 ? page * rowsPerPage + 1 : 0} -{" "}
            {Math.min((page + 1) * rowsPerPage, filteredCertificates.length)} of{" "}
            {filteredCertificates.length} certificates
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleAddCertificate}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Add Certificate
          </Button>
        </Box>

        {/* Certificates Table */}
        {loading ? (
          <Box className="my-8 text-center">
            <LinearProgress className="mb-4" />
            <Typography>Loading certificates...</Typography>
          </Box>
        ) : (
          <>
            {filteredCertificates.length > 0 ? (
              <TableContainer component={Paper} className="shadow-md">
                <Table aria-label="certificates table">
                  <TableHead className="bg-blue-50">
                    <TableRow>
                      <TableCell className="font-bold text-blue-800">
                        Certificate ID
                      </TableCell>
                      <TableCell className="font-bold text-blue-800">
                        Course Name
                      </TableCell>
                      <TableCell className="font-bold text-blue-800">
                        Issue Date
                      </TableCell>
                      <TableCell className="font-bold text-blue-800">
                        Status
                      </TableCell>
                      <TableCell className="font-bold text-blue-800 text-center">
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
                      .map((certificate) => (
                        <TableRow key={certificate.id} hover>
                          <TableCell className="font-medium">
                            {certificate.id}
                          </TableCell>
                          <TableCell>{certificate.courseName}</TableCell>
                          <TableCell>
                            {formatDate(certificate.issueDate)}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={
                                certificate.status === "verified"
                                  ? "Verified"
                                  : "Pending"
                              }
                              color={
                                certificate.status === "verified"
                                  ? "success"
                                  : "warning"
                              }
                              size="small"
                              variant="outlined"
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
                            <Tooltip title="Delete">
                              <IconButton
                                color="error"
                                onClick={() =>
                                  handleOpenDeleteDialog(certificate)
                                }
                                size="small"
                              >
                                <DeleteIcon />
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
    </div>
  );
}
