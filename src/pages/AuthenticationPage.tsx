import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { isAxiosError } from "axios";
import { useAuth } from "../hooks/customHooks";
import { useNavigate, useLocation } from "react-router-dom";

import { loginApi } from "../services/api";

function AuthenticationPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const from =
    (location.state as { from?: { pathname: string } } | null)?.from
      ?.pathname || "/";

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: loginApi,

    onSuccess: (data) => {
      login(data);
      console.log("Login success Token:", data);
console.log("LOGIN RESPONSE:", data);

      const destination = (from && from !== "/login") ? from : "/";
      navigate(destination, { replace: true });
    },
    onError: (err) => {
      if (isAxiosError(err)) {
        console.error(
          "Login Failed:",
          err.response?.data?.message || err.message,
        );
      } else if (err instanceof Error) {
        console.log("Login failed: ", err.message);
      }
    },
  });

  const submitHandler = (event: React.SubmitEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!email || !password) return;
    mutate({ email, password });
  };

  return (
    <form onSubmit={submitHandler}>
      <p>Sign in</p>
      <label htmlFor="email">Please enter your Email</label>
      <input
        type="email"
        id="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label htmlFor="password">Please enter your Password</label>
      <input
        type="password"
        id="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" disabled={isPending}>
        {isPending ? "Signing in ...." : "Sign-in"}
      </button>

      {isError && (
        <p style={{ color: "red" }}>
          {isAxiosError(error)
            ? error.response?.data?.message || error.message
            : "An unexpected error occurred"}
        </p>
      )}
    </form>
  );
}

export default AuthenticationPage;
