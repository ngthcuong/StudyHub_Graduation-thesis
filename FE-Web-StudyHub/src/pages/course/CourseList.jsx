import React, { useEffect, useState } from "react";
import {
  Box,
  Grid, // 👈 Sử dụng Grid của MUI v5 (từ code gốc của bạn)
  Pagination,
  TextField,
  InputAdornment,
  Typography,
  CircularProgress,
  Paper, // 👈 Thêm Paper để làm container
  Tabs, // 👈 Thêm Tabs
  Tab, // 👈 Thêm Tab
  Fade, // 👈 Thêm hiệu ứng
} from "@mui/material";
import {
  Search,
  School, // 👈 Icon cho tab "của bạn"
  Storefront, // 👈 Icon cho tab "thị trường"
  SentimentDissatisfied, // 👈 Icon cho trạng thái rỗng
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CourseCard from "../../components/CourseCard";
import {
  useGetMyCoursesMutation,
  useGetAllCoursesMutation,
} from "../../services/grammarLessonApi";

// Component con cho trạng thái rỗng
const EmptyState = ({ message }) => (
  <Box textAlign="center" py={10} color="text.secondary">
    <SentimentDissatisfied sx={{ fontSize: 48, mb: 2 }} />
    <Typography variant="h6">{message}</Typography>
  </Box>
);

const CourseList = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState([]); // Khóa học của tôi
  const [allCourses, setAllCourses] = useState([]); // Khóa học thị trường
  const [loading, setLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0); // 👈 State cho Tab

  const [getMyCourses] = useGetMyCoursesMutation();
  const [getAllCourses] = useGetAllCoursesMutation();

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const result = await getMyCourses(user._id).unwrap();
        const ownedCourses = result.courses || [];
        setCourses(ownedCourses);

        const res = await getAllCourses().unwrap();
        const all = res || [];

        const ownedIds = new Set(ownedCourses.map((c) => c._id));
        const filtered = all.filter((course) => !ownedIds.has(course._id));
        setAllCourses(filtered);
      } catch (error) {
        console.error("❌ Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [getMyCourses, getAllCourses, user._id]);

  // --- Logic Lọc & Phân trang cho Thị trường ---
  const filteredCourses = allCourses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pageSize = 8;
  // 💡 SỬA LỖI: pageCount phải dựa trên filteredCourses, không phải allCourses
  const pageCount = Math.ceil(filteredCourses.length / pageSize);

  // 💡 CẢI TIẾN: Reset về trang 1 khi tìm kiếm
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const paginatedCourses = filteredCourses.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // --- Xử lý sự kiện ---
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    // Reset tìm kiếm và phân trang khi chuyển tab
    setSearchTerm("");
    setPage(1);
  };

  // ------------------------------------
  // --- RENDER ---
  // ------------------------------------

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-[60vh]">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="bg-gray-50 py-10 px-4 md:px-10 min-h-screen">
      <Box className="max-w-7xl mx-auto">
        {/* Container chính với Paper */}
        <Paper elevation={2} sx={{ borderRadius: "16px", overflow: "hidden" }}>
          {/* Thanh Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabIndex}
              onChange={handleTabChange}
              variant="fullWidth"
              aria-label="course tabs"
            >
              <Tab
                label="My Courses"
                icon={<School />}
                iconPosition="start"
                id="my-courses-tab"
                aria-controls="my-courses-panel"
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "1rem",
                }}
              />
              <Tab
                label="Explore the market"
                icon={<Storefront />}
                iconPosition="start"
                id="market-courses-tab"
                aria-controls="market-courses-panel"
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "1rem",
                }}
              />
            </Tabs>
          </Box>

          {/* Panel 1: Khóa học của bạn */}
          <Fade in={tabIndex === 0} timeout={300}>
            <Box
              role="tabpanel"
              hidden={tabIndex !== 0}
              id="my-courses-panel"
              aria-labelledby="my-courses-tab"
              sx={{ p: { xs: 2, md: 4 } }}
            >
              {courses.length > 0 ? (
                <Grid container spacing={3}>
                  {courses.map((course, index) => (
                    <Grid xs={12} sm={6} md={3} key={course._id}>
                      {" "}
                      {/* 👈 Sửa Grid prop */}
                      <div
                        className="cursor-pointer transition-transform hover:scale-[1.02]"
                        onClick={() =>
                          navigate(`/course/${course._id}/lesson/${course.id}`)
                        }
                      >
                        <CourseCard
                          course={course}
                          index={index}
                          variant="owned"
                        />
                      </div>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <EmptyState message="Bạn chưa đăng ký khóa học nào." />
              )}
            </Box>
          </Fade>

          {/* Panel 2: Khóa học thị trường */}
          <Fade in={tabIndex === 1} timeout={300}>
            <Box
              role="tabpanel"
              hidden={tabIndex !== 1}
              id="market-courses-panel"
              aria-labelledby="market-courses-tab"
              sx={{ p: { xs: 2, md: 4 } }}
            >
              {/* 🔍 Search Bar (đã di chuyển vào đây) */}
              <Box className="mb-6">
                <TextField
                  placeholder="Tìm kiếm khóa học trên thị trường..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  variant="outlined"
                  fullWidth
                  sx={{
                    backgroundColor: "white",
                    "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                  }}
                  // 💡 SỬA LỖI: Dùng InputProps thay vì slotProps
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Search className="text-gray-400" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {/* 🛒 Lưới khóa học thị trường */}
              {paginatedCourses.length > 0 ? (
                <Grid container spacing={3}>
                  {paginatedCourses.map((course, index) => (
                    <Grid xs={12} sm={6} md={4} key={course._id}>
                      {" "}
                      {/* 👈 Sửa Grid prop */}
                      <div
                        className="cursor-pointer transition-transform hover:scale-[1.02]"
                        onClick={() => navigate(`/course/${course._id}`)}
                      >
                        <CourseCard
                          course={course}
                          index={index}
                          variant="market"
                        />
                      </div>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <EmptyState message="Không tìm thấy khóa học nào phù hợp." />
              )}

              {/* 📄 Pagination (chỉ hiển thị nếu cần) */}
              {pageCount > 1 && (
                <Box className="flex justify-center mt-10">
                  <Pagination
                    count={pageCount}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    color="primary"
                    variant="outlined"
                    shape="rounded"
                  />
                </Box>
              )}
            </Box>
          </Fade>
        </Paper>
      </Box>
    </Box>
  );
};

export default CourseList;
