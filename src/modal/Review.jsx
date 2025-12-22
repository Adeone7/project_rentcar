export default function ReviewModal({ setModal, reservationIdx, reloadReservations }) {
  const { token } = useToken();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmitReview = async () => {
    setError("");
    if (!token) return setError("로그인 상태를 확인할 수 없습니다.");
    if (rating === 0) return setError("별점을 선택해주세요.");
    if (comment.trim().length < 5) return setError("리뷰 내용을 5자 이상 입력해주세요.");

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
