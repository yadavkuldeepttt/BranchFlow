import { test, expect } from "@playwright/test";

test("check if there is main content", async ({ page }) => {
  // Navigate to the specified URL
  await page.goto("http://localhost:4322/");

  // Check for the presence of the element with data-testid="mainContent"
  const mainContent = await page.locator('[data-testid="mainContent"]');

  // Ensure the mainContent element is visible on the page
  await expect(mainContent).toBeVisible();
});

test.describe("branch table view", () => {
  test("change global view to table ", async ({ page }) => {
    // Navigate to the specified URL
    await page.goto("http://localhost:4322/");

    const dropdownView = await page.locator('[data-testid="dropdownView"]');
    await dropdownView.click();

    // Wait for the dropdown to be visible
    const dropdownMenu = await page.locator(
      '[data-testid="dropdownViewContent"]'
    );
    await expect(dropdownMenu).toBeVisible();

    // Click the "Table View" option in the dropdown
    const tableViewOption = await dropdownMenu.locator("text=Table View"); // Finds the "Table View" option by text
    await tableViewOption.click();

    // Assertion to ensure the view has changed to "Table View"
    const tableView = page.locator('[data-testid="table-view"]'); // Assuming you have a data-testid for the table view
    await expect(tableView).toBeVisible();
  });

  test("add a new row in table view", async ({ page }) => {
    // Navigate to the specified URL
    await page.goto("http://localhost:4322/");

    const dropdownView = await page.locator('[data-testid="dropdownView"]');
    await dropdownView.click();

    // Wait for the dropdown to be visible
    const dropdownMenu = await page.locator(
      '[data-testid="dropdownViewContent"]'
    );
    await expect(dropdownMenu).toBeVisible();

    // Click the "Table View" option in the dropdown
    const tableViewOption = await dropdownMenu.locator("text=Table View"); // Finds the "Table View" option by text
    await tableViewOption.click();

    // Assertion to ensure the view has changed to "Table View"
    const tableView = page.locator('[data-testid="table-view"]'); // Assuming you have a data-testid for the table view
    await expect(tableView).toBeVisible();

    const newRowButton = page.locator('[data-testid="addNewRow"]'); // add new row in table
    await newRowButton.click();

    // Find the table body (where rows are located)
    const tableRows = tableView.locator('tbody [data-testid="tableRowrepo2"]');
    await expect(tableRows).toBeVisible();
  });
});

