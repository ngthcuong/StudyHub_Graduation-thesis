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
import CopyButton from "./CopyButton";

const CertificateDetailModal = ({ open, onClose, certificate }) => {
  if (!certificate) return null;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

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
                  {certificate.certificateCode}
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
                  {formatDate(certificate.validity.issueDate)}
                </Typography>
              </div>
            </div>

            {/* <div className="mt-4">
              <Typography variant="body2" className="text-gray-500 mb-2">
                Certificate Hash
              </Typography>
              <Box className="bg-gray-50 p-3 rounded-lg border relative">
                <div className="flex items-center justify-between">
                  <Typography
                    variant="body2"
                    className="font-mono text-gray-700 break-all text-sm flex-1 pr-2"
                  >
                    {certificate.blockchain.certificateHash}
                  </Typography>
                  <CopyButton
                    text={certificate.blockchain.certificateHash}
                    tooltip="Copy certificate hash"
                  />
                </div>
              </Box>
            </div> */}

            <div className="mt-4">
              <Typography variant="body2" className="text-gray-500 mb-2">
                Transaction Hash
              </Typography>
              <Box className="bg-gray-50 px-3 py-2 rounded-lg border relative">
                <div className="flex items-center justify-between">
                  <Typography
                    variant="body2"
                    className="font-mono text-gray-700 break-all text-sm flex-1 pr-2"
                  >
                    {certificate.blockchain.transactionHash}
                  </Typography>
                  <CopyButton
                    text={certificate.blockchain.transactionHash}
                    tooltip="Copy transaction hash"
                  />
                </div>
              </Box>
            </div>

            <div className="mt-4">
              <Typography variant="body2" className="text-gray-500 mb-2">
                Metadata
              </Typography>
              <Box className="bg-gray-50 px-3 py-2 rounded-lg border relative">
                <div className="flex items-center justify-between">
                  <Typography
                    variant="body2"
                    className="font-mono text-gray-700 break-all text-sm flex-1 pr-2"
                  >
                    {certificate.ipfs.metadataURI}
                  </Typography>
                  <CopyButton
                    text={certificate.ipfs.metadataURI}
                    tooltip="Copy metadata URI"
                  />
                </div>
              </Box>
            </div>

            <div className="mt-4">
              <Typography variant="body2" className="text-gray-500 mb-2">
                Blockchain Network
              </Typography>
              <Chip
                label={certificate.blockchain.network}
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
                  {certificate.student.name}
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
                  {certificate.student.walletAddress}
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
                  {certificate.issuer.name}
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
                  {certificate.issuer.walletAddress}
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
                  {certificate.course.title}
                </Typography>
              </div>

              {/* <div>
                <Typography variant="body2" className="text-gray-500 mb-1">
                  Duration
                </Typography>
                <Typography
                  variant="body1"
                  className="font-medium text-gray-800"
                >
                  {certificate.duration}
                </Typography>
              </div> */}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-3 mt-6 pt-4 border-t border-gray-200">
          <Button
            variant="contained"
            color="success"
            className=" h normal-case"
            onClick={onClose}
          >
            Download
          </Button>
          <Button
            variant="contained"
            color="info"
            className=" normal-case"
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
