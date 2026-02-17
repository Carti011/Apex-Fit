import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Register from './components/Register';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-emerald-500/30">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/login"
            element={
              <div className="flex items-center justify-center h-[80vh] flex-col gap-4">
                <div className="text-4xl">🚧</div>
                <h2 className="text-2xl font-bold text-slate-500">Login Coming Soon...</h2>
                <p className="text-slate-600">Estamos implementando a autenticação JWT.</p>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
