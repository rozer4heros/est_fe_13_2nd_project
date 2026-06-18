document.addEventListener("DOMContentLoaded", () => {
  // 탭 버튼과 탭 내용 컨테이너를 모두 가져옵니다.
  const tabButtons = document.querySelectorAll(".detail-tab-item");
  const tabContents = document.querySelectorAll(".detail-tab-content");

  // 각 탭 버튼에 클릭 이벤트를 달아줍니다.
  tabButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      // 1. 모든 버튼의 활성화 상태(active 클래스) 제거
      tabButtons.forEach(btn => btn.classList.remove("active"));

      // 2. 클릭한 버튼만 활성화 상태로 변경
      button.classList.add("active");

      // 3. 모든 탭 내용을 일단 숨김 처리
      tabContents.forEach(content => {
        content.style.display = "none";
      });

      // 4. 클릭한 탭의 순서(index)와 일치하는 내용물만 보여줌
      if (tabContents[index]) {
        // 기존 디자인(Flex 등)에 맞춰 "block"이나 "flex"로 변경하시면 됩니다.
        tabContents[index].style.display = "block";
      }
    });
  });
});
// 외부 JS 파일에 안전하게 넣는 탭 메뉴 스크립트
document.addEventListener("DOMContentLoaded", () => {
  // 1. 탭 버튼들을 선택합니다.
  const tabButtons = document.querySelectorAll(".detail-tab-item");

  // [안전장치] 만약 현재 페이지에 탭 버튼이 없다면 코드 실행을 즉시 중단합니다.
  // 이 처리를 해야 다른 페이지(메인 등)에서 이 JS를 공유해도 에러가 나지 않습니다.
  if (tabButtons.length === 0) return;

  // 2. 탭 콘텐츠 영역들을 선택합니다. (HTML 클래스명에 맞게 수정해서 쓰세요)
  // 예: <div class="detail-tab-content">...</div>
  const tabContents = document.querySelectorAll(".detail-tab-content");

  // 3. 각 버튼에 클릭 이벤트 추가
  tabButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      // ① 모든 버튼에서 active 클래스 제거하고, 클릭한 버튼에만 추가
      tabButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      // ② 탭 콘텐츠 영역도 제어하는 경우 (버튼 개수와 콘텐츠 개수가 같을 때만 동작)
      if (tabContents.length === tabButtons.length) {
        // 모든 콘텐츠를 숨기고(active 제거)
        tabContents.forEach(content => content.classList.remove("active"));
        // 클릭한 탭과 같은 순서(index)의 콘텐츠만 보여주기(active 추가)
        tabContents[index].classList.add("active");
      }
    });
  });
});
