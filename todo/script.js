// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBM03URLmymAoYM-RG9ke40YIrAvTrOuNY",
  authDomain: "teck-personnal.firebaseapp.com",
  projectId: "teck-personnal",
  storageBucket: "teck-personnal.appspot.com",
  messagingSenderId: "877076892450",
  appId: "1:877076892450:web:917be69a1428a8697f737b",
  measurementId: "G-88TT8R5S00"
};

// Firebase initialisatie
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', () => {
  const todoForm = document.getElementById('todoForm');
  const todoInput = document.getElementById('todoInput');
  const todoList = document.getElementById('todoList');
  const backBtn = document.getElementById('backBtn');
  let currentUser = null;

  // Nav laden
  fetch('nav.html')
    .then(response => response.text())
    .then(data => {
      const navContainer = document.getElementById('main-nav');
      if (navContainer) navContainer.innerHTML = data;
    });

  // Terug naar dashboard
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      window.location.href = '/Teck-personnal/dashboard.html';
    });
  }

  // User login check
  auth.onAuthStateChanged(user => {
    if (user) {
      currentUser = user;
      loadTodos();
    } else {
      // Redirect naar login als niet ingelogd
      window.location.href = 'login.html';
    }
  });

  // Todos realtime laden
  function loadTodos() {
    db.collection('todos')
      .where('userId', '==', currentUser.uid)
      .orderBy('createdAt')
      .onSnapshot(snapshot => {
        todoList.innerHTML = '';
        snapshot.forEach(doc => {
          const todo = doc.data();
          todo.id = doc.id;

          const li = document.createElement('li');

          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.checked = todo.completed;
          checkbox.addEventListener('change', () => toggleCompleted(todo.id, checkbox.checked));

          const span = document.createElement('span');
          span.textContent = todo.text;
          if (todo.completed) span.classList.add('completed');

          const removeBtn = document.createElement('button');
          removeBtn.textContent = '×';
          removeBtn.className = 'remove-btn';
          removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteTodo(todo.id);
          });

          li.appendChild(checkbox);
          li.appendChild(span);
          li.appendChild(removeBtn);
          todoList.appendChild(li);
        });
      });
  }

  // Toggle completed
  function toggleCompleted(id, completed) {
    db.collection('todos').doc(id).update({ completed });
  }

  // Delete todo
  function deleteTodo(id) {
    db.collection('todos').doc(id).delete();
  }

  // Voeg nieuwe todo toe
  if (todoForm) {
    todoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = todoInput.value.trim();
      if (!text) return;

      db.collection('todos').add({
        text: text,
        completed: false,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        userId: currentUser.uid
      });

      todoInput.value = '';
    });
  }
});
