import "../components/ModalManager.js";

class App {
  constructor() {
    this.currentPage = "tasks";
    this.taskManager = null;
    this.calendarManager = null;
    this.init();
  }

  async init() {
    ModalManager.init();
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
    document.addEventListener("click", (e) => {
      if (
        e.target.id === "showTaskModal" ||
        e.target.closest("#showTaskModal")
      ) {
        this.showNewTaskModal();
      }

      if (
        e.target.id === "showEventModal" ||
        e.target.closest("#showEventModal")
      ) {
        this.showNewEventModal();
      }
    });
  }

  showNewTaskModal() {
    if (this.currentPage === "tasks") {
      ModalManager.show("taskModal");
    } else {
      this.loadPage("tasks").then(() => {
        setTimeout(() => {
          ModalManager.show("taskModal");
        }, 50);
      });
    }
  }

  showNewEventModal() {
    if (this.currentPage === "calendar") {
      ModalManager.show("eventModal");
    } else {
      this.loadPage("calendar").then(() => {
        setTimeout(() => {
          ModalManager.show("eventModal");
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
