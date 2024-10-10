<script>
	import LoginSection from './loginSection.svelte';
  import { onMount } from "svelte";
  import Toast from "./Toast.svelte";
  import { repo } from "./../apiData/data";
  import UserSection from "./userSection.svelte";

  let repoContent = [...repo];
  // Create a copy of the original content
  let repoOriginalContent = JSON.parse(JSON.stringify(repoContent));

  
  let selectedContent = repo[0];
  let selectedBranch = selectedContent.branches[0];
  let selectedCommit = selectedBranch.commits[0];
  let currentPage = 1;
  const itemsPerPage = 2; // Number of repos to display per page
  let showToast = false;
  let toastMessage = "";
  let toastType = "success";
  let loginSection = false;
  // Array of languages
  const languages = ["English", "Spanish", "French", "German", "Italian"];
  let highlightedFields = {}; // To track highlighted fields after save
  // Static list of test suites
  const testSuites = [
    "Test Suite 1",
    "Test Suite 2",
    "Test Suite 3",
    "Test Suite 4",
    "Test Suite 5",
  ];

  // Track expanded state for each repo
  let expandedRepos = {};


  function openLoginSection(event){
    event.preventDefault();
    loginSection=true;
  }


  // Toggle expand/collapse for a repo
  function toggleExpand(repoId) {
    expandedRepos[repoId] = !expandedRepos[repoId];
  }

  onMount(() => {
    // Get the Test option and modal checkbox
    const testOption = document.getElementById("test-option");
    const testModalCheckbox = document.getElementById("test-modal");

    // Add event listener to show the modal when Test is clicked
    testOption.addEventListener("click", function () {
      testModalCheckbox.checked = true; // Open the modal
    });
  });

  // Function to handle language selection
  function selectLanguage(language) {
    console.log("Selected language:", language);
    // Add logic here to update the application language
  }

  //   global variable object
  let globalVariableObject = {
    isEditingBranchName: false,
    editingBranchId: null, // Track which branch is being edited
    sidebar: false, // show sidebar
    isDropdownOpen: false,
    filterOptionBox: false,
    isEditing: {},
    user: {
      general: {},
      contacts: {},
      relativeContacts:{},
      documents: {},
      address: {},
      occupation:{},
      bankDetails:{},
      additionalInfo: {},
    },
    changes: {}, // To track changes
    isEditingBranch: {},
    isEditingCommit: {},
    isEditingAccess: {},
    selectedRepos: [], // Array to keep track of selected repositories
    selectedUsers: [], // Array to keep track of selected repositories
    selectedAction: "",
    selectedAccess: selectedBranch.access[0],
    isAddPermission: {},
    newPermission: "",
    infoDropdown: {},
    importdropdown:false,
    // Variable to store the currently selected filter
    selectedFilter: "",
    searchQuery: "",
    firstCol: true,
    compareRepos: false,
    selectedReposForCompare: [],
    isEditingRepo: {},
    checkedBox: false,
    searchQueryArray: [],
    userSection:false
  };

  // Filtered repo list (initialize with the full list of repos)
  let filteredRepos = [...repoContent];

  //   state object
  let stateObject = {
    global_current_view: "list",
    repo_current_view: "list",
    branch_current_view: "list",
    commit_current_view: "list",
    user_current_view: "list",
    
  };

  function showUserSection(){
    globalVariableObject.userSection = !globalVariableObject.userSection;
  }

  //   toggle first col in mobile
  function toggleFirstColumn() {
    globalVariableObject.firstCol = !globalVariableObject.firstCol;
  }

  // Object to store filter options
  const filters = {
    fromMe: "From Me",
    last7Days: "Last 7 Days",
  };

  // Function to handle filter click (you can customize this function as needed)
  //   function applyFilter(filterKey) {
  //     globalVariableObject.selectedFilter = filterKey;
  //     console.log(`Filter applied: ${filters[filterKey]}`);
  //     // Implement your filter logic here
  //   }

  let originalBranches = [...selectedContent.branches]; // This will store the unmodified branches of the selected repo

  //   show content details
  function showContentDetails(id, repo) {
    console.log(repo);

    selectedContent = filteredRepos.find((r) => r.id === id);
    originalBranches = [...repo.branches];
    selectedContent.branches = [...repo.branches]; // Set the branches to the original list
  }

  // Function to handle search repo, branch and commits
  function handleSearchContent() {
    const query = globalVariableObject.searchQuery.toLowerCase();

    globalVariableObject.searchQueryArray.push(query);

    // Filter repoContent based on the search query for repo name, branch names, and commit messages
    filteredRepos = repoContent.filter((repo) => {
      // Check if the repo name matches the search query
      const repoNameMatches = repo.objDetails.name
        .toLowerCase()
        .includes(query);
      return repoNameMatches;
    });

    // Filter the branches from the originalBranches, not the already filtered list
    // Filter branches based on branch name or commit messages
    // Parse the query for branch or commit specific searches
    let branchSearch = query.match(/branch:"([^"]+)"/);
    let commitSearch = query.match(/commit:"([^"]+)"/);

    // If the user is searching for a specific branch
    if (branchSearch) {
      const branchName = branchSearch[1].toLowerCase();
      selectedContent.branches = originalBranches.filter((branch) =>
        branch.name.toLowerCase().includes(branchName)
      );
    }
    // If the user is searching for a specific commit message
    else if (commitSearch) {
      const commitMessage = commitSearch[1].toLowerCase();
      selectedContent.branches = originalBranches
        .map((branch) => {
          // Filter commits within the branch that match the commit message
          const filteredCommits = branch.commits.filter((commit) =>
            commit.commitMessage.toLowerCase().includes(commitMessage)
          );

          // If the branch has matching commits, return a new branch object with filtered commits
          if (filteredCommits.length > 0) {
            return { ...branch, commits: filteredCommits };
          }
          return null;
        })
        .filter((branch) => branch !== null); // Remove branches that have no matching commits
    }
    // General search across both branch names and commit messages
    else {
      selectedContent.branches = originalBranches
        .map((branch) => {
          const branchNameMatches = branch.name.toLowerCase().includes(query);

          // Filter commits within the branch that match the query
          const filteredCommits = branch.commits.filter((commit) =>
            commit.commitMessage.toLowerCase().includes(query)
          );

          // If either the branch name matches or there are matching commits, return the branch
          if (branchNameMatches || filteredCommits.length > 0) {
            return {
              ...branch,
              commits:
                filteredCommits.length > 0 ? filteredCommits : branch.commits,
            };
          }
          return null;
        })
        .filter((branch) => branch !== null); // Remove branches that don't match
    }

    console.log(selectedContent.branches, "Filtered branches and commits");
  }

  function searchCommits() {
    const query = globalVariableObject.searchQuery.toLowerCase();

    selectedContent.branches = originalBranches
      .map((branch) => {
        const branchNameMatches = branch.name.toLowerCase().includes(query);

        // Filter commits within the branch that match the query
        const filteredCommits = branch.commits.filter((commit) =>
          commit.commitMessage.toLowerCase().includes(query)
        );

        // If either the branch name matches or there are matching commits, return the branch
        if (branchNameMatches || filteredCommits.length > 0) {
          return {
            ...branch,
            commits:
              filteredCommits.length > 0 ? filteredCommits : branch.commits,
          };
        }
        return null;
      })
      .filter((branch) => branch !== null); // Remove branches that don't match
  }

  function searchBranches() {
    const query = globalVariableObject.searchQuery.toLowerCase();

    selectedContent.branches = originalBranches
      .map((branch) => {
        const branchNameMatches = branch.name.toLowerCase().includes(query);

        // Filter commits within the branch that match the query
        const filteredCommits = branch.commits.filter((commit) =>
          commit.commitMessage.toLowerCase().includes(query)
        );

        // If either the branch name matches or there are matching commits, return the branch
        if (branchNameMatches || filteredCommits.length > 0) {
          return {
            ...branch,
            commits:
              filteredCommits.length > 0 ? filteredCommits : branch.commits,
          };
        }
        return null;
      })
      .filter((branch) => branch !== null); // Remove branches that don't match
  }

  // Function to remove a query from the array
  function removeQuery(query) {
    globalVariableObject.searchQueryArray =
      globalVariableObject.searchQueryArray.filter((item) => item !== query);
  }

  //   open repo info dropdown
  function openInfoDropdown(id) {
    selectedContent = repo.find((r) => r.id === id);
    globalVariableObject.infoDropdown[id] =
      !globalVariableObject.infoDropdown[id];
  }

  //   edit branch
  function editBranch(id) {
    globalVariableObject.isEditingBranch[id] =
      !globalVariableObject.isEditingBranch[id];
  }

  //   edit repo
  function editRepo(id) {
    selectedContent = filteredRepos.find((r) => r.id === id);
    globalVariableObject.isEditingRepo[id] =
      !globalVariableObject.isEditingRepo[id];
  }

  //   show sidebar
  function showSidebar() {
    globalVariableObject.sidebar = !globalVariableObject.sidebar;
  }
  // Function to set the view type for a specific context (repo, branch, or commit)
  function setView(context, viewType) {
    console.log(context, "context", viewType, "viewType");

    if (context === "repo") {
      stateObject.repo_current_view = viewType;
    } else if (context === "branch") {
      stateObject.branch_current_view = viewType;
    } else if (context === "commit") {
      stateObject.commit_current_view = viewType;
    } else if (context === "global") {
      stateObject.global_current_view = viewType;
    }
  }

  // Function to handle Edit button click
  function enableEditing(id) {
    globalVariableObject.isEditing[id] = true;
  }

  //   enable editing branch name
  function enableEditingBranch(id) {
    globalVariableObject.isEditingBranchName = true;
    globalVariableObject.editingBranchId = id;
  }

  // close input on enter key press
  function handleKeyDown(event, branchId) {
    if (event.key === "Enter") {
      globalVariableObject.isEditingBranchName = false;
      globalVariableObject.editingBranchId = null;
      // Save branch name and cancel editing
    }
  }

  function enableEditingCommit(commitId, branchId) {
    // Toggle the editing state for the selected commit
    selectedBranch = selectedContent.branches.find((b) => b.id === branchId); //selected branch

    selectedCommit = selectedBranch.commits.find(
      (c) => c.commitId === commitId
    ); //selected commit

    globalVariableObject.isEditingCommit[commitId] =
      !globalVariableObject.isEditingCommit[commitId];
  }

  // Function to generate a new repository with current date and time
  function addNewRepo() {
    const newRepoId = generateUniqueId("repo");
    const currentDate = new Date();
    const newRepo = {
      id: newRepoId,
      objDetails: {
        name: `repo${repoContent.length + 1}`,
        time: currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: currentDate.toISOString().split("T")[0],
        totalBranches: "",
      },
      branches: [], // New repo starts with no branches
    };

    // Add the new repository to the repoContent array
    repoContent = [...repoContent, newRepo];
    repoContent = [...repoContent];
    filteredRepos = [...repoContent];
  }

  // Function to handle Save button click
  function saveChanges(content) {
    globalVariableObject.isEditing[selectedContent.id] = false;
    globalVariableObject.isEditingCommit[selectedCommit.commitId] = false;
    globalVariableObject.isEditingBranch[selectedBranch.id] = false;
    globalVariableObject.isEditingAccess[
      globalVariableObject.selectedAccess.id
    ] = false;
    globalVariableObject.isEditingRepo[selectedContent.id] = false;

    // Check if there's content to save
    if (content) {
      // Find the original repo
      let originalRepo = repoOriginalContent.find((o) => o.id === content.id);

      // If no originalRepo is found, this is a new repo
      if (!originalRepo) {
        originalRepo = { objDetails: {}, branches: [] };
      }

      // Initialize or reset highlightedFields for this repo
      highlightedFields[content.id] = highlightedFields[content.id] || {};

      // Compare fields and highlight only those that changed
      const fieldsToCompare = ["name", "time", "date"];
      fieldsToCompare.forEach((field) => {
        if (content.objDetails[field] !== originalRepo.objDetails[field]) {
          highlightedFields[content.id][field] = true; // Mark this field for highlighting
        } else {
          highlightedFields[content.id][field] = false; // Clear highlight if no change
        }
      });

      // Save the changes to the content
      repoContent = [...repoContent];

      // Show success message
      showToast = true;
      toastMessage = "Saved Successfully";
      toastType = "success";
      setTimeout(() => {
        showToast = false;
      }, 3000);
    }
  }

  // Track changes
  let changesDetect = [];

// pull request

