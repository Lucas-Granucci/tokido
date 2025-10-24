import { modalTemplates } from "./modals.js";

class ModalManager {
  static init() {
    // Inject all modals into DOM
    Object.values(modalTemplates).forEach((template) => {
      document.body.insertAdjacentHTML("beforeend", template);
    });

    this.bindGlobalEvents();
  }

  static bindGlobalEvents() {
    // Global cancel buttons
    document.addEventListener("click", (e) => {
      if (
        e.target.id === "cancelNewTaskButton" ||
        e.target.id === "cancelNewEventButton" ||
        e.target.id === "addTaskButton" ||
        e.target.id === "addEventButton"
      ) {
        this.hideAll();
      }
    });

    // Close modal when clicking background
    document.addEventListener("click", (e) => {
      if (
        e.target.classList.contains("fixed") &&
        e.target.classList.contains("inset-0")
      ) {
        this.hideAll();
      }
    });

    // Close modal with Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.hideAll();
      }
    });
  }

  static show(modalId) {
    this.hideAll();
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove("hidden");
      const firstInput = modal.querySelector("input, select, textarea");
      if (firstInput) firstInput.focus();
    } else {
      console.warn(`Modal with id ${modalId} not found`);
    }
  }

  static hide(modalId) {
    document.getElementById(modalId)?.classList.add("hidden");
  }

  static hideAll() {
    document.querySelectorAll(".modal").forEach((modal) => {
      modal.classList.add("hidden");
    });
  }
}

window.ModalManager = ModalManager;
