// src/App.tsx
import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";

// lazy pages
const Home = React.lazy(() => import("./pages/Home"));
const ContactPage = React.lazy(() => import("./pages/Contact"));
const Login = React.lazy(() => import("./routes/Login"));
const Dashboard = React.lazy(() => import("./routes/Dashboard"));

function findAnchor(id: string): HTMLElement | null {
  const root = document.getElementById(id);
  if (!root) return null;
  const explicit = root.querySelector<HTMLElement>("[data-anchor-target='true']");
  if (explicit) return explicit;
  const heading = root.querySelector<HTMLElement>("h1, h2, h3");
  return heading ?? root;
}

function headerOffsetPx(): number {
  const header = document.querySelector("header");
  return header instanceof HTMLElement ? header.offsetHeight + 12 : 84;
}

function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname, hash]);

  useEffect(() => {
    if (!hash) return;
    const id = hash.slice(1);
    const target = findAnchor(id);
    if (!target) return;
    const y = target.getBoundingClientRect().top + window.scrollY - headerOffsetPx();
    requestAnimationFrame(() => window.scrollTo({ top: y, behavior: "smooth" }));
  }, [hash]);

  return null;
}

export default function App() {
  return (
    <>
      <Header />
      <ScrollManager />
      <React.Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </React.Suspense>
    </>
  );
}
