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
  } from "carbon-components-svelte";

  let isSideNavOpen = false;
</script>

<Header
  persistentHamburgerMenu={false}
  expandedByDefault={false}
  company="PMS"
  platformName="Property Management"
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
