import { useForm } from "react-hook-form";
import { Form, Button, Card, Container, Alert, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState } from "react";
import { recuperarPassword } from "../../helpers/login/apiRecuperarPassword";

export default function RecuperarPassword({ type }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [mensaje, setMensaje] = useState("");
  const [errorServidor, setErrorServidor] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);


  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setMensaje("");
      setErrorServidor("");
      if (type === "forgot") {

        const mandarEmailResponse = await recuperarPassword(data.email);

        if (mandarEmailResponse.error) {
          setErrorServidor(mandarEmailResponse.error);
        } else {
          setMensaje(
            "Si el email existe, se envió un enlace para recuperar la contraseña."
          );
        }

      } else if (type === "reset") {
        if (data.contraseña !== data.confirmarContraseña) {
          setErrorServidor("Las contraseñas no coinciden.");
          return;
        } else {
          // Aquí iría la lógica para enviar la nueva contraseña al backend, probablemente con un token de recuperación
          setMensaje("Contraseña reestablecida exitosamente.");
        }
      }

    } catch (error) {
      setErrorServidor("Ocurrió un error. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      fluid
      className="pt-5 pb-5 d-flex justify-content-center align-items-center bg-light"
    >
      <Card
        className="shadow p-4"
        style={{ width: "100%", maxWidth: "500px" }}
      >
        <Card.Body>

          {type === "forgot" ? (
            <h3 className="mb-4 text-center">Recuperar Contraseña</h3>
          ) : (
            <h3 className="mb-4 text-center">Resetear Contraseña</h3>
          )}

          <Form onSubmit={handleSubmit(onSubmit)}>
            {type === "forgot" ? (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Ingrese su email"
                    {...register("email", {
                      required: "El email es obligatorio",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Email inválido",
                      },
                    })}
                  />
                  {errors.email && (
                    <small className="text-danger">
                      {errors.email.message}
                    </small>
                  )}
                </Form.Group>
                <p className="text-center text-muted mb-4" style={{ fontSize: "0.9rem" }}>
                  Ingresa tu email para recibir un enlace de recuperación.
                </p>
                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mt-2"
                  disabled={loading}
                >
                  {loading ? "Enviando..." : "Enviar enlace"}
                </Button>
              </>
            ) : (
              <Form.Group className="mb-3">
                <Form.Label>Contraseña:</Form.Label>

                <InputGroup>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingresa una contraseña"
                    {...register("contraseña", {
                      required: "La contraseña es obligatoria",
                      minLength: {
                        value: 6,
                        message: "Debe tener al menos 6 caracteres"
                      }
                    })}
                  />
                  <Button
                    variant="secondary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <i className="bi bi-eye"></i> : <i className="bi bi-eye-slash"></i>}
                  </Button>
                </InputGroup>

                <Form.Label className="p-2">Confirmar Contraseña:</Form.Label>

                <InputGroup>
                  <Form.Control
                    type={showPasswordConfirm ? "text" : "password"}
                    placeholder="Confirma tu contraseña"
                    {...register("confirmarContraseña", {
                      required: "La contraseña es obligatoria",
                      minLength: {
                        value: 6,
                        message: "Debe tener al menos 6 caracteres"
                      }
                    })}
                  />
                  <Button
                    variant="secondary"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  >
                    {showPasswordConfirm ? <i className="bi bi-eye"></i> : <i className="bi bi-eye-slash"></i>}
                  </Button>
                </InputGroup>

                {errors.confirmarContraseña && (
                  <small className="text-danger">
                    {errors.confirmarContraseña.message}
                  </small>
                )}
                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mt-2"
                  disabled={loading}
                >
                  {loading ? "Reestableciendo contraseña..." : "Reestablecer contraseña"}
                </Button>
              </Form.Group>
            )}

          </Form>
          {mensaje && <Alert className="mt-3" variant="success">{mensaje}</Alert>}
          {errorServidor && <Alert variant="danger">{errorServidor}</Alert>}

          <div className="text-center mt-3">
            <Link to="/login">Volver al login</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}