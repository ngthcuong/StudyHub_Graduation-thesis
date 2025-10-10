import { rootApi } from "./rootApi";

export const studyApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    // 🧠 Lấy thống kê học tập theo tháng & năm
    getStudyStats: builder.query({
      query: ({ month, year }) => ({
        url: `/study/stats?month=${month}&year=${year}`,
        method: "GET",
      }),
      providesTags: ["StudyStats"],
    }),

    // 🕒 Ghi log học
    logStudySession: builder.mutation({
      query: ({ lessonId, durationMinutes }) => ({
        url: "/study/log",
        method: "POST",
        body: { lessonId, durationMinutes },
      }),
      invalidatesTags: ["StudyStats"],
    }),
  }),
});

export const { useGetStudyStatsQuery, useLogStudySessionMutation } = studyApi;
export default studyApi;
