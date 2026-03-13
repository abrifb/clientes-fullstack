const API = "http://localhost:3000/clientes";

const tabla = document.getElementById("tablaClientes");
const form = document.getElementById("form");

const idInput = document.getElementById("id");
const nombreInput = document.getElementById("nombre");
const emailInput = document.getElementById("email");


// =============================
// LISTAR CLIENTES
// =============================

async function listarClientes() {

  const res = await fetch(API);
  const data = await res.json();

  tabla.innerHTML = "";

  data.forEach(cliente => {

    tabla.innerHTML += `
      <tr>
        <td>${cliente.id}</td>
        <td>${cliente.nombre}</td>
        <td>${cliente.email}</td>

        <td>
          <button onclick="editarCliente(${cliente.id}, '${cliente.nombre}', '${cliente.email}')">
          Editar
          </button>

          <button onclick="eliminarCliente(${cliente.id})">
          Eliminar
          </button>
        </td>

      </tr>
    `;

  });

}

document.getElementById("listar").onclick = listarClientes;


// =============================
// AGREGAR O EDITAR CLIENTE
// =============================

form.onsubmit = async (e) => {

  e.preventDefault();

  const id = idInput.value;

  const body = {
    nombre: nombreInput.value,
    email: emailInput.value
  };

  if (id === "") {

    // CREAR

    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    alert("Cliente agregado");

  } else {

    // ACTUALIZAR

    await fetch(API + "/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    alert("Cliente actualizado");

  }

  form.reset();
  idInput.value = "";

  listarClientes();

};


// =============================
// CARGAR CLIENTE PARA EDITAR
// =============================

function editarCliente(id, nombre, email) {

  idInput.value = id;
  nombreInput.value = nombre;
  emailInput.value = email;

}


// =============================
// ELIMINAR CLIENTE
// =============================

async function eliminarCliente(id) {

  const confirmar = confirm("¿Eliminar cliente?");

  if (!confirmar) return;

  await fetch(API + "/" + id, {
    method: "DELETE"
  });

  alert("Cliente eliminado");

  listarClientes();

}


// =============================
// CARGAR CLIENTES AL INICIAR
// =============================

listarClientes();