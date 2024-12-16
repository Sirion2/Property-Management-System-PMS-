<script lang="ts">
  import "$lib/index.ts"; // Importa los estilos desde el alias $lib
  import { onDestroy, onMount } from "svelte";

  import AddUser from "$lib/components/modal/Add-user.svelte";
  import EditUser from "$lib/components/modal/Edit-user.svelte";
  import {
    Button,
    Tile,
    Search,
    Pagination,
    ImageLoader,
  } from "carbon-components-svelte";
  import {
    Query,
    UserFollow,
    UserAccessLocked,
    Edit,
  } from "carbon-icons-svelte";
  import { goto } from "$app/navigation";
  import { userStore } from "$lib/stores/userStore";

  let userData: any;
  let searchQuery: string = "";
  let currentPage: number = 1;
  let pageSize: number = 16;
  let addUserModalOpen: boolean = false;
  let editUserModalOpen: boolean = false;
  let user_id: number = 0;

  function filterUsers(query: string) {
    if (query.trim() === "") {
      return users;
    }
    return users.filter((users) => {
      const userValues: any = Object.values(users);
      return userValues.some((value: any) =>
        value.toString().toLowerCase().includes(query.toLocaleLowerCase())
      );
    });
  }

  function getPaginatedUsers(
    filteredUsers: typeof users,
    currentPage: number,
    pageSize: number
  ) {
    const start: number = (currentPage - 1) * pageSize;
    const end: number = Math.min(start + pageSize, filteredUsers.length);
    return filteredUsers.slice(start, end);
  }

  $: filteredUsers = filterUsers(searchQuery);
  $: {
    if (
      filteredUsers.length === 0 ||
      currentPage > Math.ceil(filteredUsers.length / pageSize)
    ) {
      currentPage = 1;
    }
  }

  $: paginatedUsers =
    searchQuery.trim() === ""
      ? getPaginatedUsers(users, currentPage, pageSize)
      : filteredUsers; // Muestra todos los resultados filtrados si hay búsqueda

  function onPaginationChange(event: CustomEvent) {
    const { page, pageSize: newSize } = event.detail;
    if (page !== undefined) {
      currentPage = page;
    }
    if (newSize !== undefined) {
      pageSize = newSize;
    }
  }

  let users: {
    user_id: number;
    user_firstName: string;
    user_lastName: string;
    user_email: string;
    user_password: string;
    user_phoneNumber: string;
    user_profileImage: string;
    user_rol: string;
    user_status: string;
    user_createdAt: string;
    user_createdBy: string;
  }[] = [];

  function fetchUser() {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const apiUrl: string = `${apiBaseUrl}agent/Management/all`;

    fetch(apiUrl, {
      method: "GET",
      headers: { "x-access-token": userData.accessToken },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(Array.isArray(data));
        if (Array.isArray(data)) {
          users = data.map((item) => {
            const {
              id,
              firstName,
              lastName,
              email,
              password,
              phoneNumber,
              rol,
              status,
              createdAt,
              createdBy,
            } = item;
            const profileImg = `data:image/webp;base64,${item.profileImage}`;
            return {
              user_id: id,
              user_firstName: firstName,
              user_lastName: lastName,
              user_email: email,
              user_password: password,
              user_phoneNumber: phoneNumber,
              user_profileImage: profileImg,
              user_rol: rol,
              user_status: status,
              user_createdAt: createdAt,
              user_createdBy: createdBy,
            };
          });
        }
      });
  }

  const unsubscribe = userStore.subscribe((value) => {
    userData = value;
  });

  let interval: number;
  onMount(() => {
    if (!userData) {
      goto("/auth/v1.0");
    } else {
      goto("/user-administration");
      fetchUser();
      interval = setInterval(fetchUser, import.meta.env.VITE_API_FETCH_RATE);
    }
  });

  onDestroy(() => {
    clearInterval(interval);
    unsubscribe();
  });
</script>

<div>
  <h1>Usuarios</h1>
</div>
<div>
  <p>Seleccione el usuario y administre.</p>
  <br />
  <div class="search-container">
    <Search icon={Query} bind:value={searchQuery} />
    <Button
      iconDescription="Nuevo usuario"
      icon={UserFollow}
      on:click={() => (addUserModalOpen = true)}>Nuevo usuario</Button
    >
  </div>
  {#each paginatedUsers as user}
    <div class="tile-container">
      <Tile>
        <div class="tileset-container">
          <div class="tile-image">
            {#if user.user_profileImage.length > 0}
              <ImageLoader
                style="border-radius: 4px;"
                src={user.user_profileImage}
              />
            {:else}
              <p>No images available</p>
            {/if}
          </div>

          <div class="tile-description">
            <p>
              <span class="tile-id_decorator"
                >#<strong>{user.user_id}</strong></span
              >
            </p>
            <h4>
              <strong>Nombre: {user.user_firstName} {user.user_lastName}</strong
              >
            </h4>
            <br />
            <p><strong>email: </strong>{user.user_email}</p>
            <p><strong>rol: </strong>{user.user_rol}.</p>
            <p><strong>estatus: </strong>{user.user_status}.</p>
            <p>
              <strong>Fecha de Creación: </strong>
              {new Date(user.user_createdAt).toLocaleString()}
            </p>
          </div>
          <div class="tile-actions">
            <Button
              kind="ghost"
              iconDescription="Editar"
              icon={Edit}
              on:click={() => {user_id = user.user_id; editUserModalOpen = true; }}
            />
            <Button
              kind="ghost"
              iconDescription="Deshabilitar"
              icon={UserAccessLocked}
            />
          </div>
        </div>
      </Tile>
    </div>
  {/each}
  <div class="tile-pagination">
    <Pagination
      totalItems={filteredUsers.length}
      pageSizes={[6, 16, 36, 99]}
      {pageSize}
      on:change={onPaginationChange}
    />
  </div>
</div>

<AddUser bind:open={addUserModalOpen} />
<EditUser bind:open={editUserModalOpen} bind:user_id={user_id}/>

<style>
  .search-container {
    display: flex;
    margin-bottom: 10px;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  }
  .tile-container {
    margin-bottom: 10px;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  }
  .tile-image {
    display: flex;
    margin-right: 10px;
    background-repeat: no-repeat;
    background-size: contain;
    width: 100px;
  }
  .tile-pagination {
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  }
  .tileset-container {
    display: flex;
  }
  .tile-id_decorator {
    font-size: 0.7em;
  }
  .tile-actions {
    display: flex;
    gap: 5px;
    margin-left: auto;
    justify-content: center;
    flex-direction: column;
  }
</style>
