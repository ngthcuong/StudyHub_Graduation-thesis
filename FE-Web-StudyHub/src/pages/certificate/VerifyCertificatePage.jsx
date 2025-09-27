import React, { useState } from "react";
import { TextField, CircularProgress, Chip, Avatar } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { useVerifyCertificateByCodeQuery } from "../../services/certificateApi";

const VerifyCertificatePage = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const [
    verifyCertificate,
    { data: result, isLoading, error: apiError, isSuccess, isError },
  ] = useVerifyCertificateByCodeQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!code.trim()) {
      setError("Vui lòng nhập mã chứng chỉ");
      return;
    }

    try {
      await verifyCertificate(code.trim()).unwrap();
    } catch (err) {
      // Error được handle tự động bởi RTK Query
      console.error("Verification failed:", err);
    }
  };

  const cert = result?.data?.certificate || result?.certificate;

  return (
    <div className="min-h-screen bg-slate-50 flex items-start justify-center py-16 px-4">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-sm border border-slate-200 p-10">
        <h1 className="text-3xl font-semibold text-center mb-2 text-slate-900">
          Certificate Verification
        </h1>
        <p className="text-center text-slate-500 mb-10 text-sm leading-relaxed">
          Enter the certificate code below to verify its authenticity and
          <br />
          view certificate details.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Certificate Code
            </label>
            <TextField
              fullWidth
              size="medium"
              placeholder="Enter certificate code (e.g., CERT-250908-628UZJ)"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              slotProps={{
                input: {
                  style: { fontSize: 14, background: "#fff" },
                },
              }}
            />
          </div>

          {(error || isError) && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error || apiError?.data?.message || "Verification failed"}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 inline-flex items-center justify-center rounded-md bg-sky-500 hover:bg-sky-600 disabled:opacity-60 text-white font-medium text-sm transition-colors"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <CircularProgress size={18} sx={{ color: "#fff" }} />
                Verifying...
              </span>
            ) : (
              "Verify Certificate"
            )}
          </button>
        </form>

        {!isLoading && isSuccess && result && (
          <div className="mt-10">
            {cert ? (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <CheckCircleIcon className="text-emerald-500" />
                  <h2 className="text-xl font-semibold text-slate-800">
                    Certificate Valid
                  </h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-6 text-sm">
                  <div className="space-y-2">
                    <p className="font-medium text-slate-600">
                      Certificate Code
                    </p>
                    <p className="font-mono text-slate-900 bg-slate-100 rounded-md px-2 py-1 text-xs break-all">
                      {cert?.code || code}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-slate-600">Issued To</p>
                    <p className="text-slate-900">
                      {cert?.student?.name || cert?.studentName}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-slate-600">Course</p>
                    <p className="text-slate-900">
                      {cert?.course?.name || cert?.courseName}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-slate-600">Issued Date</p>
                    <p className="text-slate-900">
                      {cert?.issueDate
                        ? new Date(cert.issueDate).toLocaleDateString("vi-VN")
                        : cert?.createdAt
                        ? new Date(cert.createdAt).toLocaleDateString("vi-VN")
                        : ""}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-slate-600">Hash</p>
                    <p className="font-mono text-[11px] leading-relaxed text-slate-900 bg-slate-100 rounded-md px-2 py-1 break-all">
                      {cert?.certHash || cert?.hash}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-slate-600">Status</p>
                    <div>
                      <Chip
                        color="success"
                        size="small"
                        label="Authentic"
                        avatar={
                          <Avatar sx={{ bgcolor: "transparent" }}>
                            <CheckCircleIcon
                              className="text-emerald-500"
                              fontSize="small"
                            />
                          </Avatar>
                        }
                        variant="outlined"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-red-600 mt-6">
                <ErrorIcon />
                <p className="font-medium">
                  Certificate is invalid or revoked.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mt-12 border rounded-md bg-slate-50 border-slate-200 p-5 text-center">
          <p className="text-[11px] text-slate-500 leading-relaxed">
            For assistance with certificate verification, please contact our
            support team.
            <br />
            All certificates are digitally signed and tamper-proof.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyCertificatePage;
