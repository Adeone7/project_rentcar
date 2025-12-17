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

export { createCar, createRentalOffer, getRentalOffers, bookRentalOffer };
