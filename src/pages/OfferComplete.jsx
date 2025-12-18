import { useState } from "react";
import { useNavigate } from "react-router";

export default function OfferComplete() {
  const navigate = useNavigate();

  const sp = new URLSearchParams(window.location.search);
  const okRaw = (sp.get("ok") ?? "").toLowerCase();

  const [ok] = useState(
    okRaw === "1" || okRaw === "true" || okRaw === "ok" || okRaw === "success"
  );
  const [reason] = useState(sp.get("reason") || "");

  return (
    <div className="h-full w-full bg-stone-50 px-6 py-10">
      <div className="mx-auto grid max-w-[520px] place-items-center">
        <div className="w-full overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
          <div className="p-7">
            <div className="flex items-start gap-3">
              <div
                className={`grid h-10 w-10 place-items-center rounded-2xl ring-1 ${
                  ok
                    ? "bg-cyan-50 text-cyan-700 ring-cyan-200"
                    : "bg-rose-50 text-rose-700 ring-rose-200"
                }`}
              >
                {ok ? "✓" : "!"}
              </div>

              <div className="flex-1">
                <div className="text-lg font-extrabold text-stone-900">
                  {ok ? "예약이 완료되었습니다" : "예약에 실패했습니다"}
                </div>
                <div className="mt-1 text-sm text-stone-500">
                  {ok
                    ? "나의 예약 현황에서 확인할 수 있어요."
                    : "이전 페이지로 돌아가주세요."}
                </div>

                {!ok && reason ? (
                  <div className="mt-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-xs text-stone-600">
                    {reason}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-6">
              {ok ? (
                <button
                  onClick={() => navigate("/home/my/bookstate")}
                  className="w-full rounded-2xl bg-cyan-600 px-4 py-3 text-sm font-bold text-white hover:bg-cyan-700 active:scale-[0.99]"
                >
                  나의 예약 현황 보러가기
                </button>
              ) : (
                <button
                  onClick={() => navigate(-1)}
                  className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-bold text-stone-800 hover:bg-stone-50 active:scale-[0.99]"
                >
                  뒤로가기
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
