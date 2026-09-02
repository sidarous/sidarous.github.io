/**
 * ClassRecall - Teacher's Student Recognition Web Application
 * Live CSV Dataset Engine (Grades 7-12)
 */

(function () {
  "use strict";

  // ==========================================
  // 1. STATE & PERSISTENCE
  // ==========================================
  const STORAGE_KEYS = {
    STUDENT_STATS: "classrecall_stats_v2",
    SETTINGS: "classrecall_settings_v2",
    ROSTER_CSV: "classrecall_roster_csv_v1",
    ROSTER_META: "classrecall_roster_meta_v1"
  };

  let state = {
    currentTab: "flashcards",
    activeGrade: "all", // "all", "7", "8", "9", "10", "11", "12"
    searchQuery: "",
    students: [],
    settings: {
      theme: "dark",
      soundEnabled: true,
      speechEnabled: true
    },
    // Mode 1: Flashcards
    flashcard: {
      queue: [],
      currentIndex: 0,
      isFlipped: false,
      isAdvancing: false
    },
    // Mode 2: Multiple Choice
    mcQuiz: {
      queue: [],
      currentIndex: 0,
      score: 0,
      streak: 0,
      bestStreak: 0,
      isAnswered: false,
      currentOptions: []
    },
    // Mode 3: Type In
    typeQuiz: {
      queue: [],
      currentIndex: 0,
      hintsUsed: 0,
      score: 0,
      total: 0,
      isSubmitted: false
    },
    // Mode 4: Speed Match
    speedMatch: {
      tiles: [],
      selectedTile: null,
      matchedCount: 0,
      totalPairs: 6,
      startTime: null,
      timerInterval: null,
      elapsedSeconds: 0,
      isComplete: false
    }
  };

  // ==========================================
  // 2. AUDIO SYNTHESIS & SPEECH
  // ==========================================
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx && typeof window.AudioContext !== "undefined") {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  function playTone(freq, type = "sine", duration = 0.15, gain = 0.2) {
    if (!state.settings.soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      if (audioCtx.state === "suspended") audioCtx.resume();

      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gainNode.gain.setValueAtTime(gain, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  const Sound = {
    click: () => playTone(600, "triangle", 0.05, 0.1),
    flip: () => playTone(350, "sine", 0.08, 0.15),
    correct: () => {
      playTone(523.25, "sine", 0.1, 0.18); // C5
      setTimeout(() => playTone(659.25, "sine", 0.18, 0.2), 80); // E5
    },
    wrong: () => {
      playTone(220, "sawtooth", 0.18, 0.25);
      setTimeout(() => playTone(180, "sawtooth", 0.25, 0.2), 100);
    },
    fanfare: () => {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, i) => {
        setTimeout(() => playTone(freq, "triangle", 0.2, 0.25), i * 110);
      });
    }
  };

  function speakName(name) {
    if (!state.settings.speechEnabled || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(name);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error", e);
    }
  }

  // ==========================================
  // 3. CONFETTI ANIMATION ENGINE
  // ==========================================
  const Confetti = {
    canvas: null,
    ctx: null,
    particles: [],
    animationId: null,

    init() {
      this.canvas = document.getElementById("confetti-canvas");
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext("2d");
      this.resize();
      window.addEventListener("resize", () => this.resize());
    },

    resize() {
      if (!this.canvas) return;
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    },

    fire(count = 70) {
      this.init();
      if (!this.canvas || !this.ctx) return;
      const colors = ["#6366f1", "#ec4899", "#10b981", "#f59e0b", "#06b6d4", "#8b5cf6"];

      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: this.canvas.width / 2 + (Math.random() - 0.5) * 300,
          y: this.canvas.height * 0.45,
          vx: (Math.random() - 0.5) * 14,
          vy: (Math.random() - 0.8) * 14 - 3,
          size: Math.random() * 8 + 5,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 12,
          opacity: 1,
          gravity: 0.35
        });
      }

      if (!this.animationId) {
        this.loop();
      }
    },

    loop() {
      if (!this.ctx || !this.canvas) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.98;
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.012;

        if (p.opacity <= 0 || p.y > this.canvas.height + 20) {
          this.particles.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);
        this.ctx.globalAlpha = Math.max(0, p.opacity);
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        this.ctx.restore();
      }

      if (this.particles.length > 0) {
        this.animationId = requestAnimationFrame(() => this.loop());
      } else {
        this.animationId = null;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    }
  };

  // ==========================================
  // 4. TOAST NOTIFICATIONS
  // ==========================================
  function showToast(message, type = "info", duration = 3000) {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    
    let icon = "ℹ️";
    if (type === "success") icon = "✅";
    if (type === "error") icon = "⚠️";

    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(50px)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // ==========================================
  // 5. STORAGE & INITIALIZATION
  // ==========================================
  function parseCsv(text) {
    const rows = [];
    let row = [];
    let field = "";
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];

      if (inQuotes) {
        if (char === '"') {
          if (text[i + 1] === '"') {
            field += '"';
            i++;
          } else {
            inQuotes = false;
          }
        } else {
          field += char;
        }
      } else if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        row.push(field);
        field = "";
      } else if (char === "\n") {
        row.push(field);
        if (row.some((value) => value.trim() !== "")) rows.push(row);
        row = [];
        field = "";
      } else if (char !== "\r") {
        field += char;
      }
    }

    row.push(field);
    if (row.some((value) => value.trim() !== "")) rows.push(row);
    return rows;
  }

  function parseStudentsCsv(csvText) {
    const rows = parseCsv(csvText);
    if (rows.length < 2) throw new Error("The CSV file contains no student records");

    const headers = rows[0].map((header, index) =>
      (index === 0 ? header.replace(/^\uFEFF/, "") : header).trim()
    );
    const requiredHeaders = ["ID", "Name", "Year", "PhotoFilename", "AdvTeacher", "Tags"];
    const missingHeaders = requiredHeaders.filter((header) => !headers.includes(header));
    if (missingHeaders.length) throw new Error(`Missing CSV columns: ${missingHeaders.join(", ")}`);

    const seenIds = new Set();
    const students = rows.slice(1).map((values, index) => {
      const csvRow = index + 2;
      const record = Object.fromEntries(headers.map((header, column) => [header, (values[column] || "").trim()]));
      const studentId = record.ID;

      if (!studentId) throw new Error(`Missing student ID on CSV row ${csvRow}`);
      if (seenIds.has(studentId)) throw new Error(`Duplicate student ID on CSV row ${csvRow}`);
      seenIds.add(studentId);

      const grade = ["7", "8", "9", "10", "11", "12"].includes(record.Year) ? record.Year : "9";
      const photoFilename = record.PhotoFilename;
      const photoMissing = photoFilename.toLowerCase() === "missingphoto";
      if (!photoFilename) throw new Error(`Missing PhotoFilename on CSV row ${csvRow}`);
      if (!photoMissing && !/^[A-Za-z0-9_.-]+\.jpe?g$/i.test(photoFilename)) {
        throw new Error(`Invalid PhotoFilename on CSV row ${csvRow}`);
      }
      const rawName = record.Name;
      let displayName = rawName;
      let firstName = rawName.split(" ")[0] || "";

      if (rawName.includes(",")) {
        const [last, first] = rawName.split(/,(.+)/).map((part) => part.trim());
        displayName = `${first} ${last}`.trim();
        firstName = first.split(" ")[0] || "";
      }

      return {
        id: studentId,
        studentId,
        name: displayName,
        rosterName: rawName,
        preferredName: firstName !== displayName ? firstName : "",
        grade,
        photo: photoMissing ? "" : `collection.media/${encodeURIComponent(photoFilename)}`,
        hasPhoto: !photoMissing,
        photoMissing,
        advisoryTeacher: record.AdvTeacher,
        tags: record.Tags.split(/\s+/).filter(Boolean),
        stats: { reviews: 0, correct: 0, mastery: 1, lastReviewed: null }
      };
    });

    if (!students.length) throw new Error("The CSV file contains no student records");
    return students;
  }

  async function loadStudentsFromCsv() {
    const storedCsv = localStorage.getItem(STORAGE_KEYS.ROSTER_CSV);
    if (storedCsv) return parseStudentsCsv(storedCsv);

    const error = new Error("Choose a roster CSV to continue");
    error.code = "ROSTER_IMPORT_REQUIRED";
    throw error;
  }

  async function loadStateFromStorage() {
    // Settings
    try {
      const savedSettings = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS));
      if (savedSettings) state.settings = { ...state.settings, ...savedSettings };
    } catch (e) {}

    // Theme
    document.documentElement.setAttribute("data-theme", state.settings.theme);

    // Load the current roster directly from CSV on every page load.
    const rawStudents = await loadStudentsFromCsv();
    let savedStats = {};
    try {
      savedStats = JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENT_STATS)) || {};
    } catch (e) {}

    let migratedLegacyStats = false;
    state.students = rawStudents.map((s, index) => {
      // Preserve progress from the previous row-based `stu-N` identifiers.
      const legacyId = `stu-${index + 1}`;
      const stat = savedStats[s.id] || savedStats[legacyId];
      if (!savedStats[s.id] && savedStats[legacyId]) migratedLegacyStats = true;
      return {
        ...s,
        stats: stat || s.stats || { reviews: 0, correct: 0, mastery: 1, lastReviewed: null }
      };
    });

    if (migratedLegacyStats) saveStudentStats();

  }

  function saveStudentStats() {
    const statsMap = {};
    state.students.forEach((s) => {
      if (s.stats) statsMap[s.id] = s.stats;
    });
    localStorage.setItem(STORAGE_KEYS.STUDENT_STATS, JSON.stringify(statsMap));
  }

  function clearProgress() {
    const confirmed = window.confirm(
      "Clear all mastery and review progress for this browser roster? This cannot be undone."
    );
    if (!confirmed) return;

    localStorage.removeItem(STORAGE_KEYS.STUDENT_STATS);
    state.students.forEach((student) => {
      student.stats = { reviews: 0, correct: 0, mastery: 1, lastReviewed: null };
    });
    updateHeaderStats();
    initActiveTab();
    showToast("Progress cleared for this roster.", "success");
  }

  function saveSettingsToStorage() {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(state.settings));
  }

  function showRosterImport(error) {
    if (error.code !== "ROSTER_IMPORT_REQUIRED") console.error("Roster load error:", error);
    const importPanel = document.getElementById("roster-import-panel");
    const status = document.getElementById("roster-import-status");

    if (importPanel) importPanel.style.display = "flex";
    if (status && error.code !== "ROSTER_IMPORT_REQUIRED") {
      status.className = "roster-import-status error";
      status.textContent = `The saved roster could not be loaded: ${error.message}. Choose a corrected CSV.`;
    }
  }

  async function importRosterFile(file, statusElement) {
    if (!file) return;

    try {
      if (statusElement) {
        statusElement.className = "roster-import-status";
        statusElement.textContent = "Checking roster…";
      }

      const csvText = await file.text();
      const students = parseStudentsCsv(csvText);
      localStorage.setItem(STORAGE_KEYS.ROSTER_CSV, csvText);
      localStorage.setItem(STORAGE_KEYS.ROSTER_META, JSON.stringify({
        fileName: file.name,
        studentCount: students.length,
        importedAt: new Date().toISOString()
      }));

      if (statusElement) {
        statusElement.className = "roster-import-status success";
        statusElement.textContent = `${students.length.toLocaleString()} students imported. Reloading…`;
      }
      window.setTimeout(() => window.location.reload(), 450);
    } catch (error) {
      if (statusElement) {
        statusElement.className = "roster-import-status error";
        statusElement.textContent = `Roster not changed: ${error.message}.`;
      }
    }
  }

  function setupRosterImportControls() {
    const firstRunButton = document.getElementById("btn-select-roster");
    const firstRunInput = document.getElementById("roster-file-input");
    const settingsButton = document.getElementById("btn-replace-roster");
    const settingsInput = document.getElementById("settings-roster-file-input");

    if (firstRunButton && firstRunInput) {
      firstRunButton.addEventListener("click", () => firstRunInput.click());
      firstRunInput.addEventListener("change", () => {
        importRosterFile(firstRunInput.files[0], document.getElementById("roster-import-status"));
        firstRunInput.value = "";
      });
    }

    if (settingsButton && settingsInput) {
      settingsButton.addEventListener("click", () => settingsInput.click());
      settingsInput.addEventListener("change", () => {
        importRosterFile(settingsInput.files[0], document.getElementById("settings-roster-status"));
        settingsInput.value = "";
      });
    }

  }

  function updateRosterSummary() {
    const summary = document.getElementById("settings-roster-summary");
    if (!summary) return;

    let metadata = null;
    try {
      metadata = JSON.parse(localStorage.getItem(STORAGE_KEYS.ROSTER_META));
    } catch (error) {}

    if (metadata) {
      const imported = new Date(metadata.importedAt).toLocaleString();
      summary.textContent = `${metadata.studentCount.toLocaleString()} students from ${metadata.fileName} · imported ${imported}`;
    } else {
      summary.textContent = `${state.students.length.toLocaleString()} students from an imported CSV`;
    }
  }

  function getInitials(name) {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  }

  function getRepeatedDisplayNames(students) {
    const counts = new Map();
    students.forEach((student) => counts.set(student.name, (counts.get(student.name) || 0) + 1));
    return new Set([...counts].filter(([, count]) => count > 1).map(([name]) => name));
  }

  function renderStudentPhoto(photoElem, avatarElem, student) {
    const showAvatar = (photoMissing) => {
      if (!avatarElem) return;
      avatarElem.style.display = "flex";
      avatarElem.textContent = getInitials(student.name);
      avatarElem.classList.toggle("photo-missing", photoMissing);
      avatarElem.setAttribute(
        "aria-label",
        photoMissing ? `Photo missing for ${student.name}` : `Initials for ${student.name}`
      );
    };

    if (student.hasPhoto && student.photo) {
      photoElem.src = student.photo;
      photoElem.style.display = "block";
      if (avatarElem) {
        avatarElem.style.display = "none";
        avatarElem.classList.remove("photo-missing");
      }
      photoElem.onerror = () => {
        photoElem.style.display = "none";
        showAvatar(true);
      };
    } else {
      photoElem.style.display = "none";
      showAvatar(student.photoMissing);
    }
  }

  // ==========================================
  // 7. FILTERING & STUDENT GETTERS
  // ==========================================
  function getFilteredStudents() {
    return state.students.filter((s) => {
      const matchesGrade = state.activeGrade === "all" || s.grade === state.activeGrade;
      if (!matchesGrade) return false;

      if (!state.searchQuery) return true;
      const q = state.searchQuery.toLowerCase();
      const nameMatch = s.name.toLowerCase().includes(q);
      const rosterMatch = s.rosterName && s.rosterName.toLowerCase().includes(q);
      const tagMatch = s.tags && s.tags.some((t) => t.toLowerCase().includes(q));
      const idMatch = s.studentId && s.studentId.includes(q);

      return nameMatch || rosterMatch || tagMatch || idMatch;
    });
  }

  function shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  // ==========================================
  // 8. MODE 1: FLASHCARDS (3D FLIP & SRS)
  // ==========================================
  function initFlashcardMode() {
    const pool = getFilteredStudents();
    state.flashcard.queue = shuffleArray(pool);
    state.flashcard.currentIndex = 0;
    state.flashcard.isFlipped = false;
    renderFlashcard();
  }

  function renderFlashcard() {
    const container = document.getElementById("flashcard-render-area");
    const countBadge = document.getElementById("fc-count-badge");
    const emptyState = document.getElementById("fc-empty-state");
    const activeDeck = state.flashcard.queue;

    if (!activeDeck || activeDeck.length === 0) {
      if (container) container.style.display = "none";
      if (emptyState) emptyState.style.display = "block";
      if (countBadge) countBadge.textContent = "0 of 0";
      return;
    }

    if (container) container.style.display = "block";
    if (emptyState) emptyState.style.display = "none";

    const idx = state.flashcard.currentIndex;
    const student = activeDeck[idx];
    if (countBadge) countBadge.textContent = `Card ${idx + 1} of ${activeDeck.length}`;

    const cardInner = document.getElementById("main-flashcard-inner");
    if (cardInner) {
      cardInner.classList.toggle("flipped", state.flashcard.isFlipped);
    }

    const frontPhoto = document.getElementById("fc-front-photo");
    const frontAvatar = document.getElementById("fc-front-avatar");
    const frontGrade = document.getElementById("fc-front-grade");

    const backName = document.getElementById("fc-back-name");
    const backRoster = document.getElementById("fc-back-roster");
    const backPronounce = document.getElementById("fc-back-pronounce");
    const backNotes = document.getElementById("fc-back-notes");
    const backGrade = document.getElementById("fc-back-grade");
    const backTags = document.getElementById("fc-back-tags");

    renderStudentPhoto(frontPhoto, frontAvatar, student);

    if (frontGrade) {
      frontGrade.textContent = `Grade ${student.grade}`;
      frontGrade.setAttribute("data-grade", student.grade);
    }

    if (backName) backName.textContent = student.name;
    if (backRoster) backRoster.textContent = student.rosterName ? `Roster: ${student.rosterName}` : "";
    if (backPronounce) {
      backPronounce.onclick = (e) => {
        e.stopPropagation();
        speakName(student.name);
      };
    }
    if (backNotes) {
      backNotes.textContent = student.advisoryTeacher ? `Advisory: ${student.advisoryTeacher}` : "";
      backNotes.style.display = student.advisoryTeacher ? "block" : "none";
    }
    if (backGrade) {
      backGrade.textContent = `Grade ${student.grade}`;
      backGrade.setAttribute("data-grade", student.grade);
    }

    // Subtly show student ID on flashcard back
    const backStudentId = document.getElementById("fc-back-student-id");
    if (backStudentId) {
      backStudentId.textContent = student.studentId ? `ID ${student.studentId}` : "";
    }

    if (backTags) {
      backTags.innerHTML = (student.tags || [])
        .map((t) => `<span class="tag-pill">${t}</span>`)
        .join("");
    }
  }

  function flipFlashcard() {
    if (state.flashcard.isAdvancing) return;
    Sound.flip();
    state.flashcard.isFlipped = !state.flashcard.isFlipped;
    const cardInner = document.getElementById("main-flashcard-inner");
    if (cardInner) {
      cardInner.classList.toggle("flipped", state.flashcard.isFlipped);
    }
  }

  function recordSRSScore(scoreLevel) {
    if (state.flashcard.isAdvancing) return;
    Sound.click();
    const activeDeck = state.flashcard.queue;
    if (!activeDeck || activeDeck.length === 0) return;

    const student = activeDeck[state.flashcard.currentIndex];
    if (student) {
      if (!student.stats) student.stats = { reviews: 0, correct: 0, mastery: 1 };
      student.stats.reviews += 1;
      if (scoreLevel >= 3) {
        student.stats.correct += 1;
        student.stats.mastery = Math.min(5, (student.stats.mastery || 1) + 1);
      } else {
        student.stats.mastery = Math.max(1, (student.stats.mastery || 1) - 1);
      }
      student.stats.lastReviewed = Date.now();
      saveStudentStats();
      updateHeaderStats();
    }

    advanceFlashcard();
  }

  function advanceFlashcard() {
    const activeDeck = state.flashcard.queue;
    if (!activeDeck || activeDeck.length === 0) return;

    const cardInner = document.getElementById("main-flashcard-inner");
    const advanceStartedAt = Date.now();
    const advanceDuration = 80;
    const finishAdvance = () => {
      if (!state.flashcard.isAdvancing) return;
      const remaining = advanceDuration - (Date.now() - advanceStartedAt);
      if (remaining > 0) {
        window.setTimeout(finishAdvance, remaining);
        return;
      }
      state.flashcard.isAdvancing = false;
      if (cardInner) cardInner.classList.remove("advancing");

      if (state.flashcard.currentIndex < activeDeck.length - 1) {
        state.flashcard.currentIndex++;
      } else {
        Confetti.fire(60);
        Sound.fanfare();
        showToast("Deck complete! Great job mastering these student names!", "success");
        state.flashcard.currentIndex = 0;
        state.flashcard.queue = shuffleArray(getFilteredStudents());
      }

      state.flashcard.isFlipped = false;
      renderFlashcard();
    };

    state.flashcard.isAdvancing = true;
    state.flashcard.isFlipped = false;

    // Keep the current student's back-face content in place until the card has
    // returned to its photo side, so the next student's name is never exposed.
    if (!cardInner || !cardInner.classList.contains("flipped")) {
      finishAdvance();
      return;
    }

    cardInner.classList.add("advancing");
    cardInner.addEventListener("transitionend", finishAdvance, { once: true });
    cardInner.classList.remove("flipped");
    window.setTimeout(finishAdvance, 140);
  }

  // ==========================================
  // 9. MODE 2: MULTIPLE CHOICE QUIZ
  // ==========================================
  function initMultipleChoiceMode() {
    const pool = getFilteredStudents();
    state.mcQuiz.queue = shuffleArray(pool);
    state.mcQuiz.currentIndex = 0;
    state.mcQuiz.score = 0;
    state.mcQuiz.streak = 0;
    state.mcQuiz.isAnswered = false;
    renderMultipleChoiceQuestion();
  }

  function renderMultipleChoiceQuestion() {
    const quizArea = document.getElementById("mc-render-area");
    const emptyState = document.getElementById("mc-empty-state");
    const hudScore = document.getElementById("mc-hud-score");
    const hudStreak = document.getElementById("mc-hud-streak");
    const hudProgress = document.getElementById("mc-hud-progress");
    const photo = document.getElementById("mc-question-photo");
    const avatar = document.getElementById("mc-question-avatar");
    const optionsGrid = document.getElementById("mc-options-grid");
    const nextBtn = document.getElementById("mc-next-btn");

    const queue = state.mcQuiz.queue;
    if (!queue || queue.length === 0) {
      if (quizArea) quizArea.style.display = "none";
      if (emptyState) emptyState.style.display = "block";
      return;
    }

    if (quizArea) quizArea.style.display = "block";
    if (emptyState) emptyState.style.display = "none";
    if (nextBtn) nextBtn.style.display = "none";

    const currentStudent = queue[state.mcQuiz.currentIndex];
    state.mcQuiz.isAnswered = false;

    if (hudScore) hudScore.textContent = `Score: ${state.mcQuiz.score}`;
    if (hudStreak) hudStreak.textContent = `🔥 ${state.mcQuiz.streak}`;
    if (hudProgress) hudProgress.textContent = `${state.mcQuiz.currentIndex + 1} / ${queue.length}`;

    renderStudentPhoto(photo, avatar, currentStudent);

    const sameGradeDistractors = state.students.filter(
      (s) => s.id !== currentStudent.id && s.grade === currentStudent.grade
    );
    const otherDistractors = state.students.filter(
      (s) => s.id !== currentStudent.id && s.grade !== currentStudent.grade
    );

    const distractorPool = shuffleArray([...sameGradeDistractors, ...otherDistractors]);
    const choices = shuffleArray([currentStudent, ...distractorPool.slice(0, 3)]);
    const repeatedChoiceNames = getRepeatedDisplayNames(choices);
    state.mcQuiz.currentOptions = choices;

    if (optionsGrid) {
      optionsGrid.innerHTML = choices
        .map((choice, i) => {
          const letter = ["A", "B", "C", "D"][i];
          return `
            <button class="mc-option-btn" data-id="${choice.id}" aria-keyshortcuts="${letter}" title="Press ${letter}">
              <span class="opt-badge">${letter}</span>
              <span class="opt-text-wrap">
                <span class="opt-text">${choice.name}</span>
                ${repeatedChoiceNames.has(choice.name) ? `<span class="opt-student-id">ID ${choice.studentId}</span>` : ""}
              </span>
            </button>
          `;
        })
        .join("");

      optionsGrid.querySelectorAll(".mc-option-btn").forEach((btn) => {
        btn.addEventListener("click", () => handleMultipleChoiceSelect(btn.dataset.id, currentStudent));
      });
    }
  }

  function handleMultipleChoiceSelect(selectedId, currentStudent) {
    if (state.mcQuiz.isAnswered) return;
    state.mcQuiz.isAnswered = true;

    const isCorrect = selectedId === currentStudent.id;
    const optionBtns = document.querySelectorAll(".mc-option-btn");
    const nextBtn = document.getElementById("mc-next-btn");

    optionBtns.forEach((btn) => {
      btn.classList.add("disabled");
      if (btn.dataset.id === currentStudent.id) {
        btn.classList.add("correct");
      } else if (btn.dataset.id === selectedId && !isCorrect) {
        btn.classList.add("wrong");
      }
    });

    if (isCorrect) {
      Sound.correct();
      state.mcQuiz.score += 10 + state.mcQuiz.streak * 2;
      state.mcQuiz.streak += 1;
      if (state.mcQuiz.streak > state.mcQuiz.bestStreak) {
        state.mcQuiz.bestStreak = state.mcQuiz.streak;
      }
      if (state.mcQuiz.streak % 5 === 0) Confetti.fire(35);
    } else {
      Sound.wrong();
      state.mcQuiz.streak = 0;
    }

    if (!currentStudent.stats) currentStudent.stats = { reviews: 0, correct: 0, mastery: 1 };
    currentStudent.stats.reviews += 1;
    if (isCorrect) currentStudent.stats.correct += 1;
    saveStudentStats();
    updateHeaderStats();

    const hudScore = document.getElementById("mc-hud-score");
    const hudStreak = document.getElementById("mc-hud-streak");
    if (hudScore) hudScore.textContent = `Score: ${state.mcQuiz.score}`;
    if (hudStreak) hudStreak.textContent = `🔥 ${state.mcQuiz.streak}`;

    if (nextBtn) {
      nextBtn.style.display = "block";
      nextBtn.focus();
    }
  }

  function nextMultipleChoiceQuestion() {
    if (state.mcQuiz.currentIndex < state.mcQuiz.queue.length - 1) {
      state.mcQuiz.currentIndex++;
      renderMultipleChoiceQuestion();
    } else {
      Sound.fanfare();
      Confetti.fire(70);
      showToast(`Quiz completed! Final Score: ${state.mcQuiz.score}`, "success");
      initMultipleChoiceMode();
    }
  }

  // ==========================================
  // 10. MODE 3: TYPE-IN NAME SPELLING
  // ==========================================
  function initTypeRecallMode() {
    const pool = getFilteredStudents();
    state.typeQuiz.queue = shuffleArray(pool);
    state.typeQuiz.currentIndex = 0;
    state.typeQuiz.score = 0;
    state.typeQuiz.total = pool.length;
    state.typeQuiz.hintsUsed = 0;
    state.typeQuiz.isSubmitted = false;
    renderTypeQuestion();
  }

  function renderTypeQuestion() {
    const container = document.getElementById("type-render-area");
    const emptyState = document.getElementById("type-empty-state");
    const photo = document.getElementById("type-photo");
    const avatar = document.getElementById("type-avatar");
    const gradeBadge = document.getElementById("type-grade-badge");
    const input = document.getElementById("type-input-box");
    const hintBox = document.getElementById("type-hint-box");
    const progress = document.getElementById("type-progress-text");
    const submitBtn = document.getElementById("type-submit-btn");

    const queue = state.typeQuiz.queue;
    if (!queue || queue.length === 0) {
      if (container) container.style.display = "none";
      if (emptyState) emptyState.style.display = "block";
      return;
    }

    if (container) container.style.display = "block";
    if (emptyState) emptyState.style.display = "none";

    const student = queue[state.typeQuiz.currentIndex];
    state.typeQuiz.isSubmitted = false;
    state.typeQuiz.hintsUsed = 0;

    renderStudentPhoto(photo, avatar, student);

    if (gradeBadge) {
      gradeBadge.textContent = `Grade ${student.grade}`;
      gradeBadge.setAttribute("data-grade", student.grade);
    }
    if (progress) progress.textContent = `Student ${state.typeQuiz.currentIndex + 1} of ${queue.length}`;
    if (input) {
      input.value = "";
      input.disabled = false;
      input.focus();
    }
    if (hintBox) hintBox.textContent = "";
    if (submitBtn) submitBtn.textContent = "Check Answer";
  }

  function cleanString(str) {
    return (str || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .trim();
  }

  function checkTypeAnswer() {
    const queue = state.typeQuiz.queue;
    if (!queue || queue.length === 0) return;
    const student = queue[state.typeQuiz.currentIndex];
    const input = document.getElementById("type-input-box");
    const hintBox = document.getElementById("type-hint-box");
    const submitBtn = document.getElementById("type-submit-btn");

    if (state.typeQuiz.isSubmitted) {
      if (state.typeQuiz.currentIndex < queue.length - 1) {
        state.typeQuiz.currentIndex++;
        renderTypeQuestion();
      } else {
        Sound.fanfare();
        Confetti.fire(70);
        showToast(`Spelling complete! Correct: ${state.typeQuiz.score} / ${queue.length}`, "success");
        initTypeRecallMode();
      }
      return;
    }

    const userInput = cleanString(input ? input.value : "");
    if (!userInput) {
      showToast("Please type a name first!", "info");
      return;
    }

    const targetFull = cleanString(student.name);
    const targetRoster = cleanString(student.rosterName);
    const targetFirst = cleanString(student.name.split(" ")[0]);
    const targetLast = cleanString(student.name.split(" ").slice(1).join(" "));

    const isMatch =
      userInput === targetFull ||
      userInput === targetRoster ||
      userInput === targetFirst ||
      userInput === targetLast;

    state.typeQuiz.isSubmitted = true;
    if (input) input.disabled = true;

    if (isMatch) {
      Sound.correct();
      state.typeQuiz.score++;
      if (hintBox) {
        hintBox.innerHTML = `✨ Correct! Name: <strong>${student.name}</strong>`;
        hintBox.style.color = "var(--success)";
      }
      if (submitBtn) submitBtn.textContent = "Next Student ➔";
    } else {
      Sound.wrong();
      if (hintBox) {
        hintBox.innerHTML = `❌ Expected: <strong>${student.name}</strong> (You typed: "${input.value}")`;
        hintBox.style.color = "var(--danger)";
      }
      if (submitBtn) submitBtn.textContent = "Next Student ➔";
    }
  }

  function showTypeHint() {
    Sound.click();
    const queue = state.typeQuiz.queue;
    if (!queue || queue.length === 0) return;
    const student = queue[state.typeQuiz.currentIndex];
    const hintBox = document.getElementById("type-hint-box");

    state.typeQuiz.hintsUsed++;
    const nameParts = student.name.split(" ");
    const firstName = nameParts[0];

    if (state.typeQuiz.hintsUsed === 1) {
      hintBox.innerHTML = `💡 Hint 1: Starts with '<strong>${firstName[0]}</strong>' (${student.name.length} letters). Grade: <strong>${student.grade}</strong>`;
    } else if (state.typeQuiz.hintsUsed === 2) {
      hintBox.innerHTML = `💡 Hint 2: First Name is <strong>${firstName}</strong>.`;
    } else {
      hintBox.innerHTML = `💡 Full Name: <strong>${student.name}</strong>`;
    }
  }

  // ==========================================
  // 11. MODE 4: SPEED MATCH GAME
  // ==========================================
  function initSpeedMatchMode() {
    const pool = getFilteredStudents();
    const count = Math.min(6, pool.length);

    if (count < 2) {
      showToast("Need at least 2 students to play Speed Match!", "warning");
      return;
    }

    const selectedStudents = shuffleArray(pool).slice(0, count);
    const repeatedRoundNames = getRepeatedDisplayNames(selectedStudents);

    const photoTiles = selectedStudents.map((s) => ({
      id: s.id,
      type: "photo",
      content: s.photo,
      hasPhoto: s.hasPhoto,
      photoMissing: s.photoMissing,
      grade: s.grade,
      name: s.name
    }));

    const nameTiles = selectedStudents.map((s) => ({
      id: s.id,
      type: "name",
      content: s.name,
      grade: s.grade,
      showId: repeatedRoundNames.has(s.name)
    }));

    const combinedTiles = shuffleArray([...photoTiles, ...nameTiles]);

    state.speedMatch = {
      tiles: combinedTiles,
      selectedTile: null,
      matchedCount: 0,
      totalPairs: count,
      startTime: Date.now(),
      timerInterval: null,
      elapsedSeconds: 0,
      isComplete: false
    };

    renderSpeedMatchBoard();
    startSpeedMatchTimer();
  }

  function startSpeedMatchTimer() {
    if (state.speedMatch.timerInterval) clearInterval(state.speedMatch.timerInterval);
    const timerElem = document.getElementById("speed-timer-display");

    state.speedMatch.timerInterval = setInterval(() => {
      state.speedMatch.elapsedSeconds = Math.floor((Date.now() - state.speedMatch.startTime) / 1000);
      const mins = String(Math.floor(state.speedMatch.elapsedSeconds / 60)).padStart(2, "0");
      const secs = String(state.speedMatch.elapsedSeconds % 60).padStart(2, "0");
      if (timerElem) timerElem.textContent = `⏱️ ${mins}:${secs}`;
    }, 1000);
  }

  function renderSpeedMatchBoard() {
    const grid = document.getElementById("speed-match-grid");
    if (!grid) return;

    grid.innerHTML = state.speedMatch.tiles
      .map((tile, idx) => {
        if (tile.type === "photo") {
          return `
            <div class="match-tile" data-idx="${idx}" data-id="${tile.id}" data-type="photo">
              ${
                tile.hasPhoto && tile.content
                  ? `<img src="${tile.content}" class="tile-photo" alt="Student photo" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'; this.nextElementSibling.classList.add('photo-missing');" />
                     <div class="tile-avatar" style="display:none;">${getInitials(tile.name)}</div>`
                  : `<div class="tile-avatar${tile.photoMissing ? " photo-missing" : ""}">${getInitials(tile.name)}</div>`
              }
              <span class="grade-badge" data-grade="${tile.grade}">Gr ${tile.grade}</span>
            </div>
          `;
        } else {
          return `
            <div class="match-tile" data-idx="${idx}" data-id="${tile.id}" data-type="name">
              <span class="tile-name-text">${tile.content}</span>
              ${tile.showId ? `<span class="tile-student-id">ID ${tile.id}</span>` : ""}
            </div>
          `;
        }
      })
      .join("");

    grid.querySelectorAll(".match-tile").forEach((tileElem) => {
      tileElem.addEventListener("click", () => handleTileClick(tileElem));
    });
  }

  function handleTileClick(tileElem) {
    if (tileElem.classList.contains("matched")) return;
    const tileIdx = parseInt(tileElem.dataset.idx, 10);
    const tileData = state.speedMatch.tiles[tileIdx];

    Sound.click();

    if (!state.speedMatch.selectedTile) {
      state.speedMatch.selectedTile = { element: tileElem, data: tileData };
      tileElem.classList.add("selected");
      return;
    }

    if (state.speedMatch.selectedTile.element === tileElem) {
      tileElem.classList.remove("selected");
      state.speedMatch.selectedTile = null;
      return;
    }

    const prev = state.speedMatch.selectedTile;

    if (prev.data.id === tileData.id && prev.data.type !== tileData.type) {
      Sound.correct();
      prev.element.classList.remove("selected");
      prev.element.classList.add("matched");
      tileElem.classList.add("matched");
      state.speedMatch.matchedCount++;
      state.speedMatch.selectedTile = null;

      if (state.speedMatch.matchedCount >= state.speedMatch.totalPairs) {
        clearInterval(state.speedMatch.timerInterval);
        Sound.fanfare();
        Confetti.fire(80);
        showToast(`Matched all pairs in ${state.speedMatch.elapsedSeconds}s! Fantastic!`, "success");
      }
    } else {
      Sound.wrong();
      tileElem.classList.add("selected");
      setTimeout(() => {
        prev.element.classList.remove("selected");
        tileElem.classList.remove("selected");
        state.speedMatch.selectedTile = null;
      }, 400);
    }
  }

  // ==========================================
  // 12. DIRECTORY & STUDENT ROSTER
  // ==========================================
  function renderDirectory() {
    const grid = document.getElementById("directory-grid");
    const countDisplay = document.getElementById("roster-count-display");
    const students = getFilteredStudents();

    if (countDisplay) {
      countDisplay.textContent = `Showing ${students.length.toLocaleString()} of ${state.students.length.toLocaleString()} students`;
    }

    if (!grid) return;

    if (students.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
          <h3>No students found</h3>
          <p>Try adjusting your search or grade filter.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = students
      .map((s) => {
        const mastery = s.stats ? s.stats.mastery || 1 : 1;
        const pct = (mastery / 5) * 100;
        return `
          <div class="student-card" data-id="${s.id}">
            <div class="card-photo-wrapper">
              ${
                s.hasPhoto && s.photo
                  ? `<img src="${s.photo}" alt="${s.name}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'; this.nextElementSibling.classList.add('photo-missing');" />
                     <div class="avatar-fallback" style="display:none;">${getInitials(s.name)}</div>`
                  : `<div class="avatar-fallback${s.photoMissing ? " photo-missing" : ""}">${getInitials(s.name)}</div>`
              }
              <div class="card-grade-badge grade-badge" data-grade="${s.grade}">Grade ${s.grade}</div>
            </div>
              <div class="student-card-body">
                <div class="card-student-name">${s.name}</div>
                ${s.rosterName && s.rosterName !== s.name ? `<div class="card-student-nick">${s.rosterName}</div>` : ""}
                ${s.advisoryTeacher ? `<div class="card-advisory">Advisory: ${s.advisoryTeacher}</div>` : ""}
                ${s.studentId ? `<div class="card-student-id">ID ${s.studentId}</div>` : ""}
                
                <div class="card-tags-list" aria-label="Tags">
                ${(s.tags || []).map((t) => `<span class="tag-pill">${t}</span>`).join("")}
              </div>

              <div class="mastery-meter-bar" title="Mastery: ${mastery}/5">
                <div class="mastery-fill" style="width: ${pct}%"></div>
              </div>
            </div>

            <div class="card-actions-bar">
              <button class="card-action-btn btn-speak" data-name="${s.name}" title="Pronounce Name">
                🔊 Pronounce
              </button>
            </div>
          </div>
        `;
      })
      .join("");

    grid.querySelectorAll(".btn-speak").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        speakName(btn.dataset.name);
      });
    });
  }

  // ==========================================
  // 13. UI UPDATES & TAB NAVIGATION
  // ==========================================
  function updateHeaderStats() {
    const totalElem = document.getElementById("stat-total-students");
    const masteryElem = document.getElementById("stat-mastery-percent");
    const allGradesButton = document.querySelector('.grade-pill[data-grade="all"]');

    if (totalElem) totalElem.textContent = state.students.length.toLocaleString();
    if (allGradesButton) allGradesButton.textContent = `All Grades (${state.students.length.toLocaleString()})`;

    if (masteryElem && state.students.length > 0) {
      const mastered = state.students.filter((s) => s.stats && s.stats.mastery >= 4).length;
      const pct = Math.round((mastered / state.students.length) * 100);
      masteryElem.textContent = `${pct}% Mastered`;
    }
  }

  function switchTab(tabName) {
    Sound.click();
    state.currentTab = tabName;

    document.querySelectorAll(".nav-tab").forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.tab === tabName);
    });

    document.querySelectorAll(".view-section").forEach((sec) => {
      sec.classList.toggle("active", sec.id === `section-${tabName}`);
    });

    initActiveTab();
  }

  function initActiveTab() {
    switch (state.currentTab) {
      case "flashcards":
        initFlashcardMode();
        break;
      case "multiple-choice":
        initMultipleChoiceMode();
        break;
      case "type-in":
        initTypeRecallMode();
        break;
      case "speed-match":
        initSpeedMatchMode();
        break;
      case "directory":
        renderDirectory();
        break;
    }
  }

  function closeAllModals() {
    document.querySelectorAll(".modal-overlay").forEach((m) => m.classList.remove("open"));
  }

  // ==========================================
  // 14. EVENT BINDINGS
  // ==========================================
  function setupEventListeners() {
    // Nav tabs
    document.querySelectorAll(".nav-tab").forEach((tab) => {
      tab.addEventListener("click", () => switchTab(tab.dataset.tab));
    });

    // Grade filters
    document.querySelectorAll(".grade-pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        Sound.click();
        document.querySelectorAll(".grade-pill").forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");
        state.activeGrade = pill.dataset.grade;
        initActiveTab();
      });
    });

    // Search
    const searchInput = document.getElementById("directory-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        state.searchQuery = e.target.value.trim();
        if (state.currentTab === "directory") {
          renderDirectory();
        }
      });
    }

    // Flashcards
    const flashcardContainer = document.getElementById("main-flashcard-container");
    if (flashcardContainer) {
      flashcardContainer.addEventListener("click", flipFlashcard);
    }

    document.querySelectorAll(".srs-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        recordSRSScore(parseInt(btn.dataset.level, 10));
      });
    });

    // Multiple Choice
    const mcNextBtn = document.getElementById("mc-next-btn");
    if (mcNextBtn) mcNextBtn.addEventListener("click", nextMultipleChoiceQuestion);

    // Type In
    const typeSubmitBtn = document.getElementById("type-submit-btn");
    const typeHintBtn = document.getElementById("type-hint-btn");
    const typeInput = document.getElementById("type-input-box");

    if (typeSubmitBtn) typeSubmitBtn.addEventListener("click", checkTypeAnswer);
    if (typeHintBtn) typeHintBtn.addEventListener("click", showTypeHint);
    if (typeInput) {
      typeInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") checkTypeAnswer();
      });
    }

    // Speed Match Restart
    const speedRestartBtn = document.getElementById("speed-restart-btn");
    if (speedRestartBtn) {
      speedRestartBtn.addEventListener("click", () => {
        Sound.click();
        initSpeedMatchMode();
      });
    }

    // Modals
    document.querySelectorAll(".modal-close-btn").forEach((btn) => {
      btn.addEventListener("click", closeAllModals);
    });

    document.querySelectorAll(".modal-overlay").forEach((overlay) => {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeAllModals();
      });
    });

    // Settings Modal
    const settingsBtn = document.getElementById("btn-open-settings");
    const settingsModal = document.getElementById("settings-modal");
    if (settingsBtn && settingsModal) {
      settingsBtn.addEventListener("click", () => {
        document.getElementById("settings-sound-toggle").checked = state.settings.soundEnabled;
        document.getElementById("settings-speech-toggle").checked = state.settings.speechEnabled;
        document.getElementById("settings-roster-status").textContent = "";
        updateRosterSummary();
        settingsModal.classList.add("open");
      });
    }

    const clearProgressBtn = document.getElementById("btn-clear-progress");
    if (clearProgressBtn) clearProgressBtn.addEventListener("click", clearProgress);

    // Theme Toggle
    const themeToggleBtn = document.getElementById("btn-toggle-theme");
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener("click", () => {
        Sound.click();
        state.settings.theme = state.settings.theme === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", state.settings.theme);
        saveSettingsToStorage();
        showToast(`Theme changed to ${state.settings.theme} mode.`, "info");
      });
    }

    const saveSettingsForm = document.getElementById("settings-form");
    if (saveSettingsForm) {
      saveSettingsForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        state.settings.soundEnabled = document.getElementById("settings-sound-toggle").checked;
        state.settings.speechEnabled = document.getElementById("settings-speech-toggle").checked;

        saveSettingsToStorage();
        closeAllModals();
      });
    }

    // Keyboard Shortcuts
    window.addEventListener("keydown", (e) => {
      if (document.querySelector(".modal-overlay.open")) {
        if (e.key === "Escape") closeAllModals();
        return;
      }

      if (state.currentTab === "flashcards") {
        if (e.code === "Space") {
          e.preventDefault();
          flipFlashcard();
        } else if (e.key === "1") {
          recordSRSScore(1);
        } else if (e.key === "2") {
          recordSRSScore(2);
        } else if (e.key === "3") {
          recordSRSScore(3);
        } else if (e.key === "4") {
          recordSRSScore(4);
        }
      } else if (state.currentTab === "multiple-choice") {
        const answerIndex = ["a", "b", "c", "d"].indexOf(e.key.toLowerCase());

        if (!state.mcQuiz.isAnswered && answerIndex >= 0) {
          const optionButtons = document.querySelectorAll(".mc-option-btn");
          if (optionButtons[answerIndex]) {
            e.preventDefault();
            optionButtons[answerIndex].click();
          }
        } else if (state.mcQuiz.isAnswered && (e.key === "Enter" || e.code === "Space")) {
          e.preventDefault();
          nextMultipleChoiceQuestion();
        }
      }
    });
  }

  // ==========================================
  // 15. BOOTSTRAP
  // ==========================================
  document.addEventListener("DOMContentLoaded", async () => {
    setupRosterImportControls();
    try {
      await loadStateFromStorage();
      const rosterScreen = document.getElementById("lock-screen");
      if (rosterScreen) rosterScreen.classList.add("hidden");
      setupEventListeners();
      updateHeaderStats();
      Confetti.init();
      initActiveTab();
    } catch (error) {
      showRosterImport(error);
    }
  });
})();
