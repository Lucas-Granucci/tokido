class CalendarManager {
  constructor() {
    this.currentDate = new Date();
    this.MAX_EVENT_ROWS = 3;
    this.init();
  }

  init() {
    this.bindEvents();
    this.renderCalendar();
  }

  // -------------------------- Event Binding --------------------------
  bindEvents() {
    const elements = {
      calendarPrev: () => this.previousMonth(),
      calendarNext: () => this.nextMonth(),
      addEventButton: () => this.handleNewEvent(),
      deleteEventButton: () => this.deleteCurrentlyEditingEvent(),
      editSaveEventButton: () => this.saveEventChanges(),

      eventAllDay: (e) =>
        this.toggleTimeInputs(!e.target.checked, "timeFields"),
      eventMultiDay: (e) =>
        this.toggleEndDateInput(
          e.target.checked,
          "eventStartDateLabel",
          "eventEndDateField",
        ),

      editEventAllDay: (e) =>
        this.toggleTimeInputs(!e.target.checked, "editTimeFields"),
      editEventMultiDay: (e) =>
        this.toggleEndDateInput(
          e.target.checked,
          "editEventStartDateLabel",
          "editEventEndDateField",
        ),
    };

    Object.entries(elements).forEach(([id, handler]) => {
      const element = document.getElementById(id);
      element?.addEventListener("click", handler);
    });

    // Bind listener for clicking calendar events
    document.addEventListener("click", (e) => {
      const eventElement = e.target.closest("[data-event-id]");
      if (eventElement) {
        const eventId = eventElement.getAttribute("data-event-id");
        this.editEvent(eventId);
      }
    });
  }

  // -------------------------- Calendar Navigation --------------------------
  previousMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.renderCalendar();
  }

  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.renderCalendar();
  }

  // -------------------------- UI Controls --------------------------
  toggleTimeInputs(show, timeFieldsId) {
    document.getElementById(timeFieldsId)?.classList.toggle("hidden", !show);
  }

  toggleEndDateInput(show, startDateLabelId, endDateFieldId) {
    const startDateLabel = document.getElementById(startDateLabelId);
    const endDateInput = document.getElementById(endDateFieldId);

    endDateInput?.classList.toggle("hidden", !show);
    if (startDateLabel) {
      startDateLabel.textContent = show ? "Start Date" : "Date";
    }
  }

  // -------------------------- Data Management --------------------------
  getEventData() {
    return JSON.parse(localStorage.getItem("tokidoEvents") || "[]");
  }

  saveEventData(eventData) {
    localStorage.setItem("tokidoEvents", JSON.stringify(eventData));
  }

  // ------------------------- Render Management --------------------------
  renderCalendar() {
    const calendarContainer = document.getElementById("calendar");
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

    if (calendarContainer) {
      const calendarData = this.generateCalendarData();
      calendarContainer.innerHTML = this.renderCalendarGrid(calendarData);
    }
  }

  renderCalendarGrid(grid) {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return `
    <div class="grid grid-cols-7 gap-1 mb-4">
      ${daysOfWeek
        .map(
          (day) =>
            `<div class="p-2 text-center text-sm font-medium text-gray-500">${day}</div>`,
        )
        .join("")}
    </div>
    <div class="grid grid-cols-7">
      ${grid.map((day) => this.renderDayCell(day)).join("")}
    </div>
  `;
  }

  renderDayCell(day) {
    if (day.isEmpty) {
      return `<div class="h-32 p-1 bg-gray-50"></div>`;
    }

    const today = new Date();
    const isToday = day.date.toDateString() === today.toDateString();
    const todayStyling = isToday
      ? "text-blue-600 font-semibold rounded-lg text-white bg-blue-600"
      : "text-gray-900";

    const hiddenEventCount =
      day.events.length - day.slots.filter(Boolean).length;

    return `
    <div class="h-32 border relative">
      <div class="flex justify-between items-start">
        <span class="text-sm p-1 font-medium ${todayStyling}">${day.day}</span>
      </div>

      <div class="space-y-1">
        ${day.slots
          .map((slot, index) =>
            slot ? this.renderEvent(slot, index) : '<div class="h-6"></div>',
          )
          .join("")}
      </div>

      ${
        hiddenEventCount > 0
          ? `
        <button class="text-xs text-blue-600 font-medium hover:text-blue-800 day-more-btn" 
          data-date="${day.date.toISOString()}">
          +${hiddenEventCount} more
        </button>
      `
          : ""
      }
    </div>
  `;
  }

  renderEvent(slot) {
    const { event, isStart, isEnd } = slot;
    const isAllDay = event.allDay;

    const middleFormat = "border-l-0 border-r-0 rounded-none";
    const positionClass = `${isStart ? "rounded-l border-r-0 ml-1" : middleFormat} ${isEnd ? "rounded-r border-l-0 mr-1" : middleFormat}`;

    const colorClass = isAllDay
      ? "bg-purple-100 text-purple-500 hover:bg-purple-200"
      : "bg-blue-100 text-blue-500 hover:bg-blue-200";

    const content = isStart
      ? isAllDay
        ? `${event.name}`
        : `<span class="text-xs opacity-75">${event.startTime}</span> <span class="ml-1">${event.name}</span>`
      : "";

    return `
      <div class="text-xs p-1 bg-blue-100 text-blue-500 ${colorClass} ${positionClass} truncate cursor-pointer hover:bg-blue-200 h-6 flex items-center" 
        title="${event.name}"
        data-event-id="${event.id}">
        ${content}
      </div>
    `;
  }

  // -------------------------- Calendar Data Generation --------------------------
  generateCalendarData() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDay = firstDay.getDay(); // 0 = Sunday
    const daysInMonth = lastDay.getDate();

    const totalCells = Math.ceil((startingDay + daysInMonth) / 7) * 7;

    const grid = [];
    for (let i = 0; i < totalCells; i++) {
      if (i < startingDay || i >= startingDay + daysInMonth) {
        grid.push({
          isEmpty: true,
          slots: Array(this.MAX_EVENT_ROWS).fill(null),
        }); // Empty day
      } else {
        const day = i - startingDay + 1;
        const date = new Date(year, month, day);

        grid.push({
          day,
          date,
          events: this.getEventsForDay(year, month, day),
          slots: Array(this.MAX_EVENT_ROWS).fill(null),
        });
      }
    }

    this.fillMultiDayEvents(grid, year, month, this.MAX_EVENT_ROWS);
    this.fillSingleDayEvents(grid, year, month, this.MAX_EVENT_ROWS);
    return grid;
  }

  getEventsForDay(year, month, day) {
    const targetDate = new Date(year, month, day);
    const targetDateStr = targetDate.toISOString().split("T")[0];
    const eventData = this.getEventData();

    return eventData
      .filter((event) => {
        const startDateStr = event.startDate.split("T")[0];
        const endDateStr = event.endDate.split("T")[0];
        return startDateStr <= targetDateStr && targetDateStr <= endDateStr;
      })
      .sort(this.sortEvents);
  }

  sortEvents(a, b) {
    if (a.allDay && !b.allDay) return -1;
    if (!a.allDay && b.allDay) return 1;
    if (a.allDay && b.allDay) return a.name.localeCompare(b.name);
    return a.startTime.localeCompare(b.startTime);
  }

  fillMultiDayEvents(grid, year, month, MAX_ROWS) {
    const multiDayEvents = this.getEventsForMonth(year, month, true);

    multiDayEvents.forEach((event) => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      const targetRow = this.findAvailableRow(
        grid,
        year,
        month,
        eventStart,
        eventEnd,
      );

      if (targetRow !== -1) {
        for (
          let day = eventStart.getUTCDate();
          day <= eventEnd.getUTCDate();
          day++
        ) {
          const gridIndex = this.getGridIndexForDay(grid, year, month, day);
          if (gridIndex !== -1) {
            grid[gridIndex].slots[targetRow] = {
              eventId: event.id,
              event,
              isStart: day === eventStart.getUTCDate(),
              isEnd: day === eventEnd.getUTCDate(),
            };
          }
        }
      }
    });
  }

  fillSingleDayEvents(grid, year, month, MAX_ROWS) {
    const singleDayEvents = this.getEventsForMonth(year, month, false);

    singleDayEvents.forEach((event) => {
      const eventDate = new Date(event.startDate);
      const day = eventDate.getUTCDate();
      const gridIndex = this.getGridIndexForDay(grid, year, month, day);

      if (gridIndex !== -1) {
        const targetRow = grid[gridIndex].slots.findIndex(
          (slot) => slot === null,
        );
        if (targetRow !== -1) {
          grid[gridIndex].slots[targetRow] = {
            eventId: event.id,
            event,
            isStart: true,
            isEnd: true,
          };
        }
      }
    });
  }

  getEventsForMonth(year, month, multiDay = null) {
    const eventData = this.getEventData();
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0); // Last day of month

    // Convert to date strings for comparison (YYYY-MM-DD)
    const monthStartStr = monthStart.toISOString().split()[0];
    const monthEndStr = monthEnd.toISOString().split("T")[0];

    return eventData
      .filter((event) => {
        // Filter by multiDay option
        if (multiDay !== null && multiDay !== event.multiDay) return false;

        const eventStartStr = event.startDate.split("T")[0];
        const eventEndStr = event.endDate.split("T")[0];
        return eventStartStr <= monthEndStr && eventEndStr >= monthStartStr;
      })
      .sort(this.sortEvents);
  }

  findAvailableRow(grid, year, month, eventStart, eventEnd) {
    for (let row = 0; row <= this.MAX_EVENT_ROWS; row++) {
      const canFit = this.canFitInRow(
        grid,
        year,
        month,
        eventStart,
        eventEnd,
        row,
      );
      if (canFit) return row;
    }
    return -1;
  }

  canFitInRow(grid, year, month, eventStart, eventEnd, row) {
    for (
      let day = eventStart.getUTCDate();
      day <= eventEnd.getUTCDate();
      day++
    ) {
      const gridIndex = this.getGridIndexForDay(grid, year, month, day);
      if (gridIndex === -1 || grid[gridIndex].slots[row] !== null) {
        return false;
      }
    }
    return true;
  }

  getGridIndexForDay(grid, year, month, day) {
    return grid.findIndex(
      (cell) =>
        !cell.isEmpty &&
        cell.date.getUTCDate() === day &&
        cell.date.getUTCMonth() === month &&
        cell.date.getFullYear() === year,
    );
  }

  // -------------------------- Event Management ------------------------
  handleNewEvent() {
    const newEvent = this.createEvent();
    this.addEvent(newEvent);
  }

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
    return newEvent;
  }

  addEvent(newEvent) {
    const eventData = this.getEventData();
    eventData.push(newEvent);
    this.saveEventData(eventData);
    this.renderCalendar();
  }

  deleteEventData(eventId) {
    const eventData = this.getEventData().filter(
      (event) => event.id !== eventId,
    );
    this.saveEventData(eventData);
    this.renderCalendar();
  }

  deleteCurrentlyEditingEvent() {
    const eventId = this.currentEditingEventId;
    this.deleteEventData(eventId);
    ModalManager.hide("editEventModal");
  }

  editEvent(eventId) {
    const event = this.getEventData().find((e) => e.id === parseInt(eventId));
    if (!event) return;

    this.populateEditForm(event);
    ModalManager.show("editEventModal");
    this.currentEditingEventId = event.id;
  }

  populateEditForm(event) {
    // Fill form fields with event data
    document.getElementById("editEventName").value = event.name || "";
    document.getElementById("editEventCategory").value =
      event.category || "Other";
    document.getElementById("editEventStartDate").value = event.startDate || "";
    document.getElementById("editEventEndDate").value = event.endDate || "";
    document.getElementById("editEventStartTime").value = event.startTime || "";
    document.getElementById("editEventEndTime").value = event.endTime || "";

    // Set toggle states
    document.getElementById("editEventAllDay").checked = event.allDay || false;
    document.getElementById("editEventMultiDay").checked =
      event.multiDay || false;

    if (event.allDay) {
      this.toggleTimeInputs(false, "editTimeFields");
    }
    if (event.multiDay) {
      this.toggleEndDateInput(
        true,
        "editEventStartDateLabel",
        "editEventEndDateField",
      );
    }
  }

  saveEventChanges() {
    const eventId = this.currentEditingEventId;
    const eventData = this.getEventData();
    const eventIndex = eventData.findIndex((e) => e.id === eventId);

    if (eventIndex === -1) return;

    // Get details from edit modal HTML components
    const name = document.getElementById("editEventName").value;
    const startDate = document.getElementById("editEventStartDate").value;
    const endDate = document.getElementById("editEventEndDate").value;
    const startTime = document.getElementById("editEventStartTime").value;
    const endTime = document.getElementById("editEventEndTime").value;
    const category = document.getElementById("editEventCategory").value;

    const allDay = document.getElementById("editEventAllDay").checked;
    const multiDay = document.getElementById("editEventMultiDay").checked;

    const updatedEvent = {
      id: eventId,
      name: name,
      category: category,
      allDay: allDay,
      multiDay: multiDay,
      startDate: startDate,
      endDate: multiDay ? endDate : startDate,
      startTime: allDay ? null : startTime,
      endTime: allDay ? null : endTime,
    };

    eventData[eventIndex] = updatedEvent;
    this.saveEventData(eventData);
    ModalManager.hide("editEventModal");
    this.renderCalendar();
  }
}
