import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useToken } from "../stores/account-store";
import LoginModal from "../modal/Login";
import {
  getReservations,
  cancelReservation,
} from "../requests/offerRegistration-api";

function StatusPill({ label }) {
  const tone =
    label === "취소됨" ? "rose" : label === "이용완료" ? "stone" : "cyan";

  const map = {
    cyan: "bg-cyan-50 text-cyan-700 ring-cyan-200",
    rose: "bg-rose-50 text-rose-700 ring-rose-200",
    stone: "bg-stone-100 text-stone-700 ring-stone-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${map[tone]}`}
    >
      {label}
    </span>
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

const ymd = (s) => (s ? s.replaceAll("-", ".") : "—");
const won = (n) => (typeof n === "number" ? `${n.toLocaleString()}원` : "—");

const toLabel = (s) => {
  const t = String(s || "");
  if (t.includes("취소")) return "취소됨";
  if (t.includes("완료")) return "이용완료";
  return "예약중";
};

const pad2 = (n) => String(n).padStart(2, "0");
const todayYMD = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
};
const ymd10 = (s) => String(s || "").slice(0, 10);

export default function MyBookState() {
  const navigate = useNavigate();
  const { token } = useToken();

  const [modal, setModal] = useState("");
  const [tab, setTab] = useState("전체");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [rows, setRows] = useState([]);

  const [cancelingId, setCancelingId] = useState(null);

  const [returningId, setReturningId] = useState(null);
  const [returnedIds, setReturnedIds] = useState([]);

  const historyRef = useRef(null);

  const modalUI = modal && (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-stone-900/30 px-4"
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

  const load = async () => {
    if (!token) return;
    setLoading(true);
    setErr("");
    try {
      const json = await getReservations(token);
      setRows(json?.reservations ?? []);
    } catch (e) {
      setRows([]);
      setErr(e?.message || "예약 기록 조회 실패");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [token]);

  const items = rows.map((r) => {
    const car = r.rentalOffer?.car;
    const carName = `${car?.corporation ?? ""} ${car?.modelName ?? ""}${
      car?.modelYear ? ` (${car.modelYear})` : ""
    }`.trim();

    const baseLabel = toLabel(r.reservationStatus);

    const tdy = todayYMD();
    const startYmd = ymd10(r.startDate);
    const endYmd = ymd10(r.endDate);

    const isUsing =
      baseLabel === "예약중" &&
      startYmd &&
      endYmd &&
      startYmd <= tdy &&
      tdy <= endYmd;

    const isReturned = returnedIds.includes(r.idx);

    const label = isReturned ? "이용완료" : isUsing ? "이용중" : baseLabel;

    return {
      reservationIdx: r.idx,
      rentalOfferIdx: r.rentalOfferIdx,
      carName: carName || "차량",
      period: `${ymd(r.startDate)} ~ ${ymd(r.endDate)}`,
      img: r.rentalOffer?.img || "",
      label,
      price: won(r.paymentAmount),
    };
  });

  const stats = {
    total: items.length,
    reserved: items.filter((x) => x.label === "예약중").length,
    using: items.filter((x) => x.label === "이용중").length,
    canceled: items.filter((x) => x.label === "취소됨").length,
    completed: items.filter((x) => x.label === "이용완료").length,
  };

  const currentReservations = items.filter((x) => x.label === "예약중");
  const historyBase = items.filter((x) => x.label !== "예약중");

  const history =
    tab === "전체" ? historyBase : historyBase.filter((x) => x.label === tab);

  const onCancel = async (row) => {
    const id = row?.reservationIdx;
    if (!id) return;

    if (!window.confirm("예약을 취소할까요?")) return;

    try {
      setCancelingId(id);
      await cancelReservation({ reservationIdx: id, token });
      await load();
    } catch (e) {
      alert(e?.message || "예약 취소 실패");
    } finally {
      setCancelingId(null);
    }
  };

  const onReturn = async (row) => {
    const id = row?.reservationIdx;
    if (!id) return;

    if (!window.confirm("대여를 반납 처리할까요?")) return;

    try {
      setReturningId(id);
      setReturnedIds((prev) => (prev.includes(id) ? prev : [id, ...prev]));
      await load();
      requestAnimationFrame(() => {
        historyRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    } catch (e) {
      alert(e?.message || "대여반납 실패");
    } finally {
      setReturningId(null);
    }
  };

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
            이미지 · 차량이름 · 대여기간 · 가격
          </div>
        </div>

        <div className="w-full sm:w-[520px]">
          <div className="flex flex-wrap gap-2">
            {["전체", "예약중", "이용중", "취소됨", "이용완료"].map((t) => (
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
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <Stat label="전체" value={stats.total} />
        <Stat label="예약중" value={stats.reserved} />
        <Stat label="이용중" value={stats.using} />
        <Stat label="취소됨" value={stats.canceled} />
        <Stat label="이용완료" value={stats.completed} />
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="text-sm font-bold text-stone-900">현재 예약</div>
            <div className="mt-1 text-xs text-stone-500">
              {loading ? "불러오는 중..." : "진행중인 예약"}
            </div>
          </div>
          <button
            className="rounded-xl bg-cyan-600 px-4 py-2 text-xs font-semibold text-white hover:bg-cyan-700"
            onClick={() => navigate("/home/offer/search")}
          >
            새 예약하기
          </button>
        </div>

        {err && (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700">
            {err}
          </div>
        )}

        {!loading && !err && currentReservations.length === 0 && (
          <div className="mt-4 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-6 text-center">
            <div className="text-sm font-extrabold text-stone-900">
              현재 예약이 없습니다
            </div>
          </div>
        )}

        {currentReservations.length > 0 && (
          <div className="mt-4 space-y-3">
            {currentReservations.map((cur) => (
              <div
                key={cur.reservationIdx}
                className="rounded-2xl border border-cyan-100 bg-cyan-50/40 p-4"
              >
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="sm:w-[280px]">
                    <div className="aspect-16/10 w-full overflow-hidden rounded-2xl bg-stone-100">
                      {cur.img ? (
                        <img
                          src={"http://192.168.0.14:8080" + cur.img}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-linear-to-br from-stone-100 to-stone-200" />
                      )}
                    </div>
                    <div className="mt-2">
                      <StatusPill label={cur.label} />
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-base font-extrabold text-stone-900">
                          {cur.carName}
                        </div>
                        <div className="mt-1 text-sm font-semibold text-stone-600">
                          {cur.period}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-[11px] font-semibold text-stone-500">
                          결제금액
                        </div>
                        <div className="mt-1 text-lg font-extrabold text-stone-900">
                          {cur.price}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                        onClick={() =>
                          navigate(`/home/offer/book/${cur.rentalOfferIdx}`)
                        }
                      >
                        상세보기
                      </button>

                      <button
                        disabled={cancelingId === cur.reservationIdx}
                        className={`rounded-xl px-4 py-2 text-xs font-semibold text-white transition ${
                          cancelingId === cur.reservationIdx
                            ? "cursor-not-allowed bg-rose-200"
                            : "bg-rose-400 hover:bg-rose-500"
                        }`}
                        onClick={() => onCancel(cur)}
                      >
                        {cancelingId === cur.reservationIdx
                          ? "취소중..."
                          : "예약취소"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div
        ref={historyRef}
        className="rounded-2xl border border-stone-200 bg-white p-3 sm:p-4"
      >
        <div className="text-sm font-bold text-stone-900">예약 히스토리</div>

        <div className="mt-3 space-y-1.5">
          {history.map((b) => (
            <div
              key={b.reservationIdx}
              className="rounded-2xl border border-stone-200 bg-white px-3 py-2 transition hover:bg-stone-50/60"
            >
              <div className="flex gap-3">
                <div className="h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                  {b.img ? (
                    <img
                      src={"http://192.168.0.14:8080" + b.img}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-linear-to-br from-stone-100 to-stone-200" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-bold text-stone-900">
                        {b.carName}
                      </div>
                      <div className="mt-1 text-xs font-semibold text-stone-600">
                        {b.period}
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <StatusPill label={b.label} />
                      <div className="mt-1 text-sm font-extrabold text-stone-900">
                        {b.price}
                      </div>
                    </div>
                  </div>

                  {b.label === "이용중" && (
                    <div className="mt-2 flex gap-2">
                      <button
                        className="rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-stone-700 hover:bg-stone-50"
                        onClick={() =>
                          navigate(`/home/offer/book/${b.rentalOfferIdx}`)
                        }
                      >
                        상세
                      </button>
                      <button
                        disabled={returningId === b.reservationIdx}
                        className={`rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-white transition ${
                          returningId === b.reservationIdx
                            ? "cursor-not-allowed bg-stone-200"
                            : "bg-stone-700 hover:bg-stone-800"
                        }`}
                        onClick={() => onReturn(b)}
                      >
                        {returningId === b.reservationIdx
                          ? "처리중..."
                          : "대여반납"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {!loading && !err && history.length === 0 && (
          <div className="mt-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-6 text-center">
            <div className="text-sm font-extrabold text-stone-900">
              표시할 내역이 없습니다
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
