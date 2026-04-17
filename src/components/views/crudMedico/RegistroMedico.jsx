import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListadoMedico from './ListadoMedico';
import { useForm } from 'react-hook-form';
import { useEffect, useState, useRef } from 'react';
import Swal from "sweetalert2";
import { FaUserMd } from 'react-icons/fa';
import ModalDetalleMedico from './ModalDetalleMedico';
import { crearDoctor, listarDoctores, editarDoctor, borrarDoctor } from "../../../helpers/registroDoctores/apiDoctores";

const RegistroMedico = () => {

  const [estoyEditando, setEstoyEditando] = useState(false);
  const [medicoEditar, setMedicoEditar] = useState(null);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [medicoSeleccionado, setMedicoSeleccionado] = useState(null);
  const [medicos, setMedicos] = useState([]);


  const formRef = useRef(null);

  const verDetalleMedico = (medico) => {
    setMedicoSeleccionado(medico);
    setMostrarModal(true);
  };

  const handleCloseModal = () => {
    setMostrarModal(false);
    setMedicoSeleccionado(null);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    getValues,
    setValue
  } = useForm();

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

  const crearYEditar = async (data) => {
    try {

      const { contrasena_confirmar, ...datosLimpios } = data;


      if (estoyEditando && (!datosLimpios.contrasena || datosLimpios.contrasena.trim() === "")) {
        delete datosLimpios.contrasena;
      }

      if (estoyEditando) {
        const doctorActualizado = {
          ...datosLimpios,
          _id: medicoEditar,
        };

        await editarDoctor(doctorActualizado);

        Swal.fire({
          title: "Medico Actualizado!",
          text: `${data.nombre_medico} ${data.apellido_medico} ha sido modificado.`,
          icon: "success",
        });

      } else {
        const nuevoMedico = {
          ...datosLimpios,
          role: "medico"
        };

        await crearDoctor(nuevoMedico);

        Swal.fire({
          title: "Medico registrado!",
          text: `${data.nombre_medico} ${data.apellido_medico} esta habilitado.`,
          icon: "success",
        });
      }

      const listaActualizada = await listarDoctores();
      setMedicos(listaActualizada);

      setEstoyEditando(false);
      setMedicoEditar(null);
      reset();

    } catch (error) {
      console.error(error);
      // CORRECCIÓN: Feedback descriptivo capturando el mensaje del backend
      const mensajeError = error.response?.data?.mensaje || "Ocurrio un problema. Intenta de nuevo.";

      Swal.fire({
        title: "Error",
        text: mensajeError,
        icon: "error",
      });
    }
  };

  const modificarMedico = (id) => {
    const medico = medicos.find((m) => m._id === id);

    if (medico) {
      setEstoyEditando(true);
      setMedicoEditar(id);

      setValue('nombre_medico', medico.nombre_medico);
      setValue('apellido_medico', medico.apellido_medico);
      setValue('especialidad', medico.especialidad);
      setValue('email_medico', medico.email_medico);
      setValue('contrasena', '');
      setValue('contrasena_confirmar', '');

      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const borrarMedicoHandler = (medico) => {
    Swal.fire({
      title: "Estas seguro?",
      text: "Los datos no se podran recuperar!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, continuar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await borrarDoctor(medico);
          const listaActualizada = await listarDoctores();
          setMedicos(listaActualizada);

          Swal.fire({
            title: "Medico Eliminado",
            text: "El medico ha sido removido de la cartilla.",
            icon: "success",
          });
        } catch (error) {
          console.error(error);
        }
      }
    });
  };

  return (
    <>
      <div className="container col-12 col-md-8 col-lg-6" id="registroMedico" ref={formRef}>
        <div>
          <h1>
            <FaUserMd /> {estoyEditando ? "Editar Medico" : "Registro Medico"}
          </h1>
        </div>

        <Form className="mt-5" onSubmit={handleSubmit(crearYEditar)}>

          {/* NOMBRE */}
          <Form.Group className="mb-3">
            <div className="containerLabelControl">
              <Form.Label className="col-5 col-md-4">Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: Juan"
                maxLength={15}
                {...register("nombre_medico", {
                  required: "Este campo es obligatorio",
                  minLength: { value: 3, message: "Minimo tres caracteres" },
                  maxLength: { value: 15, message: "No debes superar los 15 caracteres" },
                })}
              />
            </div>
            <Form.Text className="text-danger">
              {errors.nombre_medico?.message}
            </Form.Text>
          </Form.Group>

          {/* APELLIDO */}
          <Form.Group className="mb-3">
            <div className="containerLabelControl">
              <Form.Label className="col-5 col-md-4">Apellido</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: Perez"
                maxLength={15}
                {...register("apellido_medico", {
                  required: "Este campo es obligatorio",
                  minLength: { value: 3, message: "Minimo tres caracteres" },
                  maxLength: { value: 15, message: "No debes superar los 15 caracteres" },
                })}
              />
            </div>
            <Form.Text className="text-danger">
              {errors.apellido_medico?.message}
            </Form.Text>
          </Form.Group>

          {/* ESPECIALIDAD */}
          <Form.Group className="mb-3">
            <div className="containerLabelControl">
              <Form.Label className="col-5 col-md-4">Especialidad</Form.Label>
              <Form.Select {...register("especialidad", {
                required: "Tienes que seleccionar una opcion",
                validate: (value) => value !== "" || "Tienes que seleccionar una opcion"
              })}>
                <option value="">Seleccione una opcion</option>
                <option value="Clinica Gral">Clinica Gral</option>
                <option value="Cirugia">Cirugia</option>
                <option value="Gastroenterologia">Gastroenterologia</option>
                <option value="Ginecologia">Ginecologia</option>
                <option value="Oftalmologia">Oftalmologia</option>
              </Form.Select>
            </div>
            <Form.Text className="text-danger">
              {errors.especialidad?.message}
            </Form.Text>
          </Form.Group>

          {/* EMAIL */}
          <Form.Group className="mb-3">
            <div className="containerLabelControl">
              <Form.Label className="col-5 col-md-4">E-mail</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ej: juanperez@gmail.com"
                disabled={estoyEditando}
                maxLength={40}
                {...register("email_medico", {
                  required: "Este campo es obligatorio",
                  maxLength: { value: 40, message: "Maximo 40 caracteres" },
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "El email no es valido"
                  }
                })}
              />
            </div>
            <Form.Text className="text-danger">
              {errors.email_medico?.message}
            </Form.Text>
          </Form.Group>

          {/* CONTRASENA */}
          {/* CONTRASENA */}
          <Form.Group className="mb-3">
            <div className="containerLabelControl">
              <Form.Label className="col-5 col-md-4">Contrasena</Form.Label>
              <Form.Control
                type="password"
                placeholder={estoyEditando ? "Dejar vacio para no cambiar" : "Ingresa la contrasena"}
                // Bloqueo físico: no permite escribir más de 10 caracteres
                maxLength={10}
                {...register("contrasena", {
                  required: estoyEditando ? false : "Tienes que ingresar una contrasena",
                  minLength: {
                    value: 8,
                    message: "La contrasena debe tener al menos 8 caracteres"
                  },
                  maxLength: {
                    value: 10,
                    message: "La contrasena no puede superar los 10 caracteres"
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                    message: "Debe incluir una mayúscula, una minúscula y un número"
                  }
                })}
              />
            </div>
            <Form.Text className="text-danger">
              {errors.contrasena?.message}
            </Form.Text>
          </Form.Group>

          {/* CONFIRMAR CONTRASENA */}
          {/* CONFIRMAR CONTRASENA */}
          <Form.Group className="mb-3">
            <div className="containerLabelControl">
              <Form.Label className="col-5 col-md-4">Confirmar Contrasena</Form.Label>
              <Form.Control
                type="password"
                // Bloqueo físico: igual que el campo anterior
                maxLength={10}
                placeholder="Repetir contrasena"
                {...register("contrasena_confirmar", {
                  required: estoyEditando ? false : "Debes confirmar la contraseña",
                  validate: (value) => {
                    const contrasena = getValues('contrasena');
                    // Si estamos editando y ambos están vacíos, es válido
                    if (estoyEditando && !contrasena && !value) return true;
                    // Si no, deben ser idénticos
                    return value === contrasena || "Las contrasenas no coinciden";
                  }
                })}
              />
            </div>
            <Form.Text className="text-danger">
              {errors.contrasena_confirmar?.message}
            </Form.Text>
          </Form.Group>

          <Button variant={estoyEditando ? "warning" : "success"} type="submit">
            {estoyEditando ? "Guardar Cambios" : "Registrar"}
          </Button>

          {estoyEditando && (
            <Button
              variant="secondary"
              className="ms-2"
              onClick={() => {
                setEstoyEditando(false);
                setMedicoEditar(null);
                reset();
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
  );
};

export default RegistroMedico;