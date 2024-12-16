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
    Modal,
  } from "carbon-components-svelte";
  import { TrashCan, Save } from "carbon-icons-svelte";
  import "$lib/index.ts"; // Importa los estilos desde el alias $lib
  import { onDestroy, onMount } from "svelte";
  import { userStore } from "$lib/stores/userStore";
  import { verifySignIn } from "$lib/auth/authHelper";
  import CustomToastNotification from "$lib/components/toast/CustomToastNotification.svelte";
  import { goto } from "$app/navigation";

  let userData: any;
  let images: File[] = [];
  let isUploadFileDisabled: boolean = false;
  export let open: boolean = false;
  export let property_id: number = 0;
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
  let soldChecked: boolean = false;
  let propertyLatestEditor: string;
  let propertyEditionDate: string;
  let errorMessage: string;
  let disableSubmitButton: boolean = false;
  let openDelete = false;

  $: publishChecked = soldChecked ? false : publishChecked;

  $: ({ userEmail, userphoneNumber, userId } =
    handleComboBoxChange(comboBoxSelectedId));

  $: if (property_id != 0 && open === true) {
    fetchProperty();
  }

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

  const unsubscribe = userStore.subscribe((value) => {
    userData = value;
  });

  

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

  function bufferToFile(
    bufferData: number[],
    fileName: string,
    mimeType: string
  ): File {
    const uint8Array = new Uint8Array(bufferData);

    const blob = new Blob([uint8Array], { type: mimeType });

    return new File([blob], fileName, { type: mimeType });
  }

  function fetchAgentsList() {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const apiUrl = `${apiBaseUrl}agent/Management/listAgentsWithID`;
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

  function updateProperty() {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const apiUrl: string = `${apiBaseUrl}property/management/update`;

    const formData = new FormData();
    formData.append("id", property_id.toLocaleString().trim());
    formData.append("property", propertyName.trim());
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
    formData.append("updatedBy", userData.id.toString().trim());
    formData.append("sold", soldChecked.toString());

    images.forEach((image, index) => {
      formData.append(`image_${index + 1}`, image);
    });

    fetch(apiUrl, {
      method: "PATCH",
      headers: { "x-access-token": userData.accessToken },
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          open = false;
          openToastNotification = true;
          errorMessage = "Propiedad actualizada de manera exitosa.";
          toastAttributes = {
            ...toastAttributes,
            kind: "success",
            subtitle: errorMessage,
          };
        } else {
          open = false;
          openToastNotification = true;
          const errorMessage = "Error al actualizar la propiedad";
          toastAttributes = {
            ...toastAttributes,
            kind: "error",
            subtitle: errorMessage,
          };
          throw new Error("Error al actualizar la propiedad");
        }
      })
      .then((data) => {
        propertyName = "";
        propertyDescription = "";
        propertyLocation = "";
        propertyPrice = "";
      })
      .catch((error) => {
        console.log(error);
        errorMessage =
          error.message || "Ha ocurrido un error, intente mas tarde.";
        openToastNotification = true;
        toastAttributes = {
          ...toastAttributes,
          kind: "error",
          subtitle: errorMessage,
        };
      });
    openToastNotification = false;
    disableSubmitButton = false;
  }

  function fetchProperty() {
    fetchAgentsList();
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const apiUrl = `${apiBaseUrl}property/management/edit-all`;

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": userData.accessToken,
      },
      body: JSON.stringify({ id: property_id }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error fetching property");
        }
        return response.json();
      })
      .then((data) => {
        images = [];
        propertyName = data.property.name;
        propertyDescription = data.property.description;
        propertyLocation = data.property.location;
        propertyPrice = data.property.price;
        comboBoxSelectedId = data.property.assignedTo?.toString() || "";
        propertyLatestEditor =
          data.property.latestEditor !== null
            ? `${data.property.latestEditor.firstName} ${data.property.latestEditor.lastName}`
            : "";
        publishChecked = data.property.publish;
        soldChecked = data.property.sold;
        propertyEditionDate = new Date(
          data.property.updatedAt
        ).toLocaleString();
        // fetching images and converting from buffer to file type
        Object.keys(data.property)
          .filter((key) => key.startsWith("image_"))
          .forEach((key, index) => {
            const value = data.property[key];
            const fileName = `image_${index + 1}.webp`;
            const mimeType = "image/webp";
            if (value && value.type === "Buffer") {
              const fileImage = bufferToFile(value.data, fileName, mimeType);
              images = [...images, fileImage];
            }
          });
      })
      .catch((error) => {
        errorMessage =
          error.error || "Ha ocurrido un error, intente mas tarde.";
        openToastNotification = true;
        toastAttributes = {
          ...toastAttributes,
          kind: "error",
          subtitle: errorMessage,
        };
        openToastNotification = false;
      });
  }

  function deleteProperty() {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const apiUrl = `${apiBaseUrl}property/management/delete`;

    fetch(apiUrl, {
      method: "PATCH", 
      headers:{
        "Content-Type": "application/json",
        "x-access-token": userData.accessToken,
      },
      body: JSON.stringify({id: property_id, updatedBy: userData.id}),
    })
    .then((response) => {
      if (response.ok) {
        open = false;
        openDelete = false;
        openToastNotification = true;
        errorMessage = "Propiedad eliminada de manera existosa.";
        toastAttributes = {
          ...toastAttributes,
          kind: "success",
          subtitle: errorMessage,
        };
      } else {
        open = false;
        openDelete = false;
        errorMessage = "Error al eliminar la propiedad.";
        toastAttributes = {
          ...toastAttributes,
          kind: "error",
          subtitle: errorMessage,
        };
        throw new Error("Error deleting property");
      }
    })
    .catch((error)=> {
      console.log(error);
      errorMessage = error.message || "Ha ocurrido un error, intente mas tarde."
      openToastNotification = true;
      toastAttributes = {
        ...toastAttributes,
        kind: "error",
        subtitle: errorMessage,
      };
    });
    openToastNotification = false;
  }

  onMount(() => {
    verifySignIn();
    if (!userData) {
      goto("/auth/v1.0");
    }
  });

  onDestroy(() => {
    unsubscribe();
  });
