import { useEffect, useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { ko } from "date-fns/locale";

// ===== util =====
const DOW_KO = ["일", "월", "화", "수", "목", "금", "토"];

function pad2(n) {
  return String(n).padStart(2, "0");
}
function fmtMDdow(date) {
  if (!date) return "—";
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const dow = DOW_KO[date.getDay()];
  return `${m}.${pad2(d)}(${dow})`;
}
function fmtTimeOnly(date, fallback = "10:00") {
  if (!date) return fallback;
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}
function combine(dateObj, timeStr) {
  if (!dateObj) return null;
  const [hh, mm] = (timeStr || "00:00").split(":").map(Number);
  const out = new Date(dateObj);
  out.setHours(hh || 0, mm || 0, 0, 0);
  return out;
}
function makeTimes(stepMin = 30) {
  const out = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += stepMin) out.push(`${pad2(h)}:${pad2(m)}`);
  }
  return out;
}
function durationText(start, end) {
  if (!start || !end) return "0시간";
  const diffMs = end - start;
  if (diffMs <= 0) return "0시간";
  const totalHours = Math.round(diffMs / (1000 * 60 * 60));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  if (days <= 0) return `${totalHours}시간`;
  if (hours === 0) return `${days}일`;
  return `${days}일 ${hours}시간`;
}

