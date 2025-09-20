import React, { useState } from "react";
import {
  Box,
  Grid,
  Pagination,
  TextField,
  InputAdornment,
  Chip,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import CourseCard from "../../components/CourseCard";
import { mockCourses } from "../../mock/mockCourse";

const CourseList = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const pageSize = 6;
  const pageCount = Math.ceil(mockCourses.length / pageSize);
  const pagedCourses = mockCourses.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <Box className="min-h-screen bg-gray-50 py-8 px-4">
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

        {/* Course Grid */}
        <Grid container spacing={3}>
          {pagedCourses.map((course, index) => (
            <Grid size={{ xs: 12, md: 3 }} key={course.id}>
              <div onClick={() => navigate(`/course/${course.id}`)}>
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
