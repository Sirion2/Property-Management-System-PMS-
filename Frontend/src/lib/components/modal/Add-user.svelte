<script lang="ts">
  import "$lib/index.ts"; // Importa los estilos desde el alias $lib
  import { onMount } from "svelte";
  import {
    Button,
    Modal,
    Form,
    TextInput,
    NumberInput,
    Select,
    SelectItem,
    PasswordInput,
  } from "carbon-components-svelte";
  import { Password } from "carbon-icons-svelte";

  export let open: boolean = false;
</script>

<Modal
  bind:open
  modalHeading="Crear Usuario."
  primaryButtonText="Crear usuario"
  secondaryButtonText="Cancelar"
  on:click:button--secondary={() => (open = false)}
  on:open
  on:close
  on:submit
>
  <div class="form-container">
    <Form
      on:submit={(e) => {
        e.preventDefault();
        console.log("submit", e);
      }}
    >
      <TextInput labelText="Nombre" placeholder="Introduzca el nombre..." />
      <TextInput labelText="Apellido" placeholder="Introduzca el apellido..." />
      <TextInput
        type="email"
        labelText="Email"
        placeholder="Introduzca el email..."
      />
      <NumberInput
      warn
        label="Número de teléfono"
        value={0}
        placeholder="Introduzca el número de teléfono..."
        warnText="El código 507 añadido de manera automática"
      />
      <Select
        labelText="Rol"
        selected="0x1bc"
        on:change={(e) => console.log("value", e.target.value)}
      >
        <SelectItem value="0x1bc" text="r--" />
        <SelectItem value="0x284" text="rw-" />
        <SelectItem value="0x308" text="rwx" />
      </Select>
      <Select
        labelText="Estatus"
        selected="0x01"
        on:change={(e) => console.log("value", e.target.value)}
      >
        <SelectItem value="0x01" text="activo" />
        <SelectItem value="0x02" text="inactivo" />
      </Select>
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
    </Form>
  </div>
</Modal>

<style>
  .form-container {
    margin-left: 40px;
    margin-right: 40px;
  }

  .password-container {
    display: flex;
    height: 5px;
  }
</style>
