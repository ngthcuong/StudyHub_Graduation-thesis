const User = require("../schemas/User");
const TestAttempt = require("../schemas/TestAttempt");
const StudyStats = require("../schemas/studyStats.js");
// const StudyStats = require("../schemas/studyStats");
const Test = require("../schemas/Test");
const Certificate = require("../schemas/Certificate");

const createUser = async (userData) => {
  try {
    const newUser = new User(userData);
    const savedUser = await newUser.save();
    return savedUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
};

const findUserById = async (id) => {
  try {
    const user = await User.findById(id);
    return user;
  } catch (error) {
    console.error("Error finding user by id:", error);
    throw new Error("Failed to find user by id");
  }
};

const findUserByWalletAddress = async (walletAddress) => {
  try {
    const user = await User.findOne({ walletAddress });
    return user;
  } catch (error) {
    console.error("Error finding user by wallet address:", error);
    throw new Error("Failed to find user by wallet address");
  }
};

const findUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email });
    return user;
  } catch (error) {
    console.error("Error finding user by email:", error);
    throw new Error("Failed to find user by email");
  }
};

const updateUserById = async (id, updateData) => {
  try {
    const user = await User.findByIdAndUpdate(id, updateData, { new: true });
    return user;
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user");
  }
};

const getAllUsers = async () => {
  try {
    const users = await User.find();
    return users;
  } catch (error) {
    console.error("Error getting all users:", error);
    throw new Error("Failed to get all users");
  }
};

const getMyCourses = async (userId) => {
  try {
    const course = await User.findById(userId)
      .populate({
        path: "courses",
        select:
          "title description teacherId courseType courseLevel thumbnailUrl category tags cost durationHours reviews grammarLessons",
      })
      .lean();
    return course;
  } catch (error) {
    console.error("Error getting user's courses:", error);
  }
};

const getUsersWithStats = async () => {
  try {
    const users = await User.find({ role: { $ne: "admin" } })
      .populate("courses", "title durationHours")
      .select("-password -__v")
      .lean();

    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        // Get purchased courses count
        const purchasedCoursesCount = user.courses ? user.courses.length : 0;

        // Get total study hours (sum of all purchased courses duration)
        const totalStudyHoursOfCourses =
          user.courses?.reduce((total, course) => {
            return total + (course.durationHours || 0);
          }, 0) || 0;

        // Get completed lessons count (from StudyStats)
        const studyStats = await StudyStats.find({ userId: user._id });

        // Hàm lấy thời gian học tổng từ studyStats
        // Vì bạn chỉ có 1 record studyStats mỗi tháng:
        const totalStudyHoursOfUser = studyStats[0]?.dailyStats.reduce(
          (sum, day) => sum + (day.durationSeconds || 0),
          0
        );
        const completedLessonsCount = studyStats.reduce((total, stat) => {
          return (
            total + (stat.dailyStats?.filter((day) => day.lessons).length || 0)
          );
        }, 0);

        // Get completed tests count
        const completedTestsCount = await TestAttempt.countDocuments({
          userId: user._id,
          // isPassed: true,
        });

        // Get user's custom tests count
        const customTestsCount = await Test.countDocuments({
          createdBy: user._id,
        });

        // Calculate certificates earned (chứng chỉ đã nhận được)
        // Count actual certificates issued for this user
        const certificatesEarned = await Certificate.countDocuments({
          "student.id": user._id,
        });

        return {
          ...user,
          stats: {
            purchasedCoursesCount,
            completedLessonsCount,
            completedTestsCount: completedTestsCount + customTestsCount,
            customTestsCount,
            totalStudyHoursOfCourses,
            certificatesEarned,
            totalStudyHoursOfUser,
          },
        };
      })
    );

    return usersWithStats;
  } catch (error) {
    console.error("Error getting users with stats:", error);
    throw new Error("Failed to get users with stats");
  }
};

const getUserDetailWithCourses = async (userId) => {
  try {
    const user = await User.findById(userId)
      .populate({
        path: "courses",
        select:
          "title description courseType courseLevel thumbnailUrl category durationHours cost",
      })
      .select("-password -__v")
      .lean();

    if (!user) {
      return null;
    }

    // Get user's custom tests
    const customTests = await Test.find({ createdBy: userId })
      .select(
        "title description examType questionType difficulty numQuestions createdAt"
      )
      .lean();

    // Get test attempts for user's tests
    let testAttempts = await TestAttempt.find({ userId })
      .populate("testId", "title examType")
      .select("testId score isPassed createdAt")
      .lean();

    // Transform testId to testInfo
    testAttempts = testAttempts.map((attempt) => ({
      _id: attempt._id,
      testInfo: attempt.testId,
      score: attempt.score,
      isPassed: attempt.isPassed,
      createdAt: attempt.createdAt,
    }));

    // Get user's certificates
    const certificates = await Certificate.find({ "student.id": userId })
      .select(
        "certificateCode course.title course.type course.level validity.issueDate validity.expireDate validity.isRevoked createdAt"
      )
      .lean();

    // Transform certificates data for easier use in frontend
    const transformedCertificates = certificates.map((cert) => ({
      _id: cert._id,
      certificateId: cert.certificateCode,
      name: cert.course.title,
      type: cert.course.type,
      level: cert.course.level,
      issuedDate: cert.validity.issueDate,
      expiryDate: cert.validity.expireDate,
      isValid:
        !cert.validity.isRevoked &&
        (cert.validity.expireDate
          ? new Date(cert.validity.expireDate) > new Date()
          : true),
      createdAt: cert.createdAt,
    }));

    return {
      ...user,
      customTests,
      testAttempts,
      certificates: transformedCertificates,
    };
  } catch (error) {
    console.error("Error getting user detail with courses:", error);
    throw new Error("Failed to get user detail with courses");
  }
};

module.exports = {
  createUser,
  findUserById,
  findUserByWalletAddress,
  findUserByEmail,
  updateUserById,
  getAllUsers,
  getMyCourses,
  getUsersWithStats,
  getUserDetailWithCourses,
};
