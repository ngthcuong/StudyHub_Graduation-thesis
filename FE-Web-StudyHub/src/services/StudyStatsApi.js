import { rootApi } from "./rootApi";

export const studyApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    // 🧠 Lấy thống kê học tập theo tháng & năm
    getStudyStats: builder.query({
      query: ({ month, year }) => ({
        url: `/study-stats/${year}/${month}`,
        method: "GET",
      }),
      providesTags: ["StudyStats"],
    }),

    // 🕒 Ghi log học
    logStudySession: builder.mutation({
      query: ({ day, lessons, exercises, durationSeconds }) => {
        console.log("🧠 Sending to backend:", {
          day,
          lessons,
          exercises,
          durationSeconds,
        });
        return {
          url: "/study-stats/log",
          method: "POST",
          body: { day, lessons, exercises, durationSeconds },
        };
      },
      invalidatesTags: ["StudyStats"],
    }),
  }),
});

export const { useGetStudyStatsQuery, useLogStudySessionMutation } = studyApi;
export default studyApi;
