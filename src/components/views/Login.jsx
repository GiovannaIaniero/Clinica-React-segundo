import { Card, Button, Row, Col, Form, InputGroup } from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { login, getRoleFromToken } from "../../helpers/login/apiLogin.js";

const Login = ({ onLogin }) => {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const rol = location.state?.tipoDeRegistro;
  const [showPassword, setShowPassword] = useState(false);

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

      if (result.error) {
        setLoginError(result.error);
        return;
      }

      // Obtener rol desde el token
      const role = getRoleFromToken();

      localStorage.setItem("token", result.token);

      onLogin?.(role === "admin");

      // Redirigir según rol REAL del token
      if (role === "admin") {
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
        <Col className="mt-4">
          <Card.Body>
            {rol === "Paciente" && (
              <h1 className="text-center mb-4">Ingreso de paciente</h1>
            )}
            {rol === "Medico" && (
              <h1 className="text-center mb-4">Ingreso de profesional</h1>
            )}
            {rol === undefined && (
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

                <Form.Text className="text-danger">
                  {errors.contraseña?.message}
                </Form.Text>
                <Form.Text className="text-danger">
                  {loginError}
                </Form.Text>
              </Form.Group>
              <Button
                variant="primary"
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
            <div className="text-center mt-3">
              <Link
                to="/forgot-password"
                className="text-decoration-none"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
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
