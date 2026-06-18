const authForm = document.querySelector(".form-group");
const emailInput = document.querySelector("#useremail");
const pwInput = document.querySelector("#userpw");

const emailError = document.querySelector(".email-error");
const pwError = document.querySelector(".pw-error");

// 회원가입 전용 요소 (체크박스 및 규칙 리스트)
const agreeAllCheck = document.querySelector("#agree-all");
const subCheckboxes = document.querySelectorAll('.terms-group input[type="checkbox"]');
const requiredCheckboxes = document.querySelectorAll('input[name="terms-required"]');
const ruleItems = document.querySelectorAll(".pw_rule_group ul li");

// 정규식 패턴
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function validateEmail() {
  if (!emailInput || !emailError) return false;
  const emailValue = emailInput.value.trim();

  const errorIcon = `<span class="material-icons-outlined body_cap">error_outline</span>`;

  if (emailValue === "") {
    emailError.innerHTML = `${errorIcon} 이메일 주소를 입력해 주세요.`;
    emailError.classList.add("show");
    return false;
  } else if (!emailPattern.test(emailValue)) {
    emailError.innerHTML = `${errorIcon} 올바른 이메일 형식이 아닙니다. (예: rounz@rounz.com)`;
    emailError.classList.add("show");
    return false;
  } else {
    emailError.innerHTML = "";
    emailError.classList.remove("show");
    return true;
  }
}

function validatePassword() {
  if (!pwInput || !pwError) return false;
  const pwValue = pwInput.value;

  const errorIcon = `<span class="material-icons-outlined body_cap">error_outline</span>`;

  if (pwValue === "") {
    pwError.innerHTML = `${errorIcon} 비밀번호를 입력해 주세요.`;
    pwError.classList.add("show");
    return false;
  } else if (pwValue.length < 8 || pwValue.length > 16) {
    pwError.innerHTML = `${errorIcon} 비밀번호는 8자 이상 16자 이하로 입력해 주세요.`;
    pwError.classList.add("show");
    return false;
  } else {
    pwError.innerHTML = "";
    pwError.classList.remove("show");
    return true;
  }
}

// ==========================================
// 비밀번호 규칙 검사
// ==========================================
function checkPasswordRules() {
  if (!pwInput || ruleItems.length === 0) return;

  const pwValue = pwInput.value;
  const emailValue = emailInput ? emailInput.value.trim() : "";
  const idPart = emailValue.split("@")[0]; // 이메일 아이디 부분 추출

  // 최소 8자리 이상 영문 대소문자 검사
  const hasLength = pwValue.length >= 8 && pwValue.length <= 16;
  const hasLetter = /[a-zA-Z]/.test(pwValue);
  if (hasLength && hasLetter) {
    ruleItems[0].classList.add("active");
  } else {
    ruleItems[0].classList.remove("active");
  }

  // 영문, 숫자, 특수문자(!@#$%^*) 3가지 조합 검사
  const hasNum = /[0-9]/.test(pwValue);
  const hasSpecial = /[!@#$%^*]/.test(pwValue);
  if (hasLetter && hasNum && hasSpecial) {
    ruleItems[1].classList.add("active");
  } else {
    ruleItems[1].classList.remove("active");
  }

  // 아이디와 3자 이상 동일한 문자 연속 금지
  if (idPart && idPart.length >= 3 && pwValue.length >= 3) {
    let isDuplicate = false;

    for (let i = 0; i <= idPart.length - 3; i++) {
      const chunk = idPart.substring(i, i + 3);
      if (pwValue.includes(chunk)) {
        isDuplicate = true;
        break;
      }
    }

    if (!isDuplicate && pwValue.length > 0) {
      ruleItems[2].classList.add("active");
    } else {
      ruleItems[2].classList.remove("active");
    }
  } else {
    // 아이디 입력이 아직 미완성인 경우 초기화
    ruleItems[2].classList.remove("active");
  }
}

if (emailInput) {
  emailInput.addEventListener("blur", validateEmail);

  emailInput.addEventListener("input", checkPasswordRules);
}

if (pwInput) {
  pwInput.addEventListener("blur", validatePassword);
  pwInput.addEventListener("input", checkPasswordRules);
}

// ==========================================
// 회원가입 전체 동의
// ==========================================
if (agreeAllCheck && subCheckboxes.length > 0) {
  agreeAllCheck.addEventListener("change", () => {
    subCheckboxes.forEach((checkbox) => {
      checkbox.checked = agreeAllCheck.checked;
    });
  });

  subCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const allChecked = Array.from(subCheckboxes).every((sub) => sub.checked);
      agreeAllCheck.checked = allChecked;
    });
  });
}

if (authForm) {
  authForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    const isSignupPage = subCheckboxes.length > 0;

    if (isSignupPage) {
      const allRequiredChecked = Array.from(requiredCheckboxes).every((cb) => cb.checked);
      const allRulesPassed = Array.from(ruleItems).every((li) => li.classList.contains("active"));

      if (!isEmailValid || !isPasswordValid) {
        return;
      }

      if (!allRulesPassed) {
        alert("비밀번호 규칙을 모두 만족해야 합니다.");
        if (pwInput) pwInput.focus();
        return;
      }

      if (!allRequiredChecked) {
        alert("[필수] 이용약관 및 개인정보 수집 동의는 필수입니다.");
        return;
      }

      alert("회원가입이 완료되었습니다! 반갑습니다.");
    } else {
      if (isEmailValid && isPasswordValid) {
        alert("로그인에 성공했습니다.");
      }
    }
  });
}

const visibilityIcon = document.querySelector(".visibility-icon");

// ==========================================
// 비밀번호 숨김/표시 토글
// ==========================================
if (visibilityIcon && pwInput) {
  visibilityIcon.addEventListener("click", () => {
    if (pwInput.type === "password") {
      pwInput.type = "text";
      visibilityIcon.textContent = "visibility_off";
    } else {
      pwInput.type = "password";
      visibilityIcon.textContent = "visibility";
    }
  });
}
