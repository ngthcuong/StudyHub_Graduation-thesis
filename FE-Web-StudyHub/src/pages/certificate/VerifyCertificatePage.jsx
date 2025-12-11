import React, { useEffect, useState } from "react";
import { TextField, CircularProgress } from "@mui/material";
import { useLazyVerifyCertificateByCodeQuery } from "../../services/certificateApi";
import CertificateDetailModal from "../../components/CertificateDetailModal";
import Header from "../../components/Header";

const VerifyCertificatePage = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);

  const [
    verifyCertificate,
    { data: result, isLoading, error: apiError, isError, isSuccess },
  ] = useLazyVerifyCertificateByCodeQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setWarning("");

    if (!code.trim()) {
      setError("Please input certificate code.");
      return;
    }

    try {
      const response = await verifyCertificate(
        code.toUpperCase().trim()
      ).unwrap();

      if (!response.certificate || response.trustLevel === "rejected") {
        if (response.errors && response.errors.length > 0) {
          setError(JSON.stringify(response.errors));
        } else {
          setError(response.message || "Certificate verification failed");
        }
        return;
      }

      if (response.trustLevel === "warning" && response.warnings?.length > 0) {
        setWarning(JSON.stringify(response.warnings));
      }

      setCurrentResult(response.certificate);
      setOpenDetailModal(true);
    } catch (err) {
      if (err.status === 404) {
        setError("Certificate not found. Please check the certificate code.");
      } else if (err.status === 403) {
        if (err.data?.errors && err.data.errors.length > 0) {
          setError(JSON.stringify(err.data.errors));
        } else {
          setError(err.data?.message || "Certificate verification failed");
        }
      } else if (err.data?.message) {
        setError(err.data.message);
      } else {
        setError("An error occurred during verification. Please try again.");
      }
    }
  };

  useEffect(() => {
    if (result && isSuccess) {
      if (result.certificate && result.trustLevel !== "rejected") {
        if (result.trustLevel === "warning" && result.warnings?.length > 0) {
          setWarning(JSON.stringify(result.warnings));
        }

        setCurrentResult(result.certificate);
        setOpenDetailModal(true);
      } else if (result.trustLevel === "rejected") {
        if (result.errors && result.errors.length > 0) {
          setError(JSON.stringify(result.errors));
        } else {
          setError(result.message || "Certificate verification failed");
        }
      }
    }
  }, [result, isSuccess]);

  const handleCloseDetailModal = () => {
    setOpenDetailModal(false);
    setCurrentResult(null);
  };

  return (
    <div className="min-h-screen flex mx-auto flex-col w-7xl">
      <Header />
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-sm border border-slate-200 p-10 self-center mt-3">
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
              onChange={(e) => setCode(e.target.value)}
              slotProps={{
                input: {
                  style: {
                    fontSize: 14,
                    background: "#fff",
                    textTransform: "uppercase",
                  },
                },
              }}
            />
          </div>

          {warning && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-amber-600 mt-0.5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-amber-800 mb-1">
                    Certificate Verified with Warnings
                  </h3>
                  {(() => {
                    try {
                      const warnings = JSON.parse(warning);
                      if (Array.isArray(warnings) && warnings.length > 0) {
                        return (
                          <ul className="list-disc list-inside space-y-1">
                            {warnings.map((w, idx) => (
                              <li key={idx} className="text-sm text-amber-700">
                                {w}
                              </li>
                            ))}
                          </ul>
                        );
                      }
                    } catch {
                      return (
                        <p className="text-sm text-amber-700">{warning}</p>
                      );
                    }
                  })()}
                </div>
              </div>
            </div>
          )}

          {(error || isError) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-red-600 mt-0.5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-red-800 mb-1">
                    Verification Failed
                  </h3>
                  {(() => {
                    try {
                      const errors = JSON.parse(error);
                      if (Array.isArray(errors) && errors.length > 0) {
                        return (
                          <ul className="list-disc list-inside space-y-1">
                            {errors.map((err, idx) => (
                              <li key={idx} className="text-sm text-red-700">
                                {err}
                              </li>
                            ))}
                          </ul>
                        );
                      }
                    } catch {
                      return (
                        <p className="text-sm text-red-700">
                          {error ||
                            apiError?.data?.message ||
                            "Unable to verify certificate"}
                        </p>
                      );
                    }
                  })()}
                </div>
              </div>
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
          certificate={result?.certificate || currentResult}
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
