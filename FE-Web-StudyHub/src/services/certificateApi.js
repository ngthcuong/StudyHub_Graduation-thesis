import { rootApi } from "./rootApi";

export const certificateApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    // Xác minh chứng chỉ bằng hash
    verifyCertificateByHash: builder.query({
      query: (hash) => `/certs/hash/${hash}`,
    }),

    // Xác minh chứng chỉ bằng mã chứng chỉ
    verifyCertificateByCode: builder.query({
      query: (code) => `/certs/code/${code}`,
    }),

    // Lấy danh sách chứng chỉ của một địa chỉ
    getCertificateByWalletAddress: builder.query({
      query: (walletAddress) => `/certs/student/${walletAddress}`,
    }),

    // Pháy hành chứng chỉ cho người học
    issueCertificate: builder.mutation({
      query: (certifateData) => ({
        url: "/issue",
        method: "POST",
        body: certifateData,
      }),
    }),
  }),
});

export const {
  useVerifyCertificateByHashQuery,
  useVerifyCertificateByCodeQuery,
  useGetCertificateByWalletAddressQuery,
  useIssueCertificateMutation,
} = certificateApi;

export default certificateApi;
