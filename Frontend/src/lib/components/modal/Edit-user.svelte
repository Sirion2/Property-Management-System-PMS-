<script lang="ts">
  import "$lib/index.ts"; // Importa los estilos desde el alias $lib
  import { onMount } from "svelte";
  import {
    Button,
    Modal,
    Form,
    TextInput,
    Select,
    SelectItem,
    PasswordInput,
    FileUploader,
  } from "carbon-components-svelte";
  import { Password } from "carbon-icons-svelte";
  import { userStore } from "$lib/stores/userStore";
  import { TrashCan, Save } from "carbon-icons-svelte";
  import CustomToastNotification from "../toast/CustomToastNotification.svelte";
  import { writable } from 'svelte/store';

  let userData: any;
  let firstName: string;
  let lastName: string;
  let email: string;
  let phoneNumber: string;
  let rol: string;
  let status: string;
  export let open: boolean = false;
  export let user_id: number = 0;
  let fileUploadError: string = "error";
  let toastAttributes: {
    kind: any;
    subtitle: any;
  } = {
    kind: "info",
    subtitle: "submessage",
  };
  let openToastNotification: boolean;
  let fileUploader: any;
  let files: File[];
  $: if (user_id != 0 && open === true) {
    fetchUser();
  }

  const unsubscribe = userStore.subscribe((value) => {
    userData = value;
  });

  function fetchUser() {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const apiUrl = `${apiBaseUrl}agent/Management/listAgentById`;
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": userData.accessToken,
      },
      body: JSON.stringify({ id: user_id }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error fetching user");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        firstName = data.agent.firstName;
        lastName = data.agent.lastName;
        email = data.agent.email;
        phoneNumber = data.agent.phoneNumber;
        rol = data.agent.rol;
        status = data.agent.status;
      });
  }

  function handleFileChange(event: CustomEvent) {
    const file = event.detail[0];
    console.log("asda", file)
    if (file) {
      //tamaño admitido 4mb (4MB = 4 * 1024 * 1024 bytes)
      if (file.size > 4 * 1024 * 1024) {
        fileUploadError = "Error el tamaño del arcivo debe ser menor a 4 Megabytes.";
        openToastNotification = true;
        toastAttributes = {
          ...toastAttributes,
          kind: "error",
          subtitle: fileUploadError,
        };
        files = []
      } else {
        fileUploadError = ''; 
        openToastNotification = false;
      }
    }
  }
</script>

<Modal
  passiveModal
  bind:open
  modalHeading="Editar Usuario."
>
  <div class="form-container">
    <Form
      on:submit={(e) => {
        e.preventDefault();
        console.log("submit", e);
      }}
    >
      <TextInput
        labelText="Nombre"
        bind:value={firstName}
        placeholder="Introduzca el nombre..."
      />
      <TextInput
        labelText="Apellido"
        bind:value={lastName}
        placeholder="Introduzca el apellido..."
      />
      <TextInput
        type="email"
        labelText="Email"
        bind:value={email}
        placeholder="Introduzca el email..."
      />
      <Select
        labelText="Rol"
        selected={rol}
        on:change={(e) => console.log("value", e.target.value)}
      >
        <SelectItem value="Usuario" text="Usuario" />
        <SelectItem value="Moderador" text="Moderador" />
        <SelectItem value="Administrador" text="Administrador" />
      </Select>
      <Select
        labelText="Estatus"
        selected={status}
        on:change={(e) => console.log("value", e.target.value)}
      >
        <SelectItem value="Activo" text="Activo" />
        <SelectItem value="Inactivo" text="Inactivo" />
      </Select>
      <div class="profileImage-container">
        <FileUploader
          bind:files
          labelTitle="Imagen de Perfil"
          buttonLabel="Agregar Archivo"
          labelDescription="formatos aceptados: .jpg, .jepg, .png, .webp"
          accept={[".jpg", ".jpeg", ".png", ".webp"]}
          status="complete"
          on:change={(event) => {
            handleFileChange(event)
          }}
        
        />
        <Button kind="tertiary" on:click={() => (files = [])}>
        Clear (two-way binding)
      </Button>
      </div>
      
      <div class="password-container">
        <PasswordInput
          labelText="Contraseña"
          placeholder="Introduzca la contraseña..."
        />
        <Button
          style="margin-top:24px"
          tooltipPosition="left"
          tooltipAlignment="end"
          iconDescription="Generar contraseña."
          icon={Password}
          size="field"
        />
      </div>
      <Button type="Submit" icon={Save}
      >Guardar</Button
    >
    <Button
      kind="danger"
      icon={TrashCan}
      on:click={() => (console.log("hola"))}>Desactivar</Button
    >
    </Form>
  </div>
</Modal>

<CustomToastNotification {openToastNotification} {toastAttributes} />
<style>
  .form-container {
    margin-left: 40px;
    margin-right: 40px;
  }

  .profileImage-container {
    margin-top: 10px;
  }

  .password-container {
    display: flex;
    margin-bottom: 10px;
  }
</style>
