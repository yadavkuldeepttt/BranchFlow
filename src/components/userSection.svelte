<script>
  import { users } from "../apiData/data";
  import Toast from "./Toast.svelte";
  let userContent = [...users];
  export let globalVariableObject; // Accept the sidebar prop
  export let stateObject;
  export let loginSection;

  // Filtered user list (initialize with the full list of users)
  let filteredUsers = [...userContent];
  let currentPage = 1;
  const itemsPerPage = 2; // Number of Users to display per page
  let showToast = false;
  let toastMessage = "";
  let toastType = "success";
  let selectedContentUser = users[0];
  let userOriginalContent = JSON.parse(JSON.stringify(userContent));

  stateObject.user_current_view = "list";

  //   let originalBranches = [...selectedContentUser.branches]; // This will store the unmodified branches of the selected repo

  //   show content details
  function showContentDetailsUser(id, user) {
    selectedContentUser = filteredUsers.find((user) => user.id === id);

    //   originalBranches = [...user.branches];
    //   selectedContentUser.branches = [...user.branches]; // Set the branches to the original list
  }

  // Function to set the view type for a specific context (repo, branch, or commit)
  function setView(context, viewType) {
    console.log(viewType, "viewTypes");

    if (context === "user") {
      stateObject.user_current_view = viewType;
      console.log(stateObject.user_current_view);

      // } else if (context === "branch") {
      //   stateObject.branch_current_view = viewType;
      // } else if (context === "commit") {
      //   stateObject.commit_current_view = viewType;
      // } else if (context === "global") {
      //   stateObject.global_current_view = viewType;
      // }
    }
  }

  // Function to handle Edit button click
  function enableEditing(section, id) {
    globalVariableObject.user[section][id] = true;
  }
  // Function to handle Cancel button click
  function cancelEditing(section, id) {
    globalVariableObject.user[section][id] = false;
    // Reset any changes if needed

    // Revert changes
    revertChanges();
  }

  // Function to handle Save button click
  function saveChangesUser(section, content, id) {
    globalVariableObject.user[section][id] = false;

    // Check if there's content to save
    if (content) {
      // Find the original repo
      let originalUser = userOriginalContent.find((o) => o.id === content.id);

      // If no originalRepo is found, this is a new repo
      if (!originalUser) {
        originalUser = { objDetails: {}, branches: [] };
      }

      // Initialize or reset highlightedFields for this repo
      //   highlightedFields[content.id] = highlightedFields[content.id] || {};

      //   // Compare fields and highlight only those that changed
      //   const fieldsToCompare = ["name", "time", "date"];
      //   fieldsToCompare.forEach((field) => {
      //     if (content.objDetails[field] !== originalRepo.objDetails[field]) {
      //       highlightedFields[content.id][field] = true; // Mark this field for highlighting
      //     } else {
      //       highlightedFields[content.id][field] = false; // Clear highlight if no change
      //     }
      //   });

      // Save the changes to the content
      userContent = [...userContent];

      // Show success message
      showToast = true;
      toastMessage = "Saved Successfully";
      toastType = "success";
      setTimeout(() => {
        showToast = false;
      }, 3000);
    }
  }

  // Function to revert changes
  function revertChanges() {
    for (const field in globalVariableObject.changes) {
      selectedContentUser.objDetails[field] =
        globalVariableObject.changes[field];
    }
    globalVariableObject.changes = {};
  }

  //   pagination
  function goToNextPage() {
    if (currentPage < Math.ceil(displayedUsers.length / itemsPerPage)) {
      currentPage += 1;
    }
  }

  function goToPreviousPage() {
    if (currentPage > 1) {
      currentPage -= 1;
    }
  }

  //   generate unique id
  function generateUniqueId(type) {
    const timestamp = Date.now(); // Get the current timestamp in milliseconds
    return `${type}-${timestamp}`; // Create an ID with a type prefix and timestamp
  }

  // Function to generate a new users with current date and time
  function addNewUser() {
    const newuserId = generateUniqueId("user");
    const currentDate = new Date();
    const newUser = {
      id: newuserId,
      objDetails: {
        firstName: `user${userContent.length + 1}`,
        lastName: "",
        gender: "Male",
        dob: "1990-01-01",
        maritalStatus: "Single",
        nationality: "Indian",
        image: "",
      },
      contacts: [],
      relativeContacts: [],
      documents: [],
      addresses: [],
      occupationDetails: [
        { id: 1, field: "occupation", value: "Software Developer" },
        { id: 2, field: "company", value: "" },
        { id: 3, field: "jobTitle", value: "" },
        { id: 4, field: "dateOfJoining", value: "2015-06-01" },
        { id: 5, field: "employeeId", value: "EMP12345" },
      ],
      bankDetails: [
        { id: 1, field: "accountNumber", value: "" },
        { id: 2, field: "ifscCode", value: "" },
        { id: 3, field: "bankName", value: "" },
        { id: 4, field: "branch", value: "" },
      ],
      additionalInfo: [
        { id: 1, field: "hobbies", value: ["Reading"] },
        {
          id: 2,
          field: "languagesSpoken",
          value: ["English"],
        },
      ],
    };

    // Add the new usersitory to the userContent array
    userContent = [...userContent, newUser];
    userContent = [...userContent];
    filteredUsers = [...userContent];
  }

  // Function to toggle selection of a repo
  function toggleSelectUser(userId) {
    if (globalVariableObject.selectedUsers.includes(userId)) {
      globalVariableObject.selectedUsers =
        globalVariableObject.selectedUsers.filter((id) => id !== userId);
    } else {
      globalVariableObject.selectedUsers = [
        ...globalVariableObject.selectedUsers,
        userId,
      ];
    }
    console.log(globalVariableObject.selectedUsers, "selected Users");
  }

  // Function to handle "Select All" checkbox
  function toggleSelectAllUsers(event) {
    if (event.target.checked) {
      globalVariableObject.selectedUsers = userContent.map((user) => user.id);
    } else {
      globalVariableObject.selectedUsers = [];
    }
    console.log(globalVariableObject.selectedUsers, "selceted Users");
  }

  // Function to check if "Select All" should be checked
  function isSelectAllChecked() {
    return globalVariableObject.selectedUsers.length === userContent.length;
  }

  // Function to select all Users
  function selectAllUsers() {
    globalVariableObject.selectedUsers = displayedUsers.map((repo) => repo.id);
    globalVariableObject.checkedBox = true;
  }

  // Function to unselect all Users
  function unselectAllUsers() {
    globalVariableObject.selectedUsers = [];
    globalVariableObject.checkedBox = false;
  }

  function performSelectedAction() {
    if (globalVariableObject.selectedAction === "delete") {
      deleteSelectedUsers(); // Call the delete function
    } else if (globalVariableObject.selectedAction === "archive") {
      archiveSelectedUsers(); // Implement this function
    } else if (globalVariableObject.selectedAction === "duplicate") {
      duplicateSelectedUsers(); // Implement this function
    } else if (globalVariableObject.selectedAction === "compare") {
      compareSelectedUsers(); // Implement this function
    }
  }

  // Function to delete selected repositories
  function deleteSelectedUsers() {
    userContent = userContent.filter(
      (user) => !globalVariableObject.selectedUsers.includes(user.id)
    );

    filteredUsers = [...userContent];

    globalVariableObject.selectedUsers = []; // Clear selection after deletion
    globalVariableObject.selectedAction = "";
  }

  function archiveSelectedUsers() {} //archive selected Users
  function duplicateSelectedUsers() {} //duplicate selected users
  function compareSelectedUsers() {} //compare selected users

  //   delete specific user
  function deleteUser(userId) {
    userContent = userContent.filter((user) => user.id !== userId);

    filteredUsers = [...userContent];
  }

  //   open repo info dropdown
  function openInfoDropdown(id) {
    selectedContentUser = userContent.find((user) => user.id === id);
    globalVariableObject.infoDropdown[id] =
      !globalVariableObject.infoDropdown[id];
  }

  function importDropdown() {
    globalVariableObject.importdropdown = !globalVariableObject.importdropdown;
  }

  let uploadedFileNameUser = ""; // To store the name of the uploaded file

  // Handle file input change (click to upload)
  function handleFileInputChangeUser(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        selectedContentUser.objDetails.image = e.target.result;
      };
      reader.readAsDataURL(file);
      // Store the file name
      uploadedFileNameUser = file.name;
    }
  }

  // Handle drag-over event to allow dropping the image
  function handleDragOverUser(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }

  // Handle drop event to process the dragged image
  function handleDropUser(event) {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        selectedContentUser.objDetails.image = e.target.result;
      };
      reader.readAsDataURL(file);

      // Store the file name
      uploadedFileNameUser = file.name;
    }
  }

  // Generic function to add new contact or relative contact
  function addNewContent(type) {
    const newContactId = generateUniqueId(type);

    const newContact = {
      id: newContactId,
      ...(type === "contacts" && {
        type: `new type ${selectedContentUser[type].length + 1}`,
        phoneNumber: "+91 3434343444",
        email: "abc@example.com",
      }),
      ...(type === "relativeContacts" && {
        name: `New user ${selectedContentUser[type].length + 1}`,
        relationship: `New relation ${selectedContentUser[type].length + 1}`,
        phoneNumber: "+91 9876543232",
      }),
      ...(type === "documents" && {
        type: `new document${selectedContentUser[type].length + 1}`,
        number: `ABCDE${selectedContentUser[type].length + 1}F`,
        fileUrl: `https://example.com/document${selectedContentUser[type].length + 1}.pdf`,
      }),
      ...(type === "addresses" && {
        type: `new address ${selectedContentUser[type].length + 1}`,
        line1: "",
        line2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
      }),
    };

    selectedContentUser[type] = [...selectedContentUser[type], newContact];
  }

  // Generic function to delete contact or relative contact
  function deleteContent(type, contactId) {
    if (selectedContentUser) {
      selectedContentUser[type] = selectedContentUser[type].filter(
        (contact) => contact.id !== contactId
      );
    }
  }

  // Function to export a specific user's details as a JSON file
  function exportUser(user) {
    console.log(user, "user");

    // Create a blob with the user's details in JSON format
    const userData = JSON.stringify(user, null, 2);
    const blob = new Blob([userData], { type: "application/json" });

    // Create a temporary download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    // Set the file name dynamically based on the user's name or ID
    link.download = `${user.objDetails.firstName}_${user.objDetails.lastName}_details.json`;

    // Append the link to the body (required for Firefox)
    document.body.appendChild(link);

    // Programmatically click the link to trigger the download
    link.click();

    // Clean up the URL and remove the temporary link
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
  }

  // Function to prevent default behavior when dragging over the drop area
  function handleDragOverImport(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy"; // Indicate copy action
  }

  // Function to handle drag leave
  function handleDragLeaveImport(event) {
    event.preventDefault();
  }

  // Function to handle the drop event
  function handleDropImport(event) {
    event.preventDefault();
    const file = event.dataTransfer.files[0]; // Get the first dropped file
    processFile(file); // Process the dropped file
  }

  // Function to handle file selection from input
  function handleFileSelectImport(event) {
    const file = event.target.files[0]; // Get the selected file
    processFile(file); // Process the selected file
  }

  // Function to read and process the JSON file
  function processFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const userData = JSON.parse(e.target.result); // Parse the JSON file content
        // Update the selected user with imported data
        //   selectedContentUser = { ...selectedContentUser, ...userData };
        filteredUsers = [...filteredUsers, userData];

        globalVariableObject.importdropdown=false;
        alert("User data imported successfully!");
    } catch (error) {
        alert("Invalid JSON file. Please upload a valid user data file.");
      }
    };
    reader.readAsText(file); // Read the file as text
  }

  // Computed value to determine which array to use
  $: displayedUsers = filteredUsers.length > 0 ? filteredUsers : userContent;
