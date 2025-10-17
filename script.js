class TaskManager {
  constructor() {
    this.timeOptions = {
      "<5 min": "#22C55E", // Green
      "<15 min": "#84CC16", // Lime
      "<30 min": "#EAB308", // Yellow
      "<1 hour": "#F97316", // Orange
      "<2 hours": "#EF4444", // Red
      "2+ hours": "#991B1B", // Dark red
    };

    this.categoryOptions = {
      School: "#2563EB", // Blue
      Research: "#7C3AED", // Purple
      Coding: "#0891B2", // Teal
      Personal: "#059669", // Emerald
      Work: "#D97706", // Amber
      Other: "#4B5563", // Gray
    };

    this.priorityOptions = {
      High: "#DC2626", // Red
      Medium: "#F59E0B", // Yellow
      Low: "#16A34A", // Green
    };

    this.buttons = document.querySelectorAll("button[data-view]");
    this.views = document.querySelectorAll(".view");
    this.addTaskButton = document.getElementById("addTaskButton");

    this.init();
  }

  init() {
    this.bindEvents();
    this.setActiveView("duration-view");
    this.updateAll();
  }

  bindEvents() {
    this.buttons.forEach((button) => {
      button.addEventListener("click", () => {
        this.setActiveView(button.dataset.view);
      });
    });

    this.addTaskButton.addEventListener("click", () => {
      this.handleAddTask();
    });

    document.addEventListener("click", (event) => {
      const removeButton = event.target.closest("[data-remove-task]");
      if (removeButton) {
        const taskId = parseInt(removeButton.dataset.removeTask);
        this.removeTask(taskId);
      }
    });
  }

  updateAll() {
    this.renderTaskViews();
    // this.updateStatistics();
    this.updateOverviewCounter();
    this.updateCategoryCounter();
  }

  // -------------------------- Utility Methods --------------------------
  escapeHTML(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#036;");
  }

  isOverdue(dueDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today;
  }

  isDueToday(dueDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const taskDate = new Date(dueDate);
    taskDate.setHours(0, 0, 0, 0);

    return today.getTime() === taskDate.getTime();
  }

  isDueThisWeek(dueDate) {
    const today = new Date();
    const taskDate = new Date(dueDate);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(today);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return taskDate >= startOfWeek && taskDate <= endOfWeek;
  }

  getTaskStatus(task) {
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    if (this.isOverdue(dueDate)) return "overdue";
    else if (this.isDueToday(dueDate)) return "dueToday";
    else if (this.isDueThisWeek(dueDate)) return "dueThisWeek";
    return "future";
  }

  getTaskData() {
    return JSON.parse(localStorage.getItem("task-data") || "[]");
  }

  saveTaskData(taskData) {
    localStorage.setItem("task-data", JSON.stringify(taskData));
  }

  // -------------------------- Render Management --------------------------
  renderTaskViews() {
    const task_data = this.getTaskData();

    const views = [
      ["dueDate-view"],
      ["duration-view", this.timeOptions, (task) => task.duration],
      ["category-view", this.categoryOptions, (task) => task.category],
      ["priority-view", this.priorityOptions, (task) => task.priority],
    ];

    views.forEach(([viewId, options, groubBy]) => {
      let grid;
      if (viewId === "dueDate-view") {
        grid = this.renderDueDateGrid(task_data);
      } else {
        const group = Object.groupBy(task_data, groubBy);
        grid = this.renderTaskGrid(options, group);
      }

      const taskView = document.getElementById(viewId);
      taskView.innerHTML = "";
      taskView.appendChild(grid);
    });
  }

  renderDueDateGrid(task_data) {
    const taskGrid = document.createElement("div");
    taskGrid.className = "grid grid-cols-3 gap-4";

    task_data.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    taskGrid.innerHTML = task_data
      .map((task) => {
        return this.renderTaskEntryHTML(task);
      })
      .join("");

    return taskGrid;
  }

  renderTaskGrid(options, taskGroup) {
    const taskGrid = document.createElement("div");
    taskGrid.className = "grid grid-cols-3 gap-4";

    taskGrid.innerHTML = Object.keys(options)
      .map((option) => {
        const tasks = taskGroup[option];

        return `
        <div class="rounded-xl bg-white border border-gray-200">
          <div class="border-b border-gray-200 p-3">
            <div class="flex justify-between items-center">
              <h3 class="font-semibold text-sm text-gray-800">${this.escapeHTML(option)}</h3>
              <p class="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">${tasks ? tasks.length : 0}</p>
            </div>
          </div>
          <div class="p-3 space-y-2">
            ${tasks ? tasks.map((task) => this.renderTaskEntryHTML(task)).join("") : "<p class='italic text-center text-gray-500'>No tasks</p>"}
          </div>
        </div>
      `;
      })
      .join("");

    return taskGrid;
  }

  renderTaskEntryHTML(task) {
    const categoryColor = this.categoryOptions[task.category];
    const priorityColor = this.priorityOptions[task.priority];
    const durationColor = this.timeOptions[task.duration];
    const dueDate = new Date(task.dueDate).toLocaleDateString("en-US", {
      timeZone: "UTC",
    });

    return `<div class="p-3 rounded-xl flex flex-row justify-center items-center bg-white border border-gray-200">
        <div class="flex-1 gap-2">
          <div class="flex justify-between items-baseline">
            <p class="font-medium text-sm text-gray-900 truncate mb-2">${task.name}</p>
            <button class="text-xl transition-colors hover:text-red-500" data-remove-task="${task.id}">&times</button>
          </div>
          <div class="flex flex-row gap-1 mb-2">
            <p class="px-1.5 py-0.5 bg-opacity-30 bg-[${categoryColor}] text-xs text-[${categoryColor}] rounded">${task.category}</p>
            <p class="px-1.5 py-0.5 bg-opacity-30 bg-[${priorityColor}] text-xs text-[${priorityColor}] rounded">${task.priority}</p>
            <p class="px-1.5 py-0.5 bg-opacity-30 bg-[${durationColor}] text-xs text-[${durationColor}] rounded">${task.duration}</p>
          </div>
          <p class="text-xs text-gray-500">${dueDate}</p>
        </div>
    </div>`;
  }

  // -------------------------- View Management --------------------------
  setActiveView(viewOption) {
    // Update button active style
    this.buttons.forEach((button) => {
      const isActive = viewOption === button.dataset.view;
      button.classList.toggle("border-2", isActive);
      button.classList.toggle("border-blue-500", isActive);
      button.classList.toggle("bg-blue-100", isActive);

      button.classList.toggle("hover:bg-blue-50", !isActive);
      button.classList.toggle("border", !isActive);
      button.classList.toggle("border-gray-200", !isActive);
      button.classList.toggle("bg-white", !isActive);
      button.classList.toggle("hover:border-gray-300", !isActive);
    });

    // Show selected view
    this.views.forEach((view) => {
      view.classList.toggle("hidden", view.id !== viewOption);
    });

    this.updateAll();
  }

  // -------------------------- Task Management --------------------------
  createTask() {
    // Get values from HTML components
    const name = document.getElementById("taskName").value;
    const category = document.getElementById("taskCategory").value;
    const priority = document.getElementById("taskPriority").value;
    const duration = document.getElementById("taskDuration").value;
    const dueDate = document.getElementById("taskDueDate").value;

    const newTask = {
      id: Date.now(),
      name: name,
      category: category,
      priority: priority,
      duration: duration,
      dueDate: new Date(dueDate),
    };

    // Clear input fields
    this.clearInputFields();

    return newTask;
  }

  clearInputFields() {
    document.getElementById("taskName").value = "";
    document.getElementById("taskCategory").value = Object.keys(
      this.categoryOptions,
    )[0];
    document.getElementById("taskPriority").value = Object.keys(
      this.priorityOptions,
    )[0];
    document.getElementById("taskDuration").value = Object.keys(
      this.timeOptions,
    )[0];
  }

  handleAddTask() {
    const newTask = this.createTask();
    this.addTask(newTask);
  }

  addTask(new_task) {
    const task_data = this.getTaskData();
    task_data.push(new_task);
    this.saveTaskData(task_data);
    this.updateAll();
  }

  removeTask(task_id) {
    const task_data = this.getTaskData();
    const new_task_data = task_data.filter((task) => task.id !== task_id);
    this.saveTaskData(new_task_data);
    this.updateAll();
  }

  // -------------------------- Statistics Management --------------------------
  updateOverviewCounter() {
    const task_data = this.getTaskData();
    const overviewStatsView = document.getElementById("overviewStats");

    const overviewStats = this.getOverviewStatistics();
    const overviewColorMap = {
      "Total Tasks": "blue-500",
      "Due This Week": "green-500",
      "Due Today": "yellow-500",
      Overdue: "red-500",
    };

    overviewStatsView.innerHTML = Object.keys(overviewStats)
      .map((statistic) => {
        const statisticValue = overviewStats[statistic];
        const statisticColor = overviewColorMap[statistic];
        return `
          <div class="flex justify-between items-center px-2">
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full bg-${statisticColor} mr-3"></div>
              <span>${statistic}</span>
            </div>
            <div class="px-2 py-1 rounded-full text-xs bg-opacity-25 bg-${statisticColor} text-${statisticColor}">${statisticValue}</div>
          </div>
        `;
      })
      .join("");
  }
  updateCategoryCounter() {
    const task_data = this.getTaskData();
    const categoryStatsView = document.getElementById("categoryStats");

    const categoryGroups = Object.groupBy(task_data, (task) => task.category);

    categoryStatsView.innerHTML = Object.keys(this.categoryOptions)
      .map((category) => {
        const numCategoryTasks = categoryGroups[category]
          ? categoryGroups[category].length
          : 0;
        const categoryColor = this.categoryOptions[category];

        return `
          <div class="flex justify-between items-center px-2">
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full bg-[${categoryColor}] mr-3"></div>
              <span>${category}</span>
            </div>
            <div class="px-2 py-1 rounded-full text-xs bg-opacity-25 bg-[${categoryColor}] text-[${categoryColor}]">${numCategoryTasks}</div>
          </div>
        `;
      })
      .join("");
  }

  getOverviewStatistics() {
    const task_data = this.getTaskData();
    let overdue = 0;
    let dueToday = 0;
    let dueThisWeek = 0;

    task_data.forEach((task) => {
      const taskStatus = this.getTaskStatus(task);
      if (taskStatus == "overdue") overdue++;
      else if (taskStatus == "dueToday") dueToday++;
      else if (taskStatus == "dueThisWeek") dueThisWeek++;
    });

    return {
      "Total Tasks": task_data.length,
      "Due This Week": dueThisWeek + dueToday,
      "Due Today": dueToday,
      Overdue: overdue,
    };
  }
}

// Initialize task TaskManager
const taskManager = new TaskManager();
