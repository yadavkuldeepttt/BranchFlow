<script>
  import { onMount } from "svelte";
  export let message = "";
  export let type = "success"; // success, error, info, etc.
  export let duration = 3000; // duration in milliseconds

  let isVisible = false;

  onMount(() => {
    isVisible = true;
    setTimeout(() => {
      isVisible = false;
    }, duration);
  });

  // Compute the appropriate class based on the type
  let bgColorClass = "";
  $: bgColorClass =
    type === "success"
      ? "bg-green-500"
      : type === "error"
        ? "bg-red-500"
        : "bg-blue-500";
</script>

<div
  style="z-index: 9999999!important;"
  class={`fixed top-[1%]  right-4 flex  items-center px-4 py-3 rounded-lg shadow-lg transition-opacity duration-300 text-white ${bgColorClass}`}
  class:opacity-0={!isVisible}
>
  {#if type === "error"}
    <div
      class="inline-flex items-center justify-center flex-shrink-0 w-8 h-7 text-orange-500 bg-orange-100 rounded-lg dark:bg-orange-700 dark:text-orange-200"
    >
      <svg
        class="w-4 h-4"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z"
        />
      </svg>
      <span class="sr-only">Warning icon</span>
    </div>
  {:else}
    <div
      class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200"
    >
      <svg
        class="w-5 h-5"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"
        />
      </svg>
      <span class="sr-only">Check icon</span>
    </div>
  {/if}
  <div class="ms-2 text-sm font-medium">{message}</div>
</div>

<style>
  .opacity-0 {
    opacity: 0;
  }
</style>