test.describe("branch list view", () => {
  test("change global view to list ", async ({ page }) => {
    // Navigate to the specified URL
    await page.goto("http://localhost:4322/");

    const dropdownView = await page.locator('[data-testid="dropdownView"]');
    await dropdownView.click();

    // Wait for the dropdown to be visible
    const dropdownMenu = await page.locator(
      '[data-testid="dropdownViewContent"]'
    );
    await expect(dropdownMenu).toBeVisible();

    // Click the "Table View" option in the dropdown
    const tableViewOption = await dropdownMenu.locator("text=List View"); // Finds the "Table View" option by text
    await tableViewOption.click();

    // Assertion to ensure the view has changed to "Table View"
    const listView = page.locator('[data-testid="listView"]'); // Assuming you have a data-testid for the table view
    await expect(listView).toBeVisible();
  });

  test("select repo and show repo details", async ({ page }) => {
    // Navigate to the specified URL
    await page.goto("http://localhost:4322/");

    // Assertion to ensure the view has changed to "Table View"
    const repoList = page.locator('[data-testid="repoListrepo2"]');
    await repoList.click();

    const selectedRepo = page.locator('[data-testid="selectedReporepo2"]');
    await expect(selectedRepo).toBeVisible();
  });

  test("add a new repo", async ({ page }) => {
    // Navigate to the specified URL
    await page.goto("http://localhost:4322/");

    // Assertion to ensure the view has changed to "Table View"
    const addNewRepo = page.locator('[data-testid="addNewRepo"]');
    await addNewRepo.click();

    await page.waitForTimeout(500);
  });

  test("compare two branch", async ({ page }) => {
    // Navigate to the specified URL
    await page.goto("http://localhost:4322/");

    // Assertion to ensure the view has changed to "Table View"
    const selectAllCheckbox = page.locator('[data-testid="selectAllCheckbox"]');
   // Ensure the checkbox is visible before interacting
  await expect(selectAllCheckbox).toBeVisible();

  // Check the checkbox
  await selectAllCheckbox.check();

  // Verify if the checkbox is checked
  await expect(selectAllCheckbox).toBeChecked();
  await page.waitForTimeout(500);

   // Locate the action dropdown by data-testid
   const actionDropdown = page.locator('[data-testid="actionDropdown"]');

   // Ensure the dropdown is visible
   await expect(actionDropdown).toBeVisible();
 
   // Click on the dropdown and select the "Compare Selected" option
   await actionDropdown.selectOption({ value: 'compare' });
 
   // Verify the correct option was selected
   const compareOption = page.locator('[data-testid="compareOption"]');
   await expect(compareOption).toHaveAttribute("value", "compare");
 



  });

  test("delete repo", async ({ page }) => {
    // Navigate to the specified URL
    await page.goto("http://localhost:4322/");

    // Assertion to ensure the view has changed to "Table View"
    const repoList = page.locator('[data-testid="repoListrepo2"]');
    await repoList.click();

    const repoDelete = page.locator('[data-testid="repoDeleterepo2"]');
    await repoDelete.click();

    await page.waitForTimeout(500);
  });

  test("test pagination", async ({ page }) => {
    // Navigate to the specified URL
    await page.goto("http://localhost:4322/");

    // add a new repo
    const addNewRepo = page.locator('[data-testid="addNewRepo"]');
    await addNewRepo.click();

    await page.waitForTimeout(500);

    const nextPage = page.locator('[data-testid="goToNextPage"]');
    await nextPage.click();

    await page.waitForTimeout(500);
  });

  test("show selected repo branch", async ({ page }) => {
    // Navigate to the specified URL
    await page.goto("http://localhost:4322/");

    // Assertion to ensure the view has changed to "Table View"
    const repoList = page.locator('[data-testid="repoListrepo2"]');
    await repoList.click();

    const selectedRepo = page.locator('[data-testid="selectedReporepo2"]');
    await expect(selectedRepo).toBeVisible();

    const selectedRepoBranch = page.locator(
      '[data-testid="specificBranchbranch3"]'
    );
    await selectedRepoBranch.click();

    const branchCollapseContent = page.locator(
      '[data-testid="branchCollapseContentbranch3"]'
    );
    await expect(branchCollapseContent).toBeVisible();
  });

  test("branch delete of selected repo", async ({ page }) => {
    // Navigate to the specified URL
    await page.goto("http://localhost:4322/");

    // Assertion to ensure the view has changed to "Table View"
    const repoList = page.locator('[data-testid="repoListrepo2"]');
    await repoList.click();

    const selectedRepo = page.locator('[data-testid="selectedReporepo2"]');
    await expect(selectedRepo).toBeVisible();

    const selectedRepoBranch = page.locator(
      '[data-testid="specificBranchbranch3"]'
    );
    await selectedRepoBranch.click();

    const branchCollapseContent = page.locator(
      '[data-testid="branchCollapseContentbranch3"]'
    );
    await expect(branchCollapseContent).toBeVisible();

    const commitsAccordion = page.locator(
      '[data-testid="commitsButtoncommit1"]'
    );
    await commitsAccordion.click();

    const commitsCollapseContent = page.locator(
      '[data-testid="commitsCollapsecommit1"]'
    );
    await expect(commitsCollapseContent).toBeVisible();
  });

  test("branch edit of selected repo", async ({ page }) => {
    // Navigate to the specified URL
    await page.goto("http://localhost:4322/");

    // Assertion to ensure the view has changed to "Table View"
    const repoList = page.locator('[data-testid="repoListrepo2"]');
    await repoList.click();

    const selectedRepo = page.locator('[data-testid="selectedReporepo2"]');
    await expect(selectedRepo).toBeVisible();

    const selectedRepoBranch = page.locator(
      '[data-testid="specificBranchbranch3"]'
    );
    await selectedRepoBranch.click();

    const branchCollapseContent = page.locator(
      '[data-testid="branchCollapseContentbranch3"]'
    );
    await expect(branchCollapseContent).toBeVisible();

    const commitsAccordion = page.locator(
      '[data-testid="commitsButtoncommit1"]'
    );
    await commitsAccordion.click();

    const commitsCollapseContent = page.locator(
      '[data-testid="commitsCollapsecommit1"]'
    );
    await expect(commitsCollapseContent).toBeVisible();
  });

  test("change branch view", async ({ page }) => {
    // Navigate to the specified URL
    await page.goto("http://localhost:4322/");

    // Assertion to ensure the view has changed to "Table View"
    const repoList = page.locator('[data-testid="repoListrepo2"]');
    await repoList.click();

    const selectedRepo = page.locator('[data-testid="selectedReporepo2"]');
    await expect(selectedRepo).toBeVisible();

    const selectedRepoBranch = page.locator(
      '[data-testid="specificBranchbranch3"]'
    );
    await selectedRepoBranch.click();

    const branchCollapseContent = page.locator(
      '[data-testid="branchCollapseContentbranch3"]'
    );
    await expect(branchCollapseContent).toBeVisible();

    const commitsAccordion = page.locator(
      '[data-testid="commitsButtoncommit1"]'
    );
    await commitsAccordion.click();

    const commitsCollapseContent = page.locator(
      '[data-testid="commitsCollapsecommit1"]'
    );
    await expect(commitsCollapseContent).toBeVisible();
  });

  test("change commit view", async ({ page }) => {
    // Navigate to the specified URL
    await page.goto("http://localhost:4322/");

    // Assertion to ensure the view has changed to "Table View"
    const repoList = page.locator('[data-testid="repoListrepo2"]');
    await repoList.click();

    const selectedRepo = page.locator('[data-testid="selectedReporepo2"]');
    await expect(selectedRepo).toBeVisible();

    const selectedRepoBranch = page.locator(
      '[data-testid="specificBranchbranch3"]'
    );
    await selectedRepoBranch.click();

    const branchCollapseContent = page.locator(
      '[data-testid="branchCollapseContentbranch3"]'
    );
    await expect(branchCollapseContent).toBeVisible();

    const commitsAccordion = page.locator(
      '[data-testid="commitsButtoncommit1"]'
    );
    await commitsAccordion.click();

    const commitsCollapseContent = page.locator(
      '[data-testid="commitsCollapsecommit1"]'
    );
    await expect(commitsCollapseContent).toBeVisible();
  });

  test("commit details of selected repo", async ({ page }) => {
    // Navigate to the specified URL
    await page.goto("http://localhost:4322/");

    // Assertion to ensure the view has changed to "Table View"
    const repoList = page.locator('[data-testid="repoListrepo2"]');
    await repoList.click();

    const selectedRepo = page.locator('[data-testid="selectedReporepo2"]');
    await expect(selectedRepo).toBeVisible();

    const selectedRepoBranch = page.locator(
      '[data-testid="specificBranchbranch3"]'
    );
    await selectedRepoBranch.click();

    const branchCollapseContent = page.locator(
      '[data-testid="branchCollapseContentbranch3"]'
    );
    await expect(branchCollapseContent).toBeVisible();

    const commitsAccordion = page.locator(
      '[data-testid="commitsButtoncommit1"]'
    );
    await commitsAccordion.click();

    const commitsCollapseContent = page.locator(
      '[data-testid="commitsCollapsecommit1"]'
    );
    await expect(commitsCollapseContent).toBeVisible();
  });

  test("delete commit of selected repo", async ({ page }) => {
    // Navigate to the specified URL
    await page.goto("http://localhost:4322/");

    // Assertion to ensure the view has changed to "Table View"
    const repoList = page.locator('[data-testid="repoListrepo2"]');
    await repoList.click();

    const selectedRepo = page.locator('[data-testid="selectedReporepo2"]');
    await expect(selectedRepo).toBeVisible();

    //  selected repo branch detail
    const selectedRepoBranch = page.locator(
      '[data-testid="specificBranchbranch3"]'
    );
    await selectedRepoBranch.click();

    // branch collapse
    const branchCollapseContent = page.locator(
      '[data-testid="branchCollapseContentbranch3"]'
    );
    await expect(branchCollapseContent).toBeVisible();

    // commit accordion
    const commitsAccordion = page.locator(
      '[data-testid="commitsButtoncommit1"]'
    );
    await commitsAccordion.click();

    // delete commit
    const commitsDelete = page.locator('[data-testid="commitsDeletecommit1"]');
    await commitsDelete.click();

    await page.waitForTimeout(500);
  });

  test("edit commit of selected repo", async ({ page }) => {
    // Navigate to the specified URL
    await page.goto("http://localhost:4322/");

    // Assertion to ensure the view has changed to "Table View"
    const repoList = page.locator('[data-testid="repoListrepo2"]');
    await repoList.click();

    const selectedRepo = page.locator('[data-testid="selectedReporepo2"]');
    await expect(selectedRepo).toBeVisible();

    //  selected repo branch detail
    const selectedRepoBranch = page.locator(
      '[data-testid="specificBranchbranch3"]'
    );
    await selectedRepoBranch.click();

    // branch collapse
    const branchCollapseContent = page.locator(
      '[data-testid="branchCollapseContentbranch3"]'
    );
    await expect(branchCollapseContent).toBeVisible();

    // commit accordion
    const commitsAccordion = page.locator(
      '[data-testid="commitsButtoncommit1"]'
    );
    await commitsAccordion.click();

    // delete commit
    const commitsDelete = page.locator('[data-testid="commitsDeletecommit1"]');
    await commitsDelete.click();

    await page.waitForTimeout(500);
  });

  test("compare branch", async ({ page }) => {
    // Navigate to the specified URL
    await page.goto("http://localhost:4322/");

    // Assertion to ensure the view has changed to "Table View"
    const repoList = page.locator('[data-testid="repoListrepo2"]');
    await repoList.click();

    const selectedRepo = page.locator('[data-testid="selectedReporepo2"]');
    await expect(selectedRepo).toBeVisible();

    const selectedRepoBranch = page.locator(
      '[data-testid="specificBranchbranch3"]'
    );
    await selectedRepoBranch.click();

    const branchCollapseContent = page.locator(
      '[data-testid="branchCollapseContentbranch3"]'
    );
    await expect(branchCollapseContent).toBeVisible();

    const commitsAccordion = page.locator(
      '[data-testid="commitsButtoncommit1"]'
    );
    await commitsAccordion.click();

    const commitsCollapseContent = page.locator(
      '[data-testid="commitsCollapsecommit1"]'
    );
    await expect(commitsCollapseContent).toBeVisible();
  });

  test("filter repo", async ({ page }) => {
    // Navigate to the specified URL
    await page.goto("http://localhost:4322/");

    // Assertion to ensure the view has changed to "Table View"
    const repoList = page.locator('[data-testid="repoListrepo2"]');
    await repoList.click();

    const selectedRepo = page.locator('[data-testid="selectedReporepo2"]');
    await expect(selectedRepo).toBeVisible();

    const selectedRepoBranch = page.locator(
      '[data-testid="specificBranchbranch3"]'
    );
    await selectedRepoBranch.click();

    const branchCollapseContent = page.locator(
      '[data-testid="branchCollapseContentbranch3"]'
    );
    await expect(branchCollapseContent).toBeVisible();

    const commitsAccordion = page.locator(
      '[data-testid="commitsButtoncommit1"]'
    );
    await commitsAccordion.click();

    const commitsCollapseContent = page.locator(
      '[data-testid="commitsCollapsecommit1"]'
    );
    await expect(commitsCollapseContent).toBeVisible();
  });
  test("filter branch", async ({ page }) => {
    // Navigate to the specified URL
    await page.goto("http://localhost:4322/");

    // Assertion to ensure the view has changed to "Table View"
    const repoList = page.locator('[data-testid="repoListrepo2"]');
    await repoList.click();

    const selectedRepo = page.locator('[data-testid="selectedReporepo2"]');
    await expect(selectedRepo).toBeVisible();

    const selectedRepoBranch = page.locator(
      '[data-testid="specificBranchbranch3"]'
    );
    await selectedRepoBranch.click();

    const branchCollapseContent = page.locator(
      '[data-testid="branchCollapseContentbranch3"]'
    );
    await expect(branchCollapseContent).toBeVisible();

    const commitsAccordion = page.locator(
      '[data-testid="commitsButtoncommit1"]'
    );
    await commitsAccordion.click();

    const commitsCollapseContent = page.locator(
      '[data-testid="commitsCollapsecommit1"]'
    );
    await expect(commitsCollapseContent).toBeVisible();
  });
  test("filter commit", async ({ page }) => {
    // Navigate to the specified URL
    await page.goto("http://localhost:4322/");

    // Assertion to ensure the view has changed to "Table View"
    const repoList = page.locator('[data-testid="repoListrepo2"]');
    await repoList.click();

    const selectedRepo = page.locator('[data-testid="selectedReporepo2"]');
    await expect(selectedRepo).toBeVisible();

    const selectedRepoBranch = page.locator(
      '[data-testid="specificBranchbranch3"]'
    );
    await selectedRepoBranch.click();

    const branchCollapseContent = page.locator(
      '[data-testid="branchCollapseContentbranch3"]'
    );
    await expect(branchCollapseContent).toBeVisible();

    const commitsAccordion = page.locator(
      '[data-testid="commitsButtoncommit1"]'
    );
    await commitsAccordion.click();

    const commitsCollapseContent = page.locator(
      '[data-testid="commitsCollapsecommit1"]'
    );
    await expect(commitsCollapseContent).toBeVisible();
  });
});
