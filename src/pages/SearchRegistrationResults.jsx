import { use, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import SearchRegistration from "./SearchRegistration";
import Loading from "../modal/Loading";

function atStartOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function atEndOfDay(d) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}
function pad2(n) {
  return String(n).padStart(2, "0");
}
function fmtDot(d) {
  if (!d) return "";
  const x = new Date(d);
  return `${x.getFullYear()}. ${pad2(x.getMonth() + 1)}. ${pad2(x.getDate())}.`;
}
function fmtDash(d) {
  if (!d) return "";
  const x = new Date(d);
  return `${x.getFullYear()}-${pad2(x.getMonth() + 1)}-${pad2(x.getDate())}`;
}

function normalizeOfferResponse(data) {
  if (Array.isArray(data)) {
    return { list: data, total: data.length };
  }
  const list =
    data?.rentalOfferResponseList ??
    data?.rentalOfferList ??
    data?.offers ??
    data?.data ??
    [];
  const total =
    data?.countAllRentalOffer ??
    data?.total ??
    data?.count ??
    (Array.isArray(list) ? list.length : 0);

  return { list: Array.isArray(list) ? list : [], total: Number(total) || 0 };
}

function pickFirstImage(o) {
  const a = o?.images?.[0]?.img;
  if (a) return a;

  const b = o?.carImages?.[0]?.img;
  if (b) return b;

  const c = o?.img?.[0];
  if (!c) return "";
  if (typeof c === "string") return c;
  return c?.img ?? "";
}

function pickModelName(o) {
  return (
    o?.modelName ??
    o?.car?.model_name ??
    o?.car?.modelName ??
    o?.car?.model ??
    "모델명 없음"
  );
}

function pickModelYear(o) {
  return o?.modelYear ?? o?.car?.model_year ?? o?.car?.year ?? null;
}

function pickNickName(o) {
  return o?.nickName ?? o?.nickname ?? o?.ownerNickName ?? null;
}

function pickPrice(o) {
  return o?.rentalPrice ?? o?.price ?? o?.dailyPrice ?? 0;
}

async function callSearchApi(range) {
  const startDate = range?.startDate ? new Date(range.startDate) : new Date();
  const endDate = range?.endDate ? new Date(range.endDate) : new Date();

  const start = fmtDash(startDate);
  const end = fmtDash(endDate);

  const api = await import("../requests/offerRegistration-api");

  const candidates = [
    api.searchRentalOffers,
    api.searchRentalOffer,
    api.getRentalOffersByDate,
    api.getRentalOffersWithDate,
    api.getRentalOffers, // 마지막 fallback
  ].filter((fn) => typeof fn === "function");

  let lastErr = null;

  for (const fn of candidates) {
    try {
      if (fn.length >= 2) return await fn(start, end);

      if (fn.length === 1)
        return await fn({
          startDate: start,
          endDate: end,
          start,
          end,
          startDateObj: startDate,
          endDateObj: endDate,
        });

      // () 형태
      return await fn();
    } catch (e) {
      lastErr = e;
    }
  }
}

