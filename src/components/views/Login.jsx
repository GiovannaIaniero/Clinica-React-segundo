import { Card, Button, Row, Col, Form } from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { login } from "../../helpers/login/apiLogin.js";

const { VITE_ADMIN_USER, VITE_ADMIN_PASS } = import.meta.env;

const Login = ({ onLogin }) => {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const rol = location.state?.tipoDeRegistro;

  const tipoDeRegistro = () => {
    if (rol === "Paciente") {
      return "/registrarPaciente";
    } else if (rol === "Medico") {
      return "/registroMedico";
    } else {
      return "/registrarPaciente"
    }
  }

  const onSubmit = async (data) => {
    try {
        const result = await login(data.email, data.contraseña);
        console.log(data.email);
        console.log(data.contraseña);
        
        if (result.error) {
          setLoginError(result.error);
          return;
        }

        // Guardar el token y el usuario en localStorage
        localStorage.setItem("token", result.token);

        onLogin?.(result.role === "admin");
        console.log(result.role);
        
        // Redirigir según rol
        if (result.role === "admin") {
          navigate("/turnos");
        } else {
          navigate("/");
        }

      } catch (error) {
        console.error(error);
        setLoginError("Error al iniciar sesión");
      }
  };

  return (
    <Card className="shadow p-3 mb-5 bg-body rounded card-login">
      <Row xs={1} md={2}>
        <Col>
          <Card.Body>
            {rol === "Paciente" && (
              <h1 className="text-center mb-4">Ingreso de paciente</h1>
            )}
            {rol === "Medico" &&(
              <h1 className="text-center mb-4">Ingreso de profesional</h1>
            )}
            {rol === undefined &&(
              <h1 className="text-center mb-4">Ingreso</h1>
            )}
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email:</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Ej: juanperez@mail.com"
                  {...register("email", {
                    required: "El email es obligatorio",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Formato de email inválido"
                    }
                  })}
                />
                <Form.Text className="text-danger">{errors.email?.message}</Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Contraseña:</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Ingresa una contraseña"
                  {...register("contraseña", {
                    required: "La contraseña es obligatoria",
                    minLength: {
                      value: 6,
                      message: "Debe tener al menos 6 caracteres"
                    }
                  })}
                />
                <Form.Text className="text-danger">{errors.password?.message}</Form.Text>
                <Form.Text className="text-danger">{loginError}</Form.Text>
              </Form.Group>

              <Button
                variant="warning"
                type="submit">
                Iniciar sesión
              </Button>
              <Button
                variant="secondary"
                className="m-3"
                as={NavLink}
                to={tipoDeRegistro()}
              >
                Registrarse
              </Button>
            </Form>
          </Card.Body>
        </Col>
        <Col>
          <img
            src="/img/img-login.jpg"
            alt="Imagen clinica login"
            className="rounded-3 w-100 h-100"
          />
        </Col>
      </Row>
    </Card>
  )
}
export default Login;