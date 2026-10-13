"use strict";

// ── Week3: querySelector로 DOM 요소 가져오기 ──
const input = document.querySelector('#todo-input');
const addBtn = document.querySelector('#add-btn');
const todoList = document.querySelector('#todo-list');
const countOutput = document.querySelector('#count');
const emptyMessage = document.querySelector('#empty-message');
// Week3: querySelectorAll — 여러 요소 한꺼번에
const filterBtns = document.querySelectorAll('.filter-btn');

// ── Week3: state 객체 패턴 (calculator.js와 동일한 패턴) ──
const state = {
  todos: [],       // { id, text, done } 형태의 배열
  filter: 'all',   // 'all' | 'active' | 'done'
  nextId: 1,
};

// ── Week1: window.addEventListener — 페이지 로드 시 초기화 ──
window.addEventListener('load', () => {
  render();
  console.log('할 일 목록이 로드되었습니다!');
});

// ── Week1: button onclick 대신 addEventListener 방식 ──
addBtn.addEventListener('click', addTodo);

// Week3: 엔터키로도 추가 가능
input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') addTodo();
});

// ── Week3: data-* 속성 + forEach로 필터 버튼 이벤트 등록 ──
filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    // dataset으로 data-filter 속성값 읽기
    state.filter = btn.dataset.filter;
    render();
  });
});

// ── 할 일 추가 함수 ──
function addTodo() {
  // Week3: try/catch로 오류 처리
  try {
    const text = input.value.trim();
    if (!text) {
      input.focus();
      return;
    }
    state.todos.push({ id: state.nextId++, text, done: false });
    input.value = '';
    render();
  } catch (error) {
    console.error('추가 오류:', error);
  }
}

// ── 할 일 완료 토글 ──
function toggleTodo(id) {
  const todo = state.todos.find((t) => t.id === id);
  if (todo) todo.done = !todo.done;
  render();
}

// ── 할 일 삭제 ──
function deleteTodo(id) {
  state.todos = state.todos.filter((t) => t.id !== id);
  render();
}

// ── Week3: 순수 함수 — 필터링된 목록 반환 (원본 안 바꿈) ──
function filteredTodos() {
  if (state.filter === 'active') return state.todos.filter((t) => !t.done);
  if (state.filter === 'done') return state.todos.filter((t) => t.done);
  return state.todos;
}

// ── Week3: render 함수 — 상태를 DOM에 반영 ──
function render() {
  const visible = filteredTodos();
  const activeCount = state.todos.filter((t) => !t.done).length;

  // Week1: textContent로 텍스트 변경
  countOutput.textContent = `${activeCount}개 남음`;

  // 빈 메시지 표시 여부
  emptyMessage.style.display = visible.length === 0 ? 'block' : 'none';

  // 목록 다시 그리기
  todoList.innerHTML = '';
  visible.forEach((todo) => {
    const li = document.createElement('li');
    li.className = 'todo-item' + (todo.done ? ' done' : '');

    // 체크박스
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.done;
    checkbox.setAttribute('aria-label', `${todo.text} 완료 여부`);
    // Week3: 클로저 — 콜백 안에서 todo.id를 참조
    checkbox.addEventListener('change', () => toggleTodo(todo.id));

    // 텍스트
    const span = document.createElement('span');
    span.textContent = todo.text;

    // 삭제 버튼 — Week3: data-action 속성 활용
    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.dataset.action = 'delete';
    deleteBtn.setAttribute('aria-label', `${todo.text} 삭제`);
    deleteBtn.textContent = '×';
    deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

    li.append(checkbox, span, deleteBtn);
    todoList.appendChild(li);
  });

  // 활성 필터 버튼 표시 업데이트
  filterBtns.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.filter === state.filter);
  });
}
