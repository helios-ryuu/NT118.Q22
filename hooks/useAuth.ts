// Hook truy cap trang thai auth tu bat ky component nao
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

export function useAuth() {
  return useContext(AuthContext);
}
