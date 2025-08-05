# Huấn luyện mô hình (KNN/XGBoost/...)

import pandas as pd #Thư viện để xử lý dữ liệu bảng (DataFrame).
from sklearn.neighbors import NearestNeighbors #Mô hình KNN dùng để tìm các điểm dữ liệu gần nhất (tương tự nhất).
import joblib #Thư viện giúp lưu lại mô hình đã huấn luyện, sau này dùng lại không cần huấn luyện lại từ đầu.

df = pd.read_csv("data/students_dataset_700.csv")

# Các cột đặc trưng (features) của học viên, dùng để huấn luyện mô hình.
features = ['time_available', 'vocab_score', 'grammar_score', 'listening_score',
            'speaking_score', 'reading_score', 'writing_score']

# Lấy tập dữ liệu đặc trưng từ df để huấn luyện mô hình.
X = df[features] 

# Huấn luyện mô hình tìm hàng xóm gần nhất
# n_neighbors=3: khi dự đoán/gợi ý, mô hình sẽ tìm 3 học viên giống nhất.
# metric='euclidean': dùng khoảng cách Euclid (đo bằng đường thẳng) để đo độ gần.
knn = NearestNeighbors(n_neighbors=3, metric='euclidean')
# Huấn luyện mô hình KNN bằng cách "ghi nhớ" các điểm dữ liệu trong X.
knn.fit(X)

# Lưu mô hình KNN vào file model.pkl để dùng lại sau.
# Lưu dữ liệu gốc (df) vào file data.pkl – để khi chạy dự đoán, bạn có thể dễ dàng truy cập thông tin học viên cũ (để hiển thị tên, kỹ năng đã học, lộ trình,...).
joblib.dump(knn, 'model/model.pkl')
df.to_pickle('model/data.pkl')
