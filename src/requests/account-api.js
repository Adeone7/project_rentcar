const server = "http://192.168.0.92:8080";

const defaultheader = { "Content-type": "application.json" };

//신규 계정 만들기 (api호출)
function createAccount(email, password, nickname) {
  const data = { email, password, nickname };

  return fetch(server + "/signup", {
    method: "post",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  }).then((response) => response.json());
}

//이메일 검증 api
function availableCheck(email) {
  return fetch(server + "/verify-email" + email, {
    method: "get",
  }).then((response) => response.json());
}

// 이메일 api 요청
export function verifyEmailCode(code) {
  return fetch("/api/verify-email-code", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  }).then((response) => response.json());
}

// 로그인 인증 api
function loginAccount(email, password) {
  const data = { email, password };

  return fetch(server + "/login", {
    method: "post",
    body: JSON.stringify(data),
    headers: {
      ...defaultHeader,
    },
  }).then((response) => response.json());
}

export { createAccount, availableCheck, loginAccount };
