<script lang="ts">
  import {
    FileUploaderDropContainer,
    Form,
    TextInput,
    TextArea,
    Checkbox,
    Button,
    FileUploaderItem,
    Tile,
    ComboBox,
  } from "carbon-components-svelte";
  import Save from "carbon-icons-svelte/lib/Save.svelte";
  import "$lib/index.ts"; // Importa los estilos desde el alias $lib
  import { onDestroy, onMount } from "svelte";
  import { userStore } from "$lib/stores/userStore";
  import { verifySignIn } from "$lib/auth/authHelper";
  import CustomToastNotification from "$lib/components/toast/CustomToastNotification.svelte";
  import { goto } from "$app/navigation";

  let images: File[] = [];
  let isUploadFileDisabled: boolean = false;
  let fileUploadError: string = "error";
  let userId: number;
  let userEmail: string;
  let userphoneNumber: string;
  let comboBoxSelectedId: string;
  let propertyName: string;
  let propertyDescription: string;
  let propertyLocation: string;
  let propertyPrice: string;
  let openToastNotification: boolean;
  let publishChecked: boolean = false;
  let errorMessage: string;
  let disableSubmitButton: boolean = false;

  let toastAttributes: {
    kind: any;
    subtitle: any;
  } = {
    kind: "info",
    subtitle: "submessage",
  };

  let agentsList: {
    agent_id: number;
    agent_firstName: string;
    agent_lastName: string;
    agent_status: string;
    agent_email: string;
    agent_phoneNumber: string;
  }[] = [];

  let userData: any = null;
  const unsubscribe = userStore.subscribe((value) => {
    userData = value;
  });

  function fetchAgentsList() {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const apiUrl = `${apiBaseUrl}agent/listAgentsWithID/`;
    fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": userData.accessToken,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          agentsList = data.map((item) => {
            return {
              agent_id: item.id,
              agent_firstName: item.firstName,
              agent_lastName: item.lastName,
              agent_status: item.status,
              agent_email: item.email,
              agent_phoneNumber: item.phoneNumber,
            };
          });
        }
      });
  }

  function handleAddImages(event: CustomEvent) {
    const files = event.detail;
    if (files && files.length > 0) {
      const newFiles = Array.from(files) as File[];
      const imageFiles = newFiles.filter((file) =>
        ["image/jpeg", "image/png", "image/webp"].includes(file.type)
      );
      if (imageFiles.length == 0) {
        fileUploadError = "Tipo de archivo no permitido.";
        openToastNotification = true;
        toastAttributes = {
          ...toastAttributes,
          kind: "error",
          subtitle: fileUploadError,
        };
      }

      if (images.length + imageFiles.length <= 4) {
        images = [...images, ...imageFiles];
        isUploadFileDisabled = images.length >= 5;
      } else {
        fileUploadError = "No se pueden añadir más de 4 imágenes.";
        openToastNotification = true;
        toastAttributes = {
          ...toastAttributes,
          kind: "error",
          subtitle: fileUploadError,
        };
      }
    }
  }

  function handleRemoveImages(event: Event, index: number) {
    images = images.filter((_, i) => i !== index);
    isUploadFileDisabled = false;
  }

  function shouldFilterItem(item: any, value: any) {
    if (!value) return true;
    return (
      item.text.toLowerCase().includes(value.toLowerCase()) ||
      item.id.toLowerCase().includes(value.toLowerCase())
    );
  }

  function handleComboBoxChange(id: string) {
    const selectedAgent = agentsList.find(
      (item) => item.agent_id.toString() === id
    );
    return {
      userId: selectedAgent?.agent_id ?? 0,
      userEmail: selectedAgent?.agent_email ?? "N/A",
      userphoneNumber: selectedAgent?.agent_phoneNumber ?? "N/A",
    };
  }

  $: ({ userEmail, userphoneNumber, userId } =
    handleComboBoxChange(comboBoxSelectedId));

  function addProperty() {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const apiUrl: string = `${apiBaseUrl}property/management/create`;

    const formData = new FormData();
    formData.append("name", propertyName.trim());
    formData.append(
      "description",
      propertyDescription.charAt(0).toUpperCase() +
        propertyDescription.slice(1).trim()
    );
    formData.append(
      "location",
      propertyLocation.charAt(0).toUpperCase() +
        propertyLocation.slice(1).trim()
    );
    formData.append("price", propertyPrice.toString().trim());
    formData.append("assignedAgentId", userId.toString().trim());
    formData.append("publish", publishChecked.toString());
    formData.append("createdBy", userData.id.toString().trim());

    images.forEach((image, index) => {
      formData.append(`image_${index + 1}`, image);
    });

    fetch(apiUrl, {
      method: "POST",
      headers: { "x-access-token": userData.accessToken },
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          openToastNotification = true;

          errorMessage = "Propiedad creada de manera exitosa.";
          toastAttributes = {
            ...toastAttributes,
            kind: "success",
            subtitle: errorMessage,
          };
        } else {
          openToastNotification = true;

          const errorMessage = "Error al crear propiedad";
          toastAttributes = {
            ...toastAttributes,
            kind: "error",
            subtitle: errorMessage,
          };
          throw new Error("Error al crear la propiedad");
        }
      })
      .then((data) => {
        propertyName = "";
        propertyDescription = "";
        propertyLocation = "";
        (propertyPrice = ""), (publishChecked = false);
        disableSubmitButton = true;
      })
      .catch((error) => {
        errorMessage =
        error.message || "Ha ocurrido un error, intente mas tarde.";
        openToastNotification = true;
        toastAttributes = {
          ...toastAttributes,
          kind: "error",
          subtitle: errorMessage,
        };
      });
      goto("/main-property");
      openToastNotification = false;
      disableSubmitButton = false;
  }

  let interval: number;
  onMount(() => {
    verifySignIn();
    fetchAgentsList();

    interval = setInterval(fetchAgentsList, import.meta.env.VITE_API_FETCH_RATE);
  });

  onDestroy(() => {
    clearInterval(interval);
    unsubscribe();
  });
