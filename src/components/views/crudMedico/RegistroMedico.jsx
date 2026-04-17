import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListadoMedico from './ListadoMedico';
import { useForm } from 'react-hook-form';
import { useEffect, useState, useRef } from 'react';
import Swal from "sweetalert2";
import { FaUserMd, FaEye, FaEyeSlash } from 'react-icons/fa';
import ModalDetalleMedico from './ModalDetalleMedico';
import { crearDoctor, listarDoctores, editarDoctor, borrarDoctor } from "../../../helpers/registroDoctores/apiDoctores";

const RegistroMedico = () => {
  const [estoyEditando, setEstoyEditando] = useState(false);
  const [medicoEditar, setMedicoEditar] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [medicoSeleccionado, setMedicoSeleccionado] = useState(null);
  const [medicos, setMedicos] = useState([]);

  const [verPassword, setVerPassword] = useState(false);
  const [verConfirmarPassword, setVerConfirmarPassword] = useState(false);

  const formRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    getValues,
    setValue,
    setError
  } = useForm({ mode: "onChange" });

  useEffect(() => {
    cargarDoctores();
  }, []);

  const cargarDoctores = async () => {
    try {
      const respuesta = await listarDoctores();
      setMedicos(respuesta);
    } catch (error) {
      console.error(error);
    }
  };

  const verDetalleMedico = (medico) => {
    setMedicoSeleccionado(medico);
    setMostrarModal(true);
  };

  const handleCloseModal = () => {
    setMostrarModal(false);
    setMedicoSeleccionado(null);
  };

  const crearYEditar = async (data) => {
    try {
      const { contrasena_confirmar, ...datosLimpios } = data;

      if (estoyEditando && (!datosLimpios.contrasena || datosLimpios.contrasena.trim() === "")) {
        delete datosLimpios.contrasena;
      }

      if (estoyEditando) {
        const doctorActualizado = { ...datosLimpios, _id: medicoEditar };
        await editarDoctor(doctorActualizado);
        Swal.fire({ title: "Médico Actualizado!", text: `${data.nombre_medico} ha sido modificado.`, icon: "success" });
      } else {
        const nuevoMedico = { ...datosLimpios, role: "medico" };
        await crearDoctor(nuevoMedico);
        Swal.fire({ title: "Médico registrado!", text: `${data.nombre_medico} está habilitado.`, icon: "success" });
      }

      const listaActualizada = await listarDoctores();
      setMedicos(listaActualizada);
      setEstoyEditando(false);
      setMedicoEditar(null);
      reset();
    } catch (error) {
      console.error("Error capturado:", error);
      const mensajeServidor = error.response?.data?.mensaje || "";
      if (mensajeServidor.includes("email") || mensajeServidor.includes("registrado") || error.response?.status === 400) {
        setError("email_medico", {
          type: "manual",
          message: "El E-mail ya está registrado."
        });
      } else {
        Swal.fire({ title: "Error", text: "Revisa los datos ingresados.", icon: "error" });
      }
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
      title: "¿Estás seguro?",
      text: "¡Los datos no se podrán recuperar!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, continuar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await borrarDoctor(medico);
          cargarDoctores();
          Swal.fire({ title: "Médico Eliminado", icon: "success" });
        } catch (error) { console.error(error); }
      }
    });
  };

  return (
    <>
      <div className="container col-12 col-md-8 col-lg-6" id="registroMedico" ref={formRef}>
        <h1 className="text-center mt-4"><FaUserMd /> {estoyEditando ? "Editar Médico" : "Registro Médico"}</h1>

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
                  minLength: { value: 3, message: "Mínimo tres caracteres" },
                  maxLength: { value: 15, message: "Máximo 15 caracteres" },
                  pattern: {
                    value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
                    message: "El nombre solo puede contener letras"
                  }
                })}
              />
            </div>
            <Form.Text className="text-danger">{errors.nombre_medico?.message}</Form.Text>
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
                  minLength: { value: 3, message: "Mínimo tres caracteres" },
                  maxLength: { value: 15, message: "Máximo 15 caracteres" },
                  pattern: {
                    value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
                    message: "El apellido solo puede contener letras"
                  }
                })}
              />
            </div>
            <Form.Text className="text-danger">{errors.apellido_medico?.message}</Form.Text>
          </Form.Group>

        
          <Form.Group className="mb-3">
            <div className="containerLabelControl">
              <Form.Label className="col-5 col-md-4">Especialidad</Form.Label>
              <Form.Select {...register("especialidad", {
                required: "Tienes que seleccionar una opción"
              })}>
                <option value="">Seleccione una opción</option>
                <option value="Clinica Gral">Clínica Gral</option>
                <option value="Cirugia">Cirugía</option>
                <option value="Gastroenterologia">Gastroenterología</option>
                <option value="Ginecologia">Ginecología</option>
                <option value="Oftalmologia">Oftalmología</option>
              </Form.Select>
            </div>
            <Form.Text className="text-danger">{errors.especialidad?.message}</Form.Text>
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
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "El email no es válido"
                  }
                })}
              />
            </div>
            <Form.Text className="text-danger">{errors.email_medico?.message}</Form.Text>
          </Form.Group>

          {/* CONTRASEÑA */}
          <Form.Group className="mb-3">
            <div className="containerLabelControl">
              <Form.Label className="col-5 col-md-4">Contraseña</Form.Label>
              <div className="position-relative w-100">
                <Form.Control
                  type={verPassword ? "text" : "password"}
                  maxLength={10}

                  {...register("contrasena", {
                    required: estoyEditando ? false : "La contraseña es obligatoria",
                    minLength: { value: 4, message: "Mínimo 4 caracteres" },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                      message: "Falta Mayúscula, minúscula o número"
                    }
                  })}
                />
                <span
                  className="position-absolute end-0 top-50 translate-middle-y me-3"
                  onClick={() => setVerPassword(!verPassword)}
                  style={{ cursor: 'pointer', zIndex: 10 }}
                >
                  {verPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
            </div>
            <Form.Text className="text-danger">{errors.contrasena?.message}</Form.Text>
          </Form.Group>

          {/* CONFIRMAR CONTRASEÑA */}
          <Form.Group className="mb-3">
            <div className="containerLabelControl">
              <Form.Label className="col-5 col-md-4">Confirmar</Form.Label>
              <div className="position-relative w-100">
                <Form.Control
                  type={verConfirmarPassword ? "text" : "password"}
                  maxLength={10}

                  {...register("contrasena_confirmar", {
                    required: estoyEditando ? false : "Debes repetir la contraseña",
                    validate: (value) => value === getValues('contrasena') || "Las contraseñas no coinciden"
                  })}
                />
                <span
                  className="position-absolute end-0 top-50 translate-middle-y me-3"
                  onClick={() => setVerConfirmarPassword(!verConfirmarPassword)}
                  style={{ cursor: 'pointer', zIndex: 10 }}
                >
                  {verConfirmarPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
            </div>
            <Form.Text className="text-danger">{errors.contrasena_confirmar?.message}</Form.Text>
          </Form.Group>

          <div className="text-end">
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
          </div>
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