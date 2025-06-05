// js/assignment.js

// 과제 + 시험 샘플 데이터
let assignments = [
  { courseName: "컴퓨터공학", title: "자바 과제", dueDate: "2025-06-05", assignTime: "목4" },
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
      // 시험 일정 처리 (기간)
      const [start, end] = a.dueDate.split("~");
      const today = new Date();
      const startDate = new Date(start);
      const endDate = new Date(end);
      let label = "";
      if (today < startDate) label = `D-${Math.ceil((startDate - today) / (1000 * 60 * 60 * 24))} 시작`;
      else if (today > endDate) label = "종료";
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
      // 일반 과제 처리
      const dueDateObj = new Date(a.dueDate);
      const days = ["일", "월", "화", "수", "목", "금", "토"];
      const yoil = days[dueDateObj.getDay()];
      const today = new Date(); today.setHours(0,0,0,0);
      const diffDay = Math.ceil((dueDateObj - today)/(1000*60*60*24));
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

// ========== 폼 열기/닫기/제출 ==========
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
  }
}

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
  }
};

// ========== 초기 실행 ==========
window.addEventListener('DOMContentLoaded', () => {
  renderAssignments();
});