import { rootApi } from "./rootApi";

export const certificateApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    // Xác minh chứng chỉ bằng hash
    verifyCertificateByHash: builder.query({
      query: (hash) => `/certs/hash/${hash}`,
      providesTags: ["Certificate"],
    }),

    // Xác minh chứng chỉ bằng mã chứng chỉ
    verifyCertificateByCode: builder.query({
      query: (code) => `/certs/code/${code}`,
      providesTags: ["Certificate"],
      keepUnusedDataFor: 0,
    }),

    // Lấy danh sách chứng chỉ của một địa chỉ
    getCertificateByWalletAddress: builder.query({
      query: (walletAddress) => `/certs/student/${walletAddress}`,
      providesTags: ["Certificate"],
    }),

    // Pháy hành chứng chỉ cho người học
    issueCertificate: builder.mutation({
      query: (certifateData) => ({
        url: "/certs/issue",
        method: "POST",
        body: certifateData,
      }),
      invalidatesTags: ["Certificate"],
    }),
  }),
});

export const {
  useVerifyCertificateByHashQuery,
  useVerifyCertificateByCodeQuery,
  useLazyVerifyCertificateByCodeQuery,
  useGetCertificateByWalletAddressQuery,
  useIssueCertificateMutation,
} = certificateApi;

export default certificateApi;
