<script lang="ts">
  import "$lib/index.ts"; // Importa los estilos desde el alias $lib
  import {
    TextInput,
    Tile,
    Form,
    PasswordInput,
    Button,
  } from "carbon-components-svelte";
  import ToastNotification from "$lib/components/toast/CustomToastNotification.svelte";
  import { goto } from "$app/navigation";
  import { userStore } from "$lib/stores/userStore";

  let email: string;
  let password: string;
  let errorMessage: string;
  let openToastNotification: boolean;

  let toastAttributes: {
    kind: any;
    subtitle: any;
  } = {
    kind: "info",
    subtitle: "submessage",
  };

  function sessionLogin() {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const apiUrl: string = `${apiBaseUrl}auth/signin`;
    fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        if (response.ok) {
          errorMessage = "Inicio de sesión exitoso";
          openToastNotification = true;
          toastAttributes = {
            ...toastAttributes,
            kind: "success",
            subtitle: errorMessage,
          };
          return response.json();
        } else {
          toastAttributes = {
            ...toastAttributes,
            kind: "error",
            subtitle: "email o contraseña incorrectos.",
          };
          throw new Error("email o contraseña incorrectos.");
        }
      })
      .then((data) => {
        userStore.set(data);
        email = "";
        password = "";
        goto("/main-property");

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
    openToastNotification = false;
  }
</script>

<div class="background">
  <div class="tile-container">
    <div class="title-container">
      <h1>PMS</h1>
      <p><i>Administre sus Propiedades.</i></p>
    </div>
    <Tile light>
      <h4>Iniciar sesión</h4>
      <Form
        on:submit={(e) => {
          e.preventDefault();
          sessionLogin();
        }}
      >
        <TextInput
          labelText="Email"
          helperText="Introduzca su email asociado con la cuenta"
          placeholder="Introduzca su email..."
          required
          bind:value={email}
        />
        <br />
        <PasswordInput
          labelText="Contraseña"
          placeholder="Introduzca su contraseña..."
          required
          bind:value={password}
        />
        <br />
        <div class="button-container">
          <Button type="submit" style="width: 100%;">Iniciar sesión</Button>
        </div>
      </Form>
    </Tile>
    <br />
  </div>
</div>
<ToastNotification {openToastNotification} {toastAttributes} />

<style>
  .background {
    margin-left: -40px;
    margin-right: -40px;
    margin-top: -50px;
    height: 100dvh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url("/images/background.webp");
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
  .title-container {
    color: white;
  }
</style>
