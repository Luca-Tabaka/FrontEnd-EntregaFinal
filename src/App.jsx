import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Catalogo from './pages/Catalogo.jsx';
import GestionArticulo from './pages/GestionArticulos.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Header />

        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Navigate to="/catalogo" />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/gestionar-Articulos" element={<GestionArticulo />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
