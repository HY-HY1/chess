import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  token?: string;
  error?: string;
}

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  async function login(data: LoginData): Promise<LoginResponse> {
    setLoading(true);

    try {
      const response = await axios.post("/api/auth/login", data, {
        headers: { "Content-Type": "application/json" },
      });

      localStorage.setItem("token", response.data.token);
      window.location.reload()

      return response.data;
    } catch  {
      return { error: "Login failed." };
    } finally {
      setLoading(false);
    }
  }

  return { login, loading };
}
