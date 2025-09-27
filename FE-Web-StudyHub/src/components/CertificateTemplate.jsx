import React from "react";
import { Divider } from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
/*
  Props:
  - data: {
      id, code, title, studentName, courseTitle,
      issuedDate, description, issuerName, issuerTitle,
      sealText, logoUrl
    }
  - onDownload: function
*/
const CertificateTemplate = ({ data = {} }) => {
  const {
    code = "EEC-2024-001",
    studentName = "Sarah Johnson",
    courseTitle = "Advanced Business English Course",
    issuedDate = "2024-03-15",
    issuerName = "StudyHub",
    issuerTitle = "English learning system",
    sealText = "LOGO",
    logoUrl,
  } = data;

  return (
    <div className="relative mx-auto w-full max-w-5xl bg-[#f2f2f2] rounded-md shadow-[0_0_0_1px_#d4d4d4,0_4px_16px_-2px_rgba(0,0,0,0.08)] print:shadow-none print:bg-white p-8 md:p-10 font-[system-ui]">
      {/* Top Accent Bar */}
      <div className="absolute top-1 left-1 right-1 h-[4px] bg-[#376bd5] rounded" />

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-10">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-[#1d4ed8] text-white flex items-center justify-center shadow-inner">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Logo"
                className="w-14 h-14 object-cover rounded-full"
              />
            ) : (
              <VerifiedIcon fontSize="large" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-800">
              English Excellence Center
            </h2>
            <p className="text-base leading-tight text-slate-500 mt-1">
              Certificate of Completion
            </p>
          </div>
        </div>
        <div className="text-right text-base leading-relaxed text-slate-500 min-w-[170px]">
          <p className="font-medium text-slate-600">Certificate ID: {code}</p>
          <p>Issued: {new Date(issuedDate).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="inline-block text-2xl md:text-3xl font-medium tracking-tight text-slate-800 ">
          Certificate of Achievement
        </h1>
      </div>

      {/* Statement */}
      <p className="text-center text-base md:text-lg text-slate-600 mb-5">
        This is to certify that
      </p>

      {/* Recipient */}
      <h3 className="text-center text-3xl md:text-4xl font-medium text-[#1d4599] tracking-wide mb-5">
        {studentName}
      </h3>

      <p className="text-center text-base md:text-lg text-slate-600 mb-8">
        has successfully completed the
      </p>

      {/* Course Title */}
      <h4 className="text-center text-2xl font-normal text-slate-800 tracking-tight mb-6">
        {courseTitle}
      </h4>

      {/* Seal & Signature Row */}
      <div className="flex items-end justify-between mt-16 mb-2">
        {/* Seal */}
        <div className="flex flex-col items-center w-40 mx-auto md:mx-0">
          <div className="w-28 h-28 rounded-full bg-[#284a9f] flex items-center justify-center text-white text-[14px] font-medium tracking-wide shadow-2xl">
            {sealText}
          </div>
          <span className="mt-2 text-sm tracking-wide text-slate-500">
            Official Seal
          </span>
        </div>

        {/* Signature */}
        <div className="hidden md:flex flex-col items-center w-60">
          <Divider className="w-full mb-1" />
          <span className="text-base font-medium text-slate-600">
            {issuerName}
          </span>
          <span className="text-sm uppercase tracking-wide text-slate-400">
            {issuerTitle}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CertificateTemplate;
