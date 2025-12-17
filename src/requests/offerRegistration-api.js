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
      model_year: Number(model_year),
      few_seats: Number(few_seats),
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

/* 자동차 예약하기  */
function bookRentalOffer({ idx, accountId, startDate, endDate }) {
  return fetch(`${server}/home/offer/${idx}/book`, {
    method: "POST",
    headers: defaultHeader,
    body: JSON.stringify({
      accountId,
      startDate,
      endDate,
    }),
  }).then((response) => {
    if (!response.ok) throw new Error("예약 정보를 불러오는데 실패했습니다.");
    return response.json();
  });
}

// 1. 자동차 검색 API 호출 함수 (CarSelector 컴포넌트에서 사용)
export async function carsByQuery(query) {
  if (!query) {
    return { success: true, carList: [] }
  }

  try {
    const response = await fetch(`${server}/car?query=${endodeURIComponent(query)}`)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `서버 에러 발생`
      }))
      throw new Error(errorData.message || `HTTp error! status: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error("자동차 검색 API 호출 중 오류 발생: ", error)
    return { success: false, message: error.message || "알 수 없는 오류 발생", carList: []}
  }
}

// 2. 렌탈 오퍼 등록 API 호출 함수 (CarRegistrationPage 컴포넌트에서 사용)
export async function registerRentalOffer(rentalOfferData) {
  try {
    const response = await fetch(`${server}/rental-offer`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Token": token,
      },
      body: JSON.stringify(rentalOfferData)
    })
    if (!response.ok) {
      throw new Error("자동차 등록에 실패했습니다.")
    }
    const data = await response.json()
      return data
  } catch (error) {
    console.error("자동차 등록중 오류 발생: ", error)
  }
}

export { createCar, createRentalOffer, getRentalOffers, bookRentalOffer };
