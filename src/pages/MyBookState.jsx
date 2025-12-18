import { useState } from "react";
import { useNavigate } from "react-router";
import { useToken } from "../stores/account-store";
import LoginModal from "../modal/Login";

function StatusPill({ label, tone = "cyan" }) {
  const map = {
    cyan: "bg-cyan-50 text-cyan-700 ring-cyan-200",
    rose: "bg-rose-50 text-rose-700 ring-rose-200",
    stone: "bg-stone-100 text-stone-700 ring-stone-200",
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${
        map[tone] ?? map.stone
      }`}
    >
      {label}
    </span>
  );
}

function GhostBtn({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50"
    >
      {children}
    </button>
  );
}

function PrimaryBtn({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl bg-cyan-600 px-4 py-2 text-xs font-semibold text-white hover:bg-cyan-700"
    >
      {children}
    </button>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white px-4 py-3">
      <div className="text-[11px] font-semibold text-stone-500">{label}</div>
      <div className="mt-1 text-xl font-extrabold text-stone-900">{value}</div>
    </div>
  );
}

export default function MyBookState() {
  const navigate = useNavigate();
  const { token } = useToken();

  const [q, setQ] = useState("");
  const [tab, setTab] = useState("전체");
  const [modal, setModal] = useState("");

  const current = {
    id: 101,
    carName: "KIA K5 (2022)",
    carNo: "12가 3456",
    pickup: "서울역 3번 출구",
    startAt: "2025.12.20 10:00",
    endAt: "2025.12.22 10:00",
    days: 2,
    price: "189,000원",
    statusLabel: "예약중",
    statusTone: "cyan",
  };

  const historyAll = [
    {
      id: 99,
      carName: "Hyundai Avante (2021)",
      pickup: "강남역 11번 출구",
      period: "2025.12.01 09:00 → 2025.12.02 09:00 · 1일",
      price: "79,000원",
      type: "이용완료",
      statusLabel: "이용완료",
      statusTone: "stone",
    },
    {
      id: 88,
      carName: "Tesla Model 3 (2023)",
      pickup: "인천공항 T1",
      period: "2025.11.01 09:00 → 2025.11.03 09:00 · 2일",
      price: "320,000원",
      type: "취소",
      statusLabel: "취소됨",
      statusTone: "rose",
    },
    {
      id: 77,
      carName: "KIA Sorento (2020)",
      pickup: "잠실역 2번 출구",
      period: "2025.10.12 10:00 → 2025.10.14 10:00 · 2일",
      price: "210,000원",
      type: "이용완료",
      statusLabel: "이용완료",
      statusTone: "stone",
    },
  ];

  const stats = {
    total: historyAll.length + 1,
    reserved: 1,
    canceled: historyAll.filter((x) => x.type === "취소").length,
    completed: historyAll.filter((x) => x.type === "이용완료").length,
  };

  const keyword = q.trim().toLowerCase();
  const history = historyAll
    .filter((x) => (tab === "전체" ? true : x.type === tab))
    .filter((x) => {
      if (!keyword) return true;
      return `${x.id} ${x.carName} ${x.pickup}`.toLowerCase().includes(keyword);
    });

  const modalUI = modal && (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-stone-900/30 px-4"
      onClick={() => setModal("")}
    >
      <div
        className="w-full max-w-[520px]"
        onClick={(e) => e.stopPropagation()}
      >
        {modal === "Login" && <LoginModal setModal={setModal} />}
      </div>
    </div>
  );

  if (!token) {
    return (
      <div className="min-h-[calc(100vh-140px)] grid place-items-center bg-white">
        <div className="w-full max-w-[420px] rounded-2xl border border-stone-200 bg-white p-6 text-center shadow-sm">
          <div className="text-sm font-extrabold text-stone-900">
            로그인이 필요합니다
          </div>
          <div className="mt-2 text-xs text-stone-500">
            내 예약을 확인하려면 로그인해주세요.
          </div>
          <button
            className="mt-5 w-full rounded-xl bg-cyan-600 px-4 py-3 text-sm font-bold text-white hover:bg-cyan-700"
            onClick={() => setModal("Login")}
          >
            로그인하기
          </button>
        </div>

        {modalUI}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {modalUI}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-[11px] font-semibold text-cyan-700">
            MY BOOKING
          </div>
          <h1 className="mt-1 text-2xl font-extrabold text-stone-900">
            내 예약
          </h1>
          <div className="mt-1 text-sm text-stone-500">
            현재 예약된 차량과 예약 히스토리를 확인하세요.
          </div>
        </div>

        <div className="w-full sm:w-[420px] space-y-2">
          <div className="flex gap-2">
            {["전체", "예약중", "취소", "이용완료"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ring-1 transition ${
                  tab === t
                    ? "bg-cyan-600 text-white ring-cyan-600"
                    : "bg-white text-stone-700 ring-stone-200 hover:bg-stone-50"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="차량명/픽업지 검색"
              className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-2.5 text-sm outline-none ring-0 placeholder:text-stone-400 focus:border-cyan-300"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="전체" value={stats.total} />
        <Stat label="예약중" value={stats.reserved} />
        <Stat label="취소" value={stats.canceled} />
        <Stat label="이용완료" value={stats.completed} />
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="text-sm font-bold text-stone-900">현재 예약</div>
            <div className="mt-1 text-xs text-stone-500">
              진행 중인 예약입니다
            </div>
          </div>
          <PrimaryBtn onClick={() => navigate("/home/offer/search")}>
            새 예약하기
          </PrimaryBtn>
        </div>

        <div className="mt-4 rounded-2xl border border-cyan-100 bg-cyan-50/40 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
            <div className="sm:w-[280px]">
              <div className="aspect-16/10 w-full overflow-hidden rounded-2xl bg-stone-100">
                <div className="h-full w-full bg-linear-to-br from-stone-100 to-stone-200" />
              </div>
              <div className="mt-2 flex items-center gap-2 text-[11px] text-stone-600">
                <StatusPill
                  label={current.statusLabel}
                  tone={current.statusTone}
                />
                <span>예약번호 #{current.id}</span>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="text-base font-extrabold text-stone-900">
                    {current.carName}
                  </div>
                  <div className="mt-1 text-xs text-stone-500">
                    차량번호 {current.carNo} · 픽업 {current.pickup}
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-xs text-stone-500">
                    {current.days}일 ·{" "}
                    <span className="font-extrabold text-stone-900">
                      {current.price}
                    </span>
                  </div>
                  <div className="mt-1 text-[11px] text-stone-500">
                    * 대여 임박/진행 중에는 취소 불가
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-stone-200 bg-white p-3">
                  <div className="text-[11px] font-semibold text-stone-500">
                    대여
                  </div>
                  <div className="mt-1 text-sm font-semibold text-stone-900">
                    {current.startAt}
                  </div>
                </div>
                <div className="rounded-2xl border border-stone-200 bg-white p-3">
                  <div className="text-[11px] font-semibold text-stone-500">
                    반납
                  </div>
                  <div className="mt-1 text-sm font-semibold text-stone-900">
                    {current.endAt}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <GhostBtn onClick={() => alert("상세보기 연결 예정")}>
                  상세보기
                </GhostBtn>
                <button
                  onClick={() => alert("예약취소 연결 예정")}
                  className="rounded-xl bg-rose-400 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-500"
                >
                  예약취소
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-3 sm:p-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="text-sm font-bold text-stone-900">
              예약 히스토리
            </div>
            <div className="mt-0.5 text-xs text-stone-500">나의 이용 내역</div>
          </div>
        </div>

        <div className="mt-3 space-y-1.5">
          {history.map((b) => (
            <div
              key={b.id}
              className="rounded-2xl border border-stone-200 bg-white px-3 py-2 hover:bg-stone-50/60 transition"
            >
              <div className="flex gap-3">
                <div className="h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                  <div className="h-full w-full bg-linear-to-br from-stone-100 to-stone-200" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 flex items-center gap-2">
                      <div className="truncate text-sm font-bold text-stone-900">
                        {b.carName}
                      </div>
                      <span className="shrink-0 text-[11px] text-stone-500">
                        #{b.id}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                      <div className="text-sm font-extrabold text-stone-900">
                        {b.price}
                      </div>

                      <button
                        onClick={() => alert("상세보기 연결 예정")}
                        className="rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-stone-700 hover:bg-stone-50"
                      >
                        상세
                      </button>
                      <button
                        onClick={() => alert("다시예약 연결 예정")}
                        className="rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-stone-700 hover:bg-stone-50"
                      >
                        다시예약
                      </button>
                    </div>
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                    <StatusPill label={b.statusLabel} tone={b.statusTone} />
                    <span className="truncate text-xs text-stone-600">
                      {b.period}
                    </span>
                    <span className="truncate text-[11px] text-stone-500">
                      픽업: {b.pickup}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
