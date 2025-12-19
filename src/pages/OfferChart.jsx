import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { getRentalOfferChart, loginAccount } from "../requests/account-api";

export default function OfferChart() {
  const [offerChart, setOfferChart] = useState([]);
  const [total, setTotal] = useState(0);
  const [showLoading, setShowLoading] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA336A"];

  useEffect(() => {
    setShowLoading(true);

    getRentalOfferChart().then((json) => {
      console.log(json);
      setTotal(json.total ?? 0);
      setOfferChart(json.carChartResponseList ?? []);
    });

    const t = setTimeout(() => {
      setShowLoading(false);
    }, 1000);

    return () => clearTimeout(t);
  }, []);

  return <div className="w-200 h-200"></div>;
}
