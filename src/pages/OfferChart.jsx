import { useEffect, useRef, useState } from "react";
import {
  getRentalOfferChart,
  getRentalOfferMonthChart,
  loginAccount,
} from "../requests/account-api";
import { useLocation } from "react-router-dom";
import { Pie, PieChart } from "recharts";
import {
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Bar,
  Legend,
} from "recharts";
import { useAccount, useToken } from "../stores/account-store";
import { useNavigate } from "react-router";

import logo from "../assets/TOCAR.png";
import LoginModal from "../modal/Login";
import SignUpModal from "../modal/SignUp";

export default function OfferChart() {
  const navigate = useNavigate();
  /* 로그인/로그인유지 */
  const { account, clearAccount } = useAccount();
  const { token, clearToken } = useToken();
  const isLogin = !!token;
  // 차 조회
  const [modal, setModal] = useState("");
  const [active, setActive] = useState("전체");
  const [showLoading, setShowLoading] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  // 차트
  const [offerChart, setOfferChart] = useState([]);
  const [total, setTotal] = useState(0);
  const [chartType, setChartType] = useState("Bar");
  // 월선택버튼
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");

  const path = useLocation().pathname;
  useEffect(() => {
    if (token) {
      setModal("");
    }
  }, [token]);

  /*  로그아웃  */
  function handleLogout() {
    clearAccount();
    clearToken();
    setActive("전체");
  }

  // 차트
  const carsWithColors = {
    "현대 / 캐스퍼": "#FF0000",
    "현대 / 아반떼": "#FF7F00",
    "현대 / 쏘나타": "#FFFF00",
    "현대 / 그랜저": "#7FFF00",
    "현대 / 코나": "#00FF00",
    "현대 / 투싼": "#00FF7F",
    "현대 / 펠리세이드": "#00FFFF",
    "현대 / 스타렉스": "#007FFF",
    "현대 / 아이오닉": "#0000FF",
    "기아 / 모닝": "#7F00FF",
    "기아 / 레이": "#FF00FF",
    "기아 / 쏘울": "#FF007F",
    "기아 / 스포티지": "#BF0000",
    "기아 / 모하비": "#BF7F00",
    "기아 / 카니발": "#BFBF00",
    "기아 / 니로": "#7FBF00",
    "쉐보레 / 스파크": "#00BF00",
    "쉐보레 / 말리부": "#00BF7F",
    "쉐보레 / 트랙스": "#00BFBF",
    "쉐보레 / 콜로라도": "#007FBF",
    "르노삼성 / sm3": "#0000BF",
    "르노삼성 / sm5": "#7F00BF",
    "르노삼성 / qm3": "#BF00BF",
    "르노삼성 / qm5": "#BF007F",
    "kg모빌리티 / 티볼리": "#800000",
    "kg모빌리티 / 코란도": "#804000",
    "kg모빌리티 / 렉스턴": "#808000",
  };
  // 차트 전체 조회
  useEffect(() => {
    setShowLoading(true);
    getRentalOfferChart().then((json) => {
      console.log(json);
      setTotal(json.total);
      setOfferChart(json.carChartResponseList ?? []);
    });

    const t = setTimeout(() => {
      setShowLoading(false);
    }, 1000);

    return () => clearTimeout(t);
  }, []);

  // 차트 월별 조회
  useEffect(() => {
    if (!selectedMonth) return;
    setShowLoading(true);
    getRentalOfferMonthChart(selectedMonth)
      .then((json) => {
        setOfferChart(json.carChartResponseList ?? []);
      })
      .finally(() => setShowLoading(false));
  }, [selectedMonth]);

  // 월 선택 버튼
  const months = [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ];

  const toggleList = () => setIsOpen(!isOpen);
  const selectMonth = (month) => {
    setSelectedMonth(month);
    setIsOpen(false); // 선택 후 리스트 닫기
  };

  const filteredData = offerChart.map((one) => ({
    ...one,
    name: `${one.corporation} / ${one.modelName}`,
    fill: carsWithColors[`${one.corporation} / ${one.modelName}`],
  }));

  return (
    <div className="h-100% w-100%">
      {/* 상단 영역 */}
      <div className="sticky top-0 w-full z-10 bg-white border-b border-stone-200">
        <div className="w-full max-w-[1000px] mx-auto flex justify-between items-center p-2">
          <img
            src={logo}
            className="w-40 cursor-pointer"
            onClick={() => navigate("/home")}
          />

          <div className="flex items-center gap-3">
            {/* 닉네임 표시 */}
            {isLogin && (
              <span
                className="text-sm text-stone-700 font-medium hover:underline cursor-pointer"
                onClick={() => navigate("/home/my/bookstate")}
              >
                {account?.nickname}
              </span>
            )}

            {!isLogin ? (
              <>
                <button
                  className="bg-cyan-500 text-white text-sm font-semibold px-3 py-1 rounded-md hover:bg-cyan-600"
                  onClick={() => setModal("SignUp")}
                >
                  회원가입
                </button>
                <button
                  className="bg-stone-200 text-black text-sm font-semibold px-3 py-1 rounded-md hover:bg-stone-300"
                  onClick={() => setModal("Login")}
                >
                  로그인
                </button>
              </>
            ) : (
              <button
                className="bg-stone-200 text-black text-sm font-semibold px-3 py-1 rounded-md hover:bg-stone-300"
                onClick={handleLogout}
              >
                로그아웃
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="h-100% w-100%">
        {/* 메인 영역*/}
        <div className="flex justify-center pt-10">
          <p className="text-2xl sm:text-3xl md:text-2xl font-semibold text-gray-800 text-center border-b-2 border-blue-500 pb-3 max-w-3xl">
            ⭐월별 차량 예약률을 한눈에 확인할 수 있는 자료입니다.
          </p>
        </div>
        {/* 월 선택 */}
        <div className=" h-10 flex justify-end items-center px-10">
          <select
            className="focus:outline-none appearance-none"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="" disabled>
              전체
            </option>
            {months.map((month, index) => (
              <option
                key={month}
                value={index + 1}
                style={{ padding: "8px", cursor: "pointer" }}
              >
                {month}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* 차트 버튼 */}
      <div className="flex items-center px-10">
        <div className="w-23 bg-gray-100 p-1 rounded-xl shadow-sm mt-3 flex-col space-y-2">
          <button
            className={`px-4 py-2 rounded-lg transition font-medium
      ${
        chartType === "Bar"
          ? "bg-blue-500 text-white"
          : "text-gray-600 hover:text-black"
      }`}
            onClick={() => setChartType("Bar")}
          >
            막대형
          </button>
          <button
            className={`px-4 py-2 rounded-lg transition font-medium
      ${
        chartType === "pie"
          ? "bg-blue-500 text-white"
          : "text-gray-600 hover:text-black"
      }`}
            onClick={() => setChartType("pie")}
          >
            파이형
          </button>
        </div>

        {/* 차트 영역 */}
        <div className="flex justify-end w-full">
          {chartType === "Bar" && (
            <BarChart
              className="py-10 h-180 select-none aspectRatio: 1 w-full"
              responsive
              data={filteredData}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis width="auto" />
              <Tooltip />
              <Bar
                dataKey="count"
                fill={({ payload }) => payload.fill}
                barSize={90}
                isAnimationActive={true}
              />
            </BarChart>
          )}

          {chartType === "pie" && (
            <PieChart
              className=" py-10  h-180 select-none aspectRatio: 1 w-full"
              responsive
            >
              <Pie
                data={filteredData}
                dataKey="count"
                innerRadius="80%"
                outerRadius="100%"
                // Corner radius is the rounded edge of each pie slice
                cornerRadius="50%"
                fill="#8884d8"
                // padding angle is the gap between each pie slice
                paddingAngle={5}
                isAnimationActive={true}
              />
              <Tooltip />
              <Legend />
            </PieChart>
          )}
        </div>
      </div>
      {/* ================= 모달 ================= */}
      {modal && (
        <div
          className="fixed inset-0 z-20 bg-stone-900/20 flex items-center justify-center"
          onClick={() => setModal("")}
        >
          <div onClick={(e) => e.stopPropagation()}>
            {modal === "Login" && <LoginModal setModal={setModal} />}
            {modal === "SignUp" && <SignUpModal setModal={setModal} />}
          </div>
        </div>
      )}
    </div>
  );
}