</script>

<!-- toast for error and message -->
{#if showToast}
  <Toast message={toastMessage} type={toastType} />
{/if}
<!-- toast end -->

<!-- user content start -->
<main
  class="  {globalVariableObject.sidebar
    ? 'w-[80.3vw]  sm:hidden'
    : 'w-[93.1vw] sm:w-[83.5vw]'} me-2 max-w-[100vw] {loginSection ? "hidden" :""}"
>
  <div
    data-testid="listView"
    class="flex gap-2 bg-base-100 p-2 h-full rounded-2xl shadow-md w-full {!globalVariableObject.firstCol
      ? 'sm:bg-[#0006!important] sm:shadow-none sm:w-0'
      : ''} "
  >
    <!-- first column -->
    <div class="firstColumn">
      <div
        class="border w-[18vw] bg-gray-50 py-2 px-2 border-gray-200 {globalVariableObject.firstCol
          ? 'sm:hidden'
          : 'sm:block hidden shadow absolute transition-all duration-600 ease-in-out  top-0 left-0 z-50 w-[42vw]'}"
      >
        <div
          class="flex {globalVariableObject.selectedUsers.length > 0
            ? 'justify-between'
            : 'justify-end'} items-center mb-2"
        >
          <!-- close first column -->
          <i
            class="fa-solid fa-times hidden sm:block me-auto text-xs text-gray-500 cursor-pointer"
            on:click={() => (globalVariableObject.firstCol = true)}
          ></i>

          <!-- Bulk Delete Button -->
          {#if globalVariableObject.selectedUsers.length > 0}
            <!-- Select Dropdown for Actions -->
            <select
              data-testid="actionDropdown"
              bind:value={globalVariableObject.selectedAction}
              on:change={performSelectedAction}
              class="bg-red-600 text-white px-2 py-1 w-[7vw] sm:w-[14vw] sm:me-3 outline-none focus:outline-none rounded-md border border-red-500 text-xs tracking-[0.06rem] hover:bg-red-800"
            >
              <option value="" disabled>Select Action</option>
              <option data-testid="deleteOption" value="delete"
                >Delete Selected</option
              >
              <option data-testid="archiveOption" value="archive"
                >Archive Selected</option
              >
              <option data-testid="duplicateOption" value="duplicate"
                >Duplicate Selected</option
              >
              <option data-testid="compareOption" value="compare"
                >Compare Selected</option
              >
              <!-- Add more options as needed -->
            </select>
          {/if}
          <div class="flex gap-2.5 items-center">
            <div>
              <!-- Checkbox for select all checkboxes -->
              <input
                type="checkbox"
                class="form-checkbox w-3 h-3"
                checked={isSelectAllChecked() ||
                  globalVariableObject.checkedBox}
                on:change={toggleSelectAllUsers}
                data-testid="selectAllCheckbox"
              />
              <div class="dropdown">
                <div tabindex="0" role="button" class="bg-transparent border-0">
                  <i class="fa-solid fa-caret-down" style="font-size: 10px;"
                  ></i>
                </div>
                <ul
                  tabindex="0"
                  class="dropdown-content menu bg-base-100 rounded-box z-[1] w-44 p-2 shadow"
                >
                  <li><a on:click={selectAllUsers}>All</a></li>
                  <li><a on:click={unselectAllUsers}>None</a></li>
                </ul>
              </div>
            </div>
            <i
              data-testid="addNewUser"
              on:click={addNewUser}
              class="fa-solid fa-plus text-sm cursor-pointer font-semibold"
            ></i>
            <i
              class="fa-solid fa-ellipsis text-sm cursor-pointer font-semibold"
              on:click={importDropdown}
            ></i>
          </div>
        </div>

        <!-- display user - user list -->
        <div class="firstCol overflow-y-auto mb-5 pb-[5.5rem] h-[96vh]">
          {#each displayedUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) as user}
            <div
              on:click={() => showContentDetailsUser(user.id, user)}
              data-testid={`userList${user.id}`}
              class="card cursor-pointer p-2 mb-2 rounded-lg shadow-sm hover:bg-gray-100 {selectedContentUser.id ===
              user.id
                ? 'bg-gray-200'
                : ''}"
            >
              <!-- user name -->
              <div class="flex items-center justify-between">
                <h3 class="text-lg tracking-[0.05rem] font-semibold mb-2">
                  {user.objDetails.firstName}
                  {user.objDetails.lastName}
                </h3>
                <div class="flex items-center gap-2">
                  <!-- Checkbox for selection -->
                  <input
                    type="checkbox"
                    class="form-checkbox w-3 h-3"
                    checked={globalVariableObject.selectedUsers.includes(
                      user.id
                    )}
                    on:change={() => toggleSelectUser(user.id)}
                  />
                  <!-- delete icon -->
                  <i
                    data-testid={`userDelete${user.id}`}
                    style="font-size:10px"
                    class="fa-solid fa-trash text-red-500 hover:text-red-600"
                    on:click={() => deleteUser(user.id)}
                  ></i>

                  <!-- info icon -->
                  <div class="dropdown dropdown-bottom dropdown-left">
                    <div
                      tabindex="0"
                      role="button"
                      class="bg-transparent border-0"
                      on:click={() => openInfoDropdown(user.id)}
                    >
                      <i class="fa-solid fa-ellipsis text-xs"></i>
                    </div>
                  </div>
                </div>
              </div>
              <p class="text-sm tracking-[0.05rem] text-gray-600">
                <span style="font-weight: 600;">Gender:</span>
                {user.objDetails.gender}
              </p>
              <p class="text-sm tracking-[0.05rem] text-gray-600">
                <span style="font-weight: 600;">DOB:</span>
                {user.objDetails.dob}
              </p>
              <p class="text-sm tracking-[0.05rem] text-gray-600">
                <span style="font-weight: 600;">Nationality:</span>
                {user.objDetails.nationality}
              </p>
            </div>
          {/each}

          <!-- Pagination Controls -->
          <div
            class="pagination-controls flex justify-between items-center px-2 mt-4"
          >
            <button
              class="bg-transparent py-1 text-xl cursor-pointer rounded disabled:opacity-50"
              on:click={goToPreviousPage}
              disabled={currentPage === 1}
            >
              <i class="fa-solid fa-circle-left text-red-500 hover:text-red-600"
              ></i>
            </button>

            <span class="text-gray-700 text-xs tracking-[0.06rem]">
              Page {currentPage} of {Math.ceil(
                displayedUsers.length / itemsPerPage
              )}
            </span>

            <button
              data-testid="goToNextPage"
              class="bg-transparent py-1 cursor-pointer rounded text-xl disabled:opacity-50"
              on:click={goToNextPage}
              disabled={currentPage ===
                Math.ceil(displayedUsers.length / itemsPerPage)}
            >
              <i
                class="fa-solid fa-circle-right text-red-500 hover:text-red-600"
              ></i></button
            >
          </div>
        </div>
      </div>

      {#if globalVariableObject.importdropdown}
        <ul
          tabindex="0"
          class="dropdown-content absolute top-[13vh] left-[7vw] menu bg-base-100 rounded-box z-50 w-52 p-2 shadow"
        >
          <li><a on:click={() => my_modal_33.showModal()}>Import</a></li>
        </ul>
      {/if}
      {#if globalVariableObject.infoDropdown[selectedContentUser.id]}
        <!-- info dropdown -->
        <ul
          tabindex="0"
          class="dropdown-content absolute top-[25vh] left-[2vw] menu bg-base-100 rounded-box z-50 w-52 p-2 shadow"
        >
          <li><a on:click={() => my_modal_33.showModal()}>Import</a></li>
          <li>
            <a on:click={() => exportUser(selectedContentUser)}>Export</a>
          </li>
        </ul>
      {/if}
    </div>

    <!-- modal -->
    <!-- Modal for Import -->
    <dialog id="my_modal_33" class="modal">
      <div class="modal-box">
        <h3 class="text-lg font-bold">Import User Data</h3>
        <p class="py-4">Drag and drop a JSON file or click to upload.</p>

        <!-- Drag and Drop Area -->
        <div
          class="border-2 border-dashed p-4 text-center"
          on:drop={handleDropImport}
          on:dragover={handleDragOverImport}
          on:dragleave={handleDragLeaveImport}
        >
          <input
            type="file"
            accept=".json"
            class="hidden"
            id="fileInput"
            on:change={handleFileSelectImport}
          />
          <label for="fileInput" class="cursor-pointer">
            Drag and drop a file here, or click to select
          </label>
        </div>

        <div class="modal-action">
          <!-- Close button -->
          <button class="btn" onclick="my_modal_33.close()">Close</button>
        </div>
      </div>

      <!-- Backdrop to close modal -->
      <form method="dialog" class="modal-backdrop">
        <button>Close</button>
      </form>
    </dialog>

    <!-- second column -->
    <div
      id="secondColumn"
      class="border w-full bg-gray-50 p-2 border-gray-200 {!globalVariableObject.firstCol
        ? 'sm:hidden'
        : ''} "
    >
      <!-- top nav -->
      <div
        class="flex justify-between items-center sm:flex-col-reverse sm:gap-3"
      >
        <!-- view type icons for repo -->
        <div class="flex gap-2 border border-gray-200">
          <!-- table view -->
          <svg
            on:click={() => setView("repo", "table")}
            class="w-7 h-7 px-1 cursor-pointer hover:bg-gray-200 text-gray-800 dark:text-white {stateObject.repo_current_view ===
            'table'
              ? 'text-red-500'
              : ''}"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fill-rule="evenodd"
              d="M4 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H4Zm0 8v6h7v-6H4Zm16 6h-7v-6h7v6Z"
              clip-rule="evenodd"
            />
          </svg>
          <!-- list view -->
          <svg
            on:click={() => setView("user", "list")}
            class="w-7 h-7 px-1 cursor-pointer hover:bg-gray-200 text-gray-800 border-x border-gray-200 dark:text-white {stateObject.user_current_view ===
            'list'
              ? 'text-red-500'
              : ''}"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-width="2"
              d="M9 8h10M9 12h10M9 16h10M4.99 8H5m-.02 4h.01m0 4H5"
            />
          </svg>
          <!-- card view -->
          <svg
            on:click={() => setView("repo", "card")}
            class="w-7 h-7 px-1 cursor-pointer hover:bg-gray-200 text-gray-800 dark:text-white {stateObject.repo_current_view ===
            'card'
              ? 'text-red-500 font-semibold'
              : ''}"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 9h3m-3 3h3m-3 3h3m-6 1c-.306-.613-.933-1-1.618-1H7.618c-.685 0-1.312.387-1.618 1M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm7 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
            />
          </svg>
        </div>
        <!-- buttons for repo -->
        <div class="flex justify-end gap-3 items-center">
          <button
            onclick="my_modal_22.showModal()"
            class="bg-gray-100 px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-gray-200"
            style="font-weight: 600;">Access</button
          >
          <button
            class="bg-blue-600 text-white px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-blue-800"
            style="font-weight: 600;">Share</button
          >
          <button
            class="bg-gray-100 px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-gray-200"
            style="font-weight: 600;">Approve</button
          >
          <button
            on:click={() => enableEditing("general", selectedContentUser.id)}
            class="bg-gray-100 px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-gray-200"
            style="font-weight: 600;">Edit</button
          >
          <button
            class="bg-orange-500 text-white px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-orange-600"
            style="font-weight: 600;">Live</button
          >
          <div class="dropdown dropdown-left">
            <button
              class="bg-gray-500 text-white px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-gray-600"
              style="font-weight: 600;"
              ><i class="fa-solid fa-ellipsis"></i></button
            >
            <ul
              tabindex="0"
              class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
            >
              <li>
                <a>Pull </a>
              </li>
              <li><a>Build </a></li>
              <li><a>Build Status</a></li>
              <li><a id="test-option">Test</a></li>
              <li><a>Run</a></li>
            </ul>
          </div>
        </div>
      </div>
      <!-- top nav end -->

      <!-- selected content details -->
      {#if selectedContentUser}
        <div
          data-testid={`selectedRepo${selectedContentUser.id}`}
          class="mt-2 overflow-y-auto h-[85vh]"
        >
          <!--  user personal details -->
          <details class="collapse bg-base-200 border-gray-200 border">
            <summary
              style="font-size:17px"
              class="py-1 px-3 collapse-title tracking-[0.06rem] font-medium border-b border-gray-200 min-h-[1.7rem!important]"
              >Personal Details</summary
            >
            <div
              class="collapse-content bg-gray-50 p-2 overflow-y-auto h-[60vh] pb-5"
            >
              <!-- list view -->
              {#if stateObject.user_current_view === "list"}
                {#each Object.keys(selectedContentUser.objDetails) as fieldName}
                  <div class="flex gap-2 mb-2">
                    <div
                      class="field1 border border-gray-200 py-1.5 px-2 w-[21vw] max-w-screen rounded-md bg-gray-100 capitalize"
                    >
                      {fieldName}
                    </div>
                    <div
                      class="field1 border border-gray-200 rounded-md bg-base-100 w-full"
                    >
                      {#if fieldName === "firstName"}
                        <input
                          type="text"
                          name=""
                          id=""
                          class="w-full py-1.5 px-2 rounded-md outline-none"
                          bind:value={selectedContentUser.objDetails[fieldName]}
                          disabled={!globalVariableObject.user.general[
                            selectedContentUser.id
                          ]}
                        />
                      {:else if fieldName === "lastName"}
                        <input
                          type="text"
                          name=""
                          id=""
                          class="w-full py-1.5 px-2 rounded-md outline-none"
                          bind:value={selectedContentUser.objDetails[fieldName]}
                          disabled={!globalVariableObject.user.general[
                            selectedContentUser.id
                          ]}
                        />
                      {:else if fieldName === "gender"}
                        <select
                          class="w-full py-1.5 px-2 rounded-md outline-none"
                          bind:value={selectedContentUser.objDetails[fieldName]}
                          disabled={!globalVariableObject.user.general[
                            selectedContentUser.id
                          ]}
                        >
                          <option value="" disabled>Select gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      {:else if fieldName === "dob"}
                        <input
                          type="date"
                          name=""
                          id=""
                          class="w-full py-1.5 px-2 rounded-md outline-none"
                          bind:value={selectedContentUser.objDetails[fieldName]}
                          disabled={!globalVariableObject.user.general[
                            selectedContentUser.id
                          ]}
                        />
                      {:else if fieldName === "maritalStatus"}
                        <input
                          type="text"
                          name=""
                          id=""
                          class="w-full py-1.5 px-2 rounded-md outline-none"
                          bind:value={selectedContentUser.objDetails[fieldName]}
                          disabled={!globalVariableObject.user.general[
                            selectedContentUser.id
                          ]}
                        />
                      {:else if fieldName === "nationality"}
                        <input
                          type="text"
                          name=""
                          id=""
                          class="w-full py-1.5 px-2 rounded-md outline-none"
                          bind:value={selectedContentUser.objDetails[fieldName]}
                          disabled={!globalVariableObject.user.general[
                            selectedContentUser.id
                          ]}
                        />
                      {:else if fieldName === "documentation"}
                        <div class="py-0 px-2">
                          <textarea
                            name=""
                            id=""
                            rows="2"
                            class="w-full border-0 outline-none"
                            bind:value={selectedContentUser.objDetails[
                              fieldName
                            ]}
                            disabled={!globalVariableObject.user.general[
                              selectedContentUser.id
                            ]}
                          />
                        </div>
                      {:else if fieldName === "image"}
                        {#if !globalVariableObject.user.general[selectedContentUser.id]}
                          <div class="py-2 px-2">
                            <img
                              src={selectedContentUser.objDetails[fieldName]}
                              alt=""
                              class="max-h-[30vh]"
                            />
                          </div>
                        {:else}
                          <div class="py-2 px-2">
                            <div
                              class="flex items-center justify-center w-full"
                              on:dragover|preventDefault={handleDragOverUser}
                              on:drop={handleDropUser}
                            >
                              <label
                                for="dropzone-file"
                                class="flex flex-col items-center justify-center w-full h-50 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                              >
                                <div
                                  class="flex flex-col items-center justify-center pt-3 pb-4"
                                >
                                  <svg
                                    class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 16"
                                  >
                                    <path
                                      stroke="currentColor"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width="2"
                                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                    />
                                  </svg>
                                  <p
                                    class="mb-2 text-sm text-gray-500 dark:text-gray-400"
                                  >
                                    <span class="font-semibold"
                                      >Click to upload</span
                                    > or drag and drop
                                  </p>
                                  <p
                                    class="text-xs text-gray-500 dark:text-gray-400"
                                  >
                                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                                  </p>
                                </div>
                                <input
                                  id="dropzone-file"
                                  type="file"
                                  class="hidden"
                                  accept="image/*"
                                  bind:value={selectedContentUser.objDetails[
                                    fieldName
                                  ]}
                                  on:change={handleFileInputChangeUser}
                                />
                              </label>
                            </div>
                            {#if uploadedFileNameUser}
                              <p
                                class="mt-2 text-sm text-gray-700 dark:text-gray-400"
                              >
                                <strong>Selected file:</strong>s
                                {uploadedFileNameUser}
                              </p>
                            {/if}
                          </div>
                        {/if}
                      {/if}
                    </div>
                  </div>
                {/each}

                <!--  save,cancel button -->
                {#if globalVariableObject.user.general[selectedContentUser.id]}
                  <div class="mt-3">
                    <button
                      on:click={() =>
                        saveChangesUser(
                          "general",
                          selectedContentUser,
                          selectedContentUser.id
                        )}
                      class="bg-blue-600 text-white px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-blue-800"
                      style="font-weight: 600;">Save</button
                    >
                    <button
                      on:click={() =>
                        cancelEditing("general", selectedContentUser.id)}
                      class="bg-gray-100 px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-gray-200"
                      style="font-weight: 600;">Cancel</button
                    >
                  </div>
                {/if}
              {/if}
            </div>
          </details>

          <!-- contacts -->
          <details class="collapse bg-base-200 border-gray-200 border mt-2">
            <summary
              style="font-size:1.125rem"
              class="py-1 px-3 collapse-title tracking-[0.06rem] font-medium border-b border-gray-200 min-h-[1.7rem!important]"
              >Contacts</summary
            >
            <div
              class="collapse-content bg-gray-50 p-2 overflow-y-auto max-h-[60vh] pb-5"
            >
              <!-- list view -->
              {#if stateObject.user_current_view === "list"}
                <!-- edit button -->
                <div class="flex justify-end items-center sm:mt-2 gap-3">
                  <!-- view type icons for repo -->
                  <i
                    class="fa-solid fa-plus cursor-pointer"
                    on:click={() => addNewContent("contacts")}
                  ></i>
                  <div class="flex gap-2 border border-gray-200">
                    <!-- table view -->
                    <svg
                      on:click={() => setView("repo", "table")}
                      class="w-7 h-7 px-1 cursor-pointer hover:bg-gray-200 text-gray-800 dark:text-white {stateObject.repo_current_view ===
                      'table'
                        ? 'text-red-500'
                        : ''}"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M4 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H4Zm0 8v6h7v-6H4Zm16 6h-7v-6h7v6Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <!-- list view -->
                    <svg
                      on:click={() => setView("user", "list")}
                      class="w-7 h-7 px-1 cursor-pointer hover:bg-gray-200 text-gray-800 border-x border-gray-200 dark:text-white {stateObject.user_current_view ===
                      'list'
                        ? 'text-red-500'
                        : ''}"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-width="2"
                        d="M9 8h10M9 12h10M9 16h10M4.99 8H5m-.02 4h.01m0 4H5"
                      />
                    </svg>
                    <!-- card view -->
                    <svg
                      on:click={() => setView("repo", "card")}
                      class="w-7 h-7 px-1 cursor-pointer hover:bg-gray-200 text-gray-800 dark:text-white {stateObject.repo_current_view ===
                      'card'
                        ? 'text-red-500 font-semibold'
                        : ''}"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 9h3m-3 3h3m-3 3h3m-6 1c-.306-.613-.933-1-1.618-1H7.618c-.685 0-1.312.387-1.618 1M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm7 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
                      />
                    </svg>
                  </div>
                </div>

                {#if selectedContentUser.contacts.length > 0}
                  {#each selectedContentUser.contacts as contact}
                    <details
                      class="collapse bg-base-200 border-gray-200 border mt-2"
                    >
                      <summary
                        style="font-size:1rem"
                        class="py-1 px-3 collapse-title tracking-[0.06rem] font-medium border-b border-gray-200 min-h-[1.7rem!important]"
                      >
                        <div class="flex justify-between items-center">
                          <span> {contact.type} </span>
                          <div class="flex gap-3 items-center">
                            <i
                              on:click={() =>
                                deleteContent("contacts", contact.id)}
                              class="fa-solid fa-trash text-xs text-red-500 hover:text-red-600"
                            ></i>
                            <i
                              class="fa-solid fa-grip text-gray-500 text-xs cursor-grab"
                              draggable="true"
                              aria-hidden="true"
                            ></i>
                          </div>
                        </div></summary
                      >
                      <div
                        class="collapse-content bg-base-100 pb-0 overflow-y-auto"
                      >
                        <!-- edit button -->
                        <div class=" my-2 flex gap-2 justify-end">
                          <!--  save,cancel button user contacts-->
                          {#if globalVariableObject.user.contacts[contact.id]}
                            <button
                              on:click={() =>
                                saveChangesUser(
                                  "contacts",
                                  selectedContentUser,
                                  contact.id
                                )}
                              class="bg-blue-600 text-white px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-blue-800"
                              style="font-weight: 600;">Save</button
                            >
                            <button
                              on:click={() =>
                                cancelEditing("contacts", contact.id)}
                              class="bg-gray-100 px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-gray-200"
                              style="font-weight: 600;">Cancel</button
                            >
                          {/if}

                          <button
                            on:click={() =>
                              enableEditing("contacts", contact.id)}
                            class="bg-red-500 px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-red-600"
                            style="font-weight: 600;">Edit</button
                          >
                        </div>
                        <!-- user contacts details -->
                        <div class="p-2 sm:text-xs">
                          {#each Object.keys(contact) as fieldName}
                            {#if fieldName !== "id"}
                              <div class="flex gap-2 mb-2">
                                <div
                                  class="field1 border border-gray-200 py-1.5 px-2 w-[21vw] max-w-screen rounded-md bg-gray-100 capitalize"
                                >
                                  {fieldName}
                                </div>
                                <div
                                  class="field1 border border-gray-200 rounded-md bg-base-100 w-full"
                                >
                                  {#if fieldName === "type"}
                                    <input
                                      type="text"
                                      name=""
                                      s
                                      id=""
                                      class="w-full py-1.5 px-2 rounded-md outline-none"
                                      bind:value={contact[fieldName]}
                                      disabled={!globalVariableObject.user
                                        .contacts[contact.id]}
                                    />
                                  {:else if fieldName === "phoneNumber"}
                                    <input
                                      type="text"
                                      name=""
                                      id=""
                                      class="w-full py-1.5 px-2 rounded-md outline-none"
                                      bind:value={contact[fieldName]}
                                      disabled={!globalVariableObject.user
                                        .contacts[contact.id]}
                                    />
                                  {:else if fieldName === "email"}
                                    <input
                                      type="email"
                                      name=""
                                      id=""
                                      class="w-full py-1.5 px-2 rounded-md outline-none"
                                      bind:value={contact[fieldName]}
                                      disabled={!globalVariableObject.user
                                        .contacts[contact.id]}
                                    />
                                  {/if}
                                </div>
                              </div>
                            {/if}
                          {/each}
                        </div>
                      </div>
                    </details>
                  {/each}
                {:else}
                  <div class="text-xs text-center mt-2">No Content Found</div>
                {/if}
              {/if}
            </div>
          </details>

          <!--relative contacts -->
          <details class="collapse bg-base-200 border-gray-200 border mt-2">
            <summary
              style="font-size:1.125rem"
              class="py-1 px-3 collapse-title tracking-[0.06rem] font-medium border-b border-gray-200 min-h-[1.7rem!important]"
              >Relative Contacts</summary
            >
            <div
              class="collapse-content bg-gray-50 p-2 overflow-y-auto max-h-[60vh] pb-5"
            >
              <!-- list view -->
              {#if stateObject.user_current_view === "list"}
                <!-- edit button -->
                <div class="flex justify-end items-center sm:mt-2 gap-3">
                  <i
                    class="fa-solid fa-plus cursor-pointer"
                    on:click={() => addNewContent("relativeContacts")}
                  ></i>
                  <!-- view type icons for repo -->
                  <div class="flex gap-2 border border-gray-200">
                    <!-- table view -->
                    <svg
                      on:click={() => setView("repo", "table")}
                      class="w-7 h-7 px-1 cursor-pointer hover:bg-gray-200 text-gray-800 dark:text-white {stateObject.repo_current_view ===
                      'table'
                        ? 'text-red-500'
                        : ''}"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M4 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H4Zm0 8v6h7v-6H4Zm16 6h-7v-6h7v6Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <!-- list view -->
                    <svg
                      on:click={() => setView("user", "list")}
                      class="w-7 h-7 px-1 cursor-pointer hover:bg-gray-200 text-gray-800 border-x border-gray-200 dark:text-white {stateObject.user_current_view ===
                      'list'
                        ? 'text-red-500'
                        : ''}"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-width="2"
                        d="M9 8h10M9 12h10M9 16h10M4.99 8H5m-.02 4h.01m0 4H5"
                      />
                    </svg>
                    <!-- card view -->
                    <svg
                      on:click={() => setView("repo", "card")}
                      class="w-7 h-7 px-1 cursor-pointer hover:bg-gray-200 text-gray-800 dark:text-white {stateObject.repo_current_view ===
                      'card'
                        ? 'text-red-500 font-semibold'
                        : ''}"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 9h3m-3 3h3m-3 3h3m-6 1c-.306-.613-.933-1-1.618-1H7.618c-.685 0-1.312.387-1.618 1M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm7 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
                      />
                    </svg>
                  </div>
                </div>

                {#if selectedContentUser.relativeContacts.length > 0}
                  {#each selectedContentUser.relativeContacts as contact}
                    <details
                      class="collapse bg-base-200 border-gray-200 border mt-2"
                    >
                      <summary
                        style="font-size:1rem"
                        class="py-1 px-3 collapse-title tracking-[0.06rem] font-medium border-b border-gray-200 min-h-[1.7rem!important]"
                      >
                        <div class="flex justify-between items-center">
                          <span> {contact.relationship} </span>
                          <div class="flex gap-3 items-center">
                            <i
                              on:click={() =>
                                deleteContent("relativeContacts", contact.id)}
                              class="fa-solid fa-trash text-xs text-red-500 hover:text-red-600"
                            ></i>
                            <i
                              class="fa-solid fa-grip text-gray-500 text-xs cursor-grab"
                              draggable="true"
                              aria-hidden="true"
                            ></i>
                          </div>
                        </div></summary
                      >
                      <div
                        class="collapse-content bg-base-100 pb-0 overflow-y-auto"
                      >
                        <!-- edit button -->
                        <div class=" my-2 flex gap-2 justify-end">
                          <!--  save,cancel button user contacts-->
                          {#if globalVariableObject.user.relativeContacts[contact.id]}
                            <button
                              on:click={() =>
                                saveChangesUser(
                                  "relativeContacts",
                                  selectedContentUser,
                                  contact.id
                                )}
                              class="bg-blue-600 text-white px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-blue-800"
                              style="font-weight: 600;">Save</button
                            >
                            <button
                              on:click={() =>
                                cancelEditing("relativeContacts", contact.id)}
                              class="bg-gray-100 px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-gray-200"
                              style="font-weight: 600;">Cancel</button
                            >
                          {/if}

                          <button
                            on:click={() =>
                              enableEditing("relativeContacts", contact.id)}
                            class="bg-red-500 px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-red-600"
                            style="font-weight: 600;">Edit</button
                          >
                        </div>
                        <!-- user contacts details -->
                        <div class="p-3 sm:text-xs">
                          {#each Object.keys(contact) as fieldName}
                            {#if fieldName !== "id"}
                              <div class="flex gap-2 mb-2">
                                <div
                                  class="field1 border border-gray-200 py-1.5 px-2 w-[21vw] max-w-screen rounded-md bg-gray-100 capitalize"
                                >
                                  {fieldName}
                                </div>
                                <div
                                  class="field1 border border-gray-200 rounded-md bg-base-100 w-full"
                                >
                                  {#if fieldName === "name"}
                                    <input
                                      type="text"
                                      name=""
                                      id=""
                                      class="w-full py-1.5 px-2 rounded-md outline-none"
                                      bind:value={contact[fieldName]}
                                      disabled={!globalVariableObject.user
                                        .relativeContacts[contact.id]}
                                    />
                                  {:else if fieldName === "relationship"}
                                    <input
                                      type="text"
                                      name=""
                                      id=""
                                      class="w-full py-1.5 px-2 rounded-md outline-none"
                                      bind:value={contact[fieldName]}
                                      disabled={!globalVariableObject.user
                                        .relativeContacts[contact.id]}
                                    />
                                  {:else if fieldName === "phoneNumber"}
                                    <input
                                      type="text"
                                      name=""
                                      id=""
                                      class="w-full py-1.5 px-2 rounded-md outline-none"
                                      bind:value={contact[fieldName]}
                                      disabled={!globalVariableObject.user
                                        .relativeContacts[contact.id]}
                                    />
                                  {/if}
                                </div>
                              </div>
                            {/if}
                          {/each}
                        </div>
                      </div>
                    </details>
                  {/each}
                {:else}
                  <div class="text-xs text-center mt-2">No Content Found</div>
                {/if}
              {/if}
            </div>
          </details>

          <!-- documents -->
          <details class="collapse bg-base-200 border-gray-200 border mt-2">
            <summary
              style="font-size:1.125rem"
              class="py-1 px-3 collapse-title tracking-[0.06rem] font-medium border-b border-gray-200 min-h-[1.7rem!important]"
              >Documents</summary
            >
            <div
              class="collapse-content bg-gray-50 p-2 overflow-y-auto max-h-[60vh] pb-5"
            >
              <!-- list view -->
              {#if stateObject.user_current_view === "list"}
                <!-- edit button -->
                <div class="flex justify-end items-center sm:mt-2 gap-3">
                  <i
                    class="fa-solid fa-plus cursor-pointer"
                    on:click={() => addNewContent("documents")}
                  ></i>
                  <!-- view type icons for repo -->
                  <div class="flex gap-2 border border-gray-200">
                    <!-- table view -->
                    <svg
                      on:click={() => setView("repo", "table")}
                      class="w-7 h-7 px-1 cursor-pointer hover:bg-gray-200 text-gray-800 dark:text-white {stateObject.repo_current_view ===
                      'table'
                        ? 'text-red-500'
                        : ''}"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M4 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H4Zm0 8v6h7v-6H4Zm16 6h-7v-6h7v6Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <!-- list view -->
                    <svg
                      on:click={() => setView("user", "list")}
                      class="w-7 h-7 px-1 cursor-pointer hover:bg-gray-200 text-gray-800 border-x border-gray-200 dark:text-white {stateObject.user_current_view ===
                      'list'
                        ? 'text-red-500'
                        : ''}"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-width="2"
                        d="M9 8h10M9 12h10M9 16h10M4.99 8H5m-.02 4h.01m0 4H5"
                      />
                    </svg>
                    <!-- card view -->
                    <svg
                      on:click={() => setView("repo", "card")}
                      class="w-7 h-7 px-1 cursor-pointer hover:bg-gray-200 text-gray-800 dark:text-white {stateObject.repo_current_view ===
                      'card'
                        ? 'text-red-500 font-semibold'
                        : ''}"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 9h3m-3 3h3m-3 3h3m-6 1c-.306-.613-.933-1-1.618-1H7.618c-.685 0-1.312.387-1.618 1M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm7 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
                      />
                    </svg>
                  </div>
                </div>

                {#if selectedContentUser.documents.length > 0}
                  {#each selectedContentUser.documents as document}
                    <details
                      class="collapse bg-base-200 border-gray-200 border mt-2"
                    >
                      <summary
                        style="font-size:1rem"
                        class="py-1 px-3 collapse-title tracking-[0.06rem] font-medium border-b border-gray-200 min-h-[1.7rem!important]"
                      >
                        <div class="flex justify-between items-center">
                          <span> {document.type} </span>
                          <div class="flex gap-3 items-center">
                            <i
                              on:click={() =>
                                deleteContent("documents", document.id)}
                              class="fa-solid fa-trash text-xs text-red-500 hover:text-red-600"
                            ></i>
                            <i
                              class="fa-solid fa-grip text-gray-500 text-xs cursor-grab"
                              draggable="true"
                              aria-hidden="true"
                            ></i>
                          </div>
                        </div></summary
                      >
                      <div
                        class="collapse-content bg-base-100 pb-0 overflow-y-auto"
                      >
                        <!-- edit button -->
                        <div class=" my-2 flex gap-2 justify-end">
                          <!--  save,cancel button user contacts-->
                          {#if globalVariableObject.user.documents[document.id]}
                            <button
                              on:click={() =>
                                saveChangesUser(
                                  "documents",
                                  selectedContentUser,
                                  document.id
                                )}
                              class="bg-blue-600 text-white px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-blue-800"
                              style="font-weight: 600;">Save</button
                            >
                            <button
                              on:click={() =>
                                cancelEditing("documents", document.id)}
                              class="bg-gray-100 px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-gray-200"
                              style="font-weight: 600;">Cancel</button
                            >
                          {/if}

                          <button
                            on:click={() =>
                              enableEditing("documents", document.id)}
                            class="bg-red-500 px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-red-600"
                            style="font-weight: 600;">Edit</button
                          >
                        </div>
                        <!-- user contacts details -->
                        <div class="p-3 sm:text-xs">
                          {#each Object.keys(document) as fieldName}
                            {#if fieldName !== "id"}
                              <div class="flex gap-2 mb-2">
                                <div
                                  class="field1 border border-gray-200 py-1.5 px-2 w-[21vw] max-w-screen rounded-md bg-gray-100 capitalize"
                                >
                                  {fieldName}
                                </div>
                                <div
                                  class="field1 border border-gray-200 rounded-md bg-base-100 w-full"
                                >
                                  {#if fieldName === "type"}
                                    <input
                                      type="text"
                                      name=""
                                      s
                                      id=""
                                      class="w-full py-1.5 px-2 rounded-md outline-none"
                                      bind:value={document[fieldName]}
                                      disabled={!globalVariableObject.user
                                        .documents[document.id]}
                                    />
                                  {:else if fieldName === "number"}
                                    <input
                                      type="text"
                                      name=""
                                      id=""
                                      class="w-full py-1.5 px-2 rounded-md outline-none"
                                      bind:value={document[fieldName]}
                                      disabled={!globalVariableObject.user
                                        .documents[document.id]}
                                    />
                                  {:else if fieldName === "fileUrl"}
                                    <div
                                      class="text-primary cursor-pointer text-sm tracking-[0.05rem] pt-2 px-2"
                                    >
                                      <a href="">
                                        {document[fieldName]}
                                      </a>
                                    </div>
                                  {/if}
                                </div>
                              </div>
                            {/if}
                          {/each}
                        </div>
                      </div>
                    </details>
                  {/each}
                {:else}
                  <div class="text-xs text-center mt-2">No Content Found</div>
                {/if}
              {/if}
            </div>
          </details>

          <!-- address -->
          <details class="collapse bg-base-200 border-gray-200 border mt-2">
            <summary
              style="font-size:1.125rem"
              class="py-1 px-3 collapse-title tracking-[0.06rem] font-medium border-b border-gray-200 min-h-[1.7rem!important]"
              >Address</summary
            >
            <div
              class="collapse-content bg-gray-50 p-2 overflow-y-auto max-h-[60vh] pb-5"
            >
              <!-- list view -->
              {#if stateObject.user_current_view === "list"}
                <!-- view icons -->

                <div class="flex justify-end sm:mt-2 items-center gap-3">
                  <i
                    class="fa-solid fa-plus cursor-pointer"
                    on:click={() => addNewContent("addresses")}
                  ></i>
                  <!-- view type icons for repo -->
                  <div class="flex gap-2 border border-gray-200">
                    <!-- table view -->
                    <svg
                      on:click={() => setView("repo", "table")}
                      class="w-7 h-7 px-1 cursor-pointer hover:bg-gray-200 text-gray-800 dark:text-white {stateObject.repo_current_view ===
                      'table'
                        ? 'text-red-500'
                        : ''}"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M4 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H4Zm0 8v6h7v-6H4Zm16 6h-7v-6h7v6Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <!-- list view -->
                    <svg
                      on:click={() => setView("user", "list")}
                      class="w-7 h-7 px-1 cursor-pointer hover:bg-gray-200 text-gray-800 border-x border-gray-200 dark:text-white {stateObject.user_current_view ===
                      'list'
                        ? 'text-red-500'
                        : ''}"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-width="2"
                        d="M9 8h10M9 12h10M9 16h10M4.99 8H5m-.02 4h.01m0 4H5"
                      />
                    </svg>
                    <!-- card view -->
                    <svg
                      on:click={() => setView("repo", "card")}
                      class="w-7 h-7 px-1 cursor-pointer hover:bg-gray-200 text-gray-800 dark:text-white {stateObject.repo_current_view ===
                      'card'
                        ? 'text-red-500 font-semibold'
                        : ''}"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 9h3m-3 3h3m-3 3h3m-6 1c-.306-.613-.933-1-1.618-1H7.618c-.685 0-1.312.387-1.618 1M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm7 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
                      />
                    </svg>
                  </div>
                </div>

                {#if selectedContentUser.addresses.length > 0}
                  {#each selectedContentUser.addresses as address}
                    <details
                      class="collapse bg-base-200 border-gray-200 border mt-2"
                    >
                      <summary
                        style="font-size:1rem"
                        class="py-1 px-3 collapse-title tracking-[0.06rem] font-medium border-b border-gray-200 min-h-[1.7rem!important]"
                      >
                        <div class="flex justify-between items-center">
                          <span> {address.type} </span>
                          <div class="flex gap-3 items-center">
                            <i
                              on:click={() =>
                                deleteContent("addresses", address.id)}
                              class="fa-solid fa-trash text-xs text-red-500 hover:text-red-600"
                            ></i>
                            <i
                              class="fa-solid fa-grip text-gray-500 text-xs cursor-grab"
                              draggable="true"
                              aria-hidden="true"
                            ></i>
                          </div>
                        </div></summary
                      >
                      <div
                        class="collapse-content bg-base-100 pb-0 overflow-y-auto"
                      >
                        <!-- edit button -->
                        <div class=" my-2 flex gap-2 justify-end">
                          <!--  save,cancel button user contacts-->
                          {#if globalVariableObject.user.address[address.id]}
                            <button
                              on:click={() =>
                                saveChangesUser(
                                  "address",
                                  selectedContentUser,
                                  address.id
                                )}
                              class="bg-blue-600 text-white px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-blue-800"
                              style="font-weight: 600;">Save</button
                            >
                            <button
                              on:click={() =>
                                cancelEditing("address", address.id)}
                              class="bg-gray-100 px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-gray-200"
                              style="font-weight: 600;">Cancel</button
                            >
                          {/if}

                          <button
                            on:click={() =>
                              enableEditing("address", address.id)}
                            class="bg-red-500 px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-red-600"
                            style="font-weight: 600;">Edit</button
                          >
                        </div>
                        <!-- user contacts details -->
                        <div class="p-3 sm:text-xs">
                          {#each Object.keys(address) as fieldName}
                            {#if fieldName !== "id"}
                              <div class="flex gap-2 mb-2">
                                <div
                                  class="field1 border border-gray-200 py-1.5 px-2 w-[21vw] max-w-screen rounded-md bg-gray-100 capitalize"
                                >
                                  {fieldName}
                                </div>
                                <div
                                  class="field1 border border-gray-200 rounded-md bg-base-100 w-full"
                                >
                                  {#if fieldName === "type"}
                                    <input
                                      type="text"
                                      name=""
                                      id=""
                                      class="w-full py-1.5 px-2 rounded-md outline-none"
                                      bind:value={address[fieldName]}
                                      disabled={!globalVariableObject.user
                                        .address[address.id]}
                                    />
                                  {:else if fieldName === "line1"}
                                    <input
                                      type="text"
                                      name=""
                                      id=""
                                      class="w-full py-1.5 px-2 rounded-md outline-none"
                                      bind:value={address[fieldName]}
                                      disabled={!globalVariableObject.user
                                        .address[address.id]}
                                    />
                                  {:else if fieldName === "line2"}
                                    <input
                                      type="text"
                                      name=""
                                      id=""
                                      class="w-full py-1.5 px-2 rounded-md outline-none"
                                      bind:value={address[fieldName]}
                                      disabled={!globalVariableObject.user
                                        .address[address.id]}
                                    />
                                  {:else if fieldName === "city"}
                                    <input
                                      type="text"
                                      name=""
                                      id=""
                                      class="w-full py-1.5 px-2 rounded-md outline-none"
                                      bind:value={address[fieldName]}
                                      disabled={!globalVariableObject.user
                                        .address[address.id]}
                                    />
                                  {:else if fieldName === "state"}
                                    <input
                                      type="text"
                                      name=""
                                      id=""
                                      class="w-full py-1.5 px-2 rounded-md outline-none"
                                      bind:value={address[fieldName]}
                                      disabled={!globalVariableObject.user
                                        .address[address.id]}
                                    />
                                  {:else if fieldName === "postalCode"}
                                    <input
                                      type="text"
                                      name=""
                                      id=""
                                      class="w-full py-1.5 px-2 rounded-md outline-none"
                                      bind:value={address[fieldName]}
                                      disabled={!globalVariableObject.user
                                        .address[address.id]}
                                    />
                                  {:else if fieldName === "country"}
                                    <input
                                      type="text"
                                      name=""
                                      id=""
                                      class="w-full py-1.5 px-2 rounded-md outline-none"
                                      bind:value={address[fieldName]}
                                      disabled={!globalVariableObject.user
                                        .address[address.id]}
                                    />
                                  {/if}
                                </div>
                              </div>
                            {/if}
                          {/each}
                        </div>
                      </div>
                    </details>
                  {/each}
                {:else}
                  <div class="text-xs text-center mt-2">No Content Found</div>
                {/if}
              {/if}
            </div>
          </details>

          <!--  occupation details -->
          <details class="collapse bg-base-200 border-gray-200 border mt-2">
            <summary
              style="font-size:17px"
              class="py-1 px-3 collapse-title tracking-[0.06rem] font-medium border-b border-gray-200 min-h-[1.7rem!important]"
              >Occupation</summary
            >
            <div class="collapse-content bg-gray-50 p-2 overflow-y-auto pb-5">
              <!-- list view -->
              {#if stateObject.user_current_view === "list"}
                <!-- view icons -->
                <div class="flex justify-end items-center sm:mt-2 gap-3">
                  <!-- edit button -->
                  <div class=" my-2 flex gap-2 items-center justify-end">
                    <!--  save,cancel button user contacts-->
                    {#if globalVariableObject.user.occupation[selectedContentUser.id]}
                      <button
                        on:click={() =>
                          saveChangesUser(
                            "occupation",
                            selectedContentUser,
                            selectedContentUser.id
                          )}
                        class="bg-blue-600 text-white px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-blue-800"
                        style="font-weight: 600;">Save</button
                      >
                      <button
                        on:click={() =>
                          cancelEditing("occupation", selectedContentUser.id)}
                        class="bg-gray-100 px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-gray-200"
                        style="font-weight: 600;">Cancel</button
                      >
                    {/if}

                    <button
                      on:click={() =>
                        enableEditing("occupation", selectedContentUser.id)}
                      class="bg-red-500 px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-red-600"
                      style="font-weight: 600;">Edit</button
                    >
                  </div>
                  <!-- view type icons for repo -->
                  <div class="flex gap-2 border items-center border-gray-200">
                    <!-- table view -->
                    <svg
                      on:click={() => setView("repo", "table")}
                      class="w-7 h-7 px-1 cursor-pointer hover:bg-gray-200 text-gray-800 dark:text-white {stateObject.repo_current_view ===
                      'table'
                        ? 'text-red-500'
                        : ''}"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M4 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H4Zm0 8v6h7v-6H4Zm16 6h-7v-6h7v6Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <!-- list view -->
                    <svg
                      on:click={() => setView("user", "list")}
                      class="w-7 h-7 px-1 cursor-pointer hover:bg-gray-200 text-gray-800 border-x border-gray-200 dark:text-white {stateObject.user_current_view ===
                      'list'
                        ? 'text-red-500'
                        : ''}"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-width="2"
                        d="M9 8h10M9 12h10M9 16h10M4.99 8H5m-.02 4h.01m0 4H5"
                      />
                    </svg>
                    <!-- card view -->
                    <svg
                      on:click={() => setView("repo", "card")}
                      class="w-7 h-7 px-1 cursor-pointer hover:bg-gray-200 text-gray-800 dark:text-white {stateObject.repo_current_view ===
                      'card'
                        ? 'text-red-500 font-semibold'
                        : ''}"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 9h3m-3 3h3m-3 3h3m-6 1c-.306-.613-.933-1-1.618-1H7.618c-.685 0-1.312.387-1.618 1M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm7 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
                      />
                    </svg>
                  </div>
                </div>

                {#each selectedContentUser.occupationDetails as detail}
                  <div class="flex gap-2 mb-2">
                    <!-- Field Name (Left Column) -->
                    <div
                      class="field1 border border-gray-200 py-1.5 px-2 w-[21vw] max-w-screen rounded-md bg-gray-100 capitalize"
                    >
                      {detail.field}
                    </div>

                    <!-- Field Value (Right Column) -->
                    <div
                      class="field1 border border-gray-200 rounded-md bg-base-100 w-full"
                    >
                      {#if detail.field === "dateOfJoining"}
                        <input
                          type="date"
                          class="w-full py-1.5 px-2 rounded-md outline-none"
                          bind:value={detail.value}
                          disabled={!globalVariableObject.user.occupation[
                            selectedContentUser.id
                          ]}
                        />
                      {:else if detail.field === "jobTitle" || detail.field === "company" || detail.field === "employeeId"}
                        <input
                          type="text"
                          class="w-full py-1.5 px-2 rounded-md outline-none"
                          bind:value={detail.value}
                          disabled={!globalVariableObject.user.occupation[
                            selectedContentUser.id
                          ]}
                        />
                      {:else if detail.field === "occupation"}
                        <select
                          class="w-full py-1.5 px-2 rounded-md outline-none"
                          bind:value={detail.value}
                          disabled={!globalVariableObject.user.occupation[
                            selectedContentUser.id
                          ]}
                        >
                          <option value="Software Developer"
                            >Software Developer</option
                          >
                          <option value="Senior Developer"
                            >Senior Developer</option
                          >
                          <option value="Manager">Manager</option>
                          <!-- Add more occupation options as needed -->
                        </select>
                      {/if}
                    </div>
                  </div>
                {/each}
              {/if}
            </div>
          </details>

          <!--  bank details section-->
          <details class="collapse bg-base-200 border-gray-200 border mt-2">
            <summary
              style="font-size:17px"
              class="py-1 px-3 collapse-title tracking-[0.06rem] font-medium border-b border-gray-200 min-h-[1.7rem!important]"
              >Bank Details</summary
            >
            <div class="collapse-content bg-gray-50 p-2 overflow-y-auto pb-5">
              <!-- list view -->
              {#if stateObject.user_current_view === "list"}
                <!-- view icons -->
                <div class="flex justify-end items-center sm:mt-2 gap-3">
                  <!-- edit button -->
                  <div class=" my-2 flex gap-2 items-center justify-end">
                    <!--  save,cancel button user contacts-->
                    {#if globalVariableObject.user.bankDetails[selectedContentUser.id]}
                      <button
                        on:click={() =>
                          saveChangesUser(
                            "bankDetails",
                            selectedContentUser,
                            selectedContentUser.id
                          )}
                        class="bg-blue-600 text-white px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-blue-800"
                        style="font-weight: 600;">Save</button
                      >
                      <button
                        on:click={() =>
                          cancelEditing("bankDetails", selectedContentUser.id)}
                        class="bg-gray-100 px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-gray-200"
                        style="font-weight: 600;">Cancel</button
                      >
                    {/if}

                    <button
                      on:click={() =>
                        enableEditing("bankDetails", selectedContentUser.id)}
                      class="bg-red-500 px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-red-600"
                      style="font-weight: 600;">Edit</button
                    >
                  </div>
                  <!-- view type icons for repo -->
                  <div class="flex gap-2 border items-center border-gray-200">
                    <!-- table view -->
                    <svg
                      on:click={() => setView("repo", "table")}
                      class="w-7 h-7 px-1 cursor-pointer hover:bg-gray-200 text-gray-800 dark:text-white {stateObject.repo_current_view ===
                      'table'
                        ? 'text-red-500'
                        : ''}"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M4 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H4Zm0 8v6h7v-6H4Zm16 6h-7v-6h7v6Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <!-- list view -->
                    <svg
                      on:click={() => setView("user", "list")}
                      class="w-7 h-7 px-1 cursor-pointer hover:bg-gray-200 text-gray-800 border-x border-gray-200 dark:text-white {stateObject.user_current_view ===
                      'list'
                        ? 'text-red-500'
                        : ''}"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-width="2"
                        d="M9 8h10M9 12h10M9 16h10M4.99 8H5m-.02 4h.01m0 4H5"
                      />
                    </svg>
                    <!-- card view -->
                    <svg
                      on:click={() => setView("repo", "card")}
                      class="w-7 h-7 px-1 cursor-pointer hover:bg-gray-200 text-gray-800 dark:text-white {stateObject.repo_current_view ===
                      'card'
                        ? 'text-red-500 font-semibold'
                        : ''}"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 9h3m-3 3h3m-3 3h3m-6 1c-.306-.613-.933-1-1.618-1H7.618c-.685 0-1.312.387-1.618 1M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm7 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
                      />
                    </svg>
                  </div>
                </div>

                {#each selectedContentUser.bankDetails as detail}
                  <div class="flex gap-2 mb-2">
                    <!-- Field Name (Left Column) -->
                    <div
                      class="field1 border border-gray-200 py-1.5 px-2 w-[21vw] max-w-screen rounded-md bg-gray-100 capitalize"
                    >
                      {detail.field}
                    </div>

                    <!-- Field Value (Right Column) -->
                    <div
                      class="field1 border border-gray-200 rounded-md bg-base-100 w-full"
                    >
                      <input
                        type="text"
                        class="w-full py-1.5 px-2 rounded-md outline-none"
                        bind:value={detail.value}
                        disabled={!globalVariableObject.user.bankDetails[
                          selectedContentUser.id
                        ]}
                      />
                    </div>
                  </div>
                {/each}
              {/if}
            </div>
          </details>

          <!-- Additional Info Section -->
          <details class="collapse bg-base-200 border-gray-200 border mt-2">
            <summary
              style="font-size:17px"
              class="py-1 px-3 collapse-title tracking-[0.06rem] font-medium border-b border-gray-200 min-h-[2rem!important]"
              >Additional Info</summary
            >
            <div class="collapse-content bg-gray-50 p-2 overflow-y-auto pb-5">
              <!-- view icons -->
              <div class="flex justify-end items-center sm:mt-2 gap-3">
                <!-- edit button -->
                <div class=" my-2 flex gap-2 items-center justify-end">
                  <!--  save,cancel button user contacts-->
                  {#if globalVariableObject.user.additionalInfo[selectedContentUser.id]}
                    <button
                      on:click={() =>
                        saveChangesUser(
                          "additionalInfo",
                          selectedContentUser,
                          selectedContentUser.id
                        )}
                      class="bg-blue-600 text-white px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-blue-800"
                      style="font-weight: 600;">Save</button
                    >
                    <button
                      on:click={() =>
                        cancelEditing("additionalInfo", selectedContentUser.id)}
                      class="bg-gray-100 px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-gray-200"
                      style="font-weight: 600;">Cancel</button
                    >
                  {/if}

                  <button
                    on:click={() =>
                      enableEditing("additionalInfo", selectedContentUser.id)}
                    class="bg-red-500 px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-red-600"
                    style="font-weight: 600;">Edit</button
                  >
                </div>
                <!-- view type icons for repo -->
                <div class="flex gap-2 border items-center border-gray-200">
                  <!-- table view -->
                  <svg
                    on:click={() => setView("repo", "table")}
                    class="w-7 h-7 px-1 cursor-pointer hover:bg-gray-200 text-gray-800 dark:text-white {stateObject.repo_current_view ===
                    'table'
                      ? 'text-red-500'
                      : ''}"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M4 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H4Zm0 8v6h7v-6H4Zm16 6h-7v-6h7v6Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <!-- list view -->
                  <svg
                    on:click={() => setView("user", "list")}
                    class="w-7 h-7 px-1 cursor-pointer hover:bg-gray-200 text-gray-800 border-x border-gray-200 dark:text-white {stateObject.user_current_view ===
                    'list'
                      ? 'text-red-500'
                      : ''}"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-width="2"
                      d="M9 8h10M9 12h10M9 16h10M4.99 8H5m-.02 4h.01m0 4H5"
                    />
                  </svg>
                  <!-- card view -->
                  <svg
                    on:click={() => setView("repo", "card")}
                    class="w-7 h-7 px-1 cursor-pointer hover:bg-gray-200 text-gray-800 dark:text-white {stateObject.repo_current_view ===
                    'card'
                      ? 'text-red-500 font-semibold'
                      : ''}"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 9h3m-3 3h3m-3 3h3m-6 1c-.306-.613-.933-1-1.618-1H7.618c-.685 0-1.312.387-1.618 1M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm7 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
                    />
                  </svg>
                </div>
              </div>

              <!-- list view -->
              {#if stateObject.user_current_view === "list"}
                {#each selectedContentUser.additionalInfo as detail}
                  <div class="flex gap-2 mb-2">
                    <!-- Field Name (Left Column) -->
                    <div
                      class="field1 border border-gray-200 py-1.5 px-2 w-[21vw] max-w-screen rounded-md bg-gray-100 capitalize"
                    >
                      {detail.field}
                    </div>

                    <!-- Field Value (Right Column) -->
                    <div
                      class="field1 border border-gray-200 rounded-md bg-base-100 w-full"
                    >
                      {#if Array.isArray(detail.value)}
                        <!-- Render each array value in a comma-separated format -->
                        <ul
                          class="list-disc mx-2 flex items-center gap-3 pe-1 list-inside"
                        >
                          {#each detail.value as item}
                            <li>{item}</li>
                          {/each}
                        </ul>
                      {:else}
                        <input
                          type="text"
                          class="w-full py-1.5 px-2 rounded-md outline-none"
                          bind:value={detail.value}
                          disabled={!globalVariableObject.user.additionalInfo[
                            selectedContentUser.id
                          ]}
                        />
                      {/if}
                    </div>
                  </div>
                {/each}
              {/if}
            </div>
          </details>
        </div>
      {/if}

      <!-- <div class="text-xs text-center tracking-[0.06rem] mt-4">
        No content available
      </div> -->
    </div>
  </div>
</main>











<style>
  .collapse:not(.show) {
    display: block;
  }
</style>


 