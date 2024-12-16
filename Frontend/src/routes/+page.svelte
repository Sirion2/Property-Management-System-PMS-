<script lang="ts">
  import "$lib/index.ts"; // Importa los estilos desde el alias $lib
  import {
    Header,
    HeaderNav,
    HeaderNavItem,
    SideNav,
    SideNavItems,
    SideNavLink,
    SkipToContent,
    Button,
  } from "carbon-components-svelte";
  import { Launch } from "carbon-icons-svelte";

  let isSideNavOpen = false;
</script>

<Header
  persistentHamburgerMenu={false}
  expandedByDefault={false}
  company="PMS"
  platformName="Management"
  bind:isSideNavOpen
>
  <svelte:fragment slot="skip-to-content">
    <SkipToContent />
  </svelte:fragment>
  <HeaderNav>
    <HeaderNavItem href="/" text="Inicio" />
    <HeaderNavItem href="/properties" text="Propiedades" />
  </HeaderNav>
</Header>

<SideNav bind:isOpen={isSideNavOpen}>
  <SideNavItems>
    <SideNavLink text="Inicio" />
    <SideNavLink text="Propiedades" />
  </SideNavItems>
</SideNav>

<div class="background">
  <h1>La propiedad que necesitas</h1>
  <p>a un solo click</p>
  <br />
  <Button icon={Launch} href="/properties">Explorar propiedades</Button>
</div>

<style>
  .background {
    color: white;
    margin-left: -40px;
    margin-right: -40px;
    margin-top: -50px;
    height: 100dvh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-image: url("/images/background1.webp");
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
</style>
