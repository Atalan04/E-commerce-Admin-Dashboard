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
      console.log("Destination:", from);

      const destination = from && from !== "/login" ? from : "/";
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <form
        onSubmit={submitHandler}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8 space-y-5"
      >
        <div className="text-center space-y-1">
          <p className="text-2xl font-bold tracking-tight text-slate-800">
            Sign in
          </p>
          <p className="text-xs text-slate-500">
            Access your store administrator panel
          </p>
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="block text-xs font-semibold uppercase text-slate-600 tracking-wider"
          >
            Please enter your Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition"
          />
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="block text-xs font-semibold uppercase text-slate-600 tracking-wider"
          >
            Please enter your Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="........"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? "Signing in ...." : "Sign-in"}
        </button>

        {isError && (
          <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg p-3 text-center">
            {isAxiosError(error)
              ? error.response?.data?.message || error.message
              : "An unexpected error occurred"}
          </p>
        )}
      </form>
    </div>
  );
}

export default AuthenticationPage;
