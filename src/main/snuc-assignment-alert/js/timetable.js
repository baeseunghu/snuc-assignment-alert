// js/timetable.js

const timetableKey = 'snuctimetable';

// 시간표 데이터 구조: [{ days: [ {subject, professor, room, color}, ...월~금 5개 ] }, ...]  (교시 수만큼)
let timetable = [];

// ========== 미니 시간표 위젯 (상단) ==========
function renderMiniTimetable() {
  const widget = document.getElementById('mini-timetable-widget');
  if (!widget) return;
  let html = '<div class="mini-timetable"><table><tr><th></th>';
  const days = ['월','화','수','목','금'];
  days.forEach(d => html += `<th>${d}</th>`);
  html += '</tr>';

  for (let i = 0; i < timetable.length; i++) {
    html += `<tr><th>${i+1}교시</th>`;
    for (let d = 0; d < 5; d++) {
      const cell = timetable[i]?.days?.[d];
      if (cell && cell.subject) {
        html += `<td class="cell" title="강의실: ${cell.room || ''}\n교수: ${cell.professor || ''}" style="background:${cell.color||'#cce0ff'}">${cell.subject}</td>`;
      } else {
        html += `<td></td>`;
      }
    }
    html += '</tr>';
  }
  html += '</table></div>';
  widget.innerHTML = html;
}

// ========== 시간표 메인 테이블 ==========
function renderTable() {
  const tbody = document.querySelector('#editable-timetable tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  for (let i = 0; i < timetable.length; i++) {
    const row = document.createElement('tr');
    const th = document.createElement('th');
    th.textContent = `${i+1}교시`;
    row.appendChild(th);
    for (let d = 0; d < 5; d++) {
      const td = document.createElement('td');
      const cell = timetable[i].days[d];
      td.style.background = cell.color || '';
      td.innerHTML = cell.subject
        ? `<strong>${cell.subject}</strong><br>${cell.professor||''}<br>${cell.room||''}`
        : '';
      td.onclick = () => openModal(i, d, cell);
      row.appendChild(td);
    }
    tbody.appendChild(row);
  }
}

// ========== 모달 열기/닫기/삭제 ==========
let modalRow = 0, modalCol = 0;
function openModal(row, col, cell) {
  modalRow = row; modalCol = col;
  document.getElementById('modal-subject').value = cell.subject || '';
  document.getElementById('modal-professor').value = cell.professor || '';
  document.getElementById('modal-room').value = cell.room || '';
  document.getElementById('modal-color').value = cell.color || '#ffd966';
  document.getElementById('modal').style.display = 'flex';
}
function closeModal() {
  document.getElementById('modal').style.display = 'none';
}
function deleteCell() {
  timetable[modalRow].days[modalCol] = {};
  saveTimetable();
  closeModal();
  renderTable();
  renderMiniTimetable();
}

// ========== 모달 submit 및 동기화 ==========
document.addEventListener('DOMContentLoaded', () => {
  // localStorage에서 시간표 불러오기 (없으면 5교시 x 5일)
  const saved = localStorage.getItem(timetableKey);
  if (saved) timetable = JSON.parse(saved);
  else timetable = Array.from({length: 5}, () => ({days: [{},{},{},{},{}]}));
  renderTable();
  renderMiniTimetable();

  const modalForm = document.getElementById('modal-form');
  if (modalForm) {
    modalForm.onsubmit = function(e) {
      e.preventDefault();
      timetable[modalRow].days[modalCol] = {
        subject: document.getElementById('modal-subject').value,
        professor: document.getElementById('modal-professor').value,
        room: document.getElementById('modal-room').value,
        color: document.getElementById('modal-color').value
      };
      saveTimetable();
      closeModal();
      renderTable();
      renderMiniTimetable();
    }
  }
});

// ========== 교시 추가/저장/초기화 ==========
function addPeriod() {
  timetable.push({days: [{},{},{},{},{}]});
  renderTable();
  renderMiniTimetable();
}
function saveTimetable() {
  localStorage.setItem(timetableKey, JSON.stringify(timetable));
  renderTable();
  renderMiniTimetable();
}
function resetTimetable() {
  timetable = Array.from({length: 5}, () => ({days: [{},{},{},{},{}]}));
  saveTimetable();
  renderTable();
  renderMiniTimetable();
}