const server = "http://192.168.0.92:8080";

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
  return fetch(server + "", {
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

/* 렌트 매물 등록(간단한 정보) */
function createRentalOffer({
  car_idx,
  rental_price,
  description,
  images = [],
}) {
  const formData = new FormData();

  formData.append("car_idx", String(car_idx));
  formData.append("rental_price", String(rental_price));
  formData.append("description", description ?? "");

  images.forEach((file) => {
    formData.append("img", file);
  });

  return fetch(server + "", {
    method: "POST",
    body: formData,
  }).then(async (response) => {
    if (!response.ok) throw new Error("렌트 매물 등록 실패");

    const text = await response.text().catch(() => "");
    return text ? JSON.parse(text) : null;
  });
}

/* 매물 리스트 */
function getRentalOffers() {
  return fetch(server + "/rental_offer", {
    method: "GET",
  }).then((response) => {
    if (!response.ok) throw new Error("매물 조회 실패");
    return response.json();
  });
}

export { createCar, createRentalOffer, getRentalOffers };