</script>

<div>
  <h1>Agregar Propiedad</h1>
</div>
<div>
  <p>Ingrese los campos y añada una nueva propiedad.</p>
  <br />
  <Form
    on:submit={(e) => {
      e.preventDefault();
      addProperty();
    }}
  >
    <TextInput
      bind:value={propertyName}
      type="text"
      labelText="Nombre:"
      placeholder="Ingrese el nombre de la propiedad..."
      maxlength={32}
      required
    />
    <TextArea
      bind:value={propertyDescription}
      labelText="Descripción:"
      placeholder="Ingrese la descripción de la propiedad..."
      maxlength={216}
      required
    />
    <TextInput
      bind:value={propertyLocation}
      type="text"
      labelText="Ubicación:"
      placeholder="Ingrese la ubicación de la propiedad..."
      maxlength={216}
      required
    />
    <TextInput
      bind:value={propertyPrice}
      type="number"
      labelText="Precio:"
      placeholder="Ingrese el precio de la propiedad..."
      maxlength={254}
      required
    />
    <br />
    <p>Añadir Imágenes:</p>

    <FileUploaderDropContainer
      multiple
      disabled={isUploadFileDisabled}
      labelText="formatos aceptados: .jpg, .jepg, .png, .webp"
      accept={[".jpg", ".jpeg", ".png", ".webp"]}
      validateFiles={(files) => {
        return files.filter((file) => file.size < 4 * 1024 * 1024);
      }}
      on:change={(event) => {
        handleAddImages(event);
      }}
    />
    <div class="file_loader-container">
      {#each images as image, index}
        <FileUploaderItem
          id={index.toString()}
          name={image.name}
          status="edit"
          on:delete={(event) => {
            handleRemoveImages(event, index);
          }}
        />
      {/each}
    </div>
    <br />
    <Tile>
      <h5><strong>Agente asignado:</strong></h5>
      <hr />
      <br />
      <ComboBox
        light
        required
        titleText="Nombre"
        placeholder="Seleccione el agente a asignar..."
        items={agentsList.map((agent) => ({
          id: agent.agent_id.toString(),
          text: `${agent.agent_firstName} ${agent.agent_lastName}`,
          disabled: agent.agent_status === "activo" ? false : true,
        }))}
        {shouldFilterItem}
        bind:selectedId={comboBoxSelectedId}
        let:item
      >
        <div>
          ID: {item.id} - <strong>{item.text}</strong>
        </div>
      </ComboBox>
      <br />
      <TextInput
        readonly
        labelText="Teléfono"
        value={userphoneNumber}
        placeholder="-"
      />
      <TextInput readonly labelText="Email" value={userEmail} placeholder="-" />
      <br />
    </Tile>
    <br />
    <Checkbox labelText="Publicar" bind:checked={publishChecked} />
    <Button disabled={disableSubmitButton} type="Submit" icon={Save}>Guardar</Button>
  </Form>
  <br />
</div>
<CustomToastNotification {openToastNotification} {toastAttributes} />

<style>
  .file_loader-container {
    display: inline-flex;
    flex-wrap: wrap;
    width: 100%;
    gap: 4px;
    margin-bottom: 10px;
  }
</style>
