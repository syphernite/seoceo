import React from "react";
import { Navigate, useLocation } from "react-router-dom";

type Props = { children: React.ReactNode };

export default function ProtectedRoute({ children }: Props) {
  const location = useLocation();
  const inDemo = typeof window !== "undefined" && localStorage.getItem("b4y_demo") === "1";
  if (!inDemo) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <>{children}</>;
}
