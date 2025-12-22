import { useToken } from "../stores/account-store";
import { useState } from "react";

export default function ReviewModal({
  setModal,
  reservationIdx,
  reloadReservations,
}) {
  const { token } = useToken();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  function StarRating({ rating, setRating }) {
    const stars = [1, 2, 3, 4, 5];
    return (
      <div className="flex justify-center mb-4">
        {stars.map((star) => (
          <svg
            key={star}
            onClick={() => setRating(star)}
            className={`h-8 w-8 cursor-pointer ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  }

  const handleSubmitReview = async () => {
    setError("");
    if (!token) return setError("로그인 상태를 확인할 수 없습니다.");
    if (rating === 0) return setError("별점을 선택해주세요.");
    if (comment.trim().length < 5)
      return setError("리뷰 내용을 5자 이상 입력해주세요.");

    setIsLoading(true);
    try {
      const result = await createReview(token, reservationIdx, {
        content: comment,
        starRating: rating,
      });

      if (result.success) {
        alert(result.message);
        setModal(""); // 모달 닫기
        // ✅ 부모 상태 갱신
        reloadReservations?.();
      } else {
        setError(result.message || "리뷰 작성에 실패했습니다.");
      }
    } catch (err) {
      setError("리뷰 작성 중 오류 발생: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border-stone-200 bg-white p-6 shadow-sm">
      <div className="text-xl font-extrabold text-stone-900 text-center mb-5">
        리뷰 작성하기
      </div>
      <div className="flex flex-col items-center gap-4">
        <StarRating rating={rating} setRating={setRating} />
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="리뷰 내용을 작성해주세요 (최소 5자)"
          className="w-full h-32 p-3 rounded-lg border border-stone-200 text-sm outline-none focus:border-cyan-400 resize-none"
        />
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        <div className="w-full flex justify-end gap-2 mt-4">
          <button
            onClick={() => setModal("")}
            className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50"
            disabled={isLoading}
          >
            취소
          </button>
          <button
            onClick={handleSubmitReview}
            className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700"
            disabled={isLoading}
          >
            {isLoading ? "작성중..." : "리뷰 제출"}
          </button>
        </div>
      </div>
    </div>
  );
}
