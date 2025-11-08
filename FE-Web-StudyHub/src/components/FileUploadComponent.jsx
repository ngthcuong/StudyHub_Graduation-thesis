import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  LinearProgress,
  IconButton,
  Alert,
  Chip,
} from "@mui/material";
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  VideoLibrary as VideoIcon,
  Description as DocumentIcon,
  InsertDriveFile as FileIcon,
} from "@mui/icons-material";

const FileUploadComponent = ({
  contentType,
  currentUrl = "",
  onFileUpload,
  onUrlChange,
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Get file type configuration
  const getFileConfig = () => {
    switch (contentType) {
      case "video":
        return {
          accept: "video/*",
          maxSize: 100 * 1024 * 1024, // 100MB for videos
          icon: <VideoIcon sx={{ fontSize: 48, color: "#667eea" }} />,
          title: "Upload Video File",
          description: "Upload MP4, AVI, MOV, or other video formats",
          supportedFormats: ["MP4", "AVI", "MOV", "WMV", "MKV"],
        };
      case "document":
        return {
          accept: ".pdf,.doc,.docx,.ppt,.pptx,.txt",
          maxSize: 25 * 1024 * 1024, // 25MB for documents
          icon: <DocumentIcon sx={{ fontSize: 48, color: "#10b981" }} />,
          title: "Upload Document",
          description: "Upload PDF, Word, PowerPoint, or text files",
          supportedFormats: ["PDF", "DOC", "DOCX", "PPT", "PPTX", "TXT"],
        };
      default:
        return {
          accept: "*/*",
          maxSize: 10 * 1024 * 1024, // 10MB for other files
          icon: <FileIcon sx={{ fontSize: 48, color: "#f59e0b" }} />,
          title: "Upload File",
          description: "Upload any file type",
          supportedFormats: ["All formats"],
        };
    }
  };

  const config = getFileConfig();

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const validateFile = (file) => {
    // Check file size
    if (file.size > config.maxSize) {
      throw new Error(
        `File size must be less than ${formatFileSize(config.maxSize)}`
      );
    }

    // Check file type for specific content types
    if (contentType === "video" && !file.type.startsWith("video/")) {
      throw new Error("Please select a valid video file");
    }

    if (contentType === "document") {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "text/plain",
      ];
      if (!allowedTypes.includes(file.type)) {
        throw new Error(
          "Please select a valid document file (PDF, Word, PowerPoint, or Text)"
        );
      }
    }
  };

  const simulateUpload = (file) => {
    return new Promise((resolve, reject) => {
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + Math.random() * 30;
          if (newProgress >= 100) {
            clearInterval(interval);
            // Simulate successful upload - in real app, this would be the actual URL from server
            const mockUrl = `https://example.com/uploads/${file.name}`;
            resolve(mockUrl);
            return 100;
          }
          return newProgress;
        });
      }, 200);

      // Simulate potential upload failure (5% chance)
      if (Math.random() < 0.05) {
        setTimeout(() => {
          clearInterval(interval);
          reject(new Error("Upload failed. Please try again."));
        }, 2000);
      }
    });
  };

  const handleFileSelect = async (file) => {
    try {
      setError(null);
      setUploading(true);
      setUploadProgress(0);

      // Validate file
      validateFile(file);

      // Simulate upload (replace with actual upload logic)
      const uploadedUrl = await simulateUpload(file);

      // Notify parent component
      onFileUpload(uploadedUrl, file);
      onUrlChange(uploadedUrl);

      setUploading(false);
      setUploadProgress(0);
    } catch (err) {
      setError(err.message);
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemoveFile = () => {
    onUrlChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getFileName = (url) => {
    if (!url) return "";
    return url.split("/").pop() || "Uploaded file";
  };

  return (
    <Box sx={{ width: "100%" }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {currentUrl ? (
        // Show uploaded file
        <Paper
          elevation={1}
          sx={{
            p: 1,
            borderRadius: 3,
            border: "2px solid",
            borderColor: "#e3f2fd",
            bgcolor: "#f8f9ff",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {config.icon}
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {getFileName(currentUrl)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  File uploaded successfully
                </Typography>
              </Box>
            </Box>
            <IconButton
              onClick={handleRemoveFile}
              sx={{
                color: "#ef4444",
                bgcolor: "#fee2e2",
                "&:hover": {
                  bgcolor: "#fecaca",
                },
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Paper>
      ) : (
        // Show upload area
        <Paper
          elevation={0}
          sx={{
            border: "2px dashed",
            borderColor: dragOver ? "#667eea" : "#e0e0e0",
            borderRadius: 3,
            p: 4,
            textAlign: "center",
            bgcolor: dragOver ? "#f0f2ff" : "white",
            cursor: uploading ? "not-allowed" : "pointer",
            transition: "all 0.3s ease",
            "&:hover": {
              borderColor: uploading ? "#e0e0e0" : "#667eea",
              bgcolor: uploading ? "white" : "#f8f9ff",
            },
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !uploading && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={config.accept}
            onChange={handleFileInputChange}
            style={{ display: "none" }}
            disabled={uploading}
          />

          {uploading ? (
            <Box>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  bgcolor: "#e3f2fd",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 2,
                }}
              >
                <UploadIcon sx={{ fontSize: 32, color: "#667eea" }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Uploading...
              </Typography>
              <LinearProgress
                variant="determinate"
                value={uploadProgress}
                sx={{
                  width: "100%",
                  maxWidth: 300,
                  mx: "auto",
                  mb: 2,
                  height: 8,
                  borderRadius: 4,
                  bgcolor: "#e3f2fd",
                  "& .MuiLinearProgress-bar": {
                    bgcolor: "#667eea",
                  },
                }}
              />
              <Typography variant="body2" color="text.secondary">
                {Math.round(uploadProgress)}% complete
              </Typography>
            </Box>
          ) : (
            <Box>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  bgcolor: "#f0f2ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 3,
                }}
              >
                {config.icon}
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                {config.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mb: 3 }}
              >
                {config.description}
              </Typography>

              <Button
                variant="contained"
                startIcon={<UploadIcon />}
                sx={{
                  borderRadius: 2,
                  bgcolor: "#667eea",
                  textTransform: "none",
                  px: 3,
                  py: 1.2,
                  fontWeight: 600,
                  boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                  "&:hover": {
                    bgcolor: "#5568d3",
                    boxShadow: "0 6px 16px rgba(102, 126, 234, 0.4)",
                  },
                }}
              >
                Choose File
              </Button>

              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  color: "text.secondary",
                  mt: 2,
                }}
              >
                or drag and drop files here
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  gap: 1,
                  mt: 2,
                }}
              >
                {config.supportedFormats.map((format) => (
                  <Chip
                    key={format}
                    label={format}
                    size="small"
                    sx={{
                      bgcolor: "#e9ecfe",
                      color: "#667eea",
                      fontWeight: 500,
                      fontSize: "0.75rem",
                    }}
                  />
                ))}
              </Box>

              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  color: "text.secondary",
                  mt: 1,
                }}
              >
                Maximum file size: {formatFileSize(config.maxSize)}
              </Typography>
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default FileUploadComponent;
