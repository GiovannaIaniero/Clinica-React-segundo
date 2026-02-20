import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { FaUserMd } from 'react-icons/fa';
import ListaPacientes from "./Pacientes/ListaPacientes";
import ModalDetallePaciente from "./Pacientes/ModalDetallePaciente";



const RegistrarPaciente = () => {

  /* EDITAR */

  const [estoyEditando, setEstoyEditando] = useState(false)
  const [pacienteEditar, setPacienteEditar] = useState(null)


  /* VER */

  const [mostrarModal, setMostrarModal] = useState(false);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);

  const verDetallePaciente = (paciente) => {
    setPacienteSeleccionado(paciente);
    setMostrarModal(true)
  };

  const handleCloseModal = () => {
    setMostrarModal(false)
    setPacienteSeleccionado(null)
  }


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    getValues,
    setValue
  } = useForm();



  const pacientesLocalStorage =
    JSON.parse(localStorage.getItem("pacientesKey")) || [];

  const [pacientes, setPacientes] = useState(pacientesLocalStorage);





  const crearYEditar = (data) => {

    if (estoyEditando) {
      // Lógica de EDICIÓN
      const listadoActualizado = pacientes.map(paciente => paciente.email === pacienteEditar ?  // Usamos el email como ID
        { ...data, role: "paciente" } // Actualiza los datos, manteniendo el role
        : paciente
      );

      setPacientes(listadoActualizado)

      setEstoyEditando(false) // Sale del modo edición

      setPacienteEditar(null) // Limpia el médico a editar

      Swal.fire({
        title: "Paciente Actualizado!",
        text: `${data.nombre_y_apellido} ha sido modificado.`,
        icon: "success",
      });
    } else {

      const nuevoPaciente = {
        ...data,
        role: "paciente"
      };

      setPacientes([...pacientes, nuevoPaciente])



      Swal.fire({
        title: "Creaste un usuario!",
        text: `${data.nombre_y_apellido} esta habilitado.`,
        icon: "success",
      });

    }

    reset();   // Limpia el formulario después de cualquier operación

  }

  const modificarPaciente = (email) => {
    const pacienteSeleccionado = pacientes.find((paciente) => paciente.email === email);

    if (pacienteSeleccionado) {

      // 1. Establecer el modo edición y el médico a editar

      setEstoyEditando(true);
      setPacienteEditar(email)

      // 2. Precargar los campos del formulario usando setValue
      // Nota: El email y la contraseña se precargan solo para referencia,
      // pero el email NO debería ser editable si es la clave primaria.
      // Para simplificar, precargamos todos.

      setValue('nombre_y_apellido', pacienteSeleccionado.nombre_y_apellido)
      setValue('celular', pacienteSeleccionado.celular)
      setValue('email', pacienteSeleccionado.email)
      setValue('obraSocial', pacienteSeleccionado.obraSocial)
      setValue('contraseña', pacienteSeleccionado.contraseña)
      setValue('contraseña_confirmar', pacienteSeleccionado.contraseña)

    }

  }







  useEffect(() => {
    localStorage.setItem("pacientesKey", JSON.stringify(pacientes));
  }, [pacientes]);




  const borrarPaciente = (emailPaciente) => {
    Swal.fire({
      title: "Estas seguro?",
      text: "Los datos no se podrán recuperar!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, continuar"
    }).then((result) => {
      if (result.isConfirmed) {

        const listadoPacienteActual = pacientes.filter(
          (itemPaciente) => itemPaciente.email !== emailPaciente
        );

        setPacientes(listadoPacienteActual);

        Swal.fire({
          title: "Paciente Eliminado",
          text: "El paciente ha sido removido de la cartilla.",
          icon: "success",
        });
      }
    });
  };

