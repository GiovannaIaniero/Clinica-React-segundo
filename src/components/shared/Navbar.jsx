import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getRoleFromToken } from '../../helpers/login/apiLogin.js';
import { useNavigate } from "react-router";


export default function NavbarClinica() {
  const navigate = useNavigate();
  const cerrarSesion = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  

  const role = getRoleFromToken();
  console.log("Rol del usuario:", role);
  

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>

        <Navbar.Brand as={Link} to="/">
          Clinica - Bienestar 360
        </Navbar.Brand>


        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="">
              Inicio
            </Nav.Link>
            <Nav.Link as={Link} to="*">
              Servicios
            </Nav.Link>
            <Nav.Link as={Link} to="*">
              Contacto
            </Nav.Link>


            {role === "paciente" || role === "admin" || role === "medico"? (
              <>
                <Nav.Link onClick={cerrarSesion}>
                  Cerrar sesión
                </Nav.Link>
                {role === "admin" ? (
                  <NavDropdown title="Gestión" id="login-dropdown">
                    <NavDropdown.Item as={Link} to="/turnos">
                      Turnos
                    </NavDropdown.Item>

                    <NavDropdown.Item as={Link} to="/guardia-medica">
                      Guardia Médica
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/registroMedico">
                      Gestion de Medicos
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/registrarPaciente">
                      Gestion de Pacientes
                    </NavDropdown.Item>
                  </NavDropdown>
                ) : <NavDropdown title="Perfil" id="login-dropdown">
                    <NavDropdown.Item as={Link} to="/turnos">
                      Turnos
                    </NavDropdown.Item>
                    {role === "medico" && 
                    <NavDropdown.Item as={Link} to="/guardia-medica">
                      Guardia Médica
                    </NavDropdown.Item>}  
                    {role === "medico" && 
                    <NavDropdown.Item as={Link} to="/historiaClinica">
                      Historia Clínica
                    </NavDropdown.Item>}  
                  </NavDropdown>}
              </>
            ) : (
              <NavDropdown title="Iniciar Sesión" id="login-dropdown">
                <NavDropdown.Item as={Link} to="/login" state={{ tipoDeRegistro: "Paciente" }}>
                  Paciente
                </NavDropdown.Item>

                <NavDropdown.Item as={Link} to="/login" state={{ tipoDeRegistro: "Medico" }}>
                  Doctor
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}