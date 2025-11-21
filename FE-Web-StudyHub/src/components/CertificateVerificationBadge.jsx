import React from "react";
import { Chip, Tooltip } from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  HelpOutline as HelpOutlineIcon,
} from "@mui/icons-material";

/**
 * Badge component hiển thị trạng thái xác thực chữ ký của certificate
 */
const CertificateVerificationBadge = ({ verification, size = "medium" }) => {
  if (!verification) {
    return null;
  }

  const { trustLevel, status } = verification;

  // Map trust level to icon
  const getIcon = () => {
    switch (status?.severity || trustLevel) {
      case "success":
      case "trusted":
        return <CheckCircleIcon fontSize={size} />;
      case "warning":
        return <WarningIcon fontSize={size} />;
      case "error":
      case "rejected":
        return <ErrorIcon fontSize={size} />;
      default:
        return <HelpOutlineIcon fontSize={size} />;
    }
  };

  // Get display label
  const label = status?.label || trustLevel?.toUpperCase() || "UNKNOWN";
  const color = status?.color || "#6b7280";
  const description = status?.description || "";

  return (
    <Tooltip title={description} arrow placement="top">
      <Chip
        icon={getIcon()}
        label={label}
        size={size}
        sx={{
          backgroundColor: color,
          color: "white",
          fontWeight: 600,
          "& .MuiChip-icon": {
            color: "white",
          },
        }}
      />
    </Tooltip>
  );
};

export default CertificateVerificationBadge;
