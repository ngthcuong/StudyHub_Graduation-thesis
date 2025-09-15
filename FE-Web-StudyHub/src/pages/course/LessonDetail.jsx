import { useState } from "react";

import HeaderHome from "../home/HeaderHome";

export default function LessonDetail() {
  const [activeSection, setActiveSection] = useState(null);
  const [activeLecture, setActiveLecture] = useState(null);
  const [titleLecture, setTitleLecture] = useState("1. What is Webflow?");

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
    setActiveLecture(null); // reset khi đổi section
  };

  const toggleLecture = (lecture) => {
    setActiveLecture(activeLecture === lecture ? null : lecture);
  };

  const [activeTab, setActiveTab] = useState("description");

  const tabs = [
    { id: "description", label: "Description" },
    { id: "notes", label: "Lecture Notes" },
    { id: "attachments", label: "Attach File", count: 1 },
    { id: "comments", label: "Comments" },
  ];

  const [activeReply, setActiveReply] = useState(null);

  const initialComments = [
    {
      id: 1,
      author: "Ronald Richards",
      role: null,
      time: "1 week ago",
      text: "Maecena risu s tortor, tincidun nec purus eu, gravida susc ipit tortor.",
      replyable: true,
      replies: [],
    },
    {
      id: 2,
      author: "Kristin Watson",
      role: "ADMIN",
      time: "1 week ago",
      text: "Nulla pellentesq leo vitae lorem hendrerit, sit amet elementum ipsum rutrum. Morbi uttrices volupat orci quis fringilla. Suspendisse faucibus augue quis dictum egestas.",
      replyable: true,
      replies: [],
    },
    {
      id: 3,
      author: "Cody Fisher",
      role: null,
      time: "1 week ago",
      text: "Thank You so much, you're a great mentor! 🔥🔥",
      replyable: true,
      replies: [],
    },
    {
      id: 4,
      author: "Guy Hawkins",
      role: null,
      time: "2 weeks ago",
      text: `Thank you for your helpful video. May I ask what is the application use to demo the animation at [4:24], is it runnable mobile application? 
As what I know, Figma Mirror app cannot do that. Please help me 
Great thanks`,
      replyable: true,
      replies: [],
    },
    {
      id: 5,
      author: "Esther Howard",
      role: null,
      time: "2 weeks ago",
      text: "Quality content 🔥",
      replyable: true,
      replies: [],
    },
    {
      id: 6,
      author: "Theresa Webb",
      role: null,
      time: "3 weeks ago",
      text: "Now I know that I will spent 5 minutes of my life with pure pleasure",
      replyable: true,
      replies: [],
    },
    {
      id: 7,
      author: "Marvin McKinney",
      role: null,
      time: "3 weeks ago",
      text: "Great tutorial I'm subscribing! I'm wondering if this feasible to be materialized in a real project or can be integrated in an actual app code?",
      replyable: true,
      replies: [],
    },
    {
      id: 8,
      author: "Darrell Steward",
      role: null,
      time: "1 month ago",
      text: "Awesome video. Sometimes, we have got to try and push the possibilities of designs and not bounded by codes. The fact that the design itself is a push from the norm, it is only expected that to code it would require some level of thinking out of the box. That is what differentiates yourself from others who just building on top of someone else's code.",
      replyable: true,
      replies: [],
    },
  ];

  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(initialComments);

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const newCmt = {
      id: Date.now(),
      author: "You",
      role: "Student",
      time: "just now",
      text: newComment,
      replyable: true,
    };

    setComments([newCmt, ...comments]);
    setNewComment("");
  };

  //reply
  const [replyText, setReplyText] = useState({});

  const handleReply = (commentId) => {
    const text = replyText[commentId]?.trim();
    if (!text) return;

    // Thêm reply vào state
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              replies: [
                ...c.replies,
                {
                  id: Date.now(), // hoặc UUID
                  author: "You",
                  role: null,
                  time: "just now",
                  text,
                },
              ],
            }
          : c
      )
    );

    // Reset
    setReplyText((prev) => ({ ...prev, [commentId]: "" }));
    setActiveReply(null);
  };

  return (
    <div className="max-w-7xl mx-auto mt-3">
      <HeaderHome />
      <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-gray-300">
        <div>
          {/* Title */}
          <div className="text-sm font-medium text-gray-800 max-w-md">
            Complete Website Responsive Design: from Figma to Webflow to Website
            Design
          </div>

          {/* Stats */}
          <div className="flex gap-4 text-gray-600 text-sm">
            <span className="flex items-center gap-1">📧 6 Sections</span>
            <span className="flex items-center gap-1">📝 202 Lectures</span>
            <span className="flex items-center gap-1">⏱ 19h 37m</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button className="px-4 py-1 border border-orange-500 text-orange-500 rounded-md hover:bg-orange-50 transition">
            Write A Review
          </button>
          <button className="px-4 py-1 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition">
            Next Lecture
          </button>
        </div>
      </div>

      <div className="flex justify-center items-start bg-[#f5f7fa] min-h-screen p-5">
        <div className="flex w-full max-w-7xl gap-5">
          {/* Video Section */}
          <div className="w-[70%] rounded-xl ">
            <div className="relative w-full h-[400px] bg-black rounded-md">
              <div className="absolute bottom-2 left-2 text-white text-sm">
                ⏸ 12:15 / 8:15
              </div>
            </div>
            <p className="p-5 bg-white border-l-2">{titleLecture}</p>
          </div>

          {/* Contents Section */}
          <div className="w-[30%] bg-white p-5 rounded-xl shadow-md">
            <div className="p-5 bg-white font-sans">
              {/* Header */}
              <div className="flex justify-between items-center border-b border-gray-300 pb-2 mb-3">
                <h2 className="text-lg font-semibold text-gray-800">
                  Course Contents
                </h2>
                <span className="text-sm text-green-600">15% Completed</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-[6px] bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-600 rounded-full transition-all duration-300"
                  style={{ width: "15%" }}
                ></div>
              </div>
            </div>

            {/* Lesson List */}
            <div className="w-full bg-white rounded-md shadow p-3 font-sans">
              {/* Section 1 */}
              <div
                className={`border-b border-gray-200 p-3 cursor-pointer ${
                  activeSection === "getting-started" ? "text-green-600" : ""
                }`}
                onClick={() => toggleSection("getting-started")}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium flex items-center gap-1">
                    {activeSection === "getting-started"} Getting Started
                  </span>
                  <span className="text-xs text-gray-500">
                    4 lectures • 5m • (1/4)
                  </span>
                </div>

                {activeSection === "getting-started" && (
                  <div className="pl-5 mt-2 space-y-2 text-sm text-gray-700">
                    <div
                      className="flex justify-between"
                      onClick={(e) => {
                        e.stopPropagation(); // tránh toggle cả section
                        toggleLecture("lecture-1");
                        setTitleLecture("1. What is Webflow?");
                      }}
                    >
                      <span>1. What is Webflow?</span>
                      <span className="text-xs text-gray-500">07:31</span>
                    </div>
                    <div
                      className="flex justify-between"
                      onClick={(e) => {
                        e.stopPropagation(); // tránh toggle cả section
                        toggleLecture("lecture-2");
                        setTitleLecture("2. Sign up in Webflow?");
                      }}
                    >
                      <span>2. Sign up in Webflow</span>
                      <span className="text-xs text-gray-500">07:31</span>
                    </div>
                    <div
                      className="flex justify-between"
                      onClick={(e) => {
                        e.stopPropagation(); // tránh toggle cả section
                        toggleLecture("lecture-3");
                        setTitleLecture("3. Teaser of Webflow?");
                      }}
                    >
                      <span>3. Teaser of Webflow</span>
                      <span className="text-xs text-gray-500">07:31</span>
                    </div>
                    <div
                      className="flex justify-between"
                      onClick={(e) => {
                        e.stopPropagation(); // tránh toggle cả section
                        toggleLecture("lecture-4");
                        setTitleLecture("4. Figma Introduction");
                      }}
                    >
                      <span>4. Figma Introduction</span>
                      <span className="text-xs text-gray-500">07:31</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Section 2 */}
              <div
                className={`border-b border-gray-200 p-3 cursor-pointer ${
                  activeSection === "secret-design" ? "text-green-600" : ""
                }`}
                onClick={() => toggleSection("secret-design")}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">Secret of Good Design</span>
                  <span className="text-xs text-gray-500">
                    52 lectures • 5h 49m
                  </span>
                </div>
                {activeSection === "secret-design" && (
                  <div className="pl-5 mt-2 text-sm text-gray-700">
                    Coming soon...
                  </div>
                )}
              </div>

              {/* Section 3 */}
              <div
                className="border-b border-gray-200 p-3 cursor-pointer"
                onClick={() => toggleSection("practice-design")}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    Practice Design Like an Artist
                  </span>
                  <span className="text-xs text-gray-500">
                    43 lectures • 5m
                  </span>
                </div>
              </div>

              {/* Section 4 */}
              <div
                className="border-b border-gray-200 p-3 cursor-pointer"
                onClick={() => toggleSection("web-development")}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">Web Development (Webflow)</span>
                  <span className="text-xs text-gray-500">
                    137 lectures • 10h 6m
                  </span>
                </div>
              </div>

              {/* Section 5 */}
              <div
                className="border-b border-gray-200 p-3 cursor-pointer"
                onClick={() => toggleSection("freelancing")}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    Secrets of Making Money Freelancing
                  </span>
                  <span className="text-xs text-gray-500">
                    21 lectures • 6h 3m
                  </span>
                </div>
              </div>

              {/* Section 6 */}
              <div
                className="border-b border-gray-200 p-3 cursor-pointer"
                onClick={() => toggleSection("advanced")}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">Advanced</span>
                  <span className="text-xs text-gray-500">
                    38 lectures • 3h 1m
                  </span>
                </div>
              </div>

              {/* Section 7 */}
              <div
                className="p-3 cursor-pointer"
                onClick={() => toggleSection("whats-next")}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">What's Next</span>
                  <span className="text-xs text-gray-500">
                    7 lectures • 1h 7m
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="font-sans  bg-gray-100 p-5 text-gray-800">
        {/* Tabs */}
        <div className="flex bg-white rounded-t-lg shadow px-5 py-2">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full cursor-pointer transition-colors mr-3 text-sm font-medium ${
                activeTab === tab.id
                  ? "bg-orange-500 text-white"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.label}
              {tab.count && (
                <span className="ml-2 bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Content tabs */}
        <div className="bg-white p-5 rounded-b-lg shadow -mt-px">
          {/* Description */}
          {activeTab === "description" && (
            <div>
              <h2 className="text-lg font-semibold mb-3">
                Lecture Description
              </h2>
              <p className="mb-3">
                We cover everything you need to build your first website. From
                creating your first page through to uploading your website to
                the internet.
              </p>
              <p>
                We'll use the world’s most popular (and free) web design tool
                called Visual Studio Code, there are exercises files you can
                download and then download so that you can compare your project
                with mine. This will enable you to see exactly where you are in
                the process so you can compare and then project with mine. This
                will enable you to see if all sounds a little too fancy - don't
                worry, this course is aimed at complete beginners to web design
                and who have never coded before. We'll start right at the
                beginning and work our way through step by step.
              </p>
            </div>
          )}

          {/* Notes */}
          {activeTab === "notes" && (
            <div>
              <h2 className="text-lg font-semibold mb-3">Lecture Notes</h2>
              <p className="mb-3">
                In ut aliquet ante, Curabitur mollis incidunt turpis, sed
                aliquamauris finibus vulputate. Praesent et mi in mi maximus
                egestas. Mauris et ipsum nisi, luctus bibendum pellentesque, eu
                Sed ac arcu ultricies aliquet. Maecenas tristique aliquet massa,
                varius tempus, urna ut actor mattis, urna ut actor mattis, urna
                ut actor mattis.
              </p>
              <p className="mb-3">
                Nunc aliquam lectus finibus, Donec nec a orci. Aliquam efficitur
                sem cursus elit facilisis lacinia.
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>
                  Curabitur posuere ut imperdiet tristique. Nam varius ac id
                  sodales, Donec facilisum interim mattis.
                </li>
                <li>
                  Sed eleifend, libero pharetra vestibulum, nibh est. Mauris
                  vestibulum massa, est. Integer eu lectus.
                </li>
                <li>
                  Donec consequat lorem nec consequat. Suspendisse eu risus
                  mattis, interdum ante sed, fringuilla. Praesent mattis dictum
                  sapien a lacinia. Vestibulum scelerisque magna aliquet,
                  blandit arcs, consectetur purus. Suspendisse et Ut scelerisque
                  felis, integer vulputate urna.
                </li>
              </ul>
              <button className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-4 py-2 rounded">
                Download Notes
              </button>
            </div>
          )}

          {/* Attachments */}
          {activeTab === "attachments" && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Attach Files (1)</h3>
              <div className="flex items-center bg-gray-100 rounded-lg p-3 mb-3">
                <span className="text-2xl mr-3">📄</span>
                <div className="flex-1">
                  <div className="font-semibold">
                    Create account on webflow.pdf
                  </div>
                  <div className="text-sm text-gray-500">12.6 MB</div>
                </div>
                <button className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-3 py-1.5 rounded">
                  Download File
                </button>
              </div>
            </div>
          )}

          {/* Comments */}
          {activeTab === "comments" && (
            <div>
              <div className="max-w-7xl bg-white rounded-lg shadow p-5">
                <div className="text-lg font-bold mb-4">
                  Comments ({comments.length})
                </div>

                {/* ✅ Form thêm comment */}
                <div className="mb-6 flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      className="w-full min-h-[60px] border border-gray-300 rounded p-2 resize-y"
                    />
                    <div className="mt-2 flex justify-end">
                      <button
                        onClick={handleAddComment}
                        className={`bg-[#e5e7eb] hover:bg-orange-600 text-white text-sm px-4 py-2 rounded ${
                          newComment.trim()
                            ? "bg-orange-500 hover:bg-orange-600"
                            : "bg-gray-300 cursor-not-allowed"
                        }`}
                      >
                        Post Comment
                      </button>
                    </div>
                  </div>
                </div>

                {/* Danh sách comment */}
                {comments.map((c) => (
                  <div key={c.id} className="mb-5">
                    <div className="flex">
                      <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                      <div className="flex-1">
                        <span className="font-semibold">
                          {c.author}{" "}
                          {c.role && (
                            <span className="text-blue-600 font-medium">
                              {c.role}
                            </span>
                          )}
                        </span>
                        <span className="text-gray-500 text-sm ml-1">
                          • {c.time}
                        </span>
                        <p className="mt-1 whitespace-pre-line">{c.text}</p>

                        {c.replyable && (
                          <button
                            onClick={() =>
                              setActiveReply(activeReply === c.id ? null : c.id)
                            }
                            className="text-blue-500 text-xs mt-1 hover:underline"
                          >
                            REPLY
                          </button>
                        )}

                        {/* hiển thị reply */}
                        {c.replies && c.replies.length > 0 && (
                          <div className="ml-12 mt-2 space-y-2">
                            {c.replies.map((r) => (
                              <div key={r.id} className="flex">
                                <div className="w-8 h-8 bg-gray-200 rounded-full mr-2"></div>
                                <div>
                                  <span className="font-semibold">
                                    {r.author}
                                  </span>
                                  <span className="text-gray-500 text-xs ml-1">
                                    • {r.time}
                                  </span>
                                  <p className="mt-1 text-sm whitespace-pre-line">
                                    {r.text}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {activeReply === c.id && (
                      <div className="mt-3 ml-12">
                        <textarea
                          className="w-full min-h-[60px] border border-gray-300 rounded p-2 mb-2 resize-y"
                          placeholder="Write your reply..."
                          value={replyText[c.id] || ""}
                          onChange={(e) =>
                            setReplyText((prev) => ({
                              ...prev,
                              [c.id]: e.target.value,
                            }))
                          }
                        />
                        <button
                          onClick={() => handleReply(c.id)}
                          className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-4 py-2 rounded"
                        >
                          Post Reply
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
