import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import { Register } from './components/Register';
import './App.css'

function LoginPlaceholder() {
  return (
    <div className="app-layout" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
      <h1 className="hero-title">LOGIN COMING SOON...</h1>
      <Link to="/" className="cta-button secondary">Voltar para Home</Link>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LoginPlaceholder />} />
      </Routes>
    </Router>
  );
}

export default App
