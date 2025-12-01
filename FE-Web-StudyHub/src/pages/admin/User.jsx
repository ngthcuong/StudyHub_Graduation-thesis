import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Avatar,
  Button,
  Stack,
  CircularProgress,
  TablePagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
} from "@mui/material";
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  FilterAltOutlined,
  FilterAltOffOutlined,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  useGetUsersWithStatsQuery,
  useGetUserDetailWithCoursesQuery,
} from "../../services/userApi";
import UserDetailDialog from "../../components/UserDetailDialog";

const User = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Fetch users data from API
  const {
    data: usersData,
    isLoading: usersLoading,
    error: usersError,
  } = useGetUsersWithStatsQuery();

  // Fetch user detail when dialog is open
  const {
    data: userDetailData,
    isLoading: userDetailLoading,
    error: userDetailError,
  } = useGetUserDetailWithCoursesQuery(selectedUser?._id, {
    skip: !selectedUser?._id,
  });

  // Reset to first page when filters change
  useEffect(() => {
    setPage(0);
  }, [searchTerm, roleFilter, statusFilter, startDate, endDate]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClearAll = () => {
    setSearchTerm("");
    setRoleFilter("all");
    setStatusFilter("all");
    setStartDate(null);
    setEndDate(null);
    setPage(0);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  // Get users from API response
  const users = useMemo(() => usersData?.data || [], [usersData]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm);

    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;

    // Filter by date range
    let matchesDate = true;
    if (startDate || endDate) {
      const userDate = new Date(user.createdAt);
      if (startDate && endDate) {
        matchesDate = userDate >= startDate && userDate <= endDate;
      } else if (startDate) {
        matchesDate = userDate >= startDate;
      } else if (endDate) {
        matchesDate = userDate <= endDate;
      }
    }

    return matchesSearch && matchesRole && matchesStatus && matchesDate;
  });

  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Convert seconds to hours
  const secondsToHours = (totalSeconds) => {
    return Number(totalSeconds) / 3600;
  };

  // Show loading state
  if (usersLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress size={50} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading users...
        </Typography>
      </Box>
    );
  }

  // Show error state
  if (usersError) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <Typography variant="h6" color="error">
          Error loading users. Please try again.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, color: "#1f2937", mb: 1 }}
        >
          User Management
        </Typography>
        <Typography variant="body2" sx={{ color: "#6b7280" }}>
          Monitor and manage platform users and their learning progress
        </Typography>
      </Box>

      {/* Statistics Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item size={{ xs: 12, sm: 6, md: 6 }}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <PersonIcon sx={{ color: "#3b82f6", fontSize: 32, mr: 2 }} />
                <Box>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: "#1f2937" }}
                  >
                    {users.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Users
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item size={{ xs: 12, sm: 6, md: 6 }}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <TimeIcon sx={{ color: "#8b5cf6", fontSize: 32, mr: 2 }} />
                <Box>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: "#1f2937" }}
                  >
                    {Math.round(
                      users.reduce(
                        (total, user) =>
                          total +
                          (secondsToHours(user.stats?.totalStudyHoursOfUser) ||
                            0),
                        0
                      )
                    )}
                    h
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Study Hours
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filter */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
          mb: 2,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Search and Filter Bar */}
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems="center"
            className="w-full mb-2"
          >
            <TextField
              fullWidth
              placeholder="Search users by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
                minWidth: 250,
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
              Filter
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
              {filteredUsers.length} of {users.length} users
            </Typography>
          </Stack>

          {/* Date Filter Panel */}
          {showFilter && (
            <Box sx={{ mt: 2, p: 2, bgcolor: "#f9fafb", borderRadius: 2 }}>
              <Typography variant="body2" color="#64748b" sx={{ mb: 1.5 }}>
                Registration Date Range
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
                      } else {
                        setStartDate(null);
                      }
                    }}
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
                    slotProps={{ textField: { size: "small" } }}
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
          )}
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
          mb: 3,
        }}
      >
        <CardContent sx={{ p: 0 }}>
          {filteredUsers.length === 0 ? (
            <Box sx={{ textAlign: "center", p: 6 }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                No Users Found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {searchTerm ||
                roleFilter !== "all" ||
                statusFilter !== "all" ||
                startDate ||
                endDate
                  ? "Try adjusting your search criteria or filters"
                  : "No users have been registered yet"}
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                    <TableCell>User</TableCell>
                    <TableCell align="center">Courses</TableCell>
                    <TableCell align="center">Lessons</TableCell>
                    <TableCell align="center">Custom Tests</TableCell>
                    <TableCell align="center">Study Hours</TableCell>
                    <TableCell align="center">Certificates</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedUsers.map((user) => (
                    <TableRow
                      key={user._id}
                      sx={{
                        "&:hover": { bgcolor: "#f8f9fa" },
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Avatar
                            src={user.avatarUrl}
                            sx={{
                              width: 40,
                              height: 40,
                              mr: 2,
                              bgcolor: "#1976d2",
                            }}
                          >
                            {user.fullName?.charAt(0) || "U"}
                          </Avatar>
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {user.fullName || "Unknown"}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {user.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {user.stats?.purchasedCoursesCount || 0}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {user.stats?.completedLessonsCount || 0}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {user.stats?.customTestsCount || 0}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {Math.round(user.stats?.totalStudyHours || 0)}h
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {user.stats?.certificatesEarned || 0}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          onClick={() => handleViewUser(user)}
                          size="small"
                          sx={{
                            color: "#1976d2",
                            "&:hover": { bgcolor: "#e3f2fd" },
                          }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Pagination */}
          <TablePagination
            component="div"
            count={filteredUsers.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </CardContent>
      </Card>

      {/* User Detail Dialog */}
      <UserDetailDialog
        open={openDialog}
        onClose={handleCloseDialog}
        selectedUser={selectedUser}
        userDetailData={userDetailData}
        userDetailLoading={userDetailLoading}
        userDetailError={userDetailError}
      />
    </Box>
  );
};

export default User;
