import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Pagination,
  TextField,
  InputAdornment,
  Chip,
  Button,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import CourseCard from "../../components/CourseCard";
import { mockCourses } from "../../mock/mockCourse";
import { useGetMyCoursesMutation } from "../../services/grammarLessonApi";
import { useSelector } from "react-redux";

const CourseList = ({ variant = "market" }) => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState([]);

  const user = useSelector((state) => state.auth.user);

  const [getMyCourses] = useGetMyCoursesMutation();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const result = await getMyCourses(user._id).unwrap();
        setCourses(result.courses || []);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };

    fetchCourses();
  }, [getMyCourses]);

  const pageSize = 6;
  const pageCount = Math.ceil(mockCourses.length / pageSize);
  // const pagedCourses = mockCourses.slice(
  //   (page - 1) * pageSize,
  //   page * pageSize
  // );

  return (
    <Box className="min-h-fit bg-white py-8 px-6">
      <Box className="max-w-7xl mx-auto">
        {/* Search and Filter Bar */}
        <Box className="flex gap-4 mb-6 flex-wrap">
          <TextField
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            className="flex-1 min-w-[200px]"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <Search className="text-gray-400" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        {variant !== "market" && (
          <Button onClick={() => navigate("/course")}>Find more</Button>
        )}

        {/* Course Grid */}
        <Grid container spacing={3}>
          {courses?.map((course, index) => (
            <Grid size={{ xs: 12, md: 3 }} key={course.id}>
              <div
                onClick={() => {
                  if (variant === "owned")
                    navigate(`/course/${course._id}/lesson/${course.id}`);
                  else navigate(`/course/${course.id}`);
                }}
              >
                <CourseCard course={course} index={index} variant="owned" />
              </div>
            </Grid>
          ))}
        </Grid>

        {/* Pagination */}
        <Box className="flex justify-center mt-8">
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            variant="outlined"
            shape="rounded"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default CourseList;
