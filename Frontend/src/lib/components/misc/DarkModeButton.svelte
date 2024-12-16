<script lang="ts">
  /** @type {"white" | "g10" | "g90" | "g100"} */

  import { Button } from "carbon-components-svelte";
  import { Asleep, AsleepFilled } from "carbon-icons-svelte";

  export let theme: string = "white";
  let darkMode: boolean = false;

  $: {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("theme", theme);
    }
  }

  function toggleDarkMode() {
    darkMode = !darkMode;
    theme = darkMode ? "g90" : "white";
  }
</script>

<div class="darkMBtn-cont">
  <Button
    class="darkMBtn"
    icon={darkMode ? AsleepFilled: Asleep}
    tooltipPosition="left"
    tooltipAlignment="start"
    iconDescription="Modo oscuro: {darkMode ? 'On' : 'Off'}"
    kind="tertiary"
    on:click={toggleDarkMode}
  />
</div>

<style>
  .darkMBtn-cont{
    position: fixed;
    bottom: 20px;
    right: 20px;
  }
</style>