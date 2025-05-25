let tasks = [];
let activeTimer = null;

document.addEventListener('DOMContentLoaded', function() {
  renderTasks();
});

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const difficultySelect = document.getElementById("difficulty");
  
  const title = taskInput.value.trim();
  if (!title) {
    alert("Lütfen görev adı girin!");
    return;
  }

  tasks.push({
    id: Date.now(),
    title: title,
    difficulty: difficultySelect.value,
    isActive: false,
    isPaused: false,
    points: 0,
    seconds: 0,
    startTime: null,
    pausedSeconds: 0
  });

  taskInput.value = "";
  renderTasks();
}

function renderTasks() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = tasks.map(task => `
    <div class="task-item ${task.isActive ? 'active' : ''}">
      <div class="task-info">
        <h3>${task.title}</h3>
        <span class="difficulty ${task.difficulty.toLowerCase()}">${task.difficulty}</span>
        <div class="task-stats">
          <span>⏱️ ${formatTime(task.seconds)}</span>
          <span>⭐ ${task.points} puan</span>
        </div>
        ${task.isPaused ? '<div class="paused-label">DURAKLATILDI</div>' : ''}
      </div>
      <div class="task-actions">
        <button onclick="startTask(${task.id})" ${task.isActive && !task.isPaused ? 'disabled' : ''}>
          ${task.isPaused ? 'Devam Et' : 'Başlat'}
        </button>
        <button onclick="pauseTask(${task.id})" ${!task.isActive || task.isPaused ? 'disabled' : ''}>
          Durdur
        </button>
        <button onclick="finishTask(${task.id})" class="complete-btn" ${!task.isActive ? 'disabled' : ''}>
          Tamamla
        </button>
        <button onclick="deleteTask(${task.id})" class="delete-btn">
          Sil
        </button>
      </div>
    </div>
  `).join('');
}

function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return [
    hrs > 0 ? hrs.toString().padStart(2, '0') + ':' : '',
    mins.toString().padStart(2, '0'),
    ':',
    secs.toString().padStart(2, '0')
  ].join('');
}

function startTask(id) {
  // Önceki aktif timer'ı temizle
  if (activeTimer) {
    const runningTask = tasks.find(t => t.isActive && !t.isPaused);
    if (runningTask) pauseTask(runningTask.id);
  }

  const task = tasks.find(t => t.id === id);
  if (!task) return;

  task.isActive = true;
  task.isPaused = false;
  
  // Timer'ı başlat
  const now = new Date();
  if (task.pausedSeconds > 0) {
    // Duraklatılmış görevi devam ettir
    task.startTime = new Date(now - task.pausedSeconds * 1000);
  } else {
    // Yeni görevi başlat
    task.startTime = now;
    task.seconds = 0;
  }
  task.pausedSeconds = 0;

  activeTimer = setInterval(() => {
    task.seconds = Math.floor((new Date() - task.startTime) / 1000);
    renderTasks();
  }, 1000);
  
  renderTasks();
}

function pauseTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task || !task.isActive || task.isPaused) return;

  clearInterval(activeTimer);
  activeTimer = null;
  
  task.isPaused = true;
  task.pausedSeconds = task.seconds;
  
  renderTasks();
}

function finishTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task || !task.isActive) return;

  clearInterval(activeTimer);
  activeTimer = null;

  // Puan hesapla (HTML'deki değerlerle eşleşecek şekilde)
  const difficultyMultipliers = {
    'Kolay': 1,
    'Orta': 2,
    'Zor': 3
  };
  
  const timeBlocks = Math.floor(task.seconds / 5); // Her 5 saniye için 1 puan bloğu
  task.points = timeBlocks * difficultyMultipliers[task.difficulty];
  
  task.isActive = false;
  task.isPaused = false;
  task.pausedSeconds = 0;
  
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(task => {
    if (task.id === id) {
      if (task.isActive) {
        clearInterval(activeTimer); 
        activeTimer = null;
      }
      return false;
    }
    return true;
  });
  
  renderTasks();
}


function resetScore() {
  tasks.forEach(task => {
    task.points = 0;
  });
  
  if (activeTimer) {
    clearInterval(activeTimer);
    activeTimer = null;
  }
  
  renderTasks();
}