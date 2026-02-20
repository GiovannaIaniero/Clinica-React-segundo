import "./Home.css"
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from "react-router";
import Img from "../../../../public/img/clinica.jpg"
import { Container, Row, Col } from "react-bootstrap";

const Home = () => {
  const role = JSON.parse(localStorage.getItem("currentUser"))?.role;
  return (
    <>
      <img src={Img} alt="Imagen Clinica" className='clinica-img ' />
      <h1 className='display-4 my-4 fw-bold horarios-titulo'>Bienestar360</h1>

      <Row className="g-4 my-4">

        <Col md={4}>
          <Card className="op-card shadow-sm border-0 p-4">
            <div className="op-icon icon-blue">
              <i className="bi bi-person-badge"></i>
            </div>
            <h4 className="mt-3 text-primary fw-bold">{role === undefined ? "Acceso Pacientes" : "Turnos"}</h4>
            <p className="my-4 fw-bold px-3">{role === undefined ? "Ingresar como paciente" : "Gestiona tus turnos aquí"}</p>

            {role === undefined && (
              <Button
                variant="primary"
                className="fw-bold"
                as={Link}
                to="/login">
                Ingresar
              </Button>
            )}
            {role !== undefined && (
              <Button
                variant="primary"
                className="fw-bold"
                as={Link}
                to="/turnos">
                Ingresar
              </Button>
            )}
          </Card>
        </Col>

        <Col md={4}>
          {role === "user" && (
            <Card className="op-card shadow-sm border-0 p-4">
              <div className="op-icon icon-gray">
                <i className="bi bi-person"></i>
              </div>
              <h4 className="mt-3 fw-bold text-secondary">Función Próxima</h4>
              <p className="my-4 px-3 fw-bold">Disponible próximamente</p>

              <Button
                variant="secondary"
                className="fw-bold"
                disabled
              >
                Próximamente
              </Button>
            </Card>
          )}

          {role === undefined && (
            <Card className="op-card shadow-sm border-0 p-4">
              <div className="op-icon icon-green">
                <i className="bi bi-clipboard-check"></i>
              </div>
              <h4 className="mt-3 fw-bold text-success">Acceso Profesionales</h4>
              <p className="my-4 px-3 fw-bold">Accede como profesional</p>

              <Button
                variant="success"
                className="fw-bold"
                as={Link}
                to="/login"
              >
                Ingresar
              </Button>
            </Card>
          )}

          {(role === "admin" || role === "medico") && (
            <Card className="op-card shadow-sm border-0 p-4">
              <div className="op-icon icon-gray">
                <i className="bi bi-person"></i>
              </div>
              <h4 className="mt-3 fw-bold text-success">Guardia Médica</h4>
              <p className="my-4 px-3 fw-bold">Accede a la guardia médica</p>

              <Button
                variant="success"
                className="fw-bold"
                as={Link}
                to="/guardia-medica"
              >
                Ingresar
              </Button>
            </Card>
          )}


        </Col>

        <Col md={4}>

          {role === "user" && (
            <Card className="op-card shadow-sm border-0 p-4">
              <div className="op-icon icon-gray">
                <i className="bi bi-person"></i>
              </div>
              <h4 className="mt-3 fw-bold text-secondary">Función Próxima</h4>
              <p className="my-4 px-3 fw-bold">Disponible próximamente</p>

              <Button
                variant="secondary"
                className="fw-bold"
                disabled
              >
                Próximamente
              </Button>
            </Card>
          )}

          {role === undefined && (
            <Card className="op-card shadow-sm border-0 p-4">
              <div className="op-icon icon-orange">
                <i className="bi bi-hospital"></i>
              </div>
              <h4 className="mt-3 fw-bold text-warning"> ¿Usuario o Profesional?</h4>
              <p className="my-4 px-3 fw-bold">Accede a nuestro servicio</p>
              <Row className="g-3">
                <Col>
                  <Button
                    variant="warning"
                    className="fw-bold w-100"
                    as={Link}
                    to="/registroMedico"
                  >
                    Profesional
                  </Button>
                </Col>

                <Col>
                  <Button
                    variant="warning"
                    className="fw-bold w-100"
                    as={Link}
                    to="/registrarPaciente"
                  >
                    Paciente
                  </Button>
                </Col>
              </Row>
            </Card>
          )}

          {role === "admin" && (
            <Card className="op-card shadow-sm border-0 p-4">
              <div className="op-icon icon-gray">
                <i className="bi bi-person"></i>
              </div>
              <h4 className="mt-3 fw-bold text-warning">Gestión de Profesionales</h4>
              <p className="my-4 px-3 fw-bold">Accede a el registro de los profesionales</p>

              <Button
                variant="warning"
                className="fw-bold"
                as={Link}
                to="/registroMedico"
              >
                Ingresar
              </Button>
            </Card>
          )}

          {role === "medico" && (
            <Card className="op-card shadow-sm border-0 p-4">
              <div className="op-icon icon-gray">
                <i className="bi bi-person"></i>
              </div>
              <h4 className="mt-3 fw-bold text-warning">Historia Clínica</h4>
              <p className="my-4 px-3 fw-bold">Gestiona los historiales clínicos</p>

              <Button
                variant="warning"
                className="fw-bold"
                as={Link}
                to="/historiaClinica"
              >
                Ingresar
              </Button>
            </Card>
          )}

        </Col>

      </Row >

      <div className="bg-light py-5 my-5">
        <Container className="text-center">

          <h2 className=" horarios-titulo fw-bold "  >Horarios de Atención</h2>

          <hr className="w-25 mx-auto my-4 " />

          <Row className="text-muted fw-semibold">

            <Col>
              <p className="fw-bold" >Internación</p>
              <p className="mb-1 fw-bold">11 a 12 hs</p>
              <p className="fw-bold">18 a 20 hs</p>
            </Col>

            <Col>
              <p className="fw-bold">Terapia Intensiva Adultos</p>
              <p className="mb-1 fw-bold">12 a 13 hs</p>
              <p className="fw-bold">20 a 21 hs</p>
            </Col>

            <Col>
              <p className="fw-bold">Terapia Intensiva Pediátrica</p>
              <p className="mb-1 fw-bold">11 a 12 hs</p>
              <p className="fw-bold">19 a 20 hs</p>
            </Col>

            <Col>
              <p className="fw-bold">Unidad Coronaria</p>
              <p className="mb-1 fw-bold">12 a 13 hs</p>
              <p className="fw-bold">20 a 21 hs</p>
            </Col>

            <Col>
              <p className="fw-bold">Guardia Medica</p>
              <p className="mb-1 fw-bold">24 hrs.</p>
            </Col>

          </Row>
        </Container>
      </div>



    </>
  )
}

export default Home
