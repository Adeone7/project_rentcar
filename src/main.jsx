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
import DefaultLayout from "./layout/DefaultLayout";
import SearchRegistration from "./pages/SearchRegistration";
import DefaultLayout2 from "./layout/DefaultLayout2";

const router = createBrowserRouter([
  {
    element: <DefaultLayout />,
    children: [
      {
        path: "/home",
        element: <HomePage />, //메인 홈페이지
      },
      {
        path: "/home/offer/search",
        element: <SearchRegistration />, //예약 검색
      },
      {
        path: "/home/offer/registration",
        element: <OfferRegistration />, // 렌트카 등록
      },
    ],
  },
  {
    element: <DefaultLayout2 />,
    children: [
      {
        path: "/home/my/bookstate",
        element: <MyBookState />, //나의 예약 현황, 마이페이지
      },
      {
        path: "/home/offer/:offerId/book",
        element: <OfferBook />, // 렌트카 선택 후 예약하는 페이지
      },
    ],
  },

  {
    path: "/home/signup",
    element: <SignUp />, //회원가입 페이지
  },

  {
    path: "/home/offer/results",
    element: <OfferList />, //렌트카 리스트 검색결과
  },

  {
    path: "/home/offer/chart",
    element: <OfferChart />, //렌트카 이용 차트
  },
  {
    path: "/home/my/bookstate",
    element: <MyBookState />, //나의 예약 현황, 마이페이지
  },
]);
createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
