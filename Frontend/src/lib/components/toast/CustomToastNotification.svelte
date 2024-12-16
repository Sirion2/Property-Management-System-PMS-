<script lang="ts">
  import { ToastNotification } from "carbon-components-svelte";
  import { fade } from "svelte/transition";

  export let openToastNotification: boolean = false;
  let timeout = 0;

  $: openToastNotification ? (timeout = 3_000) : (timeout = 0);

  export let toastAttributes: {
    kind: any;
    subtitle: any;
  } = {
    kind: "info",
    subtitle: "submessage",
  };

  $: toastAttributes;
  $: showNotification = timeout !== 0;
</script>

<div class="toast-container">
  {#if showNotification}
    <div transition:fade>
      <ToastNotification
        {timeout}
        kind={toastAttributes.kind}
        title={toastAttributes.kind === "success"
          ? "Éxito"
          : toastAttributes.kind === "warning"
            ? "Aviso"
            : toastAttributes.kind === "info"
              ? "Información"
              : "Error"}
        subtitle={toastAttributes.subtitle}
        caption={new Date().toLocaleString()}
        on:close={(e) => {
          timeout = 0;
          openToastNotification = false;
        }}
      />
    </div>
  {/if}
</div>

<style>
  .toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
  }
</style>
