<script lang="ts">
  import { Button, ImageLoader, Modal, Tile } from "carbon-components-svelte";
  import { ChevronLeft, ChevronRight } from "carbon-icons-svelte";
  export let open: boolean = false;

  export let property: {
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
  export let index: number = 0;
  let imageArrLen: number;

  $: imageArrLen =
    property?.property_images.filter(
      (image) => !image.includes("data:image/webp;base64,null")
    ).length || 0;
  $: src = property?.property_images[index];

  function prevImage() {
    index--;
    if (index === -1) {
      index = imageArrLen - 1;
    }
  }

  function nextImage() {
    index++;
    if (index > imageArrLen - 1) {
      index = 0;
    }
  }
</script>

<Modal
  passiveModal
  bind:open
  modalHeading={property?.property_name.substring(0, 22)}
  size="sm"
  on:close={() => {
    open = false;
    index = 0;
    property = null;
  }}
>
  <div class="modalContent-container">
    <ImageLoader
      ratio="1x1"
      fadeIn
      {src}
      alt={src}
      style="max-width:100%; max-height:250px; object-fit:contain;"
    />
    <div class="image-control">
      <Button
        tooltipPosition="top"
        kind="ghost"
        tooltipAlignment="end"
        iconDescription="Previous"
        icon={ChevronLeft}
        on:click={() => prevImage()}
      />
      <Button
        tooltipPosition="top"
        kind="ghost"
        tooltipAlignment="end"
        iconDescription="Next"
        icon={ChevronRight}
        on:click={() => {
          nextImage();
        }}
      />
    </div>
    <Tile>
      <div class="modalContent-description">
        <h6><strong>ID: {property?.property_id}</strong></h6>
        <h5><strong>Descripción:</strong></h5>
        <p>
          {property?.property_description?.substring(0, 249)}
        </p>
        <br />
        <h5>Ubicación:</h5>
        <p>{property?.property_description}</p>
        <br />
        <h5>Precio:</h5>
        <p>${property?.property_price}</p>
        <br />
        <Tile light>
          <div class="contacto-image">
            <ImageLoader src={property?.property_agent.profileImage} />
            <div class="contacto-text">
              <h4><strong>Contacto</strong></h4>
              <hr />
              <h5>Agente:</h5>
              <p>
                {`${property?.property_agent.firstName} ${property?.property_agent.lastName}`}
              </p>
              <h5>Teléfono:</h5>
              <p>
                {property?.property_agent.phoneNumber}
              </p>
              <h5>Email:</h5>
              <p>
                {property?.property_agent.email}
              </p>
            </div>
          </div>
        </Tile>
      </div>
    </Tile>
  </div>
</Modal>

<style>
  .modalContent-container {
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
  .image-control {
    position: absolute;
    display: flex;
  }

  .modalContent-description {
    position: absolute;
  }

  .contacto-image {
    display: flex;
    flex-direction: row;
    width: 115px;
    height: auto;
    object-fit: scale-down;
    gap: 20px;
  }

  @media (max-width: 480px) {
    .image-control {
      margin-top: 20dvh;
    }
    .modalContent-description {
      margin-top: -10dvh;
      width: 320px;
    }
    .contacto-text {
      line-break: auto;
    }
    .contacto-text {
      min-width: 150px;
      word-break: break-word;
    }
  }

  @media (min-width: 481px) and (max-width: 768px) {
    .image-control {
      margin-top: 10dvh;
    }
    .modalContent-description {
      margin-top: -13dvh;
      width: 390px;
    }
    .contacto-text {
      min-width: 150px;
      word-break: break-word;
    }
  }

  @media (min-width: 769px) {
    .image-control {
      display: flex;
      margin-top: 7dvh;
    }
    .modalContent-description {
      margin-top: -26dvh;
      width: 90%;
    }
  }
</style>
