<script lang="ts">
  import "$lib/index.ts"; // Importa los estilos desde el alias $lib
  import ViewProperty from "$lib/components/modal/View-property.svelte";
  import EditProperty from "$lib/components/modal/Edit-property.svelte";
  import { onDestroy, onMount } from "svelte";
  import { Button, Tile, Search, Pagination } from "carbon-components-svelte";
  import {
    Query,
    View,
    Edit,
    BuildingInsights_3,
  } from "carbon-icons-svelte";
  import { goto } from "$app/navigation";
  import { userStore } from "$lib/stores/userStore";

  let userData: any;
  let searchQuery: string = "";
  let currentPage: number = 1;
  let pageSize: number = 16;
  let viewPropertyModalOpen: boolean = false;
  let editPropertyModalOpen: boolean = false;
  let property_id: number = 0;
  let properties: {
    property_id: number;
    property_name: string;
    property_description: string;
    property_location: string;
    property_agent: {
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
      profileImage: string;
    };
    property_creation: string;
    property_price: string;
    property_images: string[];
  }[] = [];

  let selectedProperty: {
    property_id: number;
    property_name: string;
    property_location: string;
    property_agent: {
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
      profileImage: string;
    };
    property_creation: string;
    property_price: string;
    property_images: string[];
    property_description?: string;
  } | null = null;

  function filterProperties(query: string) {
    if (query.trim() === "") {
      return properties;
    }
    return properties.filter((property) => {
      const propertyValues: any = Object.values(property);
      return propertyValues.some((value: any) =>
        value.toString().toLowerCase().includes(query.toLocaleLowerCase())
      );
    });
  }

  function getPaginatedProperties(
    filteredProperties: typeof properties,
    currentPage: number,
    pageSize: number
  ) {
    const start: number = (currentPage - 1) * pageSize;
    const end: number = Math.min(start + pageSize, filteredProperties.length);
    return filteredProperties.slice(start, end);
  }

  $: filteredProperties = filterProperties(searchQuery);
  $: {
    if (
      filteredProperties.length === 0 ||
      currentPage > Math.ceil(filteredProperties.length / pageSize)
    ) {
      currentPage = 1;
    }
  }
  $: paginatedProperties =
    searchQuery.trim() === ""
      ? getPaginatedProperties(properties, currentPage, pageSize)
      : filteredProperties;

  function onPaginationChange(event: CustomEvent) {
    const { page, pageSize: newSize } = event.detail;
    if (page !== undefined) {
      currentPage = page;
    }
    if (newSize !== undefined) {
      pageSize = newSize;
    }
  }

  function fetchProperty() {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const apiUrl: string = `${apiBaseUrl}property/management/all`;

    fetch(apiUrl,{
      method: "GET",
      headers: {"x-access-token": userData.accessToken},
    })
    .then((response) => { 
        if (!response.ok) 
        {  throw new Error(`HTTP error! Status: ${response.status}`);}
        return response.json()
      })
      .then((data) => {
        if (Array.isArray(data)) {
          properties = data.map((item) => {
            const {
              id,
              name,
              description,
              price,
              location,
              agentAssigned,
              createdAt,
              image_1,
              image_2,
              image_3,
              image_4,
            } = item;
            const profileImg = `data:image/webp;base64,${item.agentAssigned.profileImage}`;
            const images = [image_1, image_2, image_3, image_4].map(
              (image) => `data:image/webp;base64,${image}`
            );
            return {
              property_id: id,
              property_name: name,
              property_description: description,
              property_location: location,
              property_agent: { ...agentAssigned, profileImage: profileImg },
              property_creation: createdAt,
              property_price: price,
              property_images: images,
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
      goto("/main-property");
      fetchProperty();
      interval = setInterval(fetchProperty, import.meta.env.VITE_API_FETCH_RATE);
    }
  });

  onDestroy(() => {
    clearInterval(interval);
    unsubscribe();
  });
</script>

<div>
  <h1>Propiedades</h1>
</div>
<div>
  <p>Seleccione la propiedad y administre.</p>
  <br />
  <div class="search-container">
    <Search icon={Query} bind:value={searchQuery} />
    <Button icon={BuildingInsights_3} size="field" href="/add-property"
      >Agregar Propiedad</Button
    >
  </div>
  {#each paginatedProperties as property}
    <div class="tile-container">
      <Tile>
        <div class="tileset-container">
          <div class="tile-description">
            <p>
              <span class="tile-id_decorator"
                >#<strong>{property.property_id}</strong></span
              >
            </p>
            <h4><strong>{property.property_name.substring(0, 22)}</strong></h4>
            <br />
            <p><strong>Ubicacion: </strong>{property.property_location}.</p>
            <p><strong>Precio: </strong>$ {property.property_price}</p>
            <p>
              <strong
                >Agente:
              </strong>{`${property.property_agent.firstName} ${property.property_agent.lastName}`}
            </p>
            <p>
              <strong>Fecha de Creación: </strong>
              {
                new Date(property.property_creation).toLocaleString()
              }
            </p>
          </div>
          <div class="tile-actions">
            <Button
              kind="ghost"
              iconDescription="Ver"
              icon={View}
              on:click={() => {
                selectedProperty = property;
                viewPropertyModalOpen = true;
              }}
            />
            <Button
              kind="ghost"
              iconDescription="Editar"
              icon={Edit}
              on:click={() => {
                property_id = property.property_id;
                editPropertyModalOpen = true;
              }}
            />
          </div>
        </div>
      </Tile>
    </div>
  {/each}
  <div class="tile-pagination">
    <Pagination
      totalItems={filteredProperties.length === 0
        ? properties.length
        : filteredProperties.length}
      pageSizes={[6, 16, 36, 99]}
      {pageSize}
      on:change={onPaginationChange}
    />
  </div>
</div>
<ViewProperty bind:open={viewPropertyModalOpen} property={selectedProperty} />
<EditProperty bind:open={editPropertyModalOpen} bind:property_id={property_id} />

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
