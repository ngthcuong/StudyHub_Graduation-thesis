import React, { useEffect, useState } from "react";
import { TextField, CircularProgress, Chip, Avatar } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { useLazyVerifyCertificateByCodeQuery } from "../../services/certificateApi";
import CertificateDetailModal from "../../components/CertificateDetailModal";

const VerifyCertificatePage = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);

  const [
    verifyCertificate,
    { data: result, isLoading, error: apiError, isError, isSuccess },
  ] = useLazyVerifyCertificateByCodeQuery(code);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!code.trim()) {
      setError("Vui lòng nhập mã chứng chỉ");
      return;
    }

    try {
      const response = await verifyCertificate(code.trim()).unwrap();
      setCurrentResult(response);
      setOpenDetailModal(true);
    } catch (err) {
      // Error được handle tự động bởi RTK Query
      console.error("Verification failed:", err);
    }
  };

  useEffect(() => {
    if (result && isSuccess) {
      setCurrentResult(result);
      setOpenDetailModal(true);
    }
  }, [result, isSuccess]);

  const handleCloseDetailModal = () => {
    setOpenDetailModal(false);
    setCurrentResult(null);
  };

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
            className="w-full h-12 inline-flex items-center justify-center rounded-md bg-sky-500 hover:bg-sky-600 disabled:opacity-60 text-white font-medium text-sm transition-colors cursor-pointer"
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

        <CertificateDetailModal
          open={openDetailModal}
          certificate={currentResult?.metadata || result?.metadata}
          onClose={handleCloseDetailModal}
        />

        <div className="mt-12 border rounded-md bg-slate-50 border-slate-200 p-5 text-center">
          <p className="text-base text-slate-500 leading-relaxed">
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
