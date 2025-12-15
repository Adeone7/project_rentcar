import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { loginAccount } from "../requests/account-api";
import { createAccount, verifyEmailCode } from "../requests/account-api";
import logo from "../assets/TOCAR.png";
import LoginModal from "../modal/Login";
import SignUpModal from "../modal/SignUp";

export default function HomePage() {
  const navigate = useNavigate();
  const [modal, setModal] = useState("");
  const [active, setActive] = useState("전체");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  return (
    <div>
      <div className="h-screen bg-stone-50 flex flex-col relative overflow-x-hidden">
        {/* 상단고정 부분 */}
        <div className="sticky top-0 w-full z-10 bg-white border-b border-stone-200">
          <div className="absolute left-1/2 transform -translate-x-1/2 top-16 w-[1560px] h-[300px] bg-cyan-600 -z-10" />
          <div className="w-full max-w-[1000px] mx-auto flex justify-between items-center p-2">
            <img
              src={logo}
              className="w-40 h-auto cursor-pointer"
              onClick={() => navigate("/home")}
            />
            <div className="flex gap-3">
              <button
                className="bg-cyan-500 text-white text-[14px] font-semibold px-3 py-1 rounded-md hover:bg-cyan-600"
                onClick={() => {
                  setModal("SignUp");
                }}
              >
                회원가입
              </button>
              <button
                className="bg-stone-200 text-black text-[14px] font-semibold px-3 py-1 rounded-md hover:bg-stone-300"
                onClick={() => {
                  setModal("Login");
                }}
              >
                로그인
              </button>
            </div>
          </div>
        </div>

        {/* 가운데 흰색 상자 */}
        <div className="w-full max-w-[1032px] h-full mt-[200px] mx-auto bg-white rounded-lg shadow-sm p-6 relative z-20">
          {/* 상단 탭 헤더 */}
          <div className="mb-4">
            <nav className="flex items-center justify-start gap-9 border-b border-stone-200 pb-3">
              {/* 탭 버튼 */}
              {["전체", "예약하기", "차량등록"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActive(tab)}
                  className={
                    "text-sm font-medium pb-1 transition-colors " +
                    (active === tab
                      ? "text-cyan-600 text-[15px] border-b-2 border-cyan-600"
                      : "text-stone-600 text-[15px] hover:text-stone-800")
                  }
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* 날짜 검색 기능 바 */}
          <div className="flex justify-center">
            <form className="flex items-center gap-1.5 rounded-md bg-stone-100 px-3 py-1.5 text-sm">
              <button
                type="button"
                className="h-8 rounded-md px-2 text-stone-600 hover:bg-stone-200"
              ></button>

              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setLatest(false);
                }}
                className="h-8 rounded-md border border-stone-300 bg-white px-2 text-stone-700 focus:outline-none focus:ring-1 focus:ring-stone-400"
              />

              <span className="px-1 text-stone-500">▶</span>

              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setLatest(false);
                }}
                className="h-8 rounded-md border border-stone-300 bg-white px-2 text-stone-700 focus:outline-none focus:ring-1 focus:ring-stone-400"
              />

              <button
                type="button"
                className="h-8 rounded-md px-2 text-stone-600 hover:bg-stone-200"
              ></button>

              <button
                type="button"
                onClick={() => setLatest(false)}
                className="ml-1 h-8 rounded-md bg-stone-700 px-3 text-white hover:bg-stone-800"
              >
                검색
              </button>
            </form>
          </div>

          {/* 탭 콘텐츠 영역 */}
          <div>
            {active === "전체" && (
              <p className="text-sm text-stone-600">전체 내용</p>
            )}
            {active === "예약하기" && (
              <p className="text-sm text-stone-600">예약하기 폼 또는 설명</p>
            )}
            {active === "차량등록" && (
              <p className="text-sm text-stone-600">차량등록 폼</p>
            )}
          </div>
        </div>
      </div>
      {/* Modal 영역 */}
      {modal && (
        <div
          className="z-20 fixed inset-0 bg-stone-900/20  flex items-center justify-center"
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
