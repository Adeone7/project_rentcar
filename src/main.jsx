import "./index.css";

import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import HomePage from "./pages/HomePage";
import Login from "./modal/Login";
import SignUp from "./modal/SignUp";
import OfferList from "./pages/OfferList";
import OfferBook from "./pages/OfferBook";
import OfferRegistration from "./pages/OfferRegistration";
import OfferChart from "./pages/OfferChart";
import MyBookState from "./pages/MyBookState";

const router = createBrowserRouter([
  {
    path: "/home",
    element: <HomePage />, //메인 홈페이지
  },
  {
    path: "/home/login",
    element: <Login />, //로그인 페이지
  },
  {
    path: "/home/signup",
    element: <SignUp />, //회원가입 페이지
  },

  {
    path: "/home/offer",
    element: <OfferList />, //렌트카 리스트
  },
  {
    path: "/home/offer/:offerId/book",
    element: <OfferBook />, // 렌트카 예약
  },
  {
    path: "/home/offer/registration",
    element: <OfferRegistration />, // 렌트카 등록
  },
  {
    path: "/home/offer/chart",
    element: <OfferChart />, //렌트카 이용 차트
  },
  {
    path: "/home/my/bookstate",
    element: <MyBookState />, //나의 예약 현황
  },
]);
createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
