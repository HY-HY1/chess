import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface RegisterData {
  firstname: string;
  surname: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  token?: string;
  error?: string;
}

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  async function register(data: RegisterData): Promise<RegisterResponse> {
    setLoading(true);

    try {
      const response = await axios.post("/api/auth/register", data, {
        headers: { "Content-Type": "application/json" },
      });

      localStorage.setItem("token", response.data.token);
      router.refresh()


      return response.data;
    } catch  {
      return { error: "Registration failed." };
    } finally {
      setLoading(false);
    }
  }

  return { register, loading };
}
