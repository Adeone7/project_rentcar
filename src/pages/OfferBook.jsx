import { useEffect, useMemo, useState } from "react";
import { useAccount, useToken } from "../stores/account-store";
import { bookRentalOffer } from "../requests/offerRegistration-api";
import { useNavigate } from "react-router";
import LoginModal from "../modal/Login";

function pickOfferId(offer) {
  return (
    offer?.idx ?? offer?.id ?? offer?.offerId ?? offer?.rentalOfferIdx ?? null
  );
}
function pickAccountId(account) {
  return account?.idx ?? account?.id ?? account?.accountId ?? null;
}

export default function OfferBook({ offer, onBack }) {
  const { token } = useToken();
  const { account } = useAccount();
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingErr, setBookingErr] = useState("");
  const [bookingOk, setBookingOk] = useState("");

  const [modal, setModal] = useState(null);
  const [isLogin, setIsLogin] = useState(false);

  const offerId = useMemo(() => String(pickOfferId(offer) ?? ""), [offer]);

  useEffect(() => {
    if (!token) setModal("Login");
    else setModal(null);
  }, [token]);

  const title = useMemo(() => {
    return (
      offer?.modelName ??
      offer?.car?.model_name ??
      offer?.car?.modelName ??
      "차량 상세"
    );
  }, [offer]);

  const year = useMemo(() => {
    return offer?.modelYear ?? offer?.car?.model_year ?? offer?.car?.modelYear;
  }, [offer]);

  const price = useMemo(() => {
    const v = offer?.rentalPrice ?? offer?.price;
    if (typeof v === "number") return v.toLocaleString();
    if (typeof v === "string") return v;
    return "0";
  }, [offer]);

  const heroImg = useMemo(() => {
    return (
      offer?.images?.[0]?.img ?? offer?.images?.[0] ?? offer?.img?.[0] ?? null
    );
  }, [offer]);

  const onBook = async () => {
    setBookingErr("");
    setBookingOk("");

    if (!token) {
      setModal("Login");
      return;
    }
    if (!offerId) {
      setBookingErr("매물 ID가 없습니다.");
      return;
    }
    if (!startDate || !endDate) {
      setBookingErr("대여 시작일/종료일을 선택해주세요.");
      return;
    }

    const accountId = pickAccountId(account);
    if (!accountId) {
      setBookingErr("로그인 정보(accountId)를 찾을 수 없습니다.");
      return;
    }

    setBookingLoading(true);
    try {
      await bookRentalOffer({ offerId, accountId, startDate, endDate });
      setBookingOk("예약이 완료되었습니다.");
    } catch (e) {
      setBookingErr("예약 요청에 실패했습니다.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (!offer) {
    return (
      <div className="min-h-screen bg-stone-50">
        <div className="mx-auto max-w-[900px] px-6 py-10">
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <div className="text-sm font-extrabold text-stone-900">
              차량 정보를 찾을 수 없습니다.
            </div>
            <button
              type="button"
              className="mt-4 rounded-2xl bg-cyan-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-cyan-800"
              onClick={() => onBack?.()}
            >
              돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  function goResult(nextRange) {
    onSearch?.(nextRange);

    navigate(resultPath, {
      state: {
        range: nextRange,
        startDate: nextRange?.startDate,
        endDate: nextRange?.endDate,
      },
    });

    setOpen(false);
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-[1100px] px-6 py-10">
        {/* 상단 */}
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <div className="text-xs font-semibold text-cyan-700">BOOKING</div>
            <div className="mt-1 text-2xl font-extrabold tracking-tight text-stone-900">
              {title}
            </div>
            <div className="mt-2 text-xs font-semibold text-stone-500">
              {offerId ? `매물번호: ${offerId}` : ""}
            </div>
          </div>

          <button
            type="button"
            className="rounded-2xl border border-stone-200 bg-white px-4 py-2 text-sm font-bold text-stone-700 shadow-sm hover:bg-stone-50"
            onClick={() => onBack?.()}
          >
            뒤로가기
          </button>
        </div>

        {/* 본문 카드 */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.2fr,0.8fr]">
          {/* 좌측: 차량 상세 */}
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
            <div className="relative h-64 bg-stone-100">
              {heroImg ? (
                <img
                  src={heroImg}
                  alt={title}
                  className="h-full w-full object-contain p-4"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-stone-400">
                  이미지 없음
                </div>
              )}
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-extrabold text-stone-900">
                    {title}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full border border-stone-200 bg-stone-50 px-2 py-0.5 text-xs font-semibold text-stone-600">
                      {year ? `${year}년식` : "연식 정보 없음"}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <div className="text-[11px] font-semibold text-stone-500">
                    대여료
                  </div>
                  <div className="mt-1 inline-flex items-baseline gap-1 rounded-xl bg-sky-500 px-3 py-1.5 text-white">
                    <span className="text-sm font-extrabold">{price}</span>
                    <span className="text-[11px] font-semibold opacity-90">
                      원
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-stone-50 p-4">
                <div className="text-xs font-bold text-stone-700">설명</div>
                <div className="mt-2 text-sm text-stone-700 leading-relaxed">
                  {offer?.description ?? "설명이 없습니다."}
                </div>
              </div>
            </div>
          </div>

          {/* 우측: 예약 폼 */}
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <div className="text-sm font-extrabold text-stone-900">
              예약 정보
            </div>
            <div className="mt-1 text-xs font-semibold text-stone-500">
              날짜 선택 후 예약을 진행하세요.
            </div>

            <div className="mt-4 space-y-3">
              <label className="block">
                <div className="text-xs font-bold text-stone-700">
                  대여 시작일
                </div>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-cyan-600"
                />
              </label>

              <label className="block">
                <div className="text-xs font-bold text-stone-700">
                  대여 종료일
                </div>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-cyan-600"
                />
              </label>

              {bookingErr && (
                <div className="rounded-2xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
                  {bookingErr}
                </div>
              )}
              {bookingOk && (
                <div className="rounded-2xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                  {bookingOk}
                </div>
              )}

              <button
                type="button"
                disabled={bookingLoading}
                onClick={onBook}
                className="mt-2 w-full rounded-2xl bg-cyan-600 px-4 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-cyan-800 disabled:opacity-60"
              >
                {bookingLoading ? "예약 처리중..." : "예약하기"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {modal === "Login" && (
        <div
          className="fixed inset-0 z-9999 grid place-items-center bg-black/40 px-4"
          onClick={() => setModal(null)}
        >
          <LoginModal setModal={setModal} setIsLogin={setIsLogin} />
        </div>
      )}
    </div>
  );
}
