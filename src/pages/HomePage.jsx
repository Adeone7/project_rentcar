import { useState, useEffect, use } from "react";
import { useNavigate } from "react-router";
import { useAccount, useToken } from "../stores/account-store";

import logo from "../assets/TOCAR.png";
import LoginModal from "../modal/Login";
import SignUpModal from "../modal/SignUp";

export default function HomePage() {
  const navigate = useNavigate();

  const [modal, setModal] = useState("");
  const [active, setActive] = useState("전체");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  /* 로그인/로그인유지 */
  const { account, setAccount } = useAccount();
  const { clearAccount, setClearAccount } = useAccount();
  const { token, setToken } = useToken();

  const isLogin = !!token;

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

  return (
    <div>
      <div className="h-screen bg-stone-50 flex flex-col relative overflow-x-hidden">
        {/* ================= 상단바 ================= */}
        <div className="sticky top-0 w-full z-10 bg-white border-b border-stone-200">
          <div className="absolute left-1/2 -translate-x-1/2 top-16 w-[1560px] h-[300px] bg-cyan-600 -z-10" />

          <div className="w-full max-w-[1000px] mx-auto flex justify-between items-center p-2">
            <img
              src={logo}
              className="w-40 cursor-pointer"
              onClick={() => navigate("/home")}
            />

            <div className="flex items-center gap-3">
              {/* 닉네임 표시 */}
              {isLogin && (
                <span className="text-sm text-stone-700 font-medium">
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

        {/* ================= 메인 박스 ================= */}
        <div className="w-full max-w-[1032px] mt-[200px] mx-auto bg-white rounded-lg shadow-sm p-6 z-20">
          {/* 탭 */}
          <nav className="flex gap-9 border-b border-stone-200 pb-3 mb-6">
            {["전체", "예약하기", "차량등록"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActive(tab)}
                className={
                  "text-sm font-medium pb-1 transition " +
                  (active === tab
                    ? "text-cyan-600 border-b-2 border-cyan-600"
                    : "text-stone-600 hover:text-stone-800")
                }
              >
                {tab}
              </button>
            ))}
          </nav>

          {/* 날짜 검색 */}
          <div className="flex justify-center mb-6">
            <form className="flex items-center gap-1.5 rounded-md bg-stone-100 px-3 py-1.5 text-sm">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-8 rounded-md border border-stone-300 bg-white px-2
                           text-stone-700 focus:outline-none focus:ring-1 focus:ring-stone-400"
              />

              <span className="px-1 text-stone-500">▶</span>

              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-8 rounded-md border border-stone-300 bg-white px-2
                           text-stone-700 focus:outline-none focus:ring-1 focus:ring-stone-400"
              />

              <button
                type="button"
                className="ml-2 h-8 rounded-md bg-stone-700 px-3 text-white hover:bg-stone-800"
                onClick={() => {
                  console.log("검색:", startDate, endDate);
                }}
              >
                검색
              </button>
            </form>
          </div>

          {/* 콘텐츠 */}
          {active === "전체" && (
            <p className="text-sm text-stone-600">전체 내용</p>
          )}
          {active === "예약하기" && (
            <p className="text-sm text-stone-600">
              예약하기 (로그인 여부와 무관)
            </p>
          )}
          {active === "차량등록" && (
            <p className="text-sm text-stone-600">차량등록 폼</p>
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