function pullRequest(content) {
  let originalRepo = repoOriginalContent.find((o) => o.id === content.id);

  if (originalRepo) {
    // Compare fields to detect changes
    Object.keys(content.objDetails).forEach((field) => {
      const newValue = content.objDetails[field];
      const previousValue = originalRepo.objDetails[field];

      // Check if the value has changed
      if (newValue !== previousValue) {
        // Check if the change for the same field is already recorded
        const existingChangeIndex = changesDetect.findIndex(
          (change) => change.fieldName === field
        );

        if (existingChangeIndex === -1) {
          // If the field change doesn't exist, push a new change
          changesDetect.push({
            fieldName: field,
            previousValue: previousValue,
            newValue: newValue
          });
        } else {
          // Update the change if it already exists
          changesDetect[existingChangeIndex].newValue = newValue;
        }
      }
    });
  }

  // Log the changesDetect to verify
  console.log('Changes detected:', changesDetect);

  // Show the modal if there are any changes
  if (changesDetect.length > 0) {
    showToast = true;
    toastMessage = "File Updated";
    toastType = "success";
    setTimeout(() => {
      showToast = false;
      document.getElementById("my_modal_32").showModal();
    }, 3000);
  }
}

  // Function to handle Cancel button click
  function cancelEditing() {
    globalVariableObject.isEditing[selectedContent.id] = false;
    // Reset any changes if needed

    // Revert changes
    revertChanges();
  }

  //   open filter box
  function openFilterOptionBox() {
    globalVariableObject.filterOptionBox =
      !globalVariableObject.filterOptionBox;
    globalVariableObject.isDropdownOpen = false;
  }

  //   toggle dropdown
  function toggleDropdown() {
    globalVariableObject.isDropdownOpen = !globalVariableObject.isDropdownOpen;
    globalVariableObject.filterOptionBox = false;
  }

  //   close dropdown
  function closeDropdown() {
    globalVariableObject.isDropdownOpen = false;
  }

  //   add a new branch
  function addNewBranch(repoId) {
    if (selectedContent) {
      // Create a new branch object
      const newBranch = {
        id: `branch${selectedContent.branches.length + 1}`, // Auto-increment branch ID
        name: `new-branch-${selectedContent.branches.length + 1}`,
        branchOwner: "",
        lastCommited: "",
        createdOn: "",
        commits: [], // Start with an empty commits array
        access: [],
      };

      console.log(newBranch, "new branch");

      // Add the new branch to the repository's branches array
      selectedContent.branches = [...selectedContent.branches, newBranch];

      originalBranches = [...selectedContent.branches];
      // Update the totalBranches field in objDetails
      selectedContent.objDetails.totalBranches =
        selectedContent.branches.length;
    }
  }

  // Delete a branch by its ID
  function deleteBranch(branchId) {
    if (selectedContent) {
      // Filter out the branch to be deleted
      selectedContent.branches = selectedContent.branches.filter(
        (branch) => branch.id !== branchId
      );

      // Update the totalBranches field in objDetails
      selectedContent.objDetails.totalBranches =
        selectedContent.branches.length;
    }
  }

  // Add a new commit in a specific branch
  function addNewCommit(branchId) {
    if (selectedContent) {
      // Find the specific branch by ID
      const specificBranch = selectedContent.branches.find(
        (b) => b.id === branchId
      );

      if (specificBranch) {
        // Create a new commit object
        const newCommit = {
          commitId: `commit${specificBranch.commits.length + 1}`, // Auto-increment commit ID
          commitMessage: `New commit in branch ${specificBranch.name}`,
          user: `User${specificBranch.commits.length + 1}`,
          commitTime: new Date().toLocaleTimeString(),
          commitDate: new Date().toLocaleDateString(),
          changes: [
            {
              fileName: "newFile.js",
              changeType: "added",
              code: "+console.log('New Commit');",
            },
          ],
          access: [],
        };

        // Add the new commit to the branch's commits array
        specificBranch.commits = [...specificBranch.commits, newCommit];
        selectedContent.branches = [...selectedContent.branches];
        console.log(specificBranch, "specific branch");
      }
    }
  }

  // Delete a commit by its ID
  function deleteCommit(branchId, commitId) {
    if (selectedContent) {
      // Find the specific branch by ID
      const specificBranch = selectedContent.branches.find(
        (b) => b.id === branchId
      );

      if (specificBranch) {
        // Filter out the branch to be deleted
        specificBranch.commits = specificBranch.commits.filter(
          (commit) => commit.commitId !== commitId
        );
      }
      selectedContent.branches = [...selectedContent.branches];
    }
  }

  //   delete specific repo
  function deleteRepo(repoId) {
    repoContent = repoContent.filter((r) => r.id !== repoId);

    filteredRepos = [...repoContent];
  }

  // Function to handle input changes
  function handleInputChange(event, fieldName) {
    globalVariableObject.changes[fieldName] = event.target.value;
    selectedContent.objDetails[fieldName] = event.target.value;
  }

  // Function to revert changes
  function revertChanges() {
    for (const field in globalVariableObject.changes) {
      selectedContent.objDetails[field] = globalVariableObject.changes[field];
    }
    globalVariableObject.changes = {};
  }

  // Function to toggle selection of a repo
  function toggleSelectRepo(repoId) {
    if (globalVariableObject.selectedRepos.includes(repoId)) {
      globalVariableObject.selectedRepos =
        globalVariableObject.selectedRepos.filter((id) => id !== repoId);
    } else {
      globalVariableObject.selectedRepos = [
        ...globalVariableObject.selectedRepos,
        repoId,
      ];
    }
    console.log(globalVariableObject.selectedRepos, "selected repos");
  }

  // Function to handle "Select All" checkbox
  function toggleSelectAllRepos(event) {
    if (event.target.checked) {
      globalVariableObject.selectedRepos = repoContent.map((r) => r.id);
    } else {
      globalVariableObject.selectedRepos = [];
    }
    console.log(globalVariableObject.selectedRepos, "selceted repos");
  }

  // Function to check if "Select All" should be checked
  function isSelectAllChecked() {
    return globalVariableObject.selectedRepos.length === repoContent.length;
  }

  // Function to select all repos
  function selectAllRepos() {
    globalVariableObject.selectedRepos = displayedRepos.map((repo) => repo.id);
    globalVariableObject.checkedBox = true;
  }

  // Function to unselect all repos
  function unselectAllRepos() {
    globalVariableObject.selectedRepos = [];
    globalVariableObject.checkedBox = false;
  }

  function performSelectedAction() {
    if (globalVariableObject.selectedAction === "delete") {
      deleteSelectedRepos(); // Call the delete function
    } else if (globalVariableObject.selectedAction === "archive") {
      archiveSelectedRepos(); // Implement this function
    } else if (globalVariableObject.selectedAction === "duplicate") {
      duplicateSelectedRepos(); // Implement this function
    } else if (globalVariableObject.selectedAction === "compare") {
      compareSelectedRepos(); // Implement this function
    }
  }

  //   comapre selected repos
  function compareSelectedRepos() {
    globalVariableObject.compareRepos = true;

    globalVariableObject.selectedReposForCompare = repoContent.filter((repo) =>
      globalVariableObject.selectedRepos.includes(repo.id)
    );

    console.log(globalVariableObject.selectedReposForCompare, "repoContent");
  }

  // Function to delete selected repositories
  function deleteSelectedRepos() {
    repoContent = repoContent.filter(
      (repo) => !globalVariableObject.selectedRepos.includes(repo.id)
    );

    filteredRepos = [...repoContent];

    globalVariableObject.selectedRepos = []; // Clear selection after deletion
    globalVariableObject.selectedAction = "";
  }

  function generateUniqueId(type) {
    const timestamp = Date.now(); // Get the current timestamp in milliseconds
    return `${type}-${timestamp}`; // Create an ID with a type prefix and timestamp
  }

  function archiveSelectedRepos() {} //archive selected repos
  function duplicateSelectedRepos() {} //duplicate selected repos

  //   add new access
  function addNewAccess(branchId) {
    if (selectedContent) {
      // Find the specific branch by ID
      const specificBranch = selectedContent.branches.find(
        (b) => b.id === branchId
      );

      if (specificBranch) {
        // Create a new commit object
        const newAccess = {
          id: generateUniqueId("access"), // Auto-increment commit ID
          user: `User${specificBranch.access.length + 1}`,
          permission: [],
        };

        // Add the new commit to the branch's commits array
        specificBranch.access = [...specificBranch.access, newAccess];
        selectedContent.branches = [...selectedContent.branches];
      }
    }
  }

  //   add new access
  function addNewAccessRepo() {
    if (selectedContent) {
      // Create a new access object
      const newAccess = {
        id: generateUniqueId("accessRepo"), // Auto-increment access ID
        user: `User${selectedContent.access.length + 1}`,
        permission: [],
      };
      console.log(newAccess);

      // Add the new commit to the branch's commits array
      selectedContent.access = [...selectedContent.access, newAccess];
      selectedContent.access = [...selectedContent.access];
    }
  }

  // add new access in commit
  function addNewAccessCommit(branchId, commitId) {
    if (selectedContent) {
      // Find the specific branch by ID
      const specificBranch = selectedContent.branches.find(
        (b) => b.id === branchId
      );

      const specificCommit = specificBranch.commits.find(
        (c) => c.commitId === commitId
      );

      if (specificBranch && specificCommit) {
        // Create a new commit object
        const newAccess = {
          id: generateUniqueId("accessCommit"), // Auto-increment commit ID
          user: `User${specificCommit.access.length + 1}`,
          permission: [],
        };

        // Add the new commit to the branch's commits array
        specificCommit.access = [...specificCommit.access, newAccess];

        specificCommit.access = [...specificCommit.access];
        selectedContent.branches = [...selectedContent.branches];
      }
    }
  }

  // delete access
  function deleteAccess(content, user) {
    content.access = content.access.filter((a) => a.user !== user);

    selectedContent.branches = [...selectedContent.branches];
    selectedContent.access = [...selectedContent.access];
  }

  //   handle new permission
  function handleNewPermission(branch, accessId) {
    globalVariableObject.selectedAccess = branch.access.find(
      (a) => a.id === accessId
    );
    globalVariableObject.isAddPermission[accessId] = true;
  }

  function handleKeyPressAccess(event, branch, accessId) {
    if (event.key === "Enter") {
      addNewPermission(branch, accessId);
    }
  }

  //   add new permission
  function addNewPermission(branch, accessId) {
    globalVariableObject.selectedAccess = branch.access.find(
      (a) => a.id === accessId
    );
    if (globalVariableObject.selectedAccess) {
      globalVariableObject.selectedAccess.permission.push(
        globalVariableObject.newPermission
      );
    }
    globalVariableObject.newPermission = "";
    globalVariableObject.isAddPermission[accessId] = false;
    selectedContent.branches = [...selectedContent.branches];
    console.log(globalVariableObject.selectedAccess, "selected access");
  }

  // delete permission
  function deletePermission(branch, user, permission) {
    const accessEntry = branch.access.find((a) => a.user === user);
    if (accessEntry) {
      accessEntry.permission = accessEntry.permission.filter(
        (p) => p !== permission
      );
    }
    selectedContent.branches = [...selectedContent.branches];
  }

  //   edit access
  function editAccess(branch, accessId) {
    globalVariableObject.selectedAccess = branch.access.find(
      (a) => a.id === accessId
    ); //selected commit

    globalVariableObject.isEditingAccess[accessId] =
      !globalVariableObject.isEditingAccess[accessId];
  }

  //   pagination

  function goToNextPage() {

    if (currentPage < Math.ceil(displayedRepos.length / itemsPerPage)) {
      currentPage += 1;
    }
  }

  function goToPreviousPage() {
    if (currentPage > 1) {
      currentPage -= 1;
    }
  }

  //   search filter object
  let searchShowObject = {
    sort: ["Ascending", "Descending"],
    limitOptions: ["2", "5", "10", "50", "100"],
    fieldOptions: ["Commit ID", "Commit Message", "User", "Date", "Time"],
    timeFilterOptions: [
      "Last Hour",
      "Last 24 Hours",
      "Last 7 Days",
      "Last 30 Days",
    ],
    selectedFields: [],
    selectedSort: "",
    selectedLimit: "",
    selectedTimeFilter: "",
  };

  // Function to apply filters when a checkbox or filter option changes
  function applyFilters() {
    // Apply sorting

    // Apply sorting for repositories
    if (searchShowObject.selectedSort === "Ascending") {
      filteredRepos = [...repoContent].sort((a, b) =>
        a.objDetails.name.localeCompare(b.objDetails.name)
      );
    } else if (searchShowObject.selectedSort === "Descending") {
      filteredRepos = [...repoContent].sort((a, b) =>
        b.objDetails.name.localeCompare(a.objDetails.name)
      );
    }

    if (searchShowObject.selectedSort === "Ascending") {
      selectedContent.branches = originalBranches.sort((a, b) => {
        return a.name.localeCompare(b.name); // Comparator logic for ascending order
      });
    } else if (searchShowObject.selectedSort === "Descending") {
      selectedContent.branches = originalBranches.sort((a, b) =>
        b.name.localeCompare(a.name)
      );
    }

    // Apply limit
    if (searchShowObject.limitOptions) {
      const limit = parseInt(searchShowObject.selectedLimit);

      selectedContent.branches = originalBranches.slice(0, limit);
    }

    // // Apply field selection (e.g., only show branches with selected fields)
    // Apply field selection (e.g., only show branches with selected fields removed)
    //  if (searchShowObject.selectedFields.length > 0) {
    //       selectedContent.branches = originalBranches.map((branch) => {
    //         let filteredCommits = branch.commits.map((commit) => {
    //           let filteredCommit = { ...commit };
    //           searchShowObject.selectedFields.forEach((field) => {
    //             delete filteredCommit[field]; // Remove selected field from commit
    //           });
    //           return filteredCommit;
    //         });
    //         return { ...branch, commits: filteredCommits };
    //       });
    //     } else {
    //       // If no fields are selected, keep the original commits
    //       selectedContent.branches = originalBranches;
    //     }

    // // Apply time filter (you would need to implement time-based filtering logic based on your data)
    if (searchShowObject.timeFilterOptions) {
      const now = new Date();
      let timeThreshold;

      switch (searchShowObject.selectedTimeFilter) {
        case "Last Hour":
          timeThreshold = new Date(now.getTime() - 60 * 60 * 1000);
          break;
        case "Last 24 Hours":
          timeThreshold = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case "Last 7 Days":
          timeThreshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "Last 30 Days":
          timeThreshold = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          timeThreshold = null;
      }

      if (timeThreshold) {
        selectedContent.branches = originalBranches
          .map((branch) => {
            const filteredCommits = branch.commits.filter(
              (commit) => new Date(commit.commitDate) >= timeThreshold
            );
            return filteredCommits.length > 0
              ? { ...branch, commits: filteredCommits }
              : null;
          })
          .filter((branch) => branch !== null);
      }
    }

    console.log(
      selectedContent.branches,
      "Filtered branches and commits after applying filters"
    );
  }

  // selected branch for access
  function selectedBranchForAccess(branch) {
    selectedBranch = branch;
  }

  // selected commit for access
  function selectedCommitForAccess(commit) {
    selectedCommit = commit;
  }

  let uploadedFileName = ""; // To store the name of the uploaded file

  // Handle file input change (click to upload)
  function handleFileInputChange(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        selectedContent.objDetails.image = e.target.result;
      };
      reader.readAsDataURL(file);
      // Store the file name
      uploadedFileName = file.name;
    }
  }

  // Handle drag-over event to allow dropping the image
  function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }

  // Handle drop event to process the dragged image
  function handleDrop(event) {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        selectedContent.objDetails.image = e.target.result;
      };
      reader.readAsDataURL(file);

      // Store the file name
      uploadedFileName = file.name;
    }
  }

  let uploadedVideoFileName = ""; // To store the name of the uploaded video file

  // Handle video file input change (click to upload)
  function handleVideoInputChange(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        selectedContent.objDetails.video = e.target.result; // Store video data
      };
      reader.readAsDataURL(file);

      // Store the video file name
      uploadedVideoFileName = file.name;
    }
  }

  // Handle drag-over event for videos
  function handleVideoDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }

  // Handle video drop event
  function handleVideoDrop(event) {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("video/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        selectedContent.objDetails.video = e.target.result; // Store video data
      };
      reader.readAsDataURL(file);

      // Store the video file name
      uploadedVideoFileName = file.name;
    }
  }

  let draggedBranchIndex = null;

  // Handle the start of dragging
  function handleDragStartBranch(event, index) {
    draggedBranchIndex = index; // Store the index of the dragged branch
    event.dataTransfer.effectAllowed = "move";
  }

  // Prevent the default behavior to allow dropping
  function handleDragOverBranch(event, index) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }

  // Handle the drop event to switch branches
  function handleDropBranch(event, dropIndex) {
    event.preventDefault();

    // If the drop index is different from the dragged index, switch the branches
    if (draggedBranchIndex !== null && draggedBranchIndex !== dropIndex) {
      const draggedBranch = selectedContent.branches[draggedBranchIndex];

      selectedContent.branches.splice(draggedBranchIndex, 1); // Remove the dragged branch
      selectedContent.branches.splice(dropIndex, 0, draggedBranch); // Insert it at the new position

      selectedContent.branches = [...selectedContent.branches];
      // Reset the dragged branch index
      draggedBranchIndex = null;
    }
  }

  let draggedCommitIndex = null;

  // Handle the start of dragging
  function handleDragStartCommit(event, index, branchId, commitId) {
    selectedBranch = selectedContent.branches.find(
      (branch) => branch.id === branchId
    );

    draggedCommitIndex = index; // Store the index of the dragged commit
    event.dataTransfer.effectAllowed = "move";
  }

  // Prevent the default behavior to allow dropping
  function handleDragOverCommit(event, index) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }

  // Handle the drop event to switch branches
  function handleDropCommit(event, dropIndex) {
    event.preventDefault();

    // If the drop index is different from the dragged index, switch the branches
    if (draggedCommitIndex !== null && draggedCommitIndex !== dropIndex) {
      const draggedCommit = selectedBranch.commits[draggedCommitIndex];

      selectedBranch.commits.splice(draggedCommitIndex, 1); // Remove the dragged commit
      selectedBranch.commits.splice(dropIndex, 0, draggedCommit); // Insert it at the new position

      selectedContent.branches = [...selectedContent.branches];
      // Reset the dragged branch index
      draggedCommitIndex = null;
    }
  }

  // Computed value to determine which array to use
  $: displayedRepos = filteredRepos.length > 0 ? filteredRepos : repoContent;
