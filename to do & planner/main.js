
      // Uygulama durumu
      let tasks = [];
      let activeTimer = null;
      let userScore = 0;
      let currentPet = "default";
      let ownedPets = ["default"];
      let petStats = {
        hunger: 70,
        happiness: 50,
        cleanliness: 80,
      };

      // Evcil hayvan listesi
      const pets = [
        {
          id: "default",
          name: "Temel Kedi",
          price: 0,
          image: "https://cdn-icons-png.flaticon.com/512/616/616408.png",
        },
        {
          id: "dog",
          name: "Sevimli Köpek",
          price: 100,
          image: "https://cdn-icons-png.flaticon.com/512/616/616430.png",
        },
        {
          id: "rabbit",
          name: "Tavşan",
          price: 200,
          image: "https://cdn-icons-png.flaticon.com/512/3069/3069172.png",
        },
        {
          id: "panda",
          name: "Panda",
          price: 500,
          image: "https://cdn-icons-png.flaticon.com/512/3069/3069194.png",
        },
        {
          id: "fox",
          name: "Tilki",
          price: 300,
          image: "https://cdn-icons-png.flaticon.com/512/3069/3069183.png",
        },
        {
          id: "dragon",
          name: "Ejderha",
          price: 1000,
          image: "https://cdn-icons-png.flaticon.com/512/3069/3069208.png",
        },
      ];

      // Sayfa yüklendiğinde
      document.addEventListener("DOMContentLoaded", function () {
        renderTasks();
        loadPetShop();
        loadPetInventory();
        updatePetStatsDisplay();

        // Kayıtlı verileri yükle
        const savedData = localStorage.getItem("petAppData");
        if (savedData) {
          const data = JSON.parse(savedData);
          userScore = data.score || 0;
          currentPet = data.currentPet || "default";
          ownedPets = data.ownedPets || ["default"];
          petStats = data.petStats || {
            hunger: 70,
            happiness: 50,
            cleanliness: 80,
          };

          document.getElementById("score").textContent = userScore;
          document.getElementById("currentPetImage").src = pets.find(
            (p) => p.id === currentPet
          ).image;
          updatePetStatsDisplay();
        }

        // Evcil hayvan istatistiklerini zamanla azalt
        setInterval(() => {
          petStats.hunger = Math.max(0, petStats.hunger - 1);
          petStats.happiness = Math.max(0, petStats.happiness - 1);
          petStats.cleanliness = Math.max(0, petStats.cleanliness - 1);
          updatePetStatsDisplay();
          saveData();
        }, 60000); // Her dakika
      });

      // Verileri kaydet
      function saveData() {
        const data = {
          score: userScore,
          currentPet: currentPet,
          ownedPets: ownedPets,
          petStats: petStats,
          tasks: tasks,
        };
        localStorage.setItem("petAppData", JSON.stringify(data));
      }

      // Panel açma/kapama fonksiyonları
      function togglePanel(panel) {
        document.body.classList.toggle(`show-${panel}-panel`);
      }

      function closePanel(panel) {
        document.body.classList.remove(`show-${panel}-panel`);
      }

      function closeAllPanels() {
        document.body.classList.remove("show-left-panel", "show-right-panel");
      }

      // Sekme değiştirme
      function openPetTab(evt, tabName) {
        const tabContents = document.getElementsByClassName("pet-tab-content");
        for (let i = 0; i < tabContents.length; i++) {
          tabContents[i].classList.remove("active");
        }

        const tabs = document.getElementsByClassName("pet-tab");
        for (let i = 0; i < tabs.length; i++) {
          tabs[i].classList.remove("active");
        }

        document.getElementById(tabName).classList.add("active");
        evt.currentTarget.classList.add("active");

        if (tabName === "pet-shop") {
          loadPetShop();
        } else if (tabName === "pet-inventory") {
          loadPetInventory();
        }
      }

      // Evcil hayvan dükkanını yükle
      function loadPetShop() {
        const petShop = document.getElementById("petShop");
        petShop.innerHTML = pets
          .map(
            (pet) => `
                <div class="pet-item ${
                  ownedPets.includes(pet.id) ? "unlocked" : "locked"
                }" 
                     onclick="${
                       ownedPets.includes(pet.id) ? "" : `buyPet('${pet.id}')`
                     }">
                    <img src="${pet.image}" alt="${pet.name}">
                    <h4>${pet.name}</h4>
                    ${
                      ownedPets.includes(pet.id)
                        ? "<p>Satın Alındı</p>"
                        : `<p class="pet-price">${pet.price} Puan</p>`
                    }
                </div>
            `
          )
          .join("");
      }

      // Envanteri yükle
      function loadPetInventory() {
        const petInventory = document.getElementById("petInventory");
        petInventory.innerHTML = ownedPets
          .map((petId) => {
            const pet = pets.find((p) => p.id === petId);
            return `
                    <div class="pet-item ${
                      currentPet === petId ? "active" : ""
                    }" 
                         onclick="selectPet('${petId}')">
                        <img src="${pet.image}" alt="${pet.name}">
                        <h4>${pet.name}</h4>
                        ${currentPet === petId ? "<p>Seçili</p>" : "<p>Seç</p>"}
                    </div>
                `;
          })
          .join("");
      }

      // Evcil hayvan seç
      function selectPet(petId) {
        if (ownedPets.includes(petId)) {
          currentPet = petId;
          document.getElementById("currentPetImage").src = pets.find(
            (p) => p.id === petId
          ).image;
          loadPetInventory();
          saveData();
        }
      }

      // Evcil hayvan satın al
      function buyPet(petId) {
        const pet = pets.find((p) => p.id === petId);
        if (!pet) return;

        if (userScore >= pet.price) {
          userScore -= pet.price;
          ownedPets.push(petId);
          document.getElementById("score").textContent = userScore;
          loadPetShop();
          loadPetInventory();
          saveData();
          alert(`Tebrikler! ${pet.name} satın aldınız!`);
        } else {
          alert(
            "Yeterli puanınız yok! Daha fazla görev tamamlayarak puan kazanabilirsiniz."
          );
        }
      }

      // Evcil hayvan bakım fonksiyonları
      function feedPet() {
        petStats.hunger = Math.min(100, petStats.hunger + 10);
        updatePetStatsDisplay();
        saveData();
      }

      function playWithPet() {
        petStats.happiness = Math.min(100, petStats.happiness + 10);
        updatePetStatsDisplay();
        saveData();
      }

      function cleanPet() {
        petStats.cleanliness = Math.min(100, petStats.cleanliness + 10);
        updatePetStatsDisplay();
        saveData();
      }

      // İstatistikleri güncelle
      function updatePetStatsDisplay() {
        document.getElementById("hunger-bar").value = petStats.hunger;
        document.getElementById("happiness-bar").value = petStats.happiness;
        document.getElementById("cleanliness-bar").value = petStats.cleanliness;
      }

      /* Todo List fonksiyonları */
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
          pausedSeconds: 0,
        });

        taskInput.value = "";
        renderTasks();
        saveData();
      }

      function renderTasks() {
        const todoList = document.getElementById("todoList");
        todoList.innerHTML = tasks
          .map(
            (task) => `
                <div class="task-item ${task.isActive ? "active" : ""}">
                    <div class="task-info">
                        <h3>${task.title}</h3>
                        <span class="difficulty ${task.difficulty.toLowerCase()}">${
              task.difficulty
            }</span>
                        <div class="task-stats">
                            <span>⏱️ ${formatTime(task.seconds)}</span>
                            <span>⭐ ${task.points} puan</span>
                        </div>
                        ${
                          task.isPaused
                            ? '<div class="paused-label">DURAKLATILDI</div>'
                            : ""
                        }
                    </div>
                    <div class="task-actions">
                        <button onclick="startTask(${task.id})" ${
              task.isActive && !task.isPaused ? "disabled" : ""
            }>
                            ${task.isPaused ? "Devam Et" : "Başlat"}
                        </button>
                        <button onclick="pauseTask(${task.id})" ${
              !task.isActive || task.isPaused ? "disabled" : ""
            }>
                            Durdur
                        </button>
                        <button onclick="finishTask(${
                          task.id
                        })" class="complete-btn" ${
              !task.isActive ? "disabled" : ""
            }>
                            Tamamla
                        </button>
                        <button onclick="deleteTask(${
                          task.id
                        })" class="delete-btn">
                            Sil
                        </button>
                    </div>
                </div>
            `
          )
          .join("");
      }

      function formatTime(seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        return [
          hrs > 0 ? hrs.toString().padStart(2, "0") + ":" : "",
          mins.toString().padStart(2, "0"),
          ":",
          secs.toString().padStart(2, "0"),
        ].join("");
      }

      function startTask(id) {
        if (activeTimer) {
          const runningTask = tasks.find((t) => t.isActive && !t.isPaused);
          if (runningTask) pauseTask(runningTask.id);
        }

        const task = tasks.find((t) => t.id === id);
        if (!task) return;

        task.isActive = true;
        task.isPaused = false;

        const now = new Date();
        if (task.pausedSeconds > 0) {
          task.startTime = new Date(now - task.pausedSeconds * 1000);
        } else {
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
        const task = tasks.find((t) => t.id === id);
        if (!task || !task.isActive || task.isPaused) return;

        clearInterval(activeTimer);
        activeTimer = null;

        task.isPaused = true;
        task.pausedSeconds = task.seconds;

        renderTasks();
      }

      function finishTask(id) {
        const task = tasks.find((t) => t.id === id);
        if (!task || !task.isActive) return;

        clearInterval(activeTimer);
        activeTimer = null;

        const difficultyMultipliers = {
          Kolay: 1,
          Orta: 2,
          Zor: 3,
        };

        const timeBlocks = Math.floor(task.seconds / 5);
        const earnedPoints =
          timeBlocks * difficultyMultipliers[task.difficulty];
        task.points = earnedPoints;
        userScore += earnedPoints;

        task.isActive = false;
        task.isPaused = false;
        task.pausedSeconds = 0;

        document.getElementById("score").textContent = userScore;
        renderTasks();
        saveData();
      }

      function deleteTask(id) {
        tasks = tasks.filter((task) => {
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
        saveData();
      }

      function resetScore() {
        if (confirm("Puanınızı sıfırlamak istediğinize emin misiniz?")) {
          userScore = 0;
          document.getElementById("score").textContent = userScore;
          saveData();
        }
      }
