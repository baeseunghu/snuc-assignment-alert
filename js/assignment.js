// js/assignment.js

let assignments = [
  { courseName: "컴퓨터공학", title: "자바 과제", dueDate: "2025-06-07", assignTime: "목4" },
  { courseName: "영어", title: "에세이 제출", dueDate: "2025-06-12", assignTime: "수6" },
  { courseName: "공통", title: "중간고사", dueDate: "2025-04-20~2025-04-24", examType: "중간" },
  { courseName: "공통", title: "기말고사", dueDate: "2025-06-20~2025-06-25", examType: "기말" }
];

// ========== 과제/시험 목록 렌더링 ==========
function renderAssignments() {
  const list = document.getElementById("assignment-list");
  list.innerHTML = '';
  if (assignments.length === 0) {
    list.innerHTML = `<tr><td colspan="5" style="color:#aaa;">등록된 과제/시험이 없습니다.</td></tr>`;
    return;
  }
  assignments.forEach((a, idx) => {
    if (a.examType) {
      const [start, end] = a.dueDate.split("~");
      const nowKST = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
      const startDate = new Date(start);
      const endDate = new Date(end);
      let label = "";
      if (nowKST < startDate) label = `D-${Math.ceil((startDate - nowKST) / (1000 * 60 * 60 * 24))} 시작`;
      else if (nowKST > endDate) label = "종료";
      else label = "진행중";
      let dateLabel = `${start} ~ ${end} / ${label}`;
      list.innerHTML += `
        <tr>
          <td>${a.courseName}</td>
          <td>${a.title}</td>
          <td colspan="2">${dateLabel}</td>
          <td><button class="del-btn" onclick="deleteAssignment(${idx})">삭제</button></td>
        </tr>
      `;
    } else {
      const dueDateObj = new Date(a.dueDate + "T00:00:00+09:00");
      const days = ["일", "월", "화", "수", "목", "금", "토"];
      const yoil = days[dueDateObj.getDay()];
      const nowKST = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
      nowKST.setHours(0,0,0,0);
      const diffDay = Math.ceil((dueDateObj - nowKST)/(1000*60*60*24));
      let ddayLabel = "";
      if (diffDay === 0) ddayLabel = "D-DAY";
      else if (diffDay > 0) ddayLabel = `D-${diffDay}`;
      else ddayLabel = `D+${-diffDay}`;
      let dueDisplay = `${a.dueDate} (${yoil}) / ${ddayLabel}`;
      let period = a.assignTime || "";
      list.innerHTML += `
        <tr>
          <td>${a.courseName}</td>
          <td>${a.title}</td>
          <td>${dueDisplay}</td>
          <td>${period}</td>
          <td><button class="del-btn" onclick="deleteAssignment(${idx})">삭제</button></td>
        </tr>
      `;
    }
  });
}

// 폼 열기/닫기/삭제
function showForm() {
  document.getElementById("assignment-form").style.display = "block";
}
function hideForm() {
  document.getElementById("assignment-form").reset();
  document.getElementById("assignment-form").style.display = "none";
}
function deleteAssignment(idx) {
  if (confirm("정말 삭제할까요?")) {
    assignments.splice(idx, 1);
    renderAssignments();
    // 삭제 후에도 알림 다시 체크
    if (typeof deadlineNotification === "function") {
      deadlineNotification(assignments);
    }
  }
}

// **[변경] 과제 추가 시 즉시 알림 체크**
document.getElementById("assignment-form").onsubmit = function(e) {
  e.preventDefault();
  const courseName = document.getElementById("courseName").value.trim();
  const title = document.getElementById("title").value.trim();
  const dueDate = document.getElementById("dueDate").value;
  const assignTime = document.getElementById("assignTime").value.trim();
  if (courseName && title && dueDate && assignTime) {
    assignments.push({ courseName, title, dueDate, assignTime });
    renderAssignments();
    hideForm();

    // ➡️ 새로 추가할 때마다 알림 체크
    if (typeof deadlineNotification === "function") {
      deadlineNotification(assignments);
    }
  }
};

// ========== 초기 실행 및 알림 연동 ==========
window.addEventListener('DOMContentLoaded', () => {
    renderAssignments();
    setupAlert(assignments);  // ← 알림 기능 연동 (alert.js 필요)
});