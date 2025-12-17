import { useEffect, useState } from "react";
import { getRentalOffers } from "../requests/offerRegistration-api";

export default function HomePage() {
  const [offers, setOffers] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    getRentalOffers().then((json) => {
      console.log(json);
      setOffers(json.rentalOfferListResponse ?? []);
      setTotal(json.countAllRentalOffer ?? 0);
    });
  }, []);

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-[1200px] px-6 py-10">
        <h1 className="mb-6 text-2xl font-semibold text-stone-900">
          신규 차량
        </h1>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {offers.map((o) => (
            <div
              key={o.idx}
              className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm"
            >
              <div className="relative h-36 bg-stone-100">
                {o.images?.[0] ? (
                  <img
                    src={o.images[0].img}
                    alt={o.car?.model_name}
                    className="h-full w-full object-contain p-3"
                    loading="잠시 기다려 주세요"
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
                      {o?.modelName ?? "모델명 없음"}
                    </div>
                    <div className="mt-1 inline-flex items-center rounded-full border border-stone-200 bg-stone-50 px-2 py-0.5 text-xs font-semibold text-stone-600">
                      {o?.modelYear ? `${o.modelYear}년식` : "연식 정보 없음"}
                    </div>
                  </div>

                  {/* 가격 배지 */}
                  <div className="shrink-0 text-right">
                    <div className="text-[11px] font-semibold text-stone-500">
                      1일 대여
                    </div>
                    <div className="mt-0.5 inline-flex items-baseline gap-1 rounded-xl bg-sky-500 px-3 py-1.5 text-white">
                      <span className="text-sm font-extrabold">
                        {typeof o?.rentalPrice === "number"
                          ? o.rentalPrice.toLocaleString()
                          : o?.rentalPrice ?? 0}
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
                      {(o?.nickName ?? "게").slice(0, 1)}
                    </div>
                    <div className="text-sm font-semibold text-stone-700">
                      {o?.nickName ? `${o.nickName}님` : "판매자 정보 없음"}
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
                      console.log("예약하기", o);
                    }}
                  >
                    예약하기
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
