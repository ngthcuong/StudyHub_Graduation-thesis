from collections import defaultdict
from typing import List, Dict, Optional

from .schemas import QuestionKey, PerQuestionResult, SkillSummary

def grade_locally(answer_key: List[QuestionKey], student_answers: Dict[int, str]):
    """Deterministic grading and simple analytics.

    Returns: (total_correct, total_qs, per_question_results, skill_summary, weak_topics)
    Note: Explanations produced here are minimal. When use_gemini=True, main.py
    will replace per_question and analytics with Gemini's detailed output.
    """
    total_correct = 0
    per_q: List[PerQuestionResult] = []
    skill_stats = defaultdict(lambda: {"correct": 0, "total": 0, "topics": defaultdict(int)})

    for q in answer_key:
        qid = q.id
        expected = q.answer.strip().upper() if q.answer else ""
        user_ans = None
        if isinstance(student_answers, dict):
            # support both int and str keys
            user_ans = student_answers.get(qid) or student_answers.get(str(qid))
        else:
            try:
                user_ans = student_answers.get(str(qid))
            except Exception:
                user_ans = None

        correct = False
        if user_ans is not None and user_ans.strip().upper() == expected:
            correct = True
            total_correct += 1

        # lightweight explanation when not using Gemini
        if correct:
            explain_text = "Correct."
        else:
            explain_text = f"Expected \"{expected}\" but got \"{(user_ans or 'no answer')}\"."

        per_q.append(PerQuestionResult(
            id=qid,
            question=getattr(q, "question", None),
            correct=correct,
            expected_answer=expected,
            user_answer=(user_ans.strip().upper() if user_ans else None),
            skill=q.skill,
            topic=q.topic,
            explain=explain_text
        ))

        # skill stats
        skill_key = q.skill or "Unknown"
        skill_stats[skill_key]["total"] += 1
        if correct:
            skill_stats[skill_key]["correct"] += 1
        if q.topic:
            skill_stats[skill_key]["topics"][q.topic] += (0 if correct else 1)

    # prepare skill summary
    skill_summary = []
    weak_topics_grab = []
    for skill, st in skill_stats.items():
        total = st["total"]
        correct = st["correct"]
        accuracy = (correct / total * 100) if total > 0 else 0.0
        skill_summary.append(SkillSummary(skill=skill, total=total, correct=correct, accuracy=round(accuracy, 2)))
        topics = st["topics"]
        sorted_topics = sorted(topics.items(), key=lambda x: x[1], reverse=True)
        for tname, cnt in sorted_topics[:2]:
            weak_topics_grab.append(f"{skill} - {tname}")

    seen = set()
    weak_topics = []
    for t in weak_topics_grab:
        if t not in seen:
            weak_topics.append(t)
            seen.add(t)
        if len(weak_topics) >= 3:
            break

    return total_correct, len(answer_key), per_q, skill_summary, weak_topics
