<script lang="ts">
  import { goto } from "$app/navigation";
  import { verifySignIn } from "$lib/auth/authHelper";
  import "$lib/index.ts"; // Importa los estilos desde el alias $lib
  import { userStore } from "$lib/stores/userStore";
  import {
    Header,
    HeaderUtilities,
    SkipToContent,
    HeaderGlobalAction,
    SideNavItems,
    SideNavDivider,
    SideNav,
    SideNavLink,
    TooltipDefinition,
    ImageLoader,
  } from "carbon-components-svelte";
  import {
    Logout,
    Fade,
    Home,
    Building,
    BuildingInsights_3,
    Edit,
    User,
    TrashCan
  } from "carbon-icons-svelte";
  import { onDestroy, onMount } from "svelte";

  let isSideNavOpen: boolean = false;
  let userData: any = null;

  function sessionLogout() {
    userStore.reset();
    goto("/auth/v1.0");
  }

  const unsubscribe = userStore.subscribe((value) => {
    userData = value;
  });

  onMount(() => {
    verifySignIn();
  });
  onDestroy(() => {
    unsubscribe;
  });
</script>

{#if userData}
  <Header
    company="PMS"
    platformName=""
    bind:isSideNavOpen
    persistentHamburgerMenu={true}
  >
    <svelte:fragment slot="skip-to-content">
      <SkipToContent />
    </svelte:fragment>

    <HeaderUtilities>
      <div class="profile">
        <TooltipDefinition>
          <span class="profile-tooltip" slot="tooltip">
            <p>ID</p>
            <p style="font-size: 0.7rem;">{userData.id}</p>
            <p>Email</p>
            <p style="font-size: 0.7rem;">{userData.email}</p>
          </span>
          <p class="profile-description">
            {userData.firstName}
            {userData.lastName}
          </p>
          <div class="profile-image">
            <ImageLoader
              style="border-radius: 50%; width: 35px; height:35px;"
              src={`data:image/webp;base64,${userData.profileImage}`}
              alt=""
            />
          </div>
        </TooltipDefinition>
      </div>
      <HeaderGlobalAction
        iconDescription="Logout"
        tooltipAlignment="end"
        icon={Logout}
        on:click={() => {
          sessionLogout();
        }}
      />
    </HeaderUtilities>
  </Header>

  <SideNav bind:isOpen={isSideNavOpen}>
    <SideNavItems>
      <h6>Propiedades</h6>
      <SideNavLink icon={Building} text="Administrar Propiedades" href="/main-property" />
      <SideNavLink icon={TrashCan} text="Propiedades Eliminadas" href="/add-property" />
      <SideNavDivider />
      <h5>Usuarios</h5>
      <SideNavLink icon={User} text="Administrar usuarios" href="/user-administration" />
    </SideNavItems>
  </SideNav>
{/if}

<style>
  .profile {
    display: flex;
    color: white;
    gap: 14px;
    justify-content: center;
    align-items: center;
  }
  .profile-description {
    color: white;
  }
  .profile-tooltip {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  .profile-image {
    margin-left: 20px;
    margin-right: 10px;
    height: 35px;
    width: 35px;
  }
</style>
