import { AccessTime } from "@mui/icons-material";
import { Card, CardContent, Typography } from "@mui/material";
import React from "react";

const CourseCard = ({ course }) => {
  return (
    <Card
      key={course.id}
      className="bg-white border border-gray-200 !rounded-xl hover:!shadow-2xl transition-shadow cursor-pointer overflow-hidden"
    >
      {/* Course Image */}
      <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="">
          <img
            src={course.image}
            alt={course.title}
            className="w-10 h-10 rounded-full"
          />
        </div>
      </div>

      <CardContent className="p-6">
        {/* Category and Duration */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
            <Typography variant="body2" className="text-gray-600 font-medium">
              {course.type}
            </Typography>
          </div>
          <div className="flex items-center space-x-2">
            <AccessTime />
            <Typography variant="body2" className="text-gray-600">
              {course.durationHours} hours
            </Typography>
          </div>
        </div>

        {/* Course Title */}
        <Typography
          variant="subtitle1"
          className="!font-black text-black !mb-1 "
        >
          {course.title}
        </Typography>

        {/* Course Description */}
        <Typography variant="body2" className="text-gray-600 ">
          {course.description}
        </Typography>

        {/* Instructor and Pricing */}
        <div className="flex items-center gap-2 justify-end mt-2">
          <Typography
            variant="body1"
            className="text-gray-600 line-through text-sm"
          >
            {course.originalPrice}
          </Typography>
          <Typography variant="h6" className="!font-bold text-teal-600">
            ${course.cost}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
