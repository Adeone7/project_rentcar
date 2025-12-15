const server = "http://192.168.0.92:8080";

const defaultHeader = { "Content-Type": "application/json" };

// 신규 계정 만들기
function createAccount(nickname, email, password) {
  const data = { nickname, email, password };

  return fetch(server + "/signup", {
    method: "POST",
    headers: defaultHeader,
    body: JSON.stringify(data),
  }).then((res) => res.json());
}

// 인증 코드 검증
export function verifyEmailCode(code) {
  return fetch(server + "/verify-email/check", {
    method: "POST",
    headers: defaultHeader,
    body: JSON.stringify({ code }),
  });
}

// 로그인
function loginAccount(email, password) {
  const data = { email, password };

  return fetch(server + "/login", {
    method: "POST",
    headers: defaultHeader,
    body: JSON.stringify(data),
  }).then((res) => res.json());
}

export { createAccount, loginAccount };