export default function SearchRegistration() {
  // ✅ 적용값
  const [startDT, setStartDT] = useState(null);
  const [endDT, setEndDT] = useState(null);

  // ✅ 모달 드래프트
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState(undefined);
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("10:00");
  const [error, setError] = useState("");

  const timeOptions = useMemo(() => makeTimes(30), []);
  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  function openModal() {
    const from = startDT ? new Date(startDT) : undefined;
    const to = endDT ? new Date(endDT) : undefined;

    setRange(from && to ? { from, to } : undefined);
    setStartTime(fmtTimeOnly(startDT, "10:00"));
    setEndTime(fmtTimeOnly(endDT, "10:00"));
    setError("");
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const draftStart = useMemo(
    () => (range?.from ? combine(range.from, startTime) : null),
    [range?.from, startTime]
  );
  const draftEnd = useMemo(
    () => (range?.to ? combine(range.to, endTime) : null),
    [range?.to, endTime]
  );

  const canApply =
    !!range?.from &&
    !!range?.to &&
    !!draftStart &&
    !!draftEnd &&
    draftEnd > draftStart;

  const durText = useMemo(
    () => durationText(draftStart, draftEnd),
    [draftStart, draftEnd]
  );

  function apply() {
    if (!range?.from || !range?.to) {
      setError("대여/반납 날짜를 선택해 주세요.");
      return;
    }
    const s = combine(range.from, startTime);
    const e = combine(range.to, endTime);

    if (!s || !e) {
      setError("시간 선택이 올바르지 않아요.");
      return;
    }
    if (e <= s) {
      setError("반납 시간은 대여 시간보다 이후여야 합니다.");
      return;
    }

    setStartDT(s);
    setEndDT(e);
    setOpen(false);
  }

  function handleSearch() {
    console.log("검색 적용값:", {
      start: startDT?.toISOString(),
      end: endDT?.toISOString(),
    });
  }

  const barText =
    startDT && endDT
      ? `${fmtMDdow(startDT)} ${fmtTimeOnly(startDT)}  ▶  ${fmtMDdow(
          endDT
        )} ${fmtTimeOnly(endDT)}`
      : "날짜 및 시간 선택";

  const appliedDuration = useMemo(
    () => durationText(startDT, endDT),
    [startDT, endDT]
  );

  return (
    <div>
      {/* 상단 검색 바 */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center gap-2 rounded-lg bg-stone-100 px-3 py-2 text-sm">
          <button
            type="button"
            onClick={openModal}
            className="flex min-w-[420px] items-center justify-between gap-3 rounded-md border border-stone-200 bg-white px-4 py-2 hover:bg-stone-50"
          >
            <span className="text-stone-800">{barText}</span>
            {startDT && endDT && (
              <span className="shrink-0 rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600">
                {appliedDuration}
              </span>
            )}
          </button>

          <button
            type="button"
            className="h-9 rounded-md bg-stone-700 px-4 text-white hover:bg-stone-800"
            onClick={handleSearch}
          >
            검색
          </button>
        </div>
      </div>

      {/* 모달 */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
          onClick={() => setOpen(false)}
        >
          {/* ✅ 가로 줄이고 / 세로 키우기 */}
          <div
            className="w-full max-w-[860px] min-h-[720px] h-[84vh] rounded-2xl bg-white shadow-xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 헤더 */}
            <div className="px-4 sm:px-6 pt-6">
              <div className="text-base font-semibold text-stone-900">
                날짜 및 시간 선택
              </div>
            </div>

            {/* 선택값 바 */}
            <div className="px-4 sm:px-6 mt-3">
              <div className="flex items-center justify-between rounded-xl bg-stone-100 px-4 py-3 text-sm">
                <div className="text-stone-800">
                  {fmtMDdow(range?.from)} {startTime}
                  <span className="mx-2 text-stone-400">▶</span>
                  {fmtMDdow(range?.to)} {endTime}
                </div>
                <div className="text-stone-500">{canApply ? durText : ""}</div>
              </div>
            </div>

            {/* ✅ 달력(상자 넓게 보이게: 좌우 패딩 줄이고 캘린더 박스는 꽉 차게) */}
            <div className="px-3 sm:px-6 mt-4">
              <div className="w-full rounded-2xl border border-stone-200 bg-white px-4 sm:px-6 py-6">
                <DayPicker
                  mode="range"
                  numberOfMonths={2}
                  pagedNavigation
                  locale={ko}
                  selected={range}
                  onSelect={(r) => {
                    setRange(r);
                    setError("");
                  }}
                  disabled={{ before: today }}
                  style={{
                    "--rdp-day_button-width": "46px",
                    "--rdp-day_button-height": "46px",
                    "--rdp-accent-color": "rgb(37 99 235)",

                    // ✅ 범위 막대기 제거
                    "--rdp-range_middle-background-color": "transparent",
                    "--rdp-range_start-background": "transparent",
                    "--rdp-range_end-background": "transparent",
                    "--rdp-accent-background-color": "transparent",
                  }}
                  modifiers={{
                    sunday: (date) => date.getDay() === 0,
                    saturday: (date) => date.getDay() === 6,
                  }}
                  modifiersClassNames={{
                    sunday: "text-red-500",
                    saturday: "text-blue-600",
                  }}
                  classNames={{
                    months:
                      "flex flex-col md:flex-row md:gap-12 items-start justify-center",
                    month: "w-full md:w-[380px]",

                    // ✅ nav(<> 버튼)과 월/년 라벨이 안 붙도록: 위 공간 크게 + nav 더 위로
                    caption:
                      "relative flex items-center justify-center pt-16 pb-2",
                    caption_label: "text-xl font-semibold text-stone-800",

                    // ✅ < > 버튼: 훨씬 위 + 좌우 여백 크게(너무 붙는 느낌 방지)
                    nav: "absolute inset-x-0 -top-16 flex justify-between px-10",
                    nav_button:
                      "h-9 w-9 rounded-md border border-stone-200 bg-white hover:bg-stone-100",

                    head_row: "flex w-full border-b border-stone-200 pb-2",
                    head_cell:
                      "w-[46px] text-center text-sm font-medium text-stone-500",

                    row: "flex w-full",
                    cell: "w-[46px] h-[46px]",
                    day: "w-[46px] h-[46px]",
                    day_button:
                      "w-[46px] h-[46px] rounded-full text-stone-900 hover:bg-stone-100 focus:outline-none",

                    // ✅ 선택(시작/끝)은 파란 동그라미 + 흰 글자
                    day_selected:
                      "!rounded-full !bg-blue-600 !text-white hover:!bg-blue-600",
                    day_range_start:
                      "!rounded-full !bg-blue-600 !text-white hover:!bg-blue-600",
                    day_range_end:
                      "!rounded-full !bg-blue-600 !text-white hover:!bg-blue-600",

                    // ✅ 중간 범위는 표시 안 함
                    day_range_middle: "!bg-transparent !text-stone-900",

                    // (버전 차이 대비) v9 키도 같이 처리
                    selected:
                      "!rounded-full !bg-blue-600 !text-white hover:!bg-blue-600",
                    range_start:
                      "!rounded-full !bg-blue-600 !text-white hover:!bg-blue-600",
                    range_end:
                      "!rounded-full !bg-blue-600 !text-white hover:!bg-blue-600",
                    range_middle: "!bg-transparent !text-stone-900",
                  }}
                />
              </div>
            </div>

            {/* ✅ 시간 구간 상자도 넓게(좌우 패딩 줄이고 카드 패딩 늘림) */}
            <div className="px-3 sm:px-6 mt-5">
              <div className="w-full rounded-2xl border border-stone-200 bg-white p-4 sm:p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="rounded-2xl border border-stone-200 p-4 sm:p-5">
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-700">
                      <span className="rounded bg-blue-600 px-2 py-0.5 text-xs text-white">
                        시작
                      </span>
                      대여시간
                    </div>
                    <select
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                    >
                      {timeOptions.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="rounded-2xl border border-stone-200 p-4 sm:p-5">
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-700">
                      <span className="rounded bg-blue-600 px-2 py-0.5 text-xs text-white">
                        끝
                      </span>
                      반납시간
                    </div>
                    <select
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                    >
                      {timeOptions.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="px-4 sm:px-6 mt-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* 하단 버튼 */}
            <div className="px-4 sm:px-6 mt-5 pb-6">
              <button
                type="button"
                onClick={apply}
                disabled={!canApply}
                className={
                  "w-full rounded-2xl py-4 text-white font-semibold transition " +
                  (canApply
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-300 cursor-not-allowed")
                }
              >
                총 {canApply ? durText : "0시간"} 대여하기
              </button>

              <div className="mt-3 flex justify-start">
                <button
                  type="button"
                  className="rounded-md px-3 py-2 text-sm text-stone-600 hover:bg-stone-100"
                  onClick={() => {
                    setRange(undefined);
                    setStartTime("10:00");
                    setEndTime("10:00");
                    setError("");
                  }}
                >
                  초기화
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <h1>홈페이지</h1>
    </div>
  );
}
