import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, CircularProgress, Alert } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLazyVerifyCertificateByCodeQuery } from "../../services/certificateApi";
import { downloadCertificateAsImage } from "../../utils/imageGenerator";
import Header from "../../components/Header";

const ViewCertificatePage = () => {
  const { certificateCode } = useParams();
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const [
    verifyCertificate,
    { data: result, isLoading, error: apiError, isError },
  ] = useLazyVerifyCertificateByCodeQuery();

  useEffect(() => {
    if (certificateCode) {
      verifyCertificate(certificateCode);
    }
  }, [certificateCode, verifyCertificate]);

  useEffect(() => {
    if (result?.certificate) {
      setCertificate(result.certificate);
    }
  }, [result]);

  const handleDownloadImage = async () => {
    if (!certificate) return;
    try {
      setIsDownloading(true);
      await downloadCertificateAsImage(certificate);
    } catch (error) {
      console.error("Error downloading certificate image:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <CircularProgress size={60} />
        </div>
      </div>
    );
  }

  if (isError || !certificate) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <Alert severity="error" className="mb-4">
              {apiError?.data?.message || "Certificate not found"}
            </Alert>
            <Button
              variant="contained"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/verify-certificate")}
              fullWidth
            >
              Back to Verification
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex-1 flex flex-col items-center pb-4 pt-2 md:p-2">
        {/* Certificate Display */}
        <div className="w-full max-w-5xl bg-[#f2f2f2] rounded-md shadow-[0_0_0_1px_#d4d4d4,0_4px_16px_-2px_rgba(0,0,0,0.08)] p-8 md:p-10 font-[system-ui] relative">
          {/* Top Accent Bar */}
          <div className="absolute top-1 left-1 right-1 h-1 bg-[#376bd5] rounded" />

          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-10">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-[#1d4ed8] text-white flex items-center justify-center shadow-inner">
                <svg
                  className="w-8 h-8"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.69 3.61.82 1.89 3.2L12 21.04l3.4 1.46 1.89-3.2 3.61-.82-.34-3.69L23 12zm-12.91 4.72l-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-slate-800">
                  {certificate.issuer.name}
                </h2>
                <p className="text-base leading-tight text-slate-500 mt-1">
                  Certificate of Completion
                </p>
              </div>
            </div>
            <div className="text-right text-base leading-relaxed text-slate-500 min-w-[170px]">
              <p className="font-medium text-slate-600">
                Certificate Code: {certificate.certificateCode}
              </p>
              <p>Issue Date: {formatDate(certificate.validity.issueDate)}</p>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="inline-block text-2xl md:text-3xl font-medium tracking-tight text-slate-800">
              Certificate of Achievement
            </h1>
          </div>

          {/* Statement */}
          <p className="text-center text-base md:text-lg text-slate-600 mb-5">
            This is to certify that
          </p>

          {/* Recipient */}
          <h3 className="text-center text-3xl md:text-4xl font-medium text-[#1d4599] tracking-wide mb-5">
            {certificate.student.name}
          </h3>

          <p className="text-center text-base md:text-lg text-slate-600 mb-8">
            has successfully completed the
          </p>

          {/* Course Title */}
          <h4 className="text-center text-2xl font-normal text-slate-800 tracking-tight mb-6">
            {certificate.course.title}
          </h4>

          <div className="flex justify-center gap-2.5 w-full">
            <p className="text-center text-base md:text-lg text-slate-600 mb-8">
              <span className="font-bold">Type:</span>{" "}
              {certificate.course.type || "N/A"}
            </p>
            <p className="text-center text-base md:text-lg text-slate-600 mb-8">
              <span className="font-bold">Level:</span>{" "}
              {certificate.course.level || "N/A"}
            </p>
          </div>

          {/* Seal & Signature Row */}
          <div className="flex items-end justify-between mt-16 mb-2">
            {/* Seal */}
            <div className="flex flex-col items-center w-40 mx-auto md:mx-0">
              <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center shadow-2xl overflow-hidden">
                <img
                  src="/Logo.jpg"
                  alt="StudyHub Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="mt-2 text-sm tracking-wide text-slate-500">
                Official Seal
              </span>
            </div>

            {/* Signature */}
            <div className="hidden md:flex flex-col items-center w-60">
              <div className="w-full h-px bg-slate-300 mb-2"></div>
              <span className="text-base font-medium text-slate-600">
                {certificate.issuer.name}
              </span>
              <span className="text-sm uppercase tracking-wide text-slate-400">
                English learning system
              </span>
            </div>
          </div>
        </div>

        <div className="w-full  mt-4 flex justify-center ">
          <Button
            variant="contained"
            color="success"
            startIcon={
              isDownloading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <DownloadIcon />
              )
            }
            onClick={handleDownloadImage}
            disabled={isDownloading}
          >
            {isDownloading ? "Downloading..." : "Download Image"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ViewCertificatePage;
