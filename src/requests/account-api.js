const server = "http://192.168.0.92:8080";

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

export { createAccount, verifyEmailCode, loginAccount, availableCheck };