</script>

<Modal
  passiveModal
  bind:open
  modalHeading={"Editar Propiedad"}
  size="sm"
  on:close={() => {
    open = false;
  }}
>
  <Form
    on:submit={(e) => {
      e.preventDefault();
      updateProperty();
    }}
  >
    <TextInput
      bind:value={propertyName}
      type="text"
      labelText="Nombre:"
      placeholder="Ingrese el nombre de la propiedad..."
      maxlength={22}
      required
      disabled={soldChecked}
    />
    <TextArea
      bind:value={propertyDescription}
      labelText="Descripción:"
      placeholder="Ingrese la descripción de la propiedad..."
      maxlength={216}
      required
      disabled={soldChecked}
    />
    <TextInput
      bind:value={propertyLocation}
      type="text"
      labelText="Ubicación:"
      placeholder="Ingrese la ubicación de la propiedad..."
      maxlength={216}
      required
      disabled={soldChecked}
    />
    <TextInput
      bind:value={propertyPrice}
      type="number"
      labelText="Precio:"
      placeholder="Ingrese el precio de la propiedad..."
      maxlength={254}
      required
      disabled={soldChecked}
    />
    <br />
    <p>Añadir Imágenes:</p>

    <FileUploaderDropContainer
      multiple
      disabled={isUploadFileDisabled || soldChecked}
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
          status={soldChecked ? "complete" : "edit"}
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
        disabled={soldChecked}
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
        disabled={soldChecked}
      />
      <TextInput
        readonly
        labelText="Email"
        value={userEmail}
        placeholder="-"
        disabled={soldChecked}
      />
      <br />
    </Tile>
    <p>
      Último Editor: {propertyLatestEditor === ""
        ? "Ninguno"
        : propertyLatestEditor}
    </p>
    <p>
      Fecha de Edición: {propertyEditionDate === null
        ? "Nunca"
        : propertyEditionDate}
    </p>
    <br />
    <Checkbox
      labelText="Publicar"
      bind:checked={publishChecked}
      disabled={soldChecked}
    />
    <Checkbox labelText="Vendido" bind:checked={soldChecked} />
    <Button disabled={disableSubmitButton} type="Submit" icon={Save}
      >Guardar</Button
    >
    <Button
      disabled={disableSubmitButton || soldChecked}
      kind="danger"
      icon={TrashCan}
      on:click={() => (openDelete = true)}>Eliminar</Button
    >
  </Form>
</Modal>

<Modal
  danger
  size="xs"
  bind:open={openDelete}
  modalHeading="Eliminar Propiedad"
  primaryButtonText="Delete"
  secondaryButtonText="Cancel"
  on:click:button--secondary={() => (openDelete = false)}
  on:click:button--primary={() => {deleteProperty()}}
  on:open
  on:close
  on:submit
>
  <p>Desea eliminar esta propiedad?</p>
  <p>esta acción es <strong>IRREVOCABLE</strong></p>
</Modal>

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
