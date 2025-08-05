 # Gợi ý lộ trình học cho học viên mới


import joblib
import pandas as pd

knn = joblib.load('model/model.pkl')
df = pd.read_pickle('model/data.pkl')

features = ['time_available', 'vocab_score', 'grammar_score', 'listening_score',
            'speaking_score', 'reading_score', 'writing_score']
skill_cols = features[1:]

def recommend_learning_path(new_student: list):
    _, indices = knn.kneighbors([new_student])
    similar_students = df.iloc[indices[0]]

    # 1. Lộ trình học -> dựa trên lộ trình phổ biến nhất từ 3 học viên gần nhất.
    recommended_path = similar_students['recommended_path'].mode()[0]

    # 2. Bài học nên học tiếp (gộp top_3_recommendations) -> thống kê tần suất bài học trong top_3_recommendations của học viên tương tự, lấy top 3 phổ biến nhất.
    lessons = similar_students['top_3_recommendations'].str.split('; ')
    all_lessons = [lesson for sublist in lessons for lesson in sublist]
    top_lessons = pd.Series(all_lessons).value_counts().head(3).index.tolist()

    # 3. Kỹ năng yếu (dựa theo điểm thấp nhất trong 7 kỹ năng) ->  tìm 2 kỹ năng có điểm số thấp nhất của học viên mới.
    lowest_indices = sorted(range(len(new_student)), key=lambda k: new_student[k])[1:3]
    skill_names = [skill_cols[i].replace('_score', '') for i in lowest_indices]

    # 5. Lịch học phù hợp (trung bình time_available)
    avg_time = similar_students['time_available'].mean()

    return {
        "✅ Lộ trình học": recommended_path,
        "✅ Bài học nên học tiếp": top_lessons,
        "✅ Kỹ năng yếu cần cải thiện": skill_names,
        "✅ Phong cách học hiệu quả": "Qua video, luyện tập thực hành",
        "✅ Lịch học phù hợp": f"Mỗi tuần nên dành khoảng {round(avg_time)} giờ học"
    }
