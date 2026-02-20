import { useEffect } from "react";
import { FormText } from "react-bootstrap";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const FormGuardia = ({ agregarMedico, editarMedico, medicoEditando }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  useEffect(() => {
    if (medicoEditando !== null) {
      setValue("nombre", medicoEditando.nombre);
      setValue("entrada", medicoEditando.entrada);
      setValue("salida", medicoEditando.salida);
    } else {
      reset();
    }
  }, [medicoEditando, setValue, reset]);

  const onSubmit = (data) => {
    if (medicoEditando !== null) {
      editarMedico(data);

      Swal.fire({
        icon: "success",
        title: "Guardia editada",
        text: "Los datos fueron actualizados correctamente",
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      agregarMedico(data);

      Swal.fire({
        icon: "success",
        title: "Guardia agregada",
        text: "La guardia fue registrada correctamente",
        timer: 2000,
        showConfirmButton: false,
      });
    }

    reset();
  };

  return (
    <div className="lista-div container mt-4 pt-1">
      <h2 className="my-4">
        {medicoEditando ? "Editar Guardia" : "Agregar Guardia"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3 d-flex flex-column align-items-center ">
          <label className="form-label fs-4">Nombre del Médico</label>
          <input
            type="text"
            className={`form-control w-50 text-center ${
              medicoEditando ? "input-editando" : ""
            }`}
            placeholder="Ej: Dr Pablo"
            {...register("nombre", {
              required: "Este campo no puede quedar vacío.",
              pattern: {
                value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
                message: "Solo se permiten letras",
              },
              maxLength: {
                value: 30,
                message:
                  "El campo de nombre debe tener como maximo 30 caracteres.",
              },
            })}
          />
          <FormText className="text-danger w-50 d-flex  fs-6 ">
            <strong>{errors.nombre?.message}</strong>
          </FormText>
        </div>

        <div className="mb-4 d-flex flex-column align-items-center">
          <label className="form-label fs-4">Horario de Entrada</label>
          <input
            type="time"
            className={`form-control w-50 text-center ${
              medicoEditando ? "input-editando" : ""
            }`}
            placeholder="Ej: 08:00"
            {...register("entrada", {
              required: "Este campo no puede quedar vacío",
            })}
          />
          <FormText className="text-danger w-50 d-flex  fs-6 ">
            <strong>{errors.entrada?.message} </strong>
          </FormText>
        </div>

        <div className="mb-4 d-flex flex-column align-items-center">
          <label className="form-label fs-4">Horario de Salida</label>
          <input
            type="time"
            className={`form-control w-50 text-center ${
              medicoEditando ? "input-editando" : ""
            }`}
            {...register("salida", {
              required: "Este campo no puede quedar vacío",
            })}
          />
          <FormText className="text-danger w-50 d-flex  fs-6 ">
            <strong>{errors.salida?.message} </strong>
          </FormText>
        </div>

        <button className="btn btn-success my-3" type="submit">
          {medicoEditando ? "Guardar Cambios" : "Agregar"}
        </button>
      </form>
    </div>
  );
};

export default FormGuardia;
