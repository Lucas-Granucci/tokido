window.modalTemplates = {
  eventModal: `
  <div id="eventModal" class="modal hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div class="flex flex-col p-6 gap-5 bg-white rounded-lg">
        <h3 class="font-semibold text-lg">Create New Event</h3>

        <!-- Event Name -->
        <div>
          <label
            for="eventName"
            class="block text-sm font-medium text-gray-500 mb-2"
            >Event Name</label
          >
          <input
            type="text"
            id="eventName"
            class="w-full p-3 border border-gray-300 rounded-lg text-base transition-colors focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            placeholder="Event title"
          />
        </div>

        <!-- Date Range -->
        <div class="flex flex-row gap-4">
          <div class="flex-1">
            <label
              for="eventStartDate"
              class="block text-sm font-medium text-gray-500 mb-2"
              id="eventStartDateLabel"
              >Date</label
            >
            <input
              type="date"
              id="eventStartDate"
              name="eventStartDate"
              class="p-3 w-full border border-gray-300 rounded-lg bg-white text-base transition-colors focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            />
          </div>
          <div class="flex-1 hidden" id="eventEndDateField">
            <label
              for="eventEndDate"
              class="block text-sm font-medium text-gray-500 mb-2"
              >End Date</label
            >
            <input
              type="date"
              id="eventEndDate"
              name="eventEndDate"
              class="p-3 w-full border border-gray-300 rounded-lg bg-white text-base transition-colors focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </div>

        <!-- Time Options -->
        <div class="flex flex-row gap-4" id="timeFields">
          <div class="flex-1">
            <label
              for="eventStartTime"
              class="block text-sm font-meedium text-gray-500 mb-2"
              >Start Time</label
            >
            <input
              type="time"
              id="eventStartTime"
              class="p-3 w-full border border-gray-300 rounded-lg bg-white text-base transition-colors focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            />
          </div>
          <div class="flex-1">
            <label
              for="eventEndTime"
              class="block text-sm font-meedium text-gray-500 mb-2"
              >End Time</label
            >
            <input
              type="time"
              id="eventEndTime"
              class="p-3 w-full border border-gray-300 rounded-lg bg-white text-base transition-colors focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </div>

        <!-- Category, Multi-Day & All Day Toggle -->
        <div class="flex flex-row gap-4">
          <div class="flex-1">
            <label
              for="eventCategory"
              class="block text-sm font-medium text-gray-500 mb-2"
              >Category</label
            >
            <select
              id="eventCategory"
              class="p-3 w-full border border-gray-300 rounded-lg bg-white text-base transition-colors focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            >
              <option value="School">School</option>
              <option value="Research">Research</option>
              <option value="Coding">Coding</option>
              <option value="Personal">Personal</option>
              <option value="Work">Works</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div class="flex-1 flex flex-row gap-4">
            <!-- Multi-Day Toggle -->
            <div class="flex h-full items-center pt-6">
              <label class="flex cursor-pointer items-center">
                <input type="checkbox" id="eventMultiDay" class="peer sr-only" />
                <div
                  class="peer relative h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-blue-600 peer-focus:outline-none after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full"
                ></div>
                <span class="ms-3 text-sm font-medium text-gray-500"
                  >Multi-Day Event</span
                >
              </label>
            </div>
            <!-- All Day Toggle -->
            <div class="flex h-full items-center pt-6">
              <label class="flex cursor-pointer items-center">
                <input type="checkbox" id="eventAllDay" class="peer sr-only" />
                <div
                  class="peer relative h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-blue-600 peer-focus:outline-none after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full"
                ></div>
                <span class="ms-3 text-sm font-medium text-gray-500"
                  >All Day Event</span
                >
              </label>
            </div>
          </div>
        </div>
        <div class="flex flex-row gap-4 h-12 text-center">
          <button
            id="cancelNewEventButton"
            class="p-3 flex-1 border-2 border-blue-500 bg-white rounded-lg cursor-pointer flex justify-center items-center gap-2 font-medium transition-colors hover:bg-blue-50"
          >
            Cancel
          </button>
          <button
            id="addEventButton"
            class="p-3 flex-1 bg-blue-500 text-white border-none rounded-lg cursor-pointer flex justify-center items-center gap-2 font-medium transition-colors hover:bg-blue-600"
          >
            Add Event
          </button>
        </div>
      </div>
    </div>
  </div>
  `,

  taskModal: `
    <div id="taskModal" class="modal hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div class="flex flex-col p-6 gap-5 bg-white rounded-lg">
            <h3 class="font-semibold text-lg">Create New Task</h3>
            <div>
              <label
                for="taskName"
                class="block text-sm font-medium text-gray-500 mb-2"
                >Task Name</label
              >
              <input
                type="text"
                id="taskName"
                class="w-full p-3 border border-gray-300 rounded-lg text-base transition-colors focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                placeholder="Task title"
              />
            </div>
            <div class="flex flex-row gap-4">
              <div class="flex-1">
                <label
                  for="taskCategory"
                  class="block text-sm font-medium text-gray-500 mb-2"
                  >Category</label
                >
                <select
                  id="taskCategory"
                  class="p-3 w-full border border-gray-300 rounded-lg bg-white text-base transition-colors focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="School">School</option>
                  <option value="Research">Research</option>
                  <option value="Coding">Coding</option>
                  <option value="Personal">Personal</option>
                  <option value="Work">Works</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div class="flex-1">
                <label
                  for="taskPriority"
                  class="block text-sm font-medium text-gray-500 mb-2"
                  >Priority</label
                >
                <select
                  id="taskPriority"
                  class="p-3 w-full border border-gray-300 rounded-lg bg-white text-base transition-colors focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div class="flex-1">
                <label
                  for="taskDuration"
                  class="block text-sm font-medium text-gray-500 mb-2"
                  >Estimated Duration</label
                >
                <select
                  id="taskDuration"
                  class="p-3 w-full border border-gray-300 rounded-lg bg-white text-base transition-colors focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="<5 min">&lt5 min</option>
                  <option value="<15 min">&lt15 min</option>
                  <option value="<30 min">&lt30 min</option>
                  <option value="<1 hour">&lt1 hour</option>
                  <option value="<2 hours">&lt2 hours</option>
                  <option value="2+ hours">2+ hours</option>
                </select>
              </div>
              <div class="flex-1">
                <label
                  for="taskDueDate"
                  class="block text-sm font-medium text-gray-500 mb-2"
                  >Due Date</label
                >
                <input
                  type="date"
                  id="taskDueDate"
                  name="taskDueDate"
                  class="p-3 w-full border border-gray-300 rounded-lg bg-white text-base transition-colors focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>
            <div class="flex flex-row gap-4 h-12 text-center">
              <button
                id="cancelNewTaskButton"
                class="p-3 flex-1 border-2 border-blue-500 bg-white rounded-lg cursor-pointer flex justify-center items-center gap-2 font-medium transition-colors hover:bg-blue-50"
              >
                Cancel
              </button>
              <button
                id="addTaskButton"
                class="p-3 flex-1 bg-blue-500 text-white border-none rounded-lg cursor-pointer flex justify-center items-center gap-2 font-medium transition-colors hover:bg-blue-600"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,

  editEventModal: `
    <div id="editEventModal" class="modal hidden">
      <div class="modal-content">
      
      </div>
    </div>
  `,
};
