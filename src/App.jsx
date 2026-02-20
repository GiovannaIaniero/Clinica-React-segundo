import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import Navbar from './components/shared/Navbar.jsx'
import Footer from './components/shared/Footer.jsx'
import Home from './components/views/Home/Home.jsx'
import Login from './components/views/Login.jsx'
import RegistrarPaciente from './components/views/RegistrarPaciente.jsx'
import RegistroMedico from './components/views/crudMedico/RegistroMedico.jsx'
import TurnosList from './components/views/TurnosList.jsx'
import GuardiaMedica from './components/views/Guardia/GuardiaMedica.jsx'
import HistoriaClinica from './components/historiaClinica/HistoriaClinica.jsx'
import ItemMedico from './components/views/crudMedico/ItemMedico.jsx'
import Error404 from './components/views/Error404.jsx'
import ItemPacientes from './components/views/Pacientes/ItemPacientes.jsx'
import Pago from './components/turnos/Pagos.jsx'



function App() {
  const [isAdmin, setIsAdmin] = useState(false)
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))

  if (currentUser?.role === "admin") {
    console.log("El usuario es un admin")
  } else if (currentUser?.role === "user") {
    console.log("El usuario es un paciente")
  } else if (currentUser?.role === "medico") {
    console.log("El usuario es un médico")
  }
  return (
    <div className='div-principal'>
      <BrowserRouter>

        <Navbar />

        <main className='my-5'>
          <Routes>
            <Route path='' element={<Home />} />
            <Route path='/' element={<Home />} />
            <Route path='/registrarPaciente' element={<RegistrarPaciente />} />
            <Route path='/guardia-medica' element={currentUser?.role === "medico" || currentUser?.role === "admin" ? <GuardiaMedica /> : <Navigate to="/login" />} />
            <Route path='/turnos' element={<TurnosList />} />
            <Route path='/login' element={<Login onLogin={setIsAdmin} />} />
            <Route path='/historiaClinica' element={currentUser?.role === "medico" ? <HistoriaClinica /> : <Navigate to="/login" />} />
            <Route path='/registroMedico' element={<RegistroMedico />} />
            <Route path="pago" element={currentUser?.role === "user" ? <Pago /> : <Navigate to="/login" />} />

            <Route path='*' element={<Error404 />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
      
    </div>

  )
}

export default App