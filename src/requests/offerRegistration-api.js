const server = "http://192.168.0.14:8080";

const defaultHeader = {
  "Content-Type": "application/json",
};

/* 자동차 정보 등록 */
function createCar({
  corporation,
  car_type,
  model_name,
  model_year,
  few_seats,
  gear_type,
}) {
  return fetch(server + "/car", {
    method: "POST",
    headers: defaultHeader,
    body: JSON.stringify({
      corporation,
      car_type,
      model_name,
      model_year,
      few_seats,
      gear_type,
    }),
  }).then((response) => {
    if (!response.ok) throw new Error("자동차 등록 실패");
    return response.json();
  });
}

function createRentalOffer({
  carIdx,
  rentalPrice,
  description,
  accountId,
  images = [],
}) {
  const formData = new FormData();

  formData.append("carIdx", String(carIdx));
  formData.append("rentalPrice", String(rentalPrice));
  formData.append("description", description ?? "");
  formData.append("accountId", String(accountId));

  images.forEach((file) => {
    formData.append("img", file);
  });

  return fetch(server + "/rental-offer", {
    method: "POST",
    body: formData,
  }).then((response) => {
    if (!response.ok) throw new Error("렌트 매물 등록 실패");
    return response.json();
  });
}

function getRentalOffers() {
  return fetch(server + "/rental-offer", {
    method: "GET",
  }).then((res) => {
    if (!res.ok) throw new Error("매물 조회 실패");
    return res.json();
  });
}

function getRentalOfferByOfferId(token, offerId) {
  return fetch(server + "/rental-offer/" + offerId, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => {
      if (!res.ok) throw new Error("매물 조회 실패");
      return res.json();
    })
    .catch((error) => {
      console.error("Error fetching rental offer by offerId:", error);
      throw error;
    });
}

/* 자동차 예약하기  */
function bookRentalOffer(token, payload) {
  return fetch(server + "/reservation", {
    method: "POST",
    headers: {
      ...defaultHeader,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  }).then((response) => {
    if (!response.ok) throw new Error("예약 정보를 불러오는데 실패했습니다.");
    return response.json();
  });
}

/* 차량 통계 */
function getOfferSummary(corporation, modelName) {
  return fetch(
    `${server}/rental-offer/stats?corporation=${corporation}&modelName=${modelName}`,
    {
      method: "GET",
      headers: defaultHeader,
    }
  ).then((response) => {
    if (!response.ok)
      throw new Error("차량 통계 정보를 불러오는데 실패했습니다.");
    return response.json();
  });
}

/* 매물 검색 조회 */
function searchRentalOffersByKeyword(keyword) {
  const word = new URLSearchParams({ keyword: String(keyword ?? "") });
  return fetch(`${server}/rental_offer?${word.toString()}`, {
    method: "GET",
    headers: defaultHeader,
  }).then((res) => {
    if (!res.ok) throw new Error("매물 검색 조회 실패");
    return res.json();
  });
}

/* 예약 기록 */
function getReservations(token) {
  return fetch(server + "/reservation", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  }).then((res) => {
    if (!res.ok) throw new Error("예약 기록 조회 실패");
    return res.json();
  });
}

/* 예약 취소 */
function cancelReservation({ reservationIdx, token }) {
  return fetch(`${server}/reservation/${reservationIdx}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  }).then((res) => {
    if (!res.ok) throw new Error("예약 취소 실패");
    return res.json();
  });
}

/* 리뷰 작성 */
function createReservationReview({ rental_offer_idx, content, star_rating }) {
  return fetch(`${server}/reservation?${rental_offer_idx}/review`, {
    method: "POST",
    headers: defaultHeader,
    body: JSON.stringify({
      rental_offer_idx,
      content,
      star_rating,
    }),
  }).then((res) => {
    if (!res.ok) throw new Error("리뷰 작성 실패");
    return res.json();
  });
}

/* 리뷰 조회 */
function getReviewByReservationIdx(rental_offer_idx) {
  return fetch(`${server}/review/${rental_offer_idx}`, {
    method: "GET",
    headers: defaultHeader,
  }).then((res) => {
    if (!res.ok) throw new Error("리뷰 조회 실패");
    return res.json();
  });
}

export {
  createCar,
  createRentalOffer,
  getRentalOffers,
  getRentalOfferByOfferId,
  bookRentalOffer,
  getOfferSummary,
  searchRentalOffersByKeyword,
  getReservations,
  cancelReservation,
  createReservationReview,
  getReviewByReservationIdx,
};
