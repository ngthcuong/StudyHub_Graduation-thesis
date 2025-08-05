 # Gợi ý lộ trình học cho học viên mới


import joblib
import pandas as pd

# Tải lại mô hình KNN đã huấn luyện.
knn = joblib.load('model/model.pkl')

# Tải dữ liệu học viên gốc để đối chiếu & lấy thông tin.
df = pd.read_pickle('model/data.pkl')

# danh sách các đặc trưng dùng để huấn luyện & dự đoán.
features = ['time_available', 'vocab_score', 'grammar_score', 'listening_score',
            'speaking_score', 'reading_score', 'writing_score']
skill_cols = features[1:] # bỏ time_available, chỉ lấy 6 kỹ năng còn lại

def recommend_learning_path(new_student: list):

    # Tìm 3 học viên gần nhất với new_student dựa vào các đặc trưng.
    # indices[0]: danh sách chỉ số của 3 học viên tương tự nhất.
    # similar_students: lấy dữ liệu của các học viên này từ df.
    _, indices = knn.kneighbors([new_student])
    similar_students = df.iloc[indices[0]]

    # 1. Lộ trình học 
    # -> Dựa vào cột recommended_path của 3 học viên gần nhất.
    #-> Lấy giá trị xuất hiện nhiều nhất (mode) để đề xuất.
    recommended_path = similar_students['recommended_path'].mode()[0]

    # 2. Bài học nên học tiếp (gộp top_3_recommendations) 
    # -> Mỗi học viên có top_3_recommendations là chuỗi "Lesson A; Lesson B; Lesson C".
    # -> Tách từng chuỗi ra thành danh sách các bài học
    # -> Đếm tần suất xuất hiện của các bài học → lấy top 3 phổ biến nhất.
    lessons = similar_students['top_3_recommendations'].str.split('; ')
    all_lessons = [lesson for sublist in lessons for lesson in sublist]
    top_lessons = pd.Series(all_lessons).value_counts().head(3).index.tolist()

    # 3. Kỹ năng yếu (dựa theo điểm thấp nhất trong 7 kỹ năng) 
    # ->  tìm 2 kỹ năng có điểm số thấp nhất của học viên mới.
    lowest_indices = sorted(range(len(new_student)), key=lambda k: new_student[k])[1:3]
    skill_names = [skill_cols[i].replace('_score', '') for i in lowest_indices]

    # 5. Lịch học phù hợp (trung bình time_available)
    # -> Tính trung bình thời gian học của 3 học viên tương tự.
    # -> Giả sử time_available là số giờ học mỗi tuần.
    similar_students['time_available'] = similar_students['time_available'].astype(float)
    avg_time = similar_students['time_available'].mean()

    return {
        "Lộ trình học": recommended_path,
        "Bài học nên học tiếp": top_lessons,
        "Kỹ năng yếu cần cải thiện": skill_names,
        "Phong cách học hiệu quả": "Qua video, luyện tập thực hành",
        "Lịch học phù hợp": f"Mỗi tuần nên dành khoảng {round(avg_time)} giờ học"
    }
