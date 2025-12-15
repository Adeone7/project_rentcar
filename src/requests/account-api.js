const server = "http://192.168.0.92:8080";

const defaultHeader = {
  "Content-Type": "application/json",
};

// 신규 계정 만들기
function createAccount(nickname, email, password) {
  return fetch(server + "/signup", {
    method: "POST",
    headers: defaultHeader,
    body: JSON.stringify({ nickname, email, password }),
  }).then((res) => {
    if (!res.ok) throw new Error("회원가입 실패");
    return res.json();
  });
}

// 인증 코드 검증
function verifyEmailCode(code) {
  return fetch(server + "/verify-email", {
    method: "POST",
    headers: defaultHeader,
    body: JSON.stringify({ code }),
  }).then((res) => {
    if (!res.ok) throw new Error("이메일 인증 실패");
    return res.json();
  });
}

// 로그인
function loginAccount(email, password) {
  return fetch(server + "/login", {
    method: "POST",
    headers: defaultHeader,
    body: JSON.stringify({ email, password }),
  }).then((res) => {
    if (!res.ok) throw new Error("로그인 실패");
    return res.json();
  });
}

export { createAccount, verifyEmailCode, loginAccount };
