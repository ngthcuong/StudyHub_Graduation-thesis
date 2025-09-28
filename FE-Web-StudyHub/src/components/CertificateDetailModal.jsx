import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Button,
  Chip,
} from "@mui/material";
import {
  Close as CloseIcon,
  Star as StarIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  MenuBook as MenuBookIcon,
} from "@mui/icons-material";
import { useSelector } from "react-redux";

const CertificateDetailModal = ({ open, onClose, certificate }) => {
  const user = useSelector((state) => state.auth.user);

  if (!certificate) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: "90vh",
        },
      }}
    >
      {/* Header */}
      <DialogTitle className="bg-white border-b border-gray-100">
        <div className="flex items-center justify-between">
          <Typography variant="h5" className="font-bold flex items-center">
            Certificate Details
          </Typography>
          <IconButton
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>

      <DialogContent className="bg-gray-50 p-6">
        <div className="space-y-5">
          {/* Certificate Information Section */}
          <div className="bg-white rounded-lg px-5 py-4 shadow-sm">
            <div className="flex items-center mb-4">
              <StarIcon className="text-blue-600 mr-2" />
              <Typography variant="h6" className="text-blue-700 font-semibold">
                Certificate Information
              </Typography>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Typography variant="body2" className="text-gray-500 mb-1">
                  Certificate Code
                </Typography>
                <Typography
                  variant="body1"
                  className="font-medium text-gray-800"
                >
                  {certificate.certCode}
                </Typography>
              </div>

              <div>
                <Typography variant="body2" className="text-gray-500 mb-1">
                  Issue Date
                </Typography>
                <Typography
                  variant="body1"
                  className="font-medium text-gray-800"
                >
                  {certificate.issueDate}
                </Typography>
              </div>
            </div>

            <div className="mt-4">
              <Typography variant="body2" className="text-gray-500 mb-2">
                Hash Code
              </Typography>
              <Box className="bg-gray-50 p-3 rounded-lg border">
                <Typography
                  variant="body2"
                  className="font-mono text-gray-700 break-all text-sm"
                >
                  {certificate.certHash}
                </Typography>
              </Box>
            </div>

            <div className="mt-4">
              <Typography variant="body2" className="text-gray-500 mb-2">
                Metadata
              </Typography>
              <Box className="bg-gray-50 p-3 rounded-lg border">
                <Typography
                  variant="body2"
                  className="font-mono text-gray-700 break-all text-sm"
                >
                  {certificate.metadataURI}
                </Typography>
              </Box>
            </div>

            <div className="mt-4">
              <Typography variant="body2" className="text-gray-500 mb-2">
                Blockchain Network
              </Typography>
              <Chip
                label={certificate.network}
                className="bg-green-100 text-green-800 uppercase"
                size="small"
                icon={<div className="w-2 h-2 bg-green-500 rounded-full"></div>}
              />
            </div>
          </div>

          {/* Student Information Section */}
          <div className="bg-white rounded-lg px-5 py-4 shadow-sm">
            <div className="flex items-center mb-4">
              <PersonIcon className="text-blue-600 mr-2" />
              <Typography variant="h6" className="text-blue-700 font-semibold">
                Student Information
              </Typography>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Typography variant="body2" className="text-gray-500 mb-1">
                  Student Name
                </Typography>
                <Typography
                  variant="body1"
                  className="font-medium text-gray-800"
                >
                  {user.fullName}
                </Typography>
              </div>

              <div>
                <Typography variant="body2" className="text-gray-500 mb-1">
                  Student Address
                </Typography>
                <Typography
                  variant="body1"
                  className="font-medium text-gray-800"
                >
                  {certificate.learnerAddress}
                </Typography>
              </div>
            </div>
          </div>

          {/* Issuing Organization Section */}
          <div className="bg-white rounded-lg px-5 py-4 shadow-sm">
            <div className="flex items-center mb-4">
              <BusinessIcon className="text-blue-600 mr-2" />
              <Typography variant="h6" className="text-blue-700 font-semibold">
                Issuing Organization
              </Typography>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Typography variant="body2" className="text-gray-500 mb-1">
                  Organization Name
                </Typography>
                <Typography
                  variant="body1"
                  className="font-medium text-gray-800"
                >
                  {"StudyHub"}
                </Typography>
              </div>

              <div>
                <Typography variant="body2" className="text-gray-500 mb-1">
                  Organization Address
                </Typography>
                <Typography
                  variant="body1"
                  className="font-medium text-gray-800"
                >
                  {certificate.issuer}
                </Typography>
              </div>
            </div>
          </div>

          {/* Course Information Section */}
          <div className="bg-white rounded-lg px-5 py-4 shadow-sm">
            <div className="flex items-center mb-4">
              <MenuBookIcon className="text-blue-600 mr-2" />
              <Typography variant="h6" className="text-blue-700 font-semibold">
                Course Information
              </Typography>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Typography variant="body2" className="text-gray-500 mb-1">
                  Course Name
                </Typography>
                <Typography
                  variant="body1"
                  className="font-medium text-gray-800"
                >
                  {certificate.courseName}
                </Typography>
              </div>

              <div>
                <Typography variant="body2" className="text-gray-500 mb-1">
                  Duration
                </Typography>
                <Typography
                  variant="body1"
                  className="font-medium text-gray-800"
                >
                  {certificate.duration}
                </Typography>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-3 mt-6 pt-4 border-t border-gray-200">
          <Button
            variant="contained"
            className="bg-blue-600 hover:bg-blue-700 normal-case"
            onClick={onClose}
          >
            OK
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CertificateDetailModal;
