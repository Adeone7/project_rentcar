import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAccount, useToken } from "../stores/account-store";

export default function SearchRegistration() {
  const navigate = useNavigate();

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
      <h1>홈페이지</h1>
    </div>
  );
}
