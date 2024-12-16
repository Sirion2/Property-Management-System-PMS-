<script lang="ts">
  import "$lib/index.ts"; // Importa los estilos desde el alias $lib
  import ViewProperty from "$lib/components/modal/View-property.svelte";
  import { onMount } from "svelte";
  import {
    ClickableTile,
    Search,
    Pagination,
    ImageLoader,
  } from "carbon-components-svelte";
  import { Query } from "carbon-icons-svelte";

  let searchQuery: string = "";
  let currentPage: number = 1;
  let pageSize: number = 16;
  let viewPropertyModalOpen: boolean = false;

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
      : filteredProperties; // Muestra todos los resultados filtrados si hay búsqueda

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
    const apiUrl: string = `${apiBaseUrl}property/all/`;
    fetch(apiUrl)
      .then((response) => response.json())
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
  let interval: number;
  onMount(() => {
    fetchProperty();
    interval = setInterval(fetchProperty, import.meta.env.VITE_API_FETCH_RATE);
    return () => clearInterval(interval);
  });
</script>

<div class="container">
  <div class="header-container">
    <div class="title-container">
      <h1>Propiedades</h1>
      <p>Seleccione la propiedad y administre.</p>
      <br />
    </div>
    <div class="search-container">
      <Search icon={Query} bind:value={searchQuery} />
    </div>
  </div>
  {#each paginatedProperties as property}
    <div class="tile-container">
      <ClickableTile
        on:click={() => {
          (selectedProperty = property), (viewPropertyModalOpen = true);
        }}
      >
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
            <p><strong>Precio: </strong>{property.property_price}</p>
            <p>
              <strong
                >Agente:
              </strong>{`${property.property_agent.firstName} ${property.property_agent.lastName}`}
            </p>
            <p>
              <strong>Fecha de Creación: </strong>
              {property.property_creation.substring(
                0,
                property.property_creation.indexOf("T")
              )}
            </p>
          </div>
          <div class="tile-image">
            {#if property.property_images.length > 0}
              <ImageLoader src={property.property_images[0]} />
            {:else}
              <p>No images available</p>
            {/if}
          </div>
        </div>
      </ClickableTile>
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

<style>
  .container {
    margin-top: -2px;
  }
  .title-container {
    padding-top: 40px;
    padding-bottom: 20px;
    margin-left: auto;
    margin-right: auto;
    color: white;
  }
  .header-container {
    display: flex;
    flex-direction: column;
    height: 250px;
    padding-bottom: 40px;
    margin-bottom: 10px;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
    background-image: url("/images/background1.webp");
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
  .search-container {
    width: 50dvw;
    margin-left: auto;
    margin-right: auto;
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
    min-height: 250px;
    max-height: fit-content;
  }
  .tile-description {
    display: flex;
    flex-direction: column;
    margin-top: auto;
    margin-bottom: auto;
  }
  .tile-id_decorator {
    font-size: 0.7em;
  }
  .tile-image {
    display: flex;
    margin-left: auto;
    padding-left: 10px;
    margin-right: -15px;
    margin-top: -16px;
    margin-bottom: -17px;
  }

  @media (max-width: 480px) {
    .tile-image {
      width: 150px;
    }
  }

  @media (min-width: 481px) and (max-width: 768px) {
    .tile-image {
      width: 350px;
    }
  }
</style>
