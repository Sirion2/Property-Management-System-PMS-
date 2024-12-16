<script lang="ts">
  import "$lib/index.ts"; // Importa los estilos desde el alias $lib
  import DarkModeButton from "$lib/components/misc/DarkModeButton.svelte";
  import Header from "$lib/components/header/Header.svelte";
  import UserHeader from "$lib/components/header/UserHeader.svelte";
  import { page } from "$app/stores";

  $: currentPath = $page.url.pathname; //reactively get the current path
</script>

{#if currentPath !== "/" && currentPath !== "/auth/v1.0" && currentPath !== "/properties"}
  <Header />
{:else if currentPath !== "/auth/v1.0"}
  <UserHeader />
{/if}

<main class="container">
  <slot />
</main>
<DarkModeButton />

<style>
  .container {
    margin-left: 40px;
    margin-right: 40px;
    margin-top: 50px;
  }
</style>
