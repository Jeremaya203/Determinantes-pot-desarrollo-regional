import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import IntroSection from './components/IntroSection';
import ClasificacionSection from './components/ClasificacionSection';
import PracticaSection from './components/PracticaSection';
import FinalidadSection from './components/FinalidadSection';
import TensionSection from './components/TensionSection';
import PostuladosSection from './components/PostuladosSection';
import ActividadSection from './components/ActividadSection';
import BibliografiaSection from './components/BibliografiaSection';
import Footer from './components/Footer';
import RegistroModal from './components/RegistroModal';
import DashboardPage from './dashboard/DashboardPage';
import { sesionId } from './hooks/useRegistro';

export default function App() {
  const [nombre, setNombre] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    const section = document.getElementById('postulados');
    if (!section) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !nombre) {
          setMostrarModal(true);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [nombre]);

  const isDashboard = window.location.pathname.includes('/dashboard');
  if (isDashboard) return <DashboardPage />;

  return (
    <div style={{ background: '#0a0f0a', minHeight: '100vh' }}>
      {mostrarModal && !nombre && (
        <RegistroModal
          onRegistrar={(n) => {
            setNombre(n);
            setMostrarModal(false);
          }}
        />
      )}
      <Navbar />
      <main>
        <Hero />
        <IntroSection />
        <ClasificacionSection />
        <PracticaSection />
        <FinalidadSection />
        <TensionSection />
        <PostuladosSection nombre={nombre} sesionId={sesionId} />
        <ActividadSection nombre={nombre} sesionId={sesionId} />
        <BibliografiaSection />
      </main>
      <Footer />
    </div>
  );
}