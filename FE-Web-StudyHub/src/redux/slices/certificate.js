import { createSlice } from "@reduxjs/toolkit";

export const certificateSlice = createSlice({
  name: "certificate",
  initialState: {
    certificate: null,
    loading: false,
    error: null,
  },
  reducers: {
    issueCertificate: (state, action) => {
      state.certificate = action.payload;
    },
  },
});

export const { issueCertificate } = certificateSlice.actions;
export default certificateSlice.reducer;
