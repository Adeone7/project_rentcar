const server = "http://192.168.0.14:8080";

const defaultHeader = {
  "Content-Type": "application/json",
};

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

// 렌탈 오퍼 등록 API 호출 함수 (CarRegistrationPage 컴포넌트에서 사용)
export async function registerRentalOffer(token, rentalOfferData, images) {
  try {
    const formData = new FormData();

    formData.append("carIdx", String(rentalOfferData.carIdx));
    formData.append("rentalPrice", String(rentalOfferData.rentalPrice));
    formData.append("description", rentalOfferData.description ?? ""); // Nullish Coalescing

    if (images && images.length > 0) {
      images.forEach((file) => {
        formData.append("img", file); // 백엔드 DTO의 'img' 필드와 일치
      });
    }

    console.log(
      ">>> [API Service] registerRentalOffer (매물 등록): Sending FormData Content <<<"
    );
    for (let pair of formData.entries()) {
      if (pair[0] === "img") {
        console.log(`${pair[0]}:`, pair[1].name);
      } else {
        console.log(`${pair[0]}:`, pair[1]);
      }
    }
    console.log("----------------------------------------------------------");

    const response = await fetch(`${server}/rental-offer`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // 토큰 헤더!
      },
      body: formData,
    });

    if (!response.ok) {
      let errorResponse;
      try {
        errorResponse = await response.json();
      } catch (jsonError) {
        errorResponse = { message: `서버 오류 (HTTP ${response.status})` };
      }
      throw new Error(
        errorResponse.message ||
          "알 수 없는 이유로 렌탈 매물 등록에 실패했습니다."
      );
    }

    const data = await response.json();
    return { success: true, data: data }; // 오타 없이 success!
  } catch (error) {
    console.error("[API Service] 렌탈 매물 등록 중 오류 발생:", error);
    return { success: false, message: error.message || "알 수 없는 오류 발생" };
  }
}

// -----------------------------------------------------------------------------
// 🚨🚨🚨 2. 차량 검색 API 함수 (GET 방식) 🚨🚨🚨
// 이 함수가 검색창 드롭다운을 위한 함수! FormData와는 상관없음!
// -----------------------------------------------------------------------------
export async function carsByQuery(token, query) {
  if (!query) {
    return { success: true, carList: [] };
  }

  try {
    const response = await fetch(
      `${server}/car?query=${encodeURIComponent(query)}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 검색도 인증이 필요한 경우 토큰 사용!
        },
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `서버 에러 발생`,
      }));
      throw new Error(
        errorData.message || `HTTp error! status: ${response.status}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("자동차 검색 API 호출 중 오류 발생: ", error);
    return {
      success: false,
      message: error.message || "알 수 없는 오류 발생",
      carList: [],
    };
  }
}

export { getRentalOffers, bookRentalOffer };
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
