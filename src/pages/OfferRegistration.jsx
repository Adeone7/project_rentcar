import { useState } from "react";
import { useNavigate } from "react-router";
import { loginAccount, createAccount } from "../requests/account-api";
import logo from "../assets/TOCAR.png";
import LoginModal from "../modal/Login";
import SignUpModal from "../modal/SignUp";

export default function OfferRegistration() {
  const navigate = useNavigate();
  const [modal, setModal] = useState("");

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

        <div className="w-full max-w-[1032px] h-full mt-[200px] mx-auto bg-white rounded-lg shadow-sm p-6 relative z-20"></div>
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
