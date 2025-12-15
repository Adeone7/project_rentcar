const server = "http://192.168.0.92:8080";

const defaultHeader = {
  "Content-Type": "application/json",
};

/*자동차 정보 등록*/
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

function createRentalOffer({
  car_idx,
  rental_price,
  description,
  images = [],
}) {
  const formData = new FormData();

  formData.append("car_idx", car_idx);

  formData.append("rental_price", String(rental_price));
  formData.append("description", description ?? "");

  // 이미지 여러 장
  images.forEach((file) => {
    formData.append("img", file);
  });

  return fetch(server + "", {
    method: "POST",
    body: formData, // FormData는 headers 지정하면 안 됨!
  }).then((response) => {
    if (!response.ok) throw new Error("렌트 매물 등록 실패");
    // 백엔드가 응답 바디 없으면 return null 처리
    return response
      .text()
      .then((t) => (t ? JSON.parse(t) : null))
      .catch(() => null);
  });
}

/*매물 리스트*/
function getRentalOffers() {
  return fetch(server + "/rental-offer", {
    method: "GET",
  }).then((response) => {
    if (!response.ok) throw new Error("매물 조회 실패");
    return response.json();
  });
}

export { createCar, createRentalOffer, getRentalOffers };
