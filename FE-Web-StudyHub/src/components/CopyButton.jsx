import React, { useState } from "react";
import { IconButton, Tooltip, Snackbar, Alert } from "@mui/material";
import {
  ContentCopy as CopyIcon,
  Check as CheckIcon,
} from "@mui/icons-material";

const CopyButton = ({ text, tooltip = "Copy to clipboard" }) => {
  const [copied, setCopied] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setShowSnackbar(true);

      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setShowSnackbar(true);
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      } catch (fallbackErr) {
        console.error("Fallback copy failed: ", fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  return (
    <>
      <Tooltip title={copied ? "Copied!" : tooltip}>
        <IconButton
          onClick={handleCopy}
          size="small"
          sx={{
            color: copied ? "#10b981" : "#6b7280",
            "&:hover": {
              backgroundColor: copied ? "#d1fae5" : "#f3f4f6",
            },
            transition: "all 0.2s ease-in-out",
          }}
        >
          {copied ? (
            <CheckIcon fontSize="small" />
          ) : (
            <CopyIcon fontSize="small" />
          )}
        </IconButton>
      </Tooltip>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  );
};

export default CopyButton;
