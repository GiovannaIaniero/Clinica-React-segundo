import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListadoMedico from './ListadoMedico'
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import Swal from "sweetalert2";
import { FaUserMd } from 'react-icons/fa';
import ModalDetalleMedico from './ModalDetalleMedico';
import { crearDoctor, listarDoctores, editarDoctor, borrarDoctor } from "../../../helpers/registroDoctores/apiDoctores";

const RegistroMedico = () => {

  /* EDITAR */
  const [estoyEditando, setEstoyEditando] = useState(false)
  const [medicoEditar, setMedicoEditar] = useState(null)  

  /* VER */
  const [mostrarModal, setMostrarModal] = useState(false);
  const [medicoSeleccionado, setMedicoSeleccionado] = useState(null);

  const verDetalleMedico = (medico) =>{
    setMedicoSeleccionado(medico);
    setMostrarModal(true)
  };

  const handleCloseModal = () =>{
    setMostrarModal(false)
    setMedicoSeleccionado(null)
  }

  const {
    register,
    handleSubmit,
    reset,
    formState:{errors},
    getValues,
    setValue
  } = useForm()

  // 🔥 Ahora viene del backend
  const [medicos, setMedicos] = useState([]);

  // 🔥 Cargar doctores al iniciar
  useEffect(() => {
    const cargarDoctores = async () => {
      try {
        const respuesta = await listarDoctores();
        setMedicos(respuesta);
      } catch (error) {
        console.error(error);
      }
    };
    cargarDoctores();
  }, []);

  // Función principal que maneja CREAR y EDITAR
  const crearYEditar = async (data) => {

    try {

      if(estoyEditando) {

        const doctorActualizado = {
          ...data,
          _id: medicoEditar,
        };

        await editarDoctor(doctorActualizado);

        Swal.fire({
          title: "Médico Actualizado!",
          text: `${data.nombre_y_apellido_medico} ha sido modificado.`,
          icon: "success",
        });

      } else {

        const nuevoMedico = {
          ...data,
          role: "medico"
        };  

        await crearDoctor(nuevoMedico);

        Swal.fire({
          title: "Creaste un usuario!",
          text: `${data.nombre_y_apellido_medico} esta habilitado.`,
          icon: "success",
        });
      }

      // 🔥 Refrescar lista desde backend
      const listaActualizada = await listarDoctores();
      setMedicos(listaActualizada);

      setEstoyEditando(false);
      setMedicoEditar(null);
      reset();

    } catch (error) {
      console.error(error);
    }
  }

  const modificarMedico = (id) => {

    const medicoSeleccionado = medicos.find(
      (medico) => medico._id === id
    );

    if(medicoSeleccionado){

      setEstoyEditando(true);
      setMedicoEditar(id);

      setValue('nombre_y_apellido_medico', medicoSeleccionado.nombre_y_apellido_medico)
      setValue('especialidad', medicoSeleccionado.especialidad)
      setValue('email_medico', medicoSeleccionado.email_medico)
      setValue('contraseña', medicoSeleccionado.contraseña)
      setValue('contraseña_confirmar', medicoSeleccionado.contraseña)
    }
  }

  const borrarMedicoHandler = (medico) => {

    Swal.fire({
      title: "Estas seguro?",
      text: "Los datos no se podrán recuperar!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, continuar"

    }).then(async (result) => {

      if (result.isConfirmed) {

        try {

          await borrarDoctor(medico);

          const listaActualizada = await listarDoctores();
          setMedicos(listaActualizada);

          Swal.fire({
            title: "Médico Eliminado",
            text: "El médico ha sido removido de la cartilla.",
            icon: "success",
          });

        } catch (error) {
          console.error(error);
        }
      }
    });
  }

  return (
    <>
      <div className="container col-12 col-md-8 col-lg-6" id="registroMedico">
        <div>
          <h1>
            <FaUserMd /> {estoyEditando ? "Editar Médico" : "Registro Médico"}
          </h1>
        </div>

        <Form className="mt-5" onSubmit={handleSubmit(crearYEditar)}>

          <Form.Group className="mb-3">
            <div className="containerLabelControl">
              <Form.Label className="col-5 col-md-4">Nombre y Apellido</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: Juan Perez"
                {...register("nombre_y_apellido_medico", {
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
              {errors.nombre_y_apellido_medico?.message}
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <div className="containerLabelControl">
              <Form.Label className="col-5 col-md-4">Especialidad</Form.Label>
              <Form.Select {...register("especialidad", {
                required:"Tienes que ingresar una opción"
              })}>
                <option value="">Seleccione una opción</option>
                <option value="Clinica Gral">Clinica Gral</option>
                <option value="Cirugía">Cirugia</option>
                <option value="Gastroenterologia">Gastroenterologia</option>
                <option value="Ginecologia">Ginecologia</option>
                <option value="Oftalmologia">Oftalmologia</option>
              </Form.Select>
            </div>
            <Form.Text className="text-danger">
              {errors.especialidad?.message}
            </Form.Text>
          </Form.Group>    

          <Form.Group className="mb-3">
            <div className="containerLabelControl">
              <Form.Label className="col-5 col-md-4">E-mail</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ej: juanperez@gmail.com"
                disabled={estoyEditando}
                {...register("email_medico", {
                  required: "Este campo es obligatorio"
                })}
              />
            </div>
            <Form.Text className="text-danger">
              {errors.email_medico?.message}
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <div className="containerLabelControl">
              <Form.Label className="col-5 col-md-4">Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Ingresa la contraseña"
                {...register("contraseña", {
                  required: "Tienes que ingresar una contraseña"
                })}
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <div className="containerLabelControl">
              <Form.Label className="col-5 col-md-4">Confirmar Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Repetir contraseña"
                {...register("contraseña_confirmar", {
                  required: "Tienes que repetir la contraseña",
                  validate: (value) =>
                    value === getValues('contraseña') || "Las contraseñas no coinciden"
                })}
              />
            </div>
          </Form.Group>

          <Button variant={estoyEditando? "warning" : "success"} type="submit">
            {estoyEditando ? "Guardar Cambios" : "Registrar"}
          </Button>

          {estoyEditando && (
            <Button
              variant="secondary"
              className="ms-2"
              onClick={() => {
                setEstoyEditando(false)
                setMedicoEditar(null)
                reset()
              }}
            >
              Cancelar
            </Button>
          )}
        </Form>
      </div>

      <ListadoMedico
        medicos={medicos}
        borrarMedico={borrarMedicoHandler}
        modificarMedico={modificarMedico}
        verDetalleMedico={verDetalleMedico}
      />

      <ModalDetalleMedico
        show={mostrarModal}
        handleClose={handleCloseModal}
        medico={medicoSeleccionado}
      />
    </>
  )
}

export default RegistroMedico