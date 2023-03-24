<script>
  import { fly } from "svelte/transition";

  export let error;
</script>

{#if error}
  <div
    class="alert alert-danger"
    role="alert"
    in:fly={{ y: -50, duration: 1000 }}
  >
    {error}
  </div>
{/if}