return (
  <>
    <div className="container col-12 col-md-8 col-lg-6" id="registroPacientes">
      <div>
        <h1> <FaUserMd /> {estoyEditando ? "Editar Paciente" : "Registro Paciente"}</h1>
      </div>
      <Form onSubmit={handleSubmit(crearYEditar)} className="mt-5">
        <Form.Group className="mb-3">
          <div className="containerLabelControl">
            <Form.Label className="col-5 col-md-4">Nombre y Apellido</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej: Juan Perez"
              {...register("nombre_y_apellido", {
                required: "Este campo es obligatorio",
                minLength: {
                  value: 5,
                  message: "Tienes que ingresar al menos cinco caracteres",
                },
                maxLength: {
                  value: 40,
                  message: "No debes superar los treinta caracteres",
                },
              })}
            />
          </div>
          <Form.Text className="text-danger">
            {errors.nombre_y_apellido?.message}
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3">
          <div className="containerLabelControl">
            <Form.Label className="col-5 col-md-4">Celular</Form.Label>
            <Form.Control
              type="tel"
              placeholder="Ej: 03816001122"
              {...register("celular", {
                required: "Este es un campo obligatorio",
                minLength: {
                  value: 9,
                  message: "Debes ingresar al menos nueve digitos",
                },
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Solo se permiten números",
                },
              })}
            />
          </div>
          <Form.Text className="text-danger">
            {errors.celular?.message}
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3">
          <div className="containerLabelControl">
            <Form.Label className="col-5 col-md-4">E-mail</Form.Label>
            <Form.Control
              type="email"
              placeholder="Ej: juanperez@gmail.com"
              {...register("email", {
                required: "Este campo es obligatorio",
                pattern: {
                  value:
                    /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
                  message:
                    "El email debe ser un correo valido por ej: juanperez@gmail.com",
                },
              })}
            />
          </div>
          <Form.Text className="text-danger">
            {errors.email?.message}
          </Form.Text>

        </Form.Group>

        <Form.Group className="mb-3">
          <div className="containerLabelControl">
            <Form.Label className="col-5 col-md-4">Obra Social</Form.Label>
            <Form.Select {...register("obraSocial", {
              required: "Tienes que ingresar una opción"
            })}>
              <option value="">Seleccione una opción</option>
              <option value="Prensa">Prensa</option>
              <option value="Red de Seguro Medico">Red de Seguro Medico</option>
              <option value="Pami">Pami</option>
              <option value="Prensa">Osecac</option>
              <option value="Prensa">Particular</option>
            </Form.Select>
          </div>
          <Form.Text className="text-danger">
            {errors.obraSocial?.message}
          </Form.Text>
        </Form.Group>


        <Form.Group className="mb-3">
          <div className="containerLabelControl">
            <Form.Label className="col-5 col-md-4">Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Ingresa la contraseña"
              {...register("contraseña", {
                required: "Tienes que ingresar una contraseña",
                pattern: {
                  value:
                    /^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{6,12}$/,
                  message:
                    "La contrasenia debe tener entre 6 y 16 caracteres, al menos un número, al menos una minuscula, al menos una mayuscula y al menos un caracter especial",
                },
              })}
            />
          </div>
          <Form.Text className="text-danger">
            {errors.contraseña?.message}
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3">
          <div className="containerLabelControl">
            <Form.Label className="col-5 col-md-4">Confirmar Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Repetir contraseña"
              {...register("contraseña_confirmar", {
                required: "Tienes que repetir la contraseña",
                validate: (value) => value === getValues('contraseña') || `❌ Las contraseñas no coinciden`

              })}
            />
          </div>
          <Form.Text className="text-danger">
            {errors.contraseña_confirmar?.message}
          </Form.Text>
        </Form.Group>

        <Button variant="success" type="submit" >
          {estoyEditando ? "Guardar Cambios" : "Registrar"}
        </Button>
        {estoyEditando && (
            <Button variant="secondary" className="ms-2" onClick={() => {
              setEstoyEditando(false)
              setPacienteEditar(null)
              reset()
              }} >
                Cancelar
            </Button>
          )}
      </Form>
      
    </div>
    <ListaPacientes pacientes={pacientes} borrarPaciente={borrarPaciente} modificarPaciente={modificarPaciente} verDetallePaciente={verDetallePaciente} />
    <ModalDetallePaciente show={mostrarModal} handleClose={handleCloseModal} paciente={pacienteSeleccionado} />      
  </>
);


};





export default RegistrarPaciente;


