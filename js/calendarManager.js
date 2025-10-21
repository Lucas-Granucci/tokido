class CalendarManager {
  constructor() {
    this.currentDate = new Date();
    this.init();
  }

  init() {
    this.bindEvents();
    this.updateAll();
  }

  bindEvents() {
    const prevButton = document.getElementById("calendarPrev");
    const nextButton = document.getElementById("calendarNext");
    const newEventButton = document.getElementById("newEventButton");
    const allDayToggle = document.getElementById("eventAllDay");
    const multiDayToggle = document.getElementById("eventMultiDay");

    if (prevButton) {
      prevButton.addEventListener("click", () => {
        this.previousMonth();
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", () => {
        this.nextMonth();
      });
    }

    if (newEventButton) {
      newEventButton.addEventListener("click", () => {
        this.handleNewEvent();
      });
    }

    if (allDayToggle) {
      allDayToggle.addEventListener("click", (e) => {
        this.toggleTimeInputs(!e.target.checked);
      });
    }

    if (multiDayToggle) {
      multiDayToggle.addEventListener("click", (e) => {
        this.toggleEndDateInput(e.target.checked);
      });
    }
  }

  updateAll() {
    this.currentDate = new Date();
    this.renderCalendar();
  }

  // -------------------------- Utility Methods --------------------------
  previousMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.renderCalendar();
  }

  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.renderCalendar();
  }

  toggleTimeInputs(show) {
    const timeInputs = document.getElementById("timeFields");
    if (timeInputs) {
      timeInputs.classList.toggle("hidden", !show);
    }
  }

  toggleEndDateInput(show) {
    const endDateInput = document.getElementById("eventEndDateField");
    if (endDateInput) {
      endDateInput.classList.toggle("hidden", !show);
    }
    const startDateLabel = document.getElementById("eventStartDateLabel");
    startDateLabel.textContent = show ? "Start Date" : "Date";
  }
  getEventData() {
    return JSON.parse(localStorage.getItem("tokidoEvents") || "[]");
  }

  saveEventData(eventData) {
    localStorage.setItem("tokidoEvents", JSON.stringify(eventData));
  }

  // ------------------------- Render Management --------------------------
  renderCalendar() {
    const calendarContainer = document.getElementById("calendar");
    if (!calendarContainer) return;

    // Update year/month display
    const monthYearElement = document.getElementById("current-month");
    if (monthYearElement) {
      monthYearElement.textContent = this.currentDate.toLocaleDateString(
        "en-US",
        {
          month: "long",
          year: "numeric",
        },
      );
    }

    calendarContainer.innerHTML = this.generateCalendarHTML();
  }

  generateCalendarHTML() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDay = firstDay.getDay(); // 0 = Sunday
    const daysInMonth = lastDay.getDate();

    const today = new Date();
    const isToday = (day) => {
      return (
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear()
      );
    };

    let calendarHTML = `
      <div class="grid grid-cols-7 gap-1 mb-4">
        <div class="p-2 text-center text-sm font-medium text-gray-500">Sun</div>
        <div class="p-2 text-center text-sm font-medium text-gray-500">Mon</div>
        <div class="p-2 text-center text-sm font-medium text-gray-500">Tue</div>
        <div class="p-2 text-center text-sm font-medium text-gray-500">Wed</div>
        <div class="p-2 text-center text-sm font-medium text-gray-500">Thu</div>
        <div class="p-2 text-center text-sm font-medium text-gray-500">Fri</div>
        <div class="p-2 text-center text-sm font-medium text-gray-500">Sat</div>
      </div>
      <div class="grid grid-cols-7">
    `;

    // Empty starting days
    for (let i = 0; i < startingDay; i++) {
      calendarHTML += `<div class="h-28 p-1 bg-gray-50"></div>`;
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const targetDate = new Date(year, month, day);
      const dayEvents = this.getEventsForDay(year, month, day);

      const multiDayEvents = dayEvents.filter((event) => event.multiDay);
      const singleDayEvents = dayEvents.filter((event) => !event.multiDay);

      const todayStyling = isToday(day)
        ? "text-blue-600 font-semibold rounded-lg text-white bg-blue-600"
        : "text-gray-900";

      calendarHTML += `
        <div class="h-28 border ">
          <div class="flex justify-between items-start">
            <span class="text-sm p-1 font-medium ${todayStyling}">${day}</span>
          </div>

          <!-- Multi-Day Events Section -->
          <div class="space-y-1 max-h-16 overflow-y-auto overflow-x-visible">
           ${multiDayEvents.map((event) => this.renderMultiDayEventHTML(event, targetDate)).join("")} 
          </div>

          <!-- Single-Day Events Section -->
          <div class="mt-1 space-y-1 max-h-16 overflow-y-auto">
           ${singleDayEvents.map((event) => this.renderSingleDayEventHTML(event)).join("")} 
          </div>
        </div>
        
      `;
    }

    calendarHTML += "</div>";
    return calendarHTML;
  }

  getEventsForDay(year, month, day) {
    // Format target date as YYYY-MM-DD
    const targetDate = new Date(year, month, day);
    const targetDateStr = targetDate.toISOString().split("T")[0];

    const eventData = this.getEventData();

    return eventData.filter((event) => {
      const startDateStr = event.startDate.split("T")[0];
      const endDateStr = event.endDate.split("T")[0];

      return startDateStr <= targetDateStr && targetDateStr <= endDateStr;
    });
  }

  renderSingleDayEventHTML(event) {
    const timeDisplay = event.allDay
      ? ""
      : `<span class="text-xs opacity-75">${event.startTime}</span>`;

    return `
      <div class="text-xs p-1 bg-blue-100 text-blue-500 rounded truncate cursor-pointer hover:bg-opacity-80" onclick="">${timeDisplay} ${event.name}</div>
    `;
  }

  renderMultiDayEventHTML(event, currentDay) {
    const currentDate = currentDay;

    // Convert to YYYY-MM-DD for comparison
    const eventStartStr = event.startDate.split("T")[0];
    const eventEndStr = event.endDate.split("T")[0];
    const currentDateStr = currentDate.toISOString().split("T")[0];

    // Determine event positioning and styling
    let positionClass = "";
    let text = event.name;

    const timeDisplay = event.allDay
      ? ""
      : `<span class="text-xs opacity-75">${event.startTime}</span>`;

    if (currentDateStr === eventStartStr) {
      // First day of multi-day event
      positionClass = "rounded-r-none border-r-0";
      text = `${timeDisplay} ${event.name}`;
    } else if (currentDateStr === eventEndStr) {
      // Last day of multi-day event
      positionClass = "rounded-l-none border-l-0";
      text = "";
    } else {
      // Middle days of multi day event
      positionClass = "rounded-none border-l-0 border-r-0";
      text = "";
    }

    return `
      <div class="text-xs p-1 rounded bg-blue-100 text-blue-500 ${positionClass} truncate cursor-pointer hover:bg-opacity-80 min-h-[24px] flex items-center" onclick="" title="${event.name}">${text}</div>
    `;
  }

  // -------------------------- Event Management ------------------------
  createEvent() {
    // Get details from HTML components
    const name = document.getElementById("eventName").value;
    const startDate = document.getElementById("eventStartDate").value;
    const endDate = document.getElementById("eventEndDate").value;
    const startTime = document.getElementById("eventStartTime").value;
    const endTime = document.getElementById("eventEndTime").value;
    const category = document.getElementById("eventCategory").value;

    const allDay = document.getElementById("eventAllDay").checked;
    const multiDay = document.getElementById("eventMultiDay").checked;

    const newEvent = {
      id: Date.now(),
      name: name,
      category: category,
      allDay: allDay,
      multiDay: multiDay,
      startDate: startDate,
      endDate: multiDay ? endDate : startDate,
      startTime: allDay ? null : startTime,
      endTime: allDay ? null : endTime,
    };

    this.clearInputFields();

    return newEvent;
  }

  clearInputFields() {}

  handleNewEvent() {
    const newEvent = this.createEvent();
    this.addEvent(newEvent);
  }

  addEvent(newEvent) {
    const eventData = this.getEventData();
    eventData.push(newEvent);
    this.saveEventData(eventData);
    this.updateAll();
  }
}
