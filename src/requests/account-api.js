const server = "http://192.168.0.14:8080";

const defaultHeader = {
  "Content-Type": "application/json",
};

// 신규 계정 만들기
function createAccount(nickname, id, pw) {
  return fetch(server + "/signup", {
    method: "POST",
    headers: defaultHeader,
    body: JSON.stringify({ nickname, id, pw }),
  }).then((response) => {
    if (!response.ok) throw new Error("회원가입 실패");
    return response.json();
  });
}

//email 검증
function availableCheck(id) {
  return fetch(server + "/verify-email" + email, {
    method: "get",
  }).then((response) => {
    response.json();
  });
}

// 인증 코드 검증
function verifyEmailCode(accountId, code) {
  return fetch(server + "/verify-email", {
    method: "POST",
    headers: defaultHeader,
    body: JSON.stringify({ accountId, code }),
  }).then((response) => {
    if (!response.ok) throw new Error("이메일 인증 실패");
    return response.json();
  });
}

// 로그인
function loginAccount(id, pw) {
  return fetch(server + "/login", {
    method: "POST",
    headers: defaultHeader,
    body: JSON.stringify({ id, pw }),
  }).then((response) => {
    if (!response.ok) throw new Error("로그인 실패");
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

export { createAccount, verifyEmailCode, loginAccount, availableCheck };
