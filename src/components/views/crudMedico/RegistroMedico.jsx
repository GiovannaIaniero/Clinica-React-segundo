import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListadoMedico from './ListadoMedico'
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import Swal from "sweetalert2";
import { FaUserMd } from 'react-icons/fa';
import ModalDetalleMedico from './ModalDetalleMedico';





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
  
  
  const agendaMedicoLocalStorage = JSON.parse(localStorage.getItem("agendaMedicoKey")) || [];

  const [medicos, setMedicos] = useState(agendaMedicoLocalStorage);

  // Función principal que ahora maneja CREAR y EDITAR
  const crearYEditar = (data) => {

    if(estoyEditando) {
      // Lógica de EDICIÓN
      const listadoActualizado = medicos.map(medico => medico.email_medico === medicoEditar ?  // Usamos el email como ID
        {...data, role: "medico"} // Actualiza los datos, manteniendo el role
        : medico
      );

      setMedicos(listadoActualizado)
      
      setEstoyEditando(false) // Sale del modo edición
      
      setMedicoEditar(null) // Limpia el médico a editar

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

    setMedicos([...medicos, nuevoMedico])

    

    Swal.fire({
          title: "Creaste un usuario!",
          text: `${data.nombre_y_apellido_medico} esta habilitado.`,
          icon: "success",
        });

    }

    reset();   // Limpia el formulario después de cualquier operación

  }



  const modificarMedico = (email) => {
    const medicoSeleccionado = medicos.find((medico) => medico.email_medico === email);

    if(medicoSeleccionado){

      // 1. Establecer el modo edición y el médico a editar

      setEstoyEditando(true);
      setMedicoEditar(email)

      // 2. Precargar los campos del formulario usando setValue
            // Nota: El email y la contraseña se precargan solo para referencia,
            // pero el email NO debería ser editable si es la clave primaria.
            // Para simplificar, precargamos todos.

      setValue('nombre_y_apellido_medico', medicoSeleccionado.nombre_y_apellido_medico)
      setValue('especialidad', medicoSeleccionado.especialidad)
      setValue('email_medico', medicoSeleccionado.email_medico)
      setValue('contraseña', medicoSeleccionado.contraseña)
      setValue('contraseña_confirmar', medicoSeleccionado.contraseña)

    }

  }



  useEffect(() => {
    localStorage.setItem("agendaMedicoKey", JSON.stringify(medicos))

  }, [medicos])

  const borrarMedico = (emailMedico) => {
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


    const listadoMedicoActual = medicos.filter((itemMedico) => itemMedico.email_medico !== emailMedico)
    
    setMedicos(listadoMedicoActual)

    Swal.fire({
            title: "Médico Eliminado",
            text: "El médico ha sido removido de la cartilla.",
            icon: "success",
        });
    
  }
});


    
  }

  return (
    <>
      <div className="container col-12 col-md-8 col-lg-6 " id="registroMedico" >
        <div>
        <h1> <FaUserMd /> {estoyEditando ? "Editar Médico" : "Registro Médico"} </h1>
        </div> 
      <Form   className="mt-5" onSubmit={handleSubmit(crearYEditar)}  >
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
              // Deshabilito el campo de email si el usuario esta editando (para no cambiar la clave primaria)
              disabled={estoyEditando}
              {...register("email_medico", {
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


          <Button variant={estoyEditando? "warning" : "success"}  type="submit" >
            {estoyEditando ? "Guardar Cambios" : "Registrar"}
          </Button>
          {estoyEditando && (
            <Button variant="secondary" className="ms-2" onClick={() => {
              setEstoyEditando(false)
              setMedicoEditar(null)
              reset()
              }} >
                Cancelar
            </Button>
          )}
      </Form>
       </div>
       <ListadoMedico medicos={medicos} borrarMedico={borrarMedico} modificarMedico={modificarMedico} verDetalleMedico={verDetalleMedico} ></ListadoMedico>
       <ModalDetalleMedico show={mostrarModal} handleClose={handleCloseModal} medico={medicoSeleccionado} />
   </>
  )
}

export default RegistroMedico
