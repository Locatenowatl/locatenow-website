// src/App.tsx
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import Home from "./pages/Home";
import { Guide } from "./pages/Guide";
import { LeadCaptureModal } from "./components/LeadCaptureModal";
import { Toaster } from "@/components/ui/toaster";
import Calculator from "@/pages/Calculator"; 


// Scroll handler: smooth scroll on hash, instant jump on route change without hash
function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.substring(1);
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 0);
      }
    } else {
      // no hash: instant jump to top
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <BrowserRouter>
      <Navbar onOpenModal={() => setIsModalOpen(true)} />
      <ScrollToHash />

      <Routes>
        <Route
          path="/"
          element={<Home onOpenModal={() => setIsModalOpen(true)} />}
        />
        <Route
          path="/guide"
          element={<Guide onOpenModal={() => setIsModalOpen(true)} />}
        />
        <Route
          path="/calculator"
          element={<Calculator />}
  />
      </Routes>

      <LeadCaptureModal open={isModalOpen} onOpenChange={setIsModalOpen} />
      <Toaster />
    </BrowserRouter>
  );
}

export default App;