import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Button,
  Chip,
  CircularProgress,
} from "@mui/material";
import {
  Close as CloseIcon,
  Star as StarIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  MenuBook as MenuBookIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import CopyButton from "./CopyButton";
import { downloadCertificateAsImage } from "../utils/imageGenerator";
import CertificateVerificationBadge from "./CertificateVerificationBadge";

const CertificateDetailModal = ({ open, onClose, certificate }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  if (!certificate) return null;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const handleDownloadImage = async () => {
    try {
      setIsDownloading(true);
      await downloadCertificateAsImage(certificate);
    } catch (error) {
      console.error("Error downloading certificate image:", error);
      alert(
        "An error occurred while downloading the certificate. Please try again."
      );
    } finally {
      setIsDownloading(false);
    }
  };

  // Get header color based on verification status
  const getHeaderStyle = () => {
    const trustLevel = certificate?.verification?.trustLevel?.toLowerCase();

    const styles = {
      trusted: {
        backgroundColor: "#22c55e", // Green
        borderColor: "#059669",
        textColor: "#ffffff",
      },
      warning: {
        backgroundColor: "#f59e0b", // Amber
        borderColor: "#d97706",
        textColor: "#ffffff",
      },
      rejected: {
        backgroundColor: "#ef4444", // Red
        borderColor: "#dc2626",
        textColor: "#ffffff",
      },
      unknown: {
        backgroundColor: "#6b7280", // Gray
        borderColor: "#4b5563",
        textColor: "#ffffff",
      },
    };

    return styles[trustLevel] || styles.unknown;
  };

  const headerStyle = getHeaderStyle();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            maxHeight: "90vh",
          },
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          backgroundColor: headerStyle.backgroundColor,
          borderBottom: `2px solid ${headerStyle.borderColor}`,
          py: 2,
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Typography
              variant="h5"
              className="!font-bold"
              sx={{ color: "white" }}
            >
              Certificate Details
            </Typography>
          </div>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: headerStyle.textColor,
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>

      <DialogContent className="bg-gray-50 !p-3">
        <div className="space-y-5">
          {/* Certificate Information Section */}
          <div className="bg-white rounded-lg px-5 py-4 shadow-sm">
            <div className="flex items-center mb-4">
              <StarIcon className="text-blue-600 mr-2" />
              <Typography variant="h6" className="text-blue-700 font-semibold">
                Certificate Information
              </Typography>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Typography variant="body2" className="text-gray-500 mb-1">
                  Certificate Code
                </Typography>
                <Typography
                  variant="body1"
                  className="font-medium text-gray-800"
                >
                  {certificate?.certificateCode}
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
                  {formatDate(certificate?.validity.issueDate)}
                </Typography>
              </div>

              <div>
                <Typography variant="body2" className="text-gray-500 mb-1">
                  Verification Status
                </Typography>
                <CertificateVerificationBadge
                  verification={certificate?.verification}
                  size="medium"
                />
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
                    {certificate?.blockchain.transactionHash}
                  </Typography>
                  <CopyButton
                    text={certificate?.blockchain.transactionHash}
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
                    {certificate?.ipfs.metadataURI}
                  </Typography>
                  <CopyButton
                    text={certificate?.ipfs.metadataURI}
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
                label={certificate?.blockchain.network}
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
                  {certificate?.student.name}
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
                  {certificate?.student.walletAddress}
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
                  {certificate?.issuer.name}
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
                  {certificate?.issuer.walletAddress}
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
                  {certificate?.course.title}
                </Typography>
              </div>

              <div>
                <Typography variant="body2" className="text-gray-500 mb-1">
                  Type
                </Typography>
                <Typography
                  variant="body1"
                  className="font-medium text-gray-800"
                >
                  {certificate?.course.type || "No Type"}
                </Typography>
              </div>

              <div>
                <Typography variant="body2" className="text-gray-500 mb-1">
                  Level
                </Typography>
                <Typography
                  variant="body1"
                  className="font-medium text-gray-800"
                >
                  {certificate?.course.level || "No Level"}
                </Typography>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-3 mt-6 pt-4 border-t border-gray-200">
          <Button
            variant="contained"
            color="success"
            className="normal-case"
            onClick={handleDownloadImage}
            disabled={isDownloading}
            startIcon={
              isDownloading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <DownloadIcon />
              )
            }
          >
            {isDownloading ? "Downloading..." : "Download Image"}
          </Button>
          <Button
            variant="contained"
            color="info"
            className="normal-case"
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
