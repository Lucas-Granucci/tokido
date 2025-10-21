class App {
  constructor() {
    this.currentPage = "tasks";
    this.taskManager = null;
    this.calendarManager = null;
    this.init();
  }

  async init() {
    this.bindNavigation();
    this.bindSidebarEvents();
    await this.loadPage("tasks");
  }

  bindNavigation() {
    const navButtons = document.querySelectorAll(".nav-btn");
    navButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const page = e.target.closest(".nav-btn").getAttribute("data-page");
        this.loadPage(page);
      });
    });
  }

  bindSidebarEvents() {
    const newTaskButton = document.getElementById("toggleTaskForm");
    if (newTaskButton) {
      newTaskButton.addEventListener("click", () => {
        this.toggleNewTaskForm();
      });
    }

    const newEventButton = document.getElementById("toggleEventForm");
    if (newEventButton) {
      newEventButton.addEventListener("click", () => {
        this.toggleNewEventForm();
      });
    }
  }

  toggleNewTaskForm() {
    if (this.currentPage === "tasks") {
      const newTaskForm = document.getElementById("newTaskForm");
      if (newTaskForm) {
        newTaskForm.classList.toggle("hidden");
      }
    } else {
      this.loadPage("tasks").then(() => {
        // Small delay to ensure form is loaded
        setTimeout(() => {
          const newTaskForm = document.getElementById("newTaskForm");
          if (newTaskForm) {
            newTaskForm.classList.toggle("hidden");
          }
        }, 50);
      });
    }
  }

  toggleNewEventForm() {
    if (this.currentPage === "calendar") {
      const newEventForm = document.getElementById("newEventForm");
      if (newEventForm) {
        newEventForm.classList.toggle("hidden");
      }
    } else {
      this.loadPage("calendar").then(() => {
        // Small delay to enure form is loaded
        setTimeout(() => {
          const newEventForm = document.getElementById("newEventForm");
          if (newEventForm) {
            newEventForm.classList.toggle("hidden");
          }
        }, 50);
      });
    }
  }

  async loadPage(pageName) {
    try {
      // Show loading state
      document.getElementById("main-content").innerHTML = `
        <div class="text-center py-12 text-gray-500">
          <i class="fas fa-spinner fa-spin text-4xl mb-4"></i>
          <p>Loading...</p>
        </div>
      `;

      // Load page content
      const response = await fetch(`pages/${pageName}.html`);
      if (!response.ok) {
        throw new Error(`Failed to load ${pageName}`);
      }

      const html = await response.text();
      document.getElementById("main-content").innerHTML = html;

      // Initialize page specific functionality
      await this.initializePage(pageName);

      this.updateNavigation(pageName);
      this.currentPage = pageName;
    } catch (error) {
      console.error("Error loading page:", error);
      document.getElementById("main-content").innerHTML = `
        <div class="text-center py-12 text-red-500">
          <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
          <p>Failed to load page</p>
        </div>
      `;
    }
  }
  async initializePage(pageName) {
    switch (pageName) {
      case "tasks":
        this.taskManager = new TaskManager();
        break;
      case "calendar":
        this.calendarManager = new CalendarManager();
        break;
      case "settings":
        this.initializeSettings();
        break;
    }
  }

  initializeSettings() {
    console.log("Settings page initialized");
  }

  updateNavigation(activePage) {
    const navButtons = document.querySelectorAll(".nav-btn");
    navButtons.forEach((button) => {
      const page = button.getAttribute("data-page");
      if (page === activePage) {
        button.classList.add("border-blue-500", "text-gray-900");
        button.classList.remove("border-transparent", "text-gray-500");
      } else {
        button.classList.remove("border-blue-500", "text-gray-900");
        button.classList.add("border-transparent", "text-gray-500");
      }
    });
  }
}

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  window.app = new App();
});
