import { useForm } from "react-hook-form";
import { Form, Button, Card, Container, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function RecuperarPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [mensaje, setMensaje] = useState("");
  const [errorServidor, setErrorServidor] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setMensaje("");
      setErrorServidor("");

      // Aquí después va tu fetch/axios real

      setMensaje(
        "Si el email existe, se envió un enlace para recuperar la contraseña."
      );
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
          <h2 className="text-center mb-4">Recuperar contraseña</h2>

          <Form onSubmit={handleSubmit(onSubmit)}>
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

            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={loading}
            >
              {loading ? "Enviando..." : "Enviar enlace"}
            </Button>
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