export default function SearchRegistrationResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    setShowLoading(true);
    callSearchApi(range).then((data) => {
      const { list, total } = normalizeOfferResponse(data);
      setOffers(list);
      setTotal(total);
    });
    setTimeout(function () {
      setShowLoading(false);
    }, 1000);
  }, []);

  const initialRange = useMemo(() => {
    const s = location?.state?.startDate || location?.state?.range?.startDate;
    const e = location?.state?.endDate || location?.state?.range?.endDate;

    const startDate = s ? atStartOfDay(new Date(s)) : atStartOfDay(new Date());
    const endDate = e ? atEndOfDay(new Date(e)) : atEndOfDay(new Date());

    return { startDate, endDate, key: "selection" };
  }, [location?.state]);

  const [range, setRange] = useState(initialRange);

  const [offers, setOffers] = useState([]);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function runSearch(r) {
    setLoading(true);
    setError("");
    try {
      const data = await callSearchApi(r);
      const { list, total } = normalizeOfferResponse(data);
      setOffers(list);
      setTotal(total);
    } catch (e) {
      setOffers([]);
      setTotal(0);
      setError(e?.message || "검색 실패");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    runSearch(range);
  }, []);

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-[1200px] px-6 py-10 space-y-6">
        {/* 헤더 */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-stone-900">차량 검색</h1>
          <div className="text-sm text-stone-500">
            {fmtDot(range.startDate)} ~ {fmtDot(range.endDate)}
          </div>
        </div>

        {/* 달력(유지) */}
        <SearchRegistration
          onChange={(r) => {
            if (!r) return;
            setRange(r);
          }}
          onSearch={(r) => {
            if (!r) return;
            setRange(r);
            runSearch(r);
          }}
        />

        {/* 결과 요약 */}
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="text-sm font-bold text-stone-900">검색 결과</div>
            <div className="mt-1 text-xs text-stone-500">
              {loading ? "" : `총 ${Number(total).toLocaleString()}건`}
            </div>
          </div>

          <button
            type="button"
            className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50"
            onClick={() => runSearch(range)}
            disabled={loading}
          >
            새로고침
          </button>
        </div>

        {/* 에러 */}
        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {/* 검색 결과 리스트 */}
        {!loading && offers.length === 0 ? (
          <div className="rounded-2xl border border-stone-200 bg-white p-6 text-sm text-stone-600">
            조건에 맞는 차량이 없습니다. 기간을 바꿔서 다시 검색해보세요.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {(loading ? Array.from({ length: 6 }) : offers).map((o, idx) => {
              if (loading) {
                return (
                  <div
                    key={idx}
                    className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm"
                  >
                    <div className="h-36 animate-pulse bg-stone-100" />
                    <div className="p-4 space-y-3">
                      <div className="h-5 w-2/3 animate-pulse rounded bg-stone-100" />
                      <div className="h-4 w-1/3 animate-pulse rounded bg-stone-100" />
                      <div className="h-10 animate-pulse rounded bg-stone-100" />
                      <div className="h-9 animate-pulse rounded-2xl bg-stone-100" />
                    </div>
                  </div>
                );
              }

              const img = pickFirstImage(o);
              const modelName = pickModelName(o);
              const modelYear = pickModelYear(o);
              const nickName = pickNickName(o);
              const rentalPrice = pickPrice(o);

              return (
                <div
                  key={o?.idx ?? o?.id ?? idx}
                  className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm"
                >
                  <div className="relative h-36 bg-stone-100">
                    {img ? (
                      <img
                        src={img}
                        alt={modelName}
                        className="h-full w-full object-contain p-3"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-stone-400">
                        이미지 없음
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    {/* 상단: 모델명 + 연식 */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-lg font-extrabold tracking-tight text-stone-900">
                          {modelName}
                        </div>
                        <div className="mt-1 inline-flex items-center rounded-full border border-stone-200 bg-stone-50 px-2 py-0.5 text-xs font-semibold text-stone-600">
                          {modelYear ? `${modelYear}년식` : "연식 정보 없음"}
                        </div>
                      </div>

                      {/* 가격 배지 */}
                      <div className="shrink-0 text-right">
                        <div className="text-[11px] font-semibold text-stone-500">
                          1일 대여
                        </div>
                        <div className="mt-0.5 inline-flex items-baseline gap-1 rounded-xl bg-sky-500 px-3 py-1.5 text-white">
                          <span className="text-sm font-extrabold">
                            {typeof rentalPrice === "number"
                              ? rentalPrice.toLocaleString()
                              : rentalPrice ?? 0}
                          </span>
                          <span className="text-[11px] font-semibold opacity-90">
                            원
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 판매자 */}
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="grid h-8 w-8 place-items-center rounded-full bg-stone-100 text-xs font-bold text-stone-600">
                          {(nickName ?? "게").slice(0, 1)}
                        </div>
                        <div className="text-sm font-semibold text-stone-700">
                          {nickName ? `${nickName}님` : "판매자 정보 없음"}
                        </div>
                      </div>
                    </div>

                    {/* 설명 */}
                    <div className="mt-3 rounded-xl bg-stone-50 px-3 py-2 text-sm text-stone-600">
                      <div className="line-clamp-2">
                        {o?.description ?? "설명이 없습니다."}
                      </div>
                    </div>

                    {/* 하단: 예약 버튼 */}
                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        className="flex-1 rounded-2xl bg-cyan-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-cyan-800 active:scale-[0.99]"
                        onClick={() => {
                          // 프로젝트에 맞게 경로만 바꿔서 쓰면 됨
                          // 예: navigate(`/booking/${o.idx}`, { state: { offer: o, range } })
                          navigate("/home/offer/:offerId/book");
                        }}
                      >
                        예약하기
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {showLoading && <Loading />}
    </div>
  );
}