</script>

<!-- toast for error and message -->
{#if showToast}
  <Toast message={toastMessage} type={toastType} />
{/if}
<!-- toast end -->

<!--page content start -->
<div

  data-testid="mainContent"
  class="bg-gray-50 h-[98vh] {globalVariableObject.sidebar
    ? 'sm:bg-[#0006!important]'
    : ''}  {!globalVariableObject.firstCol ? 'sm:bg-[#0006!important]' : ''} {loginSection ? "bg-[#0006!important]" : ""}"
>
  <!-- top header -->
  <header
    class="px-2 py-1 pe-2 ps-2 ms-0.5 sm:p-[0.3rem!important] {loginSection ? "hidden" :""} {globalVariableObject.sidebar ||
    !globalVariableObject.firstCol 
      ? 'sm:hidden'
      : ''}"
  >
    <div class="flex justify-between items-center">
      <div class="flex gap-3 items-center">
        <!-- bar icon for closing sidebar -->
        <svg
          on:click={showSidebar}
          class="w-8 h-8 text-gray-800 dark:text-white cursor-pointer hover:bg-blue-200 rounded-lg p-1"
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
            d="M5 7h14M5 12h14M5 17h14"
          />
        </svg>

        <!-- view button -->
        <div class="dropdown">
          <div
            data-testid="dropdownView"
            tabindex="0"
            role="button"
            class="bg-blue-600 hover:bg-blue-700 px-2 py-1.5 rounded-md text-white text-xs tracking-[0.06rem]"
          >
            View
          </div>
          <ul
            data-testid="dropdownViewContent"
            tabindex="0"
            class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
          >
            <li><a on:click={() => setView("global", "list")}>List View</a></li>
            <li>
              <a on:click={() => setView("global", "table")}>Table View</a>
            </li>
            <li><a>Card View</a></li>
            <li><a>Excel View</a></li>
          </ul>
        </div>
      </div>

      <!-- search input dropdown-->
      <div class="relative">
        <div class="dropdown">
          <div role="button" class="">
            <label
              class=" w-[45vw] px-2 py-1 {globalVariableObject.isDropdownOpen ||
              globalVariableObject.filterOptionBox
                ? 'rounded-b-none bg-white border-b-0'
                : ''} relative flex items-center gap-2 border border-gray-200 bg-blue-50 rounded-xl"
            >
              <input
                type="text"
                class=" w-[42vw] {globalVariableObject.isDropdownOpen ||
                globalVariableObject.filterOptionBox
                  ? 'rounded-b-none bg-white border-b-0'
                  : ''}     bg-blue-50 outline-none focus:outline-none"
                placeholder="Search"
                on:focus={toggleDropdown}
                on:blur={closeDropdown}
                bind:value={globalVariableObject.searchQuery}
              />
            </label>
          </div>

          <!-- search dropdown -->
          <div
            id="dropdownContentSearch"
            tabindex="0"
            class="dropdown-content rounded-t-none {globalVariableObject.isDropdownOpen
              ? 'bg-white'
              : ''} bg-blue-50 border border-t-0 border-gray-200 z-50 w-[45vw] p-1 shadow"
          >
            <div class="card-body p-0">
              <div class="flex gap-3 p-3 flex-wrap w-full">
                <!-- filter options  -->
                {#each Object.keys(filters) as filterKey}
                  <button
                    class="px-2 py-1 rounded-md border text-xs tracking-[0.06rem] font-semibold
                {globalVariableObject.selectedFilter === filterKey
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-black border-gray-300 hover:bg-gray-200'}"
                    style="font-weight: 600;"
                    on:click={() => applyFilter(filterKey)}
                  >
                    {filters[filterKey]}
                  </button>
                {/each}
              </div>
              <div>
                {#each globalVariableObject.searchQueryArray as query}
                  <div
                    class=" text-xs tracking-[0.05rem] bg-gray-100 hover:bg-gray-200 border-l-2 border-blue-600"
                  >
                    <div
                      class="flex justify-between py-1 px-2 items-center border-b border-gray-200"
                    >
                      <div class="flex gap-3 items-center">
                        <svg
                          class="w-3 h-3 text-gray-700 dark:text-white"
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
                            d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>
                        <span>{query}</span>
                      </div>

                      <i
                        class="fa-solid fa-times text-xs cursor-pointer"
                        on:click={() => removeQuery(query)}
                      ></i>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          </div>
        </div>

        <!-- filter box dropdown -->
        <div>
          <kbd
            on:click={openFilterOptionBox}
            class="kbd absolute right-8 top-[0.2rem] min-h-[1.2em!important] {globalVariableObject.isDropdownOpen
              ? 'bg-white'
              : ''} me-2 bg-blue-50 hover:bg-blue-200 cursor-pointer text-dark border-0"
            ><svg
              class="w-5 h-5 text-gray-600 dark:text-white"
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
                d="M20 6H10m0 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m0 0H4m16 6h-2m0 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m0 0H4m16 6H10m0 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m0 0H4"
              />
            </svg>
          </kbd>
          <!-- search button -->
          <button
            on:click={handleSearchContent}
            class="absolute right-2 top-[0.2rem] min-h-[1.2em!important] text-sm px-2 py-1 bg-blue-50 rounded-md hover:bg-blue-200"
          >
            <i class="fa-solid fa-search"></i>
          </button>
          <!-- search button end -->

          <!-- filter box -->
          {#if globalVariableObject.filterOptionBox}
            <div
              class=" dropdownContent z-50 absolute rounded-t-none {globalVariableObject.filterOptionBox
                ? 'bg-white'
                : ''} bg-blue-50 border border-t-0 border-gray-200 z-50 w-[45vw] p-2 shadow"
            >
              <div class="card-body py-2 px-3">
                <!-- filter options -->
                <!-- Sorting Option -->
                {#if searchShowObject.sort}
                  <div>
                    <label class="font-semibold">Sort By:</label>
                    <select
                      class="border p-2 rounded-md w-full mt-1"
                      bind:value={searchShowObject.selectedSort}
                      on:change={applyFilters}
                    >
                      <option value="" disabled selected>Select Sorting</option>
                      {#each searchShowObject.sort as option}
                        <option value={option}>{option}</option>
                      {/each}
                    </select>
                  </div>
                {/if}

                <!-- Limit Option -->
                {#if searchShowObject.limitOptions}
                  <div class="my-2">
                    <label class="font-semibold">Limit Results:</label>
                    <select
                      class="border p-2 rounded-md w-full mt-1"
                      bind:value={searchShowObject.selectedLimit}
                      on:change={applyFilters}
                    >
                      <option value="" disabled selected>Select Limit</option>
                      {#each searchShowObject.limitOptions as limit}
                        <option value={limit}>{limit}</option>
                      {/each}
                    </select>
                  </div>
                {/if}

                <!-- Field Selection -->
                {#if searchShowObject.fieldOptions}
                  <div class="">
                    <label class="font-semibold">Fields to Display:</label>
                    <div class="flex flex-wrap gap-3 mt-1">
                      {#each searchShowObject.fieldOptions as field}
                        <label class="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            bind:group={searchShowObject.selectedFields}
                            value={field}
                            on:change={applyFilters}
                            class="text-xs tracking-[0.05rem]"
                          />
                          <span>{field}</span>
                        </label>
                      {/each}
                    </div>
                  </div>
                {/if}

                <!-- Time Filter -->
                {#if searchShowObject.timeFilterOptions}
                  <div class="my-2">
                    <label class="font-semibold">Time Filter:</label>
                    <select
                      class="border p-2 rounded-md w-full mt-1"
                      bind:value={searchShowObject.selectedTimeFilter}
                      on:change={applyFilters}
                    >
                      <option value="" disabled selected
                        >Select Time Range</option
                      >
                      {#each searchShowObject.timeFilterOptions as option}
                        <option value={option}>{option}</option>
                      {/each}
                    </select>
                  </div>
                {/if}
              </div>
            </div>
          {/if}
        </div>
      </div>

      <!-- dropdown right icon -->
      <div class="dropdown dropdown-left dropdown-bottom">
        <div tabindex="0" role="button" class="">
          <svg
            class="w-6 h-6 text-gray-800 dark:text-white"
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
              d="M9.143 4H4.857A.857.857 0 0 0 4 4.857v4.286c0 .473.384.857.857.857h4.286A.857.857 0 0 0 10 9.143V4.857A.857.857 0 0 0 9.143 4Zm10 0h-4.286a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286A.857.857 0 0 0 20 9.143V4.857A.857.857 0 0 0 19.143 4Zm-10 10H4.857a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286a.857.857 0 0 0 .857-.857v-4.286A.857.857 0 0 0 9.143 14Zm10 0h-4.286a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286a.857.857 0 0 0 .857-.857v-4.286a.857.857 0 0 0-.857-.857Z"
            />
          </svg>
        </div>
        <div
          tabindex="0"
          class="dropdown-content card card-compact bg-primary text-primary-content z-[1] w-64 p-2 shadow"
        >
          <div class="card-body">
            <h3 class="card-title">Select Language</h3>
            <ul>
              {#each languages as language}
                <li class="py-1">
                  <button
                    class="btn btn-sm btn-outline w-full text-left text-white"
                    on:click={() => selectLanguage(language)}
                  >
                    {language}
                  </button>
                </li>
              {/each}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </header>

  <div class="flex">
    <!--sidebar start  -->
    <aside class="{!globalVariableObject.firstCol ? 'sm:hidden' : ''} {loginSection ? "hidden" :""} ">
      {#if globalVariableObject.sidebar}
        <div class="bg-gray-50">
          <ul
            class="menu rounded-box sm:rounded-none w-56 mobileView sm:shadow sm:border-e-2 border-gray-100"
          >
            <li class="hidden sm:flex sm:justify-end">
              <i
                class="ms-auto fa-solid fa-times"
                on:click={() => (globalVariableObject.sidebar = false)}
              ></i>
            </li>
            <li>
              <a on:click={showUserSection}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>Users</a
              >
            </li>
            <li>
              <details open>
                <summary>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg> Parent</summary
                >
                <ul>
                  <li><a>Submenu 1</a></li>
                  <li><a>Submenu 2</a></li>
                  <li>
                    <details open>
                      <summary>Parent</summary>
                      <ul>
                        <li><a>Submenu 1</a></li>
                        <li><a>Submenu 2</a></li>
                      </ul>
                    </details>
                  </li>
                </ul>
              </details>
            </li>
            <li>
              <a>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg> Item 3</a
              >
            </li>
          </ul>
        </div>
      {:else}
        <!-- mini sidebar -->
        <div class="">
          <ul class="menu p-0 sidemenu sm:p-1 bg-gray-50 rounded-box">
            <li class="hidden sm:block">
              <a on:click={toggleFirstColumn}>
                <svg
                  class="w-6 h-6 text-gray-800 dark:text-white"
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
                    d="M19 12H5m14 0-4 4m4-4-4-4"
                  />
                </svg>
              </a>
            </li>
            <li>
              <a>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </a>
            </li>
            <li>
              <a>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </a>
            </li>
            <li>
              <a>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </a>
            </li>
          </ul>
        </div>
      {/if}
    </aside>


    <!-- main center content start -->
     {#if !globalVariableObject.userSection}
    <main
      class="  {globalVariableObject.sidebar
        ? 'w-[80.3vw]  sm:hidden'
        : 'w-[93.1vw] sm:w-[83.5vw]'} me-2 max-w-[100vw] {loginSection ? "hidden" :""}"
    >
      {#if stateObject.global_current_view === "table"}
        <div
          data-testid="table-view"
          class="flex gap-2 bg-base-100 p-2 rounded-2xl shadow-md w-full {!globalVariableObject.firstCol
            ? 'sm:hidden'
            : ''} "
        >
          <div class="flex flex-col w-full">
            <div class="overflow-x-auto tableView">
              <table
                class="min-w-full my-3 me-2 border-collapse border border-gray-200"
              >
                <thead>
                  <tr class="bg-gray-100">
                    <th
                      class="border border-gray-200 px-1 py-1 text-left capitalize text-sm tracking-[0.06rem]"
                    ></th>
                    {#each Object.keys(repoContent[0].objDetails) as fieldName}
                      {#if fieldName !== "url" && fieldName !== "image" && fieldName !== "documentation"}
                        <th
                          class="border border-gray-200 px-3 py-1 text-left capitalize text-sm tracking-[0.06rem]"
                          >{fieldName}</th
                        >
                      {/if}
                    {/each}
                  </tr>
                </thead>
                <tbody>
                  {#each repoContent as r}
                    <tr data-testid={`tableRow${r.id}`} class="border-t">
                      <td
                        class="border border-gray-200 px-2 py-1 text-center capitalize text-sm tracking-[0.06rem]"
                      >
                        <i
                          class="fa-solid {expandedRepos[r.id]
                            ? 'fa-chevron-down'
                            : 'fa-chevron-right'} text-xs text-gray-500 cursor-pointer"
                          on:click={() => toggleExpand(r.id)}
                        ></i>
                      </td>
                      <td
                        class:highlight={highlightedFields[r.id]?.name}
                        class="border border-gray-200 text-xs p-0 m-0 tracking-[0.06rem]"
                      >
                        <input
                          type="text"
                          class="w-full py-1.5 px-3 rounded-md outline-none"
                          bind:value={r.objDetails.name}
                          disabled={!globalVariableObject.isEditingRepo[r.id]}
                        />
                      </td>
                      <td
                        class="border border-gray-200"
                        class:highlight={highlightedFields[r.id]?.time}
                      >
                        <input
                          type="date"
                          class="w-full py-1.5 px-3 rounded-md outline-none"
                          bind:value={r.objDetails.time}
                          disabled={!globalVariableObject.isEditingRepo[r.id]}
                        />
                      </td>
                      <td
                        class="border border-gray-200"
                        class:highlight={highlightedFields[r.id]?.date}
                      >
                        <input
                          type="time"
                          class="w-full py-1.5 px-3 rounded-md outline-none"
                          bind:value={r.objDetails.date}
                          disabled={!globalVariableObject.isEditingRepo[r.id]}
                        />
                      </td>
                      <td class="border text-center border-gray-200">
                        <input
                          type="number"
                          class="w-full py-1.5 px-3 rounded-md outline-none"
                          bind:value={r.branches.length}
                          disabled
                        />
                      </td>
                      <td class="border text-center border-gray-200 px-3 py-2">
                        <div class="flex justify-center items-center gap-2">
                          <i
                            on:click={() => deleteRepo(r.id)}
                            class="fa-solid fa-trash text-xs text-red-500 hover:text-red-600 cursor-pointer"
                          ></i>
                          <svg
                            on:click={() => editRepo(r.id)}
                            class="w-4 h-4 text-red-500 cursor-pointer hover:text-red-600 dark:text-white"
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
                              d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
                            />
                          </svg>
                        </div>
                      </td>
                    </tr>

                    <!-- expand branches -->
                    {#if expandedRepos[r.id]}
                      <tr class="bg-white">
                        <td colspan="6">
                          <div class="p-3">
                            <table
                              class="min-w-full border-collapse border border-gray-300"
                            >
                              <thead class="bg-gray-200">
                                <tr>
                                  <th
                                    class="border border-gray-300 text-sm tracking-[0.05rem] px-2 py-1"
                                  >
                                    Name</th
                                  >
                                  <th
                                    class="border border-gray-300 px-2 text-sm tracking-[0.05rem] py-1"
                                  >
                                    Owner</th
                                  >
                                  <th
                                    class="border border-gray-300 px-2 text-sm tracking-[0.05rem] py-1"
                                    >lastCommited</th
                                  >
                                  <th
                                    class="border border-gray-300 px-2 text-sm tracking-[0.05rem] py-1"
                                    >Created On</th
                                  >
                                  <th
                                    class="border border-gray-300 px-2 text-sm tracking-[0.05rem] py-1"
                                    >Total Commits</th
                                  >
                                </tr>
                              </thead>
                              <tbody>
                                {#each r.branches as branch}
                                  <tr>
                                    <td
                                      class="border border-gray-300 text-xs tracking-[0.05rem] px-2 py-2"
                                      >{branch.name}</td
                                    >
                                    <td
                                      class="border border-gray-300 text-xs tracking-[0.05rem] px-2 py-2"
                                      >{branch.branchOwner}</td
                                    >
                                    <td
                                      class="border border-gray-300 text-xs tracking-[0.05rem] px-2 py-2"
                                      >{branch.lastCommited}</td
                                    >
                                    <td
                                      class="border border-gray-300 text-xs tracking-[0.05rem] px-2 py-2"
                                      >{branch.createdOn}</td
                                    >
                                    <td
                                      class="border border-gray-300 text-xs tracking-[0.05rem] px-2 py-2"
                                      >{branch.commits.length}</td
                                    >
                                  </tr>
                                {/each}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    {/if}
                  {/each}
                </tbody>
              </table>
            </div>
            <div class="flex gap-2 justify-end items-center">
              {#if globalVariableObject.isEditingRepo[selectedContent.id]}
                <button
                  on:click={saveChanges(selectedContent)}
                  class=" bg-blue-500 hover:bg-blue-600 text-xs text-white tracking-[0.05rem] px-3 py-1.5 rounded-md"
                  >Save</button
                >
                <button
                  on:click={() =>
                    (globalVariableObject.isEditingRepo[selectedContent.id] =
                      false)}
                  class=" bg-gray-100 hover:bg-gray-200 text-xs tracking-[0.05rem] px-3 py-1.5 rounded-md"
                  >Cancel</button
                >
              {/if}
              <button
                data-testid="addNewRow"
                on:click={addNewRepo}
                class=" bg-red-500 hover:bg-red-600 text-xs text-white tracking-[0.05rem] px-3 py-1.5 rounded-md"
                >Add</button
              >
            </div>
          </div>
        </div>
      {:else if stateObject.global_current_view === "list"}
        <div
          data-testid="listView"
          class="flex gap-2 bg-base-100 p-2 h-full rounded-2xl shadow-md w-full {!globalVariableObject.firstCol
            ? 'sm:bg-[#0006!important] sm:shadow-none sm:w-0'
            : ''} "
        >
          <!-- first column -->
          <div
            class="border w-[18vw] bg-gray-50 py-2 px-2 border-gray-200 {globalVariableObject.firstCol
              ? 'sm:hidden'
              : 'sm:block hidden shadow absolute transition-all duration-600 ease-in-out  top-0 left-0 z-50 w-[42vw]'}"
          >
            <div
              class="flex {globalVariableObject.selectedRepos.length > 0
                ? 'justify-between'
                : 'justify-end'} items-center mb-2"
            >
              <!-- close first column -->
              <i
                class="fa-solid fa-times hidden sm:block me-auto text-xs text-gray-500 cursor-pointer"
                on:click={() => (globalVariableObject.firstCol = true)}
              ></i>

              <!-- Bulk Delete Button -->
              {#if globalVariableObject.selectedRepos.length > 0}
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
                    on:change={toggleSelectAllRepos}
                    data-testid="selectAllCheckbox"
                  />
                  <div class="dropdown">
                    <div
                      tabindex="0"
                      role="button"
                      class="bg-transparent border-0"
                    >
                      <i class="fa-solid fa-caret-down" style="font-size: 10px;"
                      ></i>
                    </div>
                    <ul
                      tabindex="0"
                      class="dropdown-content menu bg-base-100 rounded-box z-[1] w-44 p-2 shadow"
                    >
                      <li><a on:click={selectAllRepos}>All</a></li>
                      <li><a on:click={unselectAllRepos}>None</a></li>
                    </ul>
                  </div>
                </div>
                <i
                  data-testid="addNewRepo"
                  class="fa-solid fa-plus text-sm cursor-pointer font-semibold"
                  on:click={addNewRepo}
                ></i>
                <i
                  class="fa-solid fa-ellipsis text-sm cursor-pointer font-semibold"
                ></i>
              </div>
            </div>

            <!-- display repo - repo list -->
            <div class="firstCol overflow-y-auto mb-5 pb-[5.5rem] h-[96vh]">
              {#each displayedRepos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) as r}
                <div
                  data-testid={`repoList${r.id}`}
                  on:click={() => showContentDetails(r.id, r)}
                  class="card cursor-pointer p-2 mb-2 rounded-lg shadow-sm hover:bg-gray-100 {selectedContent.id ===
                  r.id
                    ? 'bg-gray-200'
                    : ''}"
                >
                  <!-- repo name -->
                  <div class="flex items-center justify-between">
                    <h3 class="text-lg tracking-[0.05rem] font-semibold mb-2">
                      {r.objDetails.name}
                    </h3>
                    <div class="flex items-center gap-2">
                      <!-- Checkbox for selection -->
                      <input
                        type="checkbox"
                        class="form-checkbox w-3 h-3"
                        checked={globalVariableObject.selectedRepos.includes(
                          r.id
                        )}
                        on:change={() => toggleSelectRepo(r.id)}
                      />
                      <!-- delete icon -->
                      <i
                        data-testid={`repoDelete${r.id}`}
                        style="font-size:10px"
                        class="fa-solid fa-trash text-red-500 hover:text-red-600"
                        on:click={() => deleteRepo(r.id)}
                      ></i>

                      <!-- info icon -->
                      <div class="dropdown dropdown-bottom dropdown-left">
                        <div
                          tabindex="0"
                          role="button"
                          class="bg-transparent border-0"
                          on:click={() => openInfoDropdown(r.id)}
                        >
                          <i class="fa-solid fa-ellipsis text-xs"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p class="text-sm tracking-[0.05rem] text-gray-600">
                    <span style="font-weight: 600;">Date:</span>
                    {r.objDetails.date}
                  </p>
                  <p class="text-sm tracking-[0.05rem] text-gray-600">
                    <span style="font-weight: 600;">Time:</span>
                    {r.objDetails.time}
                  </p>
                  <p class="text-sm tracking-[0.05rem] text-gray-600">
                    <span style="font-weight: 600;">Total Branches:</span>
                    {r.branches.length}
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
                  <i
                    class="fa-solid fa-circle-left text-red-500 hover:text-red-600"
                  ></i>
                </button>

                <span class="text-gray-700 text-xs tracking-[0.06rem]">
                  Page {currentPage} of {Math.ceil(
                    displayedRepos.length / itemsPerPage
                  )}
                </span>

                <button
                  data-testid="goToNextPage"
                  class="bg-transparent py-1 cursor-pointer rounded text-xl disabled:opacity-50"
                  on:click={goToNextPage}
                  disabled={currentPage ===
                    Math.ceil(displayedRepos.length / itemsPerPage)}
                >
                  <i
                    class="fa-solid fa-circle-right text-red-500 hover:text-red-600"
                  ></i></button
                >
              </div>
            </div>
          </div>

          <!-- info dropdown -->
          {#if globalVariableObject.infoDropdown[selectedContent.id]}
            <ul
              tabindex="0"
              class="dropdown-content absolute top-[25vh] left-[2vw] menu bg-base-100 rounded-box z-50 w-52 p-2 shadow"
            >
              <li><a>Import</a></li>
              <li><a>Export</a></li>
            </ul>
          {/if}

          <!-- second column -->
          <div
            class="border w-full bg-gray-50 p-2 border-gray-200 {!globalVariableObject.firstCol
              ? 'sm:hidden'
              : ''} "
          >
            <!-- compare repo -->
            {#if globalVariableObject.compareRepos}
              <div class="">
                <!-- close button -->
                <div class="flex justify-end">
                  <button
                    on:click={() => (globalVariableObject.compareRepos = false)}
                    class="bg-red-500 py-1 px-3 rounded-md border-red-500 hover:bg-red-600 text-white text-xs tracking-[0.06rem]"
                    >Close</button
                  >
                </div>

                <!-- comparing both repos  -->
                {#if globalVariableObject.compareRepos && globalVariableObject.selectedReposForCompare.length === 2}
                  <div class="flex gap-4 mt-3">
                    <!-- View Mode -->
                    <div class="w-1/2 border p-4 rounded-md">
                      <h2 class="text-lg font-semibold mb-4">View Mode</h2>
                      <div>
                        <h3 class="text-md py-2 font-semibold">
                          Repository: {globalVariableObject
                            .selectedReposForCompare[0].objDetails.name}
                        </h3>
                        <p>
                          <strong>Date:</strong>
                          {globalVariableObject.selectedReposForCompare[0]
                            .objDetails.date}
                        </p>
                        <p class="py-2">
                          <strong>Time:</strong>
                          {globalVariableObject.selectedReposForCompare[0]
                            .objDetails.time}
                        </p>
                        <p>
                          <strong>Total Branches:</strong>
                          {globalVariableObject.selectedReposForCompare[0]
                            .branches.length}
                        </p>
                        <!-- Add more fields as necessary -->
                      </div>
                    </div>

                    <!-- Edit Mode -->
                    <div class="w-1/2 border p-4 rounded-md">
                      <h2 class="text-lg font-semibold mb-4">Edit Mode</h2>
                      <div>
                        <h3 class="text-md font-semibold">
                          Repository: {globalVariableObject
                            .selectedReposForCompare[1].objDetails.name}
                        </h3>
                        <label class="block mb-2">
                          <span class="text-gray-700">Name:</span>
                          <input
                            type="text"
                            class="w-full border px-2 py-1 rounded-md"
                            bind:value={globalVariableObject
                              .selectedReposForCompare[1].objDetails.name}
                          />
                        </label>
                        <label class="block mb-2">
                          <span class="text-gray-700">Date:</span>
                          <input
                            type="date"
                            class="w-full border px-2 py-1 rounded-md"
                            bind:value={globalVariableObject
                              .selectedReposForCompare[1].objDetails.date}
                          />
                        </label>
                        <label class="block mb-2">
                          <span class="text-gray-700">Time:</span>
                          <input
                            type="time"
                            class="w-full border px-2 py-1 rounded-md"
                            bind:value={globalVariableObject
                              .selectedReposForCompare[1].objDetails.time}
                          />
                        </label>
                        <label class="block mb-2">
                          <span class="text-gray-700">Total Branches:</span>
                          <input
                            type="number"
                            class="w-full border px-2 py-1 rounded-md"
                            bind:value={globalVariableObject
                              .selectedReposForCompare[1].branches.length}
                          />
                        </label>
                        <!-- Add more fields as necessary -->
                      </div>
                    </div>
                  </div>
                {/if}
              </div>
            {:else}
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
                    on:click={() => setView("repo", "list")}
                    class="w-7 h-7 px-1 cursor-pointer hover:bg-gray-200 text-gray-800 border-x border-gray-200 dark:text-white {stateObject.repo_current_view ===
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
                    on:click={() => enableEditing(selectedContent.id)}
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
                        <a on:click={() => pullRequest(selectedContent)}
                          >Pull
                        </a>
                      </li>
                      <li><a>Build </a></li>
                      <li><a>Build Status</a></li>
                      <li><a id="test-option">Test</a></li>
                      <li><a>Run</a></li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- changes after pull request -->
              <dialog id="my_modal_32" class="modal">
                <div class="modal-box">
                  <h3 class="text-lg font-bold mb-4">Changes Summary</h3>

                  <div class="diff-container">
                    {#if changesDetect.length > 0}
                      {#each changesDetect as change}
                        <div class="diff-item mb-4">
                          <div class="mb-2">
                            <strong>Field:</strong>
                            {change.fieldName}
                          </div>
                          <div class="diff-values grid grid-cols-2 gap-4">
                            <!-- Previous Value (highlighted in red) -->
                            <div
                              class="previous-value p-2 border border-red-500 rounded bg-red-100"
                            >
                              <strong>Previous:</strong>
                              {change.previousValue}
                            </div>
                            <!-- New Value (highlighted in green) -->
                            <div
                              class="new-value p-2 border border-green-500 rounded bg-green-100"
                            >
                              <strong>New:</strong>
                              {change.newValue}
                            </div>
                          </div>
                        </div>
                      {/each}
                    {:else}
                      <div class="text-center">No Changes Detected</div>
                    {/if}
                  </div>
                </div>
                <form method="dialog" class="modal-backdrop">
                  <button>close</button>
                </form>
              </dialog>

              <!-- Modal -->
              <input type="checkbox" id="test-modal" class="modal-toggle" />
              <div class="modal">
                <div class="modal-box">
                  <h3 class="font-bold text-lg">Test Suites</h3>
                  <p class="py-4">Here are the test suites:</p>
                  <!-- List of Test Suites -->
                  <ul class="list-disc pl-5">
                    {#each testSuites as suite}
                      <li>{suite}</li>
                    {/each}
                    <!-- Add more test suites here -->
                  </ul>
                  <div class="modal-action">
                    <label for="test-modal" class="btn">Close</label>
                  </div>
                </div>
              </div>

              <!-- selected content -->
              {#if selectedContent}
                <div
                  data-testid={`selectedRepo${selectedContent.id}`}
                  class="mt-2"
                >
                  <details class="collapse bg-base-200 border-gray-200 border">
                    <summary
                      class="py-1 px-3 collapse-title text-lg font-medium border-b border-gray-200 min-h-[1.7rem!important]"
                      >{selectedContent.objDetails.name} Details</summary
                    >
                    <div
                      class="collapse-content bg-gray-50 p-2 overflow-y-auto h-[60vh] pb-5"
                    >
                      {#if stateObject.repo_current_view === "list"}
                        {#each Object.keys(selectedContent.objDetails) as fieldName}
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
                                  bind:value={selectedContent.objDetails[
                                    fieldName
                                  ]}
                                  disabled={!globalVariableObject.isEditing[
                                    selectedContent.id
                                  ]}
                                />
                              {:else if fieldName === "date"}
                                <input
                                  type="date"
                                  name=""
                                  id=""
                                  class="w-full py-1.5 px-2 rounded-md outline-none"
                                  bind:value={selectedContent.objDetails[
                                    fieldName
                                  ]}
                                  disabled={!globalVariableObject.isEditing[
                                    selectedContent.id
                                  ]}
                                />
                              {:else if fieldName === "time"}
                                <input
                                  type="time"
                                  name=""
                                  id=""
                                  class="w-full py-1.5 px-2 rounded-md outline-none"
                                  bind:value={selectedContent.objDetails[
                                    fieldName
                                  ]}
                                  disabled={!globalVariableObject.isEditing[
                                    selectedContent.id
                                  ]}
                                />
                              {:else if fieldName === "totalBranches"}
                                <input
                                  type="number"
                                  name=""
                                  id=""
                                  class="w-full py-1.5 px-2 rounded-md outline-none"
                                  bind:value={selectedContent.branches.length}
                                  disabled
                                />
                              {:else if fieldName === "url"}
                                <div
                                  class="text-primary cursor-pointer text-sm tracking-[0.05rem] pt-2 px-2"
                                >
                                  <a href="">
                                    {selectedContent.objDetails[fieldName]}
                                  </a>
                                </div>
                              {:else if fieldName === "documentation"}
                                <div class="py-0 px-2">
                                  <textarea
                                    name=""
                                    id=""
                                    rows="2"
                                    class="w-full border-0 outline-none"
                                    bind:value={selectedContent.objDetails[
                                      fieldName
                                    ]}
                                    disabled={!globalVariableObject.isEditing[
                                      selectedContent.id
                                    ]}
                                  />
                                </div>
                              {:else if fieldName === "image"}
                                {#if !globalVariableObject.isEditing[selectedContent.id]}
                                  <div class="py-2 px-2">
                                    <img
                                      src={selectedContent.objDetails[
                                        fieldName
                                      ]}
                                      alt=""
                                      class="max-h-[30vh]"
                                    />
                                  </div>
                                {:else}
                                  <div class="py-2 px-2">
                                    <div
                                      class="flex items-center justify-center w-full"
                                      on:dragover|preventDefault={handleDragOver}
                                      on:drop={handleDrop}
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
                                            SVG, PNG, JPG or GIF (MAX.
                                            800x400px)
                                          </p>
                                        </div>
                                        <input
                                          id="dropzone-file"
                                          type="file"
                                          class="hidden"
                                          accept="image/*"
                                          bind:value={selectedContent
                                            .objDetails[fieldName]}
                                          on:change={handleFileInputChange}
                                        />
                                      </label>
                                    </div>
                                    {#if uploadedFileName}
                                      <p
                                        class="mt-2 text-sm text-gray-700 dark:text-gray-400"
                                      >
                                        <strong>Selected file:</strong>
                                        {uploadedFileName}
                                      </p>
                                    {/if}
                                  </div>
                                {/if}
                              {:else if fieldName === "video"}
                                {#if !globalVariableObject.isEditing[selectedContent.id]}
                                  <div class="py-2 px-2">
                                    <video controls class="max-w-full h-auto">
                                      <source
                                        src={selectedContent.objDetails[
                                          fieldName
                                        ]}
                                        type="video/mp4"
                                      />
                                      Your browser does not support the video tag.
                                    </video>
                                  </div>
                                {:else}
                                  <div class="py-2 px-2">
                                    <div
                                      class="flex items-center justify-center w-full"
                                      on:dragover|preventDefault={handleVideoDragOver}
                                      on:drop={handleVideoDrop}
                                    >
                                      <label
                                        for="dropzone-video"
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
                                            > or drag and drop a video
                                          </p>
                                          <p
                                            class="text-xs text-gray-500 dark:text-gray-400"
                                          >
                                            MP4 format (MAX. size: 50MB)
                                          </p>
                                        </div>
                                        <input
                                          id="dropzone-video"
                                          type="file"
                                          accept="video/*"
                                          class="hidden"
                                          on:change={handleVideoInputChange}
                                        />
                                      </label>
                                    </div>
                                    {#if uploadedVideoFileName}
                                      <p
                                        class="mt-2 text-sm text-gray-700 dark:text-gray-400"
                                      >
                                        <strong>Selected video:</strong>
                                        {uploadedVideoFileName}
                                      </p>
                                    {/if}
                                  </div>
                                {/if}
                              {/if}
                            </div>
                          </div>
                        {/each}
                        <!--  save,cancel button -->
                        {#if globalVariableObject.isEditing[selectedContent.id]}
                          <div class="mt-3">
                            <button
                              on:click={() => saveChanges(selectedContent)}
                              class="bg-blue-600 text-white px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-blue-800"
                              style="font-weight: 600;">Save</button
                            >
                            <button
                              on:click={cancelEditing}
                              class="bg-gray-100 px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-gray-200"
                              style="font-weight: 600;">Cancel</button
                            >
                          </div>
                        {/if}
                      {:else if stateObject.repo_current_view === "table"}
                        <table
                          class="min-w-full border-collapse border border-gray-200"
                        >
                          <thead>
                            <tr class="bg-gray-100">
                              <th
                                class="border border-gray-200 px-3 py-1 text-left capitalize text-sm tracking-[0.06rem]"
                                >Field Name</th
                              >
                              <th
                                class="border border-gray-200 px-3 py-1 text-left text-sm tracking-[0.06rem]"
                                >Value</th
                              >
                            </tr>
                          </thead>
                          <tbody>
                            {#each Object.keys(selectedContent.objDetails).filter((fieldName) => fieldName !== "url" && fieldName !== "image" && fieldName !== "documentation") as fieldName}
                              <tr
                                class="border-t {globalVariableObject.changes[
                                  fieldName
                                ]
                                  ? 'bg-blue-100'
                                  : ''}"
                              >
                                <td
                                  class="border border-gray-200 text-xs tracking-[0.06rem] px-3 py-1 capitalize"
                                >
                                  {fieldName}
                                </td>
                                <td
                                  class="border border-gray-200 text-xs tracking-[0.06rem] px-3 py-1"
                                >
                                  {#if fieldName === "name"}
                                    <input
                                      type="text"
                                      class="w-full py-1.5 px-2 rounded-md outline-none"
                                      bind:value={selectedContent.objDetails[
                                        fieldName
                                      ]}
                                      disabled={!globalVariableObject.isEditing[
                                        selectedContent.id
                                      ]}
                                      on:input={(event) =>
                                        handleInputChange(event, fieldName)}
                                    />
                                  {:else if fieldName === "date"}
                                    <input
                                      type="date"
                                      class="w-full py-1.5 px-2 rounded-md outline-none"
                                      bind:value={selectedContent.objDetails[
                                        fieldName
                                      ]}
                                      disabled={!globalVariableObject.isEditing[
                                        selectedContent.id
                                      ]}
                                      on:input={(event) =>
                                        handleInputChange(event, fieldName)}
                                    />
                                  {:else if fieldName === "time"}
                                    <input
                                      type="time"
                                      class="w-full py-1.5 px-2 rounded-md outline-none"
                                      bind:value={selectedContent.objDetails[
                                        fieldName
                                      ]}
                                      disabled={!globalVariableObject.isEditing[
                                        selectedContent.id
                                      ]}
                                      on:input={(event) =>
                                        handleInputChange(event, fieldName)}
                                    />
                                  {:else if fieldName === "totalBranches"}
                                    <input
                                      type="number"
                                      class="w-full py-1.5 px-2 rounded-md outline-none"
                                      bind:value={selectedContent.branches
                                        .length}
                                      disabled
                                      on:input={(event) =>
                                        handleInputChange(event, fieldName)}
                                    />
                                  {/if}
                                </td>
                              </tr>
                            {/each}
                          </tbody>
                        </table>
                        <!--  save,cancel button -->
                        {#if globalVariableObject.isEditing[selectedContent.id]}
                          <div class="mt-3">
                            <button
                              on:click={() => saveChanges(selectedContent)}
                              class="bg-blue-600 text-white px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-blue-800"
                              style="font-weight: 600;">Save</button
                            >
                            <button
                              on:click={cancelEditing}
                              class="bg-gray-100 px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-gray-200"
                              style="font-weight: 600;">Cancel</button
                            >
                          </div>
                        {/if}
                        <!-- card view -->
                      {:else if stateObject.repo_current_view === "card"}
                        <div
                          class="card bg-white shadow-md rounded-lg border border-gray-200 p-2"
                        >
                          <div
                            class="card-header text-lg sm:text-sm font-semibold"
                          >
                            Repo Details
                          </div>
                          <div
                            class="card-body px-4 py-3 grid grid-cols-1 gap-2"
                          >
                            <!-- card fields -->
                            {#each Object.keys(selectedContent.objDetails).filter((fieldName) => fieldName !== "url" && fieldName !== "image" && fieldName !== "documentation") as fieldName}
                              <div class="flex justify-between items-center">
                                <div
                                  class="field-label font-medium capitalize text-gray-600"
                                >
                                  {fieldName}
                                </div>
                                <div class="field-value w-[60%]">
                                  {#if fieldName === "name"}
                                    <input
                                      type="text"
                                      class="w-full py-1.5 px-2 rounded-md outline-none border border-gray-300"
                                      bind:value={selectedContent.objDetails[
                                        fieldName
                                      ]}
                                      disabled={!globalVariableObject.isEditing[
                                        selectedContent.id
                                      ]}
                                    />
                                  {:else if fieldName === "date"}
                                    <input
                                      type="date"
                                      class="w-full py-1.5 px-2 rounded-md outline-none border border-gray-300"
                                      bind:value={selectedContent.objDetails[
                                        fieldName
                                      ]}
                                      disabled={!globalVariableObject.isEditing[
                                        selectedContent.id
                                      ]}
                                    />
                                  {:else if fieldName === "time"}
                                    <input
                                      type="time"
                                      class="w-full py-1.5 px-2 rounded-md outline-none border border-gray-300"
                                      bind:value={selectedContent.objDetails[
                                        fieldName
                                      ]}
                                      disabled={!globalVariableObject.isEditing[
                                        selectedContent.id
                                      ]}
                                    />
                                  {:else if fieldName === "totalBranches"}
                                    <input
                                      type="number"
                                      class="w-full py-1.5 px-2 rounded-md outline-none border border-gray-300"
                                      bind:value={selectedContent.branches
                                        .length}
                                      disabled
                                    />
                                  {/if}
                                </div>
                              </div>
                            {/each}
                            <!--  save,cancel button -->
                            {#if globalVariableObject.isEditing[selectedContent.id]}
                              <div class="mt-3">
                                <button
                                  on:click={() => saveChanges(selectedContent)}
                                  class="bg-blue-600 text-white px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-blue-800"
                                  style="font-weight: 600;">Save</button
                                >
                                <button
                                  on:click={cancelEditing}
                                  class="bg-gray-100 px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-gray-200"
                                  style="font-weight: 600;">Cancel</button
                                >
                              </div>
                            {/if}
                          </div>
                        </div>
                      {/if}
                    </div>
                  </details>
                  <!-- repo access heading -->

                  <!-- access modal -->
                  <dialog id="my_modal_22" class="modal">
                    <div class="modal-box max-w-[43rem!important]">
                      <div
                        class="text-lg font-semibold text-gray-500 tracking-[0.06rem]"
                      >
                        Access
                      </div>
                      <div>
                        <!-- repo access content -->

                        <!-- edit icons -->
                        <div class="flex gap-3 justify-end my-2 items-center">
                          <!--  save,cancel button -->
                          {#if globalVariableObject.isEditingAccess[globalVariableObject.selectedAccess.id]}
                            <div class="">
                              <button
                                on:click={() => saveChanges(selectedContent)}
                                class="bg-blue-600 text-white px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-blue-800"
                                style="font-weight: 600;">Save</button
                              >
                              <button
                                on:click={() =>
                                  (globalVariableObject.isEditingAccess[
                                    globalVariableObject.selectedAccess.id
                                  ] = false)}
                                class="bg-gray-100 px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-gray-200"
                                style="font-weight: 600;">Cancel</button
                              >
                            </div>
                          {/if}
                          <!-- plus icon for adding new access -->
                          <svg
                            on:click={() => addNewAccessRepo()}
                            class="w-5 h-5 cursor-pointer text-blue-600 hover:text-blue-800 font-semibold dark:text-white"
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
                              d="M5 12h14m-7 7V5"
                            />
                          </svg>
                        </div>

                        <!-- Access content render -->
                        <div class="access-list mt-2">
                          <div class="overflow-x-auto tableView">
                            <table
                              class="table-view w-full text-left border-collapse border border-gray-300"
                            >
                              <thead>
                                <tr>
                                  <th class="border border-gray-300 px-3 py-2"
                                    >User</th
                                  >
                                  <th class="border border-gray-300 px-3 py-2"
                                    >Permissions</th
                                  >
                                  <th class="border border-gray-300 px-2 py-2"
                                  ></th>
                                </tr>
                              </thead>
                              <tbody>
                                {#each selectedContent.access as access}
                                  <tr>
                                    <!-- User Information -->
                                    <td class="border border-gray-300">
                                      <input
                                        type="text"
                                        class="px-3 py-2 border-0 w-full"
                                        style="font-weight: 600;"
                                        bind:value={access.user}
                                        disabled={!globalVariableObject
                                          .isEditingAccess[access.id]}
                                      />
                                    </td>

                                    <!-- Permissions -->
                                    <td
                                      class="border border-gray-300 px-3 py-2"
                                    >
                                      {#if globalVariableObject.isAddPermission[access.id]}
                                        <input
                                          type="text"
                                          class="w-full text-xs tracking-[0.06rem] outline-none focus:outline-none"
                                          placeholder="add new permission "
                                          bind:value={globalVariableObject.newPermission}
                                          on:keydown={(event) =>
                                            handleKeyPressAccess(
                                              event,
                                              selectedContent,
                                              access.id
                                            )}
                                        />
                                      {:else}
                                        <div
                                          class="permissions flex flex-wrap gap-2"
                                        >
                                          {#each access.permission as permission}
                                            <div
                                              class="badge badge-info h-[1.6rem] gap-2"
                                            >
                                              {permission}
                                              <svg
                                                on:click={() =>
                                                  deletePermission(
                                                    selectedContent,
                                                    access.user,
                                                    permission
                                                  )}
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                class="inline-block h-4 w-4 stroke-current"
                                              >
                                                <path
                                                  stroke-linecap="round"
                                                  stroke-linejoin="round"
                                                  stroke-width="2"
                                                  d="M6 18L18 6M6 6l12 12"
                                                ></path>
                                              </svg>
                                            </div>
                                          {/each}
                                          <button
                                            on:click={() =>
                                              handleNewPermission(
                                                selectedContent,
                                                access.id
                                              )}
                                            class="bg-gray-100 px-2 ms-1 py-1 hover:bg-gray-200 cursor-pointer text-xs font-bold rounded-md"
                                          >
                                            <i class="fa-solid fa-plus"></i>
                                          </button>
                                        </div>
                                      {/if}
                                    </td>

                                    <!-- Actions (Delete User) -->
                                    <td
                                      class="border border-gray-300 px-2 py-2"
                                    >
                                      <div
                                        class="flex items-center gap-2 justify-center"
                                      >
                                        <button
                                          class="text-red-500 hover:text-red-700 text-sm"
                                          on:click={() =>
                                            deleteAccess(
                                              selectedContent,
                                              access.user
                                            )}
                                        >
                                          <i class="fa-solid fa-trash text-xs"
                                          ></i>
                                        </button>
                                        <button
                                          class="text-red-500 hover:text-red-700 text-sm"
                                          on:click={() =>
                                            editAccess(
                                              selectedContent,
                                              access.id
                                            )}
                                        >
                                          <i class="fa-solid fa-edit text-xs"
                                          ></i>
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                {/each}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                    <form method="dialog" class="modal-backdrop">
                      <button>close</button>
                    </form>
                  </dialog>
                </div>

                <!-- branches -->
                <div class="mt-3">
                  <div class="flex justify-between items-center">
                    <!-- branch heading -->
                    <div
                      class="text-lg font-semibold text-gray-500 tracking-[0.06rem]"
                    >
                      Branch
                    </div>

                    <!-- icons -->
                    <div class="flex items-center gap-3">
                      {#if globalVariableObject.isEditingBranch[selectedBranch.id]}
                        <div class="">
                          <button
                            on:click={() => saveChanges(selectedContent)}
                            class="bg-blue-600 text-white px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-blue-800"
                            style="font-weight: 600;">Save</button
                          >
                          <button
                            on:click={() =>
                              (globalVariableObject.isEditingBranch[
                                selectedBranch.id
                              ] = false)}
                            class="bg-gray-100 px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-gray-200"
                            style="font-weight: 600;">Cancel</button
                          >
                        </div>
                      {/if}
                      <form class="flex items-center max-w-sm mx-auto">
                        <label for="simple-search" class="sr-only">Search</label
                        >
                        <div class="relative w-full">
                          <input
                            type="search"
                            id="simple-search"
                            class="bg-gray-50 border outline-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Search branches"
                            required
                            bind:value={globalVariableObject.searchQuery}
                            on:input={() => searchBranches()}
                          />
                        </div>
                      </form>
                      <!-- plus icon for adding new branch -->
                      <svg
                        on:click={() => addNewBranch(selectedContent.id)}
                        class="w-5 h-5 cursor-pointer text-blue-600 hover:text-blue-800 font-semibold dark:text-white"
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
                          d="M5 12h14m-7 7V5"
                        />
                      </svg>

                      <!-- view type icons for branch -->
                      <div class="flex gap-2 border border-gray-200">
                        <!-- table view -->
                        <svg
                          on:click={() => setView("branch", "table")}
                          class="w-7 h-7 px-1 cursor-pointer hover:bg-gray-200 text-gray-800 dark:text-white {stateObject.branch_current_view ===
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
                          on:click={() => setView("branch", "list")}
                          class="w-7 h-7 px-1 cursor-pointer hover:bg-gray-200 text-gray-800 border-x border-gray-200 dark:text-white {stateObject.branch_current_view ===
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
                          on:click={() => setView("branch", "card")}
                          class="w-7 h-7 px-1 cursor-pointer hover:bg-gray-200 text-gray-800 dark:text-white {stateObject.branch_current_view ===
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
                  </div>
                  <!-- branch list -->
                  <div
                    class="mt-2 overflow-y-auto h-[72vh] mb-5 pb-5 scrollContent"
                  >
                    {#if stateObject.branch_current_view === "list"}
                      <div class="overflow-y-auto h-[70vh] scrollContent">
                        {#each selectedContent.branches as branch, index}
                          <details
                            class="collapse bg-base-200 mb-2 border"
                            on:dragover={(event) =>
                              handleDragOverBranch(event, index)}
                            on:drop={(event) => handleDropBranch(event, index)}
                            data-testid={`specificBranch${branch.id}`}
                          >
                            {#if globalVariableObject.isEditingBranchName && globalVariableObject.editingBranchId === branch.id}
                              <summary
                                class="py-1 px-3 collapse-title text-lg font-medium border-b border-gray-200 min-h-[2.5rem!important]"
                              >
                                <input
                                  type="text"
                                  class="py-1.5 px-2 text-xs tracking-[0.05rem] rounded-md"
                                  on:keydown={(event) =>
                                    handleKeyDown(event, branch.id)}
                                  bind:value={branch.name}
                                />
                              </summary>
                            {:else}
                              <summary
                                on:dblclick={() =>
                                  enableEditingBranch(branch.id)}
                                class="py-1 px-3 collapse-title text-lg font-medium border-b border-gray-200 min-h-[2.5rem!important]"
                              >
                                <div class="flex justify-between items-center">
                                  <span> {branch.name} </span>
                                  <div class="flex gap-3 items-center">
                                    <i
                                      on:click={() => deleteBranch(branch.id)}
                                      class="fa-solid fa-trash text-xs text-red-500 hover:text-red-600"
                                    ></i>
                                    <i
                                      class="fa-solid fa-grip text-gray-500 text-xs cursor-grab"
                                      draggable="true"
                                      aria-hidden="true"
                                      on:dragstart={(event) =>
                                        handleDragStartBranch(event, index)}
                                    ></i>
                                  </div>
                                </div>
                              </summary>
                            {/if}
                            <!-- collapse content -->
                            <div
                              class="collapse-content border-t bg-gray-50"
                              data-testid={`branchCollapseContent${branch.id}`}
                            >
                              <!-- stats -->
                              <div class="flex gap-3 sm:gap-2 items-start mt-2">
                                <!-- stats commits -->
                                <div class="stats">
                                  <div class="stat sm:p-1.5">
                                    <div class="stat-title">Total Commits</div>
                                    <div class="stat-value">
                                      {branch.commits.length}
                                    </div>
                                    <div class="stat-desc">
                                      21% more than last month
                                    </div>
                                  </div>
                                </div>

                                <!-- stats access -->
                                <div class="stats">
                                  <div class="stat sm:p-1.5">
                                    <div class="stat-title">Total Access</div>
                                    <div class="stat-value">
                                      {branch.access.length}
                                    </div>
                                    <div class="stat-desc">
                                      21% more than last month
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <!-- edit button -->
                              <div class="flex justify-end sm:mt-2">
                                <button
                                  on:click={() =>
                                    selectedBranchForAccess(branch)}
                                  onclick="my_modal_23.showModal()"
                                  class="bg-gray-100 px-3 py-1 mx-2 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-gray-200"
                                  style="font-weight: 600;">Access</button
                                >
                                <button
                                  on:click={() => editBranch(branch.id)}
                                  class="bg-red-500 px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-red-600"
                                  style="font-weight: 600;">Edit</button
                                >
                              </div>

                              <!-- branch details -->
                              <div class="my-3 sm:text-xs">
                                {#each Object.keys(branch) as fieldName}
                                  {#if fieldName !== "id" && fieldName !== "commits" && fieldName !== "access"}
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
                                            bind:value={branch[fieldName]}
                                            disabled={!globalVariableObject
                                              .isEditingBranch[branch.id]}
                                          />
                                        {:else if fieldName === "branchOwner"}
                                          <input
                                            type="text"
                                            name=""
                                            id=""
                                            class="w-full py-1.5 px-2 rounded-md outline-none"
                                            bind:value={branch[fieldName]}
                                            disabled={!globalVariableObject
                                              .isEditingBranch[branch.id]}
                                          />
                                        {:else if fieldName === "lastCommited"}
                                          <input
                                            type="date"
                                            name=""
                                            id=""
                                            class="w-full py-1.5 px-2 rounded-md outline-none"
                                            bind:value={branch[fieldName]}
                                            disabled={!globalVariableObject
                                              .isEditingBranch[branch.id]}
                                          />
                                        {:else if fieldName === "createdOn"}
                                          <input
                                            type="date"
                                            name=""
                                            id=""
                                            class="w-full py-1.5 px-2 rounded-md outline-none"
                                            bind:value={branch[fieldName]}
                                            disabled={!globalVariableObject
                                              .isEditingBranch[branch.id]}
                                          />
                                        {/if}
                                      </div>
                                    </div>
                                  {/if}
                                {/each}
                              </div>

                              <!--  save,cancel button -->
                              {#if globalVariableObject.isEditingBranch[branch.id]}
                                <div class="mt-3">
                                  <button
                                    on:click={() =>
                                      saveChanges(selectedContent)}
                                    class="bg-blue-600 text-white px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-blue-800"
                                    style="font-weight: 600;">Save</button
                                  >
                                  <button
                                    on:click={() =>
                                      (globalVariableObject.isEditingBranch[
                                        branch.id
                                      ] = false)}
                                    class="bg-gray-100 px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-gray-200"
                                    style="font-weight: 600;">Cancel</button
                                  >
                                </div>
                              {/if}

                              <!-- commits content -->
                              <div class="commitsContent">
                                <!-- commits -->
                                <div
                                  class="flex mt-3 items-center justify-between"
                                >
                                  <div
                                    class="text-lg font-semibold text-gray-500 tracking-[0.06rem]"
                                  >
                                    Commits
                                  </div>
                                  <div class="flex gap-3 items-center">
                                    <form
                                      class="flex items-center max-w-sm mx-auto"
                                    >
                                      <label for="simple-search" class="sr-only"
                                        >Search</label
                                      >
                                      <div class="relative w-full">
                                        <input
                                          type="search"
                                          id="simple-search"
                                          class="bg-gray-50 border outline-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                          placeholder="Search commits"
                                          required
                                          bind:value={globalVariableObject.searchQuery}
                                          on:input={() => searchCommits(branch)}
                                        />
                                      </div>
                                    </form>

                                    <!-- plus icon for adding new branch -->
                                    <svg
                                      on:click={() => addNewCommit(branch.id)}
                                      class="w-5 h-5 cursor-pointer text-blue-600 hover:text-blue-800 font-semibold dark:text-white"
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
                                        d="M5 12h14m-7 7V5"
                                      />
                                    </svg>
                                    <!-- icons -->
                                    <div class="flex items-center gap-3">
                                      <!-- view type icons -->
                                      <div
                                        class="flex gap-2 border border-gray-200"
                                      >
                                        <!-- table view -->
                                        <svg
                                          on:click={() =>
                                            setView("commit", "table")}
                                          class="w-7 h-7 px-1 cursor-pointer hover:bg-gray-200 text-gray-800 dark:text-white {stateObject.commit_current_view ===
                                          'table'
                                            ? 'text-red-500 font-semibold'
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
                                          on:click={() =>
                                            setView("commit", "list")}
                                          class="w-7 h-7 px-1 cursor-pointer hover:bg-gray-200 text-gray-800 border-x border-gray-200 dark:text-white {stateObject.commit_current_view ===
                                          'list'
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
                                            stroke-width="2"
                                            d="M9 8h10M9 12h10M9 16h10M4.99 8H5m-.02 4h.01m0 4H5"
                                          />
                                        </svg>
                                        <!-- card view -->
                                        <svg
                                          on:click={() =>
                                            setView("commit", "card")}
                                          class="w-7 h-7 px-1 cursor-pointer hover:bg-gray-200 text-gray-800 dark:text-white {stateObject.commit_current_view ===
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
                                  </div>
                                </div>

                                <!-- Conditionally render layout based on the current view -->
                                {#if stateObject.commit_current_view === "table"}
                                  <!-- table view -->
                                  <!--  save,cancel button -->
                                  {#if globalVariableObject.isEditingCommit[selectedCommit.commitId]}
                                    <div class="mt-3">
                                      <button
                                        on:click={() =>
                                          saveChanges(selectedContent)}
                                        class="bg-blue-600 text-white px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-blue-800"
                                        style="font-weight: 600;">Save</button
                                      >
                                      <button
                                        on:click={() =>
                                          (globalVariableObject.isEditingCommit[
                                            selectedCommit.commitId
                                          ] = false)}
                                        class="bg-gray-100 px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-gray-200"
                                        style="font-weight: 600;">Cancel</button
                                      >
                                    </div>
                                  {/if}
                                  <div class="overflow-x-auto tableView">
                                    <div
                                      class="table-view w-full mt-3 sm:text-xs sm:tracking-[0.05rem]"
                                    >
                                      <table
                                        class="min-w-full bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-600"
                                      >
                                        <thead
                                          class="bg-gray-100 dark:bg-gray-700"
                                        >
                                          <tr>
                                            {#each Object.keys(branch.commits[0]) as key}
                                              {#if key !== "changes" && key !== "access"}
                                                {#if !searchShowObject.selectedFields.includes(key)}
                                                  <th
                                                    class="py-2 px-4 border border-gray-200"
                                                    >{key}</th
                                                  >
                                                {/if}
                                              {/if}
                                            {/each}
                                            <th
                                              class="py-2 px-3 border border-gray-200"
                                            ></th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {#each branch.commits as commit}
                                            <!-- {#if !searchShowObject.selectedFields.includes(key)} -->

                                            <tr
                                              class="hover:bg-gray-50 dark:hover:bg-gray-600"
                                            >
                                              <td class="border-b">
                                                <input
                                                  type="text"
                                                  class="w-full py-1.5 px-2 rounded-md text-xs tracking-[0.05rem] outline-none border-0 border-gray-300"
                                                  bind:value={commit.commitId}
                                                  disabled={!globalVariableObject
                                                    .isEditingCommit[
                                                    commit.commitId
                                                  ]}
                                                />
                                              </td>
                                              <td
                                                class=" border border-gray-200"
                                              >
                                                <input
                                                  type="text"
                                                  class="w-full py-1.5 px-2 rounded-md text-xs tracking-[0.05rem] outline-none border-0 border-gray-300"
                                                  bind:value={commit.commitMessage}
                                                  disabled={!globalVariableObject
                                                    .isEditingCommit[
                                                    commit.commitId
                                                  ]}
                                                />
                                              </td>
                                              <td
                                                class=" border border-gray-200"
                                              >
                                                <input
                                                  type="text"
                                                  class="w-full py-1.5 px-2 rounded-md text-xs tracking-[0.05rem] outline-none border-0 border-gray-300"
                                                  bind:value={commit.user}
                                                  disabled={!globalVariableObject
                                                    .isEditingCommit[
                                                    commit.commitId
                                                  ]}
                                                />
                                              </td>
                                              <td
                                                class=" border border-gray-200"
                                              >
                                                <input
                                                  type="text"
                                                  class="w-full py-1.5 px-2 rounded-md text-xs tracking-[0.05rem] outline-none border-0 border-gray-300"
                                                  bind:value={commit.commitTime}
                                                  disabled={!globalVariableObject
                                                    .isEditingCommit[
                                                    commit.commitId
                                                  ]}
                                                />
                                              </td>
                                              <td
                                                class=" border border-gray-200"
                                              >
                                                <input
                                                  type="text"
                                                  class="w-full py-1.5 px-2 rounded-md text-xs tracking-[0.05rem] outline-none border-0 border-gray-300"
                                                  bind:value={commit.commitDate}
                                                  disabled={!globalVariableObject
                                                    .isEditingCommit[
                                                    commit.commitId
                                                  ]}
                                                />
                                              </td>

                                              <td
                                                class="py-2 px-4 border border-gray-200"
                                              >
                                                <div class="flex gap-2">
                                                  <i
                                                    on:click={() =>
                                                      deleteCommit(
                                                        branch.id,
                                                        commit.commitId
                                                      )}
                                                    class="fa-solid fa-trash text-xs text-red-500 hover:text-red-600 cursor-pointer"
                                                  ></i>
                                                  <svg
                                                    on:click={() =>
                                                      enableEditingCommit(
                                                        commit.commitId,
                                                        branch.id
                                                      )}
                                                    class="w-4 h-4 text-red-500 cursor-pointer hover:text-red-600 dark:text-white"
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
                                                      d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
                                                    />
                                                  </svg>
                                                </div>
                                              </td>
                                            </tr>
                                            <!-- {/if} -->
                                          {/each}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                {:else if stateObject.commit_current_view === "card"}
                                  <!-- card view -->
                                  <div
                                    class="card-view grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-4 mt-3 sm:text-xs sm:tracking-[0.05rem]"
                                  >
                                    {#each branch.commits as commit}
                                      <div class="mb-1 flex justify-end">
                                        <!-- buttons commit -->
                                        <div
                                          class="flex justify-end gap-3 items-center"
                                        >
                                          <button
                                            class="bg-blue-600 text-white px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-blue-800"
                                            style="font-weight: 600;"
                                            >Share</button
                                          >
                                          <button
                                            class="bg-gray-100 px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-gray-200"
                                            style="font-weight: 600;"
                                            >Approve</button
                                          >
                                          <button
                                            on:click={() =>
                                              enableEditingCommit(
                                                commit.commitId,
                                                branch.id
                                              )}
                                            class="bg-gray-100 px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-gray-200"
                                            style="font-weight: 600;"
                                            >Edit</button
                                          >
                                          <button
                                            class="bg-orange-500 text-white px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-orange-600"
                                            style="font-weight: 600;"
                                            >Live</button
                                          >
                                        </div>
                                      </div>
                                      <div
                                        class="bg-white border border-gray-200 rounded-md p-4 sm:p-2 shadow-sm dark:bg-gray-800 dark:border-gray-600"
                                      >
                                        <div
                                          class="grid grid-cols-2 items-center gap-4 sm:gap-2"
                                        >
                                          <div class="font-semibold">
                                            Commit ID:
                                          </div>
                                          <div
                                            class="w-[60%] sm:w-[80%] sm:max-w-full"
                                          >
                                            <input
                                              type="text"
                                              class="w-full py-1.5 px-2 text-sm rounded-md outline-none border border-gray-300"
                                              value={commit.commitId}
                                              disabled={!globalVariableObject
                                                .isEditingCommit[
                                                commit.commitId
                                              ]}
                                            />
                                          </div>

                                          <div class="font-semibold">
                                            Commit Message:
                                          </div>
                                          <div class="w-[60%]">
                                            <input
                                              type="text"
                                              class="w-full py-1.5 px-2 text-sm rounded-md outline-none border border-gray-300"
                                              value={commit.commitMessage}
                                              disabled={!globalVariableObject
                                                .isEditingCommit[
                                                commit.commitId
                                              ]}
                                            />
                                          </div>

                                          <div class="font-semibold">User:</div>
                                          <div class="w-[60%]">
                                            <input
                                              type="text"
                                              class="w-full py-1.5 px-2 text-sm rounded-md outline-none border border-gray-300"
                                              value={commit.user}
                                              disabled={!globalVariableObject
                                                .isEditingCommit[
                                                commit.commitId
                                              ]}
                                            />
                                          </div>

                                          <div class="font-semibold">Date:</div>
                                          <div class="w-[60%]">
                                            <input
                                              type="date"
                                              class="w-full py-1.5 px-2 text-sm rounded-md outline-none border border-gray-300"
                                              value={commit.commitDate}
                                              disabled={!globalVariableObject
                                                .isEditingCommit[
                                                commit.commitId
                                              ]}
                                            />
                                          </div>

                                          <div class="font-semibold">Time:</div>
                                          <div class="w-[60%]">
                                            <input
                                              type="time"
                                              class="w-full py-1.5 px-2 text-sm rounded-md outline-none border border-gray-300"
                                              value={commit.commitTime}
                                              disabled={!globalVariableObject
                                                .isEditingCommit[
                                                commit.commitId
                                              ]}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <!--  save,cancel button -->
                                      {#if globalVariableObject.isEditingCommit[commit.commitId]}
                                        <div class="mt-2">
                                          <button
                                            on:click={() =>
                                              saveChanges(selectedContent)}
                                            class="bg-blue-600 text-white px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-blue-800"
                                            style="font-weight: 600;"
                                            >Save</button
                                          >
                                          <button
                                            on:click={() =>
                                              (globalVariableObject.isEditingCommit[
                                                commit.commitId
                                              ] = false)}
                                            class="bg-gray-100 px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-gray-200"
                                            style="font-weight: 600;"
                                            >Cancel</button
                                          >
                                        </div>
                                      {/if}
                                    {/each}
                                  </div>
                                {:else if stateObject.commit_current_view === "list"}
                                  <!-- list view -->
                                  <div
                                    class="overflow-y-auto h-[33vh] scrollContent"
                                  >
                                    {#each branch.commits as commit, index}
                                      <details
                                        data-testid={`commitsButton${commit.commitId}`}
                                        class="collapse bg-base-200 mb-2 border mt-2 sm:text-xs"
                                        on:dragover={(event) =>
                                          handleDragOverCommit(event, index)}
                                        on:drop={(event) =>
                                          handleDropCommit(event, index)}
                                      >
                                        <summary
                                          class="py-1 px-3 collapse-title text-lg font-medium border-b border-gray-200 min-h-[2.5rem!important]"
                                        >
                                          <div
                                            class="flex justify-between items-center"
                                          >
                                            <span>
                                              {commit.commitMessage}
                                            </span>
                                            <div
                                              class="flex items-center gap-3"
                                            >
                                              <i
                                                data-testid={`commitsDelete${commit.commitId}`}
                                                on:click={() =>
                                                  deleteCommit(
                                                    branch.id,
                                                    commit.commitId
                                                  )}
                                                class="fa-solid fa-trash text-xs text-red-500 hover:text-red-600"
                                              ></i>
                                              <i
                                                class="fa-solid fa-grip text-gray-500 text-xs cursor-grab"
                                                draggable="true"
                                                aria-hidden="true"
                                                on:dragstart={(event) =>
                                                  handleDragStartCommit(
                                                    event,
                                                    index,
                                                    branch.id,
                                                    commit.commitId
                                                  )}
                                              ></i>
                                            </div>
                                          </div></summary
                                        >
                                        <div
                                          class="collapse-content p-0"
                                          data-testid={`commitsCollapse${commit.commitId}`}
                                        >
                                          <div
                                            class="mt-2 border-t border-base-50 bg-base-200 rounded-md p-3"
                                          >
                                            <!-- buttons commit -->
                                            <div class="mb-3 flex justify-end">
                                              <!-- buttons commit -->
                                              <div
                                                class="flex justify-end gap-3 sm:gap-[0.30rem!important] items-center"
                                              >
                                                <button
                                                  on:click={() =>
                                                    selectedCommitForAccess(
                                                      commit
                                                    )}
                                                  onclick="my_modal_24.showModal()"
                                                  class="bg-gray-100 px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-gray-200"
                                                  style="font-weight: 600;"
                                                  >Access</button
                                                >
                                                <button
                                                  class="bg-blue-600 text-white px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-blue-800"
                                                  style="font-weight: 600;"
                                                  >Share</button
                                                >
                                                <button
                                                  class="bg-gray-100 px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-gray-200"
                                                  style="font-weight: 600;"
                                                  >Approve</button
                                                >
                                                <button
                                                  on:click={() =>
                                                    enableEditingCommit(
                                                      commit.commitId,
                                                      branch.id
                                                    )}
                                                  class="bg-gray-100 px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-gray-200"
                                                  style="font-weight: 600;"
                                                  >Edit</button
                                                >
                                                <button
                                                  class="bg-orange-500 text-white px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-orange-600"
                                                  style="font-weight: 600;"
                                                  >Live</button
                                                >
                                              </div>
                                            </div>
                                            {#each Object.keys(commit) as fieldName}
                                              {#if fieldName !== "changes" && fieldName !== "access"}
                                                <!-- Exclude 'changes' field -->
                                                <div class="flex gap-2 mb-2">
                                                  <div
                                                    class="field1 border border-gray-200 py-1.5 px-2 w-[21vw] max-w-screen rounded-md bg-gray-100 capitalize"
                                                  >
                                                    {fieldName}
                                                  </div>
                                                  <div
                                                    class="field1 border border-gray-200 rounded-md bg-base-100 w-full"
                                                  >
                                                    {#if fieldName === "commitId"}
                                                      <input
                                                        type="text"
                                                        name=""
                                                        id=""
                                                        class="w-full py-1.5 px-2 rounded-md outline-none"
                                                        bind:value={commit[
                                                          fieldName
                                                        ]}
                                                        disabled={!globalVariableObject
                                                          .isEditingCommit[
                                                          commit.commitId
                                                        ]}
                                                      />
                                                    {:else if fieldName === "commitMessage"}
                                                      <input
                                                        type="text"
                                                        name=""
                                                        id=""
                                                        class="w-full py-1.5 px-2 rounded-md outline-none"
                                                        bind:value={commit[
                                                          fieldName
                                                        ]}
                                                        disabled={!globalVariableObject
                                                          .isEditingCommit[
                                                          commit.commitId
                                                        ]}
                                                      />
                                                    {:else if fieldName === "user"}
                                                      <input
                                                        type="text"
                                                        name=""
                                                        id=""
                                                        class="w-full py-1.5 px-2 rounded-md outline-none"
                                                        bind:value={commit[
                                                          fieldName
                                                        ]}
                                                        disabled={!globalVariableObject
                                                          .isEditingCommit[
                                                          commit.commitId
                                                        ]}
                                                      />
                                                    {:else if fieldName === "commitDate"}
                                                      <input
                                                        type="date"
                                                        name=""
                                                        id=""
                                                        class="w-full py-1.5 px-2 rounded-md outline-none"
                                                        bind:value={commit[
                                                          fieldName
                                                        ]}
                                                        disabled={!globalVariableObject
                                                          .isEditingCommit[
                                                          commit.commitId
                                                        ]}
                                                      />
                                                    {:else if fieldName === "commitTime"}
                                                      <input
                                                        type="time"
                                                        name=""
                                                        id=""
                                                        class="w-full py-1.5 px-2 rounded-md outline-none"
                                                        bind:value={commit[
                                                          fieldName
                                                        ]}
                                                        disabled={!globalVariableObject
                                                          .isEditingCommit[
                                                          commit.commitId
                                                        ]}
                                                      />
                                                    {/if}
                                                  </div>
                                                </div>
                                              {/if}
                                            {/each}
                                            <!--  save,cancel button -->
                                            {#if globalVariableObject.isEditingCommit[commit.commitId]}
                                              <div class="mt-3">
                                                <button
                                                  on:click={() =>
                                                    saveChanges(
                                                      selectedContent
                                                    )}
                                                  class="bg-blue-600 text-white px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-blue-800"
                                                  style="font-weight: 600;"
                                                  >Save</button
                                                >
                                                <button
                                                  on:click={() =>
                                                    (globalVariableObject.isEditingCommit[
                                                      commit.commitId
                                                    ] = false)}
                                                  class="bg-gray-100 px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-gray-200"
                                                  style="font-weight: 600;"
                                                  >Cancel</button
                                                >
                                              </div>
                                            {/if}
                                          </div>
                                        </div>
                                      </details>
                                    {/each}
                                  </div>
                                {/if}
                              </div>
                            </div>
                          </details>
                        {/each}
                      </div>
                      <!-- branch table -->
                    {:else if stateObject.branch_current_view === "table"}
                      <!-- Table View -->
                      <div class="overflow-x-auto tableView">
                        <table class="table-auto w-full">
                          <thead>
                            <tr>
                              <th
                                class="border px-3 text-sm tracking-[0.05rem] py-2"
                                >ID</th
                              >
                              <th
                                class="border px-3 text-sm tracking-[0.05rem] py-2"
                              >
                                Name</th
                              >
                              <th
                                class="border px-3 text-sm tracking-[0.05rem] py-2"
                              >
                                Owner</th
                              >
                              <th
                                class="border px-3 text-sm tracking-[0.05rem] py-2"
                              >
                                lastCommited</th
                              >
                              <th
                                class="border px-3 text-sm tracking-[0.05rem] py-2"
                              >
                                createdOn</th
                              >
                              <th
                                class="border px-3 text-sm tracking-[0.05rem] py-2"
                                >Total Commits</th
                              >
                              <th
                                class="border px-3 text-sm tracking-[0.05rem] py-2"
                              ></th>
                            </tr>
                          </thead>
                          <tbody>
                            {#each selectedContent.branches as branch}
                              <tr>
                                <td class="border">
                                  <input
                                    type="text"
                                    class="w-full py-1.5 px-2 rounded-md text-xs tracking-[0.05rem] outline-none border-0 border-gray-300"
                                    bind:value={branch.id}
                                    disabled={!globalVariableObject
                                      .isEditingBranch[branch.id]}
                                  />
                                </td>
                                <!-- on:input={(event) => -->
                                <!-- // handleInputChange(event, branch.name)} -->
                                <td class="border">
                                  <input
                                    type="text"
                                    class="w-full py-1.5 px-2 rounded-md text-xs tracking-[0.05rem] outline-none border-0 border-gray-300"
                                    bind:value={branch.name}
                                    disabled={!globalVariableObject
                                      .isEditingBranch[branch.id]}
                                  />
                                </td>
                                <td class="border">
                                  <input
                                    type="text"
                                    class="w-full py-1.5 px-2 rounded-md text-xs tracking-[0.05rem] outline-none border-0 border-gray-300"
                                    bind:value={branch.branchOwner}
                                    disabled={!globalVariableObject
                                      .isEditingBranch[branch.id]}
                                  />
                                </td>
                                <td class="border">
                                  <input
                                    type="date"
                                    class="w-full py-1.5 px-2 rounded-md text-xs tracking-[0.05rem] outline-none border-0 border-gray-300"
                                    bind:value={branch.lastCommited}
                                    disabled={!globalVariableObject
                                      .isEditingBranch[branch.id]}
                                  />
                                </td>
                                <td class="border">
                                  <input
                                    type="date"
                                    class="w-full py-1.5 px-2 rounded-md text-xs tracking-[0.05rem] outline-none border-0 border-gray-300"
                                    bind:value={branch.createdOn}
                                    disabled={!globalVariableObject
                                      .isEditingBranch[branch.id]}
                                  />
                                </td>

                                <td class="border px-3 py-2"
                                  >{branch.commits.length}</td
                                >
                                <td class="border px-3 py-2">
                                  <div class="flex gap-2">
                                    <i
                                      on:click={() => deleteBranch(branch.id)}
                                      class="fa-solid fa-trash text-xs text-red-500 hover:text-red-600 cursor-pointer"
                                    ></i>
                                    <svg
                                      on:click={() => editBranch(branch.id)}
                                      class="w-4 h-4 text-red-500 cursor-pointer hover:text-red-600 dark:text-white"
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
                                        d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
                                      />
                                    </svg>
                                  </div>
                                </td>
                              </tr>
                            {/each}
                          </tbody>
                        </table>
                      </div>
                    {:else if stateObject.branch_current_view === "card"}
                      <!-- Card View -->
                      <div
                        class="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-4"
                      >
                        {#each selectedContent.branches as branch}
                          <div
                            class="card bg-white shadow-md rounded-lg border border-gray-200 p-4"
                          >
                            <!-- card header -->
                            <div class="card-header text-lg font-semibold mb-2">
                              <div class="flex justify-between items-center">
                                <span>
                                  Branch: {branch.name}
                                </span>
                                <div class="flex gap-2 items-center">
                                  <i
                                    on:click={() => deleteBranch(branch.id)}
                                    class="fa-solid fa-trash text-xs text-red-500 hover:text-red-600 cursor-pointer"
                                  ></i>
                                  <svg
                                    on:click={() => editBranch(branch.id)}
                                    class="w-4 h-4 text-red-500 cursor-pointer hover:text-red-600 dark:text-white"
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
                                      d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <!-- card body -->
                            <div class="card-body grid grid-cols-1 gap-2">
                              <!-- Branch ID -->
                              <div class="flex justify-between items-center">
                                <div class="font-medium text-gray-600">
                                  Branch ID
                                </div>
                                <div class="w-[60%]">
                                  <input
                                    type="text"
                                    class="w-full py-1.5 px-2 text-sm rounded-md outline-none border border-gray-300"
                                    value={branch.id}
                                    disabled={!globalVariableObject
                                      .isEditingBranch[branch.id]}
                                  />
                                </div>
                              </div>

                              <!-- Branch Owner -->
                              <div class="flex justify-between items-center">
                                <div class="font-medium text-gray-600">
                                  Branch Owner
                                </div>
                                <div class="w-[60%]">
                                  <input
                                    type="text"
                                    class="w-full py-1.5 px-2 text-sm rounded-md outline-none border border-gray-300"
                                    value={branch.branchOwner === ""
                                      ? "N/A"
                                      : branch.branchOwner}
                                    disabled={!globalVariableObject
                                      .isEditingBranch[branch.id]}
                                  />
                                </div>
                              </div>

                              <!-- Last Committed -->
                              <div class="flex justify-between items-center">
                                <div class="font-medium text-gray-600">
                                  Last Committed
                                </div>
                                <div class="w-[60%]">
                                  <input
                                    type="text"
                                    class="w-full py-1.5 px-2 text-sm rounded-md outline-none border border-gray-300"
                                    value={branch.lastCommited === ""
                                      ? "N/A"
                                      : branch.lastCommited}
                                    disabled={!globalVariableObject
                                      .isEditingBranch[branch.id]}
                                  />
                                </div>
                              </div>

                              <!-- Created On -->
                              <div class="flex justify-between items-center">
                                <div class="font-medium text-gray-600">
                                  Created On
                                </div>
                                <div class="w-[60%]">
                                  <input
                                    type="text"
                                    class="w-full py-1.5 px-2 text-sm rounded-md outline-none border border-gray-300"
                                    value={branch.createdOn === ""
                                      ? "N/A"
                                      : branch.createdOn}
                                    disabled={!globalVariableObject
                                      .isEditingBranch[branch.id]}
                                  />
                                </div>
                              </div>

                              <!-- Total Commits -->
                              <div class="flex justify-between items-center">
                                <div class="font-medium text-gray-600">
                                  Total Commits
                                </div>
                                <div class="w-[60%]">
                                  <input
                                    type="number"
                                    class="w-full py-1.5 px-2 text-sm rounded-md outline-none border border-gray-300"
                                    value={branch.commits.length}
                                    disabled
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        {/each}
                      </div>
                    {/if}
                  </div>
                </div>
              {:else}
                <div class="text-xs text-center tracking-[0.06rem] mt-4">
                  No content available
                </div>
              {/if}
            {/if}
          </div>
        </div>
      {/if}
    </main>
    {:else}
       <UserSection {globalVariableObject} on:showSidebar={showSidebar} {stateObject} {loginSection}/>
    {/if}

    <!-- access brach -->
    <dialog id="my_modal_23" class="modal">
      <div class="modal-box max-w-[43rem!important]">
        <!-- access content -->
        <div class="accessContent">
          <!-- access -->
          <div class="flex items-center justify-between">
            <div class="text-lg font-semibold text-gray-500 tracking-[0.06rem]">
              Access of {selectedBranch.name} branch
            </div>
            <div class="flex gap-3 items-center">
              <!--  save,cancel button -->
              {#if globalVariableObject.isEditingAccess[globalVariableObject.selectedAccess.id]}
                <div class="mt-3">
                  <button
                    on:click={() => saveChanges(selectedContent)}
                    class="bg-blue-600 text-white px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-blue-800"
                    style="font-weight: 600;">Save</button
                  >
                  <button
                    on:click={() =>
                      (globalVariableObject.isEditingAccess[
                        globalVariableObject.selectedAccess.id
                      ] = false)}
                    class="bg-gray-100 px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-gray-200"
                    style="font-weight: 600;">Cancel</button
                  >
                </div>
              {/if}
              <!-- plus icon for adding new access -->
              <svg
                on:click={() => addNewAccess(selectedBranch.id)}
                class="w-5 h-5 cursor-pointer text-blue-600 hover:text-blue-800 font-semibold dark:text-white"
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
                  d="M5 12h14m-7 7V5"
                />
              </svg>
            </div>
          </div>

          <!-- Access content render -->
          <div class="access-list mt-2">
            <div class="overflow-x-auto tableView">
              <table
                class="table-view w-full text-left border-collapse border border-gray-300"
              >
                <thead>
                  <tr>
                    <th class="border border-gray-300 px-3 py-2">User</th>
                    <th class="border border-gray-300 px-3 py-2">Permissions</th
                    >
                    <th class="border border-gray-300 px-2 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {#each selectedBranch.access as access}
                    <tr>
                      <!-- User Information -->
                      <td class="border border-gray-300">
                        <input
                          type="text"
                          class="px-3 py-2 border-0 w-full"
                          style="font-weight: 600;"
                          bind:value={access.user}
                          disabled={!globalVariableObject.isEditingAccess[
                            access.id
                          ]}
                        />
                      </td>

                      <!-- Permissions -->
                      <td class="border border-gray-300 px-3 py-2">
                        {#if globalVariableObject.isAddPermission[access.id]}
                          <input
                            type="text"
                            class="w-full text-xs tracking-[0.06rem] outline-none focus:outline-none"
                            placeholder="add new permission "
                            bind:value={globalVariableObject.newPermission}
                            on:keydown={(event) =>
                              handleKeyPressAccess(
                                event,
                                selectedBranch,
                                access.id
                              )}
                          />
                        {:else}
                          <div class="permissions flex flex-wrap gap-2">
                            {#each access.permission as permission}
                              <div class="badge badge-info h-[1.6rem] gap-2">
                                {permission}
                                <svg
                                  on:click={() =>
                                    deletePermission(
                                      selectedBranch,
                                      access.user,
                                      permission
                                    )}
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  class="inline-block h-4 w-4 stroke-current"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12"
                                  ></path>
                                </svg>
                              </div>
                            {/each}
                            <button
                              on:click={() =>
                                handleNewPermission(selectedBranch, access.id)}
                              class="bg-gray-100 px-2 ms-1 py-1 hover:bg-gray-200 cursor-pointer text-xs font-bold rounded-md"
                            >
                              <i class="fa-solid fa-plus"></i>
                            </button>
                          </div>
                        {/if}
                      </td>

                      <!-- Actions (Delete User) -->
                      <td class="border border-gray-300 px-2 py-2">
                        <div class="flex items-center gap-2 justify-center">
                          <button
                            class="text-red-500 hover:text-red-700 text-sm"
                            on:click={() =>
                              deleteAccess(selectedBranch, access.user)}
                          >
                            <i class="fa-solid fa-trash text-xs"></i>
                          </button>
                          <button
                            class="text-red-500 hover:text-red-700 text-sm"
                            on:click={() =>
                              editAccess(selectedBranch, access.id)}
                          >
                            <i class="fa-solid fa-edit text-xs"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>

    <!-- access commit -->
    <dialog id="my_modal_24" class="modal">
      <div class="modal-box max-w-[43rem!important]">
        <!-- access content -->
        <div class="accessContent">
          <!-- access -->
          <div class="flex items-center justify-between">
            <div class="text-lg font-semibold text-gray-500 tracking-[0.06rem]">
              Access of {selectedCommit.commitMessage}
            </div>
            <div class="flex gap-3 items-center">
              <!--  save,cancel button -->
              {#if globalVariableObject.isEditingAccess[globalVariableObject.selectedAccess.id]}
                <div class="mt-3">
                  <button
                    on:click={() => saveChanges(selectedContent)}
                    class="bg-blue-600 text-white px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-blue-800"
                    style="font-weight: 600;">Save</button
                  >
                  <button
                    on:click={() =>
                      (globalVariableObject.isEditingAccess[
                        globalVariableObject.selectedAccess.id
                      ] = false)}
                    class="bg-gray-100 px-3 py-1 rounded-md border border-gray-300 text-xs tracking-[0.06rem] hover:bg-gray-200"
                    style="font-weight: 600;">Cancel</button
                  >
                </div>
              {/if}
              <!-- plus icon for adding new access -->
              <svg
                on:click={() => addNewAccess(selectedCommit.id)}
                class="w-5 h-5 cursor-pointer text-blue-600 hover:text-blue-800 font-semibold dark:text-white"
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
                  d="M5 12h14m-7 7V5"
                />
              </svg>
            </div>
          </div>

          <!-- Access content render -->
          <div class="access-list mt-2">
            <div class="overflow-x-auto tableView">
              <table
                class="table-view w-full text-left border-collapse border border-gray-300"
              >
                <thead>
                  <tr>
                    <th class="border border-gray-300 px-3 py-2">User</th>
                    <th class="border border-gray-300 px-3 py-2">Permissions</th
                    >
                    <th class="border border-gray-300 px-2 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {#each selectedCommit.access as access}
                    <tr>
                      <!-- User Information -->
                      <td class="border border-gray-300">
                        <input
                          type="text"
                          class="px-3 py-2 border-0 w-full"
                          style="font-weight: 600;"
                          bind:value={access.user}
                          disabled={!globalVariableObject.isEditingAccess[
                            access.id
                          ]}
                        />
                      </td>

                      <!-- Permissions -->
                      <td class="border border-gray-300 px-3 py-2">
                        {#if globalVariableObject.isAddPermission[access.id]}
                          <input
                            type="text"
                            class="w-full text-xs tracking-[0.06rem] outline-none focus:outline-none"
                            placeholder="add new permission "
                            bind:value={globalVariableObject.newPermission}
                            on:keydown={(event) =>
                              handleKeyPressAccess(
                                event,
                                selectedCommit,
                                access.id
                              )}
                          />
                        {:else}
                          <div class="permissions flex flex-wrap gap-2">
                            {#each access.permission as permission}
                              <div class="badge badge-info h-[1.6rem] gap-2">
                                {permission}
                                <svg
                                  on:click={() =>
                                    deletePermission(
                                      selectedCommit,
                                      access.user,
                                      permission
                                    )}
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  class="inline-block h-4 w-4 stroke-current"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12"
                                  ></path>
                                </svg>
                              </div>
                            {/each}
                            <button
                              on:click={() =>
                                handleNewPermission(selectedCommit, access.id)}
                              class="bg-gray-100 px-2 ms-1 py-1 hover:bg-gray-200 cursor-pointer text-xs font-bold rounded-md"
                            >
                              <i class="fa-solid fa-plus"></i>
                            </button>
                          </div>
                        {/if}
                      </td>

                      <!-- Actions (Delete User) -->
                      <td class="border border-gray-300 px-2 py-2">
                        <div class="flex items-center gap-2 justify-center">
                          <button
                            class="text-red-500 hover:text-red-700 text-sm"
                            on:click={() =>
                              deleteAccess(selectedCommit, access.user)}
                          >
                            <i class="fa-solid fa-trash text-xs"></i>
                          </button>
                          <button
                            class="text-red-500 hover:text-red-700 text-sm"
                            on:click={() =>
                              editAccess(selectedCommit, access.id)}
                          >
                            <i class="fa-solid fa-edit text-xs"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>

    <!-- right side menu -->
    <aside class="{!globalVariableObject.firstCol ? 'sm:hidden' : ''} {loginSection ? "hidden" :""}">
      <ul class="ml-1 mt-2 p-0">
        <li>
          <a href="" on:click={openLoginSection}>
            <svg
              class="w-6 h-6 text-blue-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fill-rule="evenodd"
                d="M12 20a7.966 7.966 0 0 1-5.002-1.756l.002.001v-.683c0-1.794 1.492-3.25 3.333-3.25h3.334c1.84 0 3.333 1.456 3.333 3.25v.683A7.966 7.966 0 0 1 12 20ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10c0 5.5-4.44 9.963-9.932 10h-.138C6.438 21.962 2 17.5 2 12Zm10-5c-1.84 0-3.333 1.455-3.333 3.25S10.159 13.5 12 13.5c1.84 0 3.333-1.455 3.333-3.25S13.841 7 12 7Z"
                clip-rule="evenodd"
              />
            </svg>
          </a>
        </li>
        <li class="mt-3">
          <a href="">
            <svg
              class="w-6 h-6 text-blue-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fill-rule="evenodd"
                d="M5 5a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1h1a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1h1a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1 2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a2 2 0 0 1 2-2ZM3 19v-7a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Zm6.01-6a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm2 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm6 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm-10 4a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm6 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm2 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z"
                clip-rule="evenodd"
              />
            </svg>
          </a>
        </li>

        <li class="mt-3">
          <a href="">
            <svg
              class="w-6 h-6 text-blue-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M17.133 12.632v-1.8a5.406 5.406 0 0 0-4.154-5.262.955.955 0 0 0 .021-.106V3.1a1 1 0 0 0-2 0v2.364a.955.955 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C6.867 15.018 5 15.614 5 16.807 5 17.4 5 18 5.538 18h12.924C19 18 19 17.4 19 16.807c0-1.193-1.867-1.789-1.867-4.175ZM8.823 19a3.453 3.453 0 0 0 6.354 0H8.823Z"
              />
            </svg>
          </a>
        </li>
      </ul>
    </aside>

    <!-- login section -->
     {#if loginSection}
     <div class="absolute z-50 inset-y-10 left-[25rem] w-[40vw]">
       <LoginSection {loginSection}/>
      </div>
     {/if}
  </div>
</div>

<style>
  .menu a {
    border-radius: 0rem !important;
  }
  .highlight {
    background-color: yellow; /* Yellow highlight */
  }

  .collapse:not(.show) {
    display: block;
  }
  .firstCol::-webkit-scrollbar,
  .tableView::-webkit-scrollbar,
  .scrollContent::-webkit-scrollbar {
    width: 2px;
  }
  @media screen and (max-width: 600px) {
    .sidemenu li a {
      padding: 0.6rem;
    }
    .sidemenu {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .mobileView {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 99999;
      background-color: #f4f5f7;
      height: 98vh;
    }
    table td,
    .card {
      font-size: 12px;
    }
  }
</style>
