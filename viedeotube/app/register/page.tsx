"use client";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

// debounce function
function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): T {
  let timer: NodeJS.Timeout;
  return function(this: any, ...args: any[]) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  } as T;
}

// throttle function
function throttle<T extends (...args: any[]) => void>(fn: T, delay: number): T {
  let lastCall = 0;
  return function(this: any, ...args: any[]) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn.apply(this, args);
    }
  } as T;
}

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  // simulate async email check
  const checkEmail = debounce(async (email: string) => {
    console.log("Checking if email exists:", email);
    // simulate API check:
    if (email === "test@example.com") {
      setEmailValid(false);
    } else {
      setEmailValid(true);
    }
  }, 500);

  const registerMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }
      return data;
    },
    onSuccess: () => router.push("/login"),
    onError: (err) => alert(err instanceof Error ? err.message : "Something went wrong")
  });

  const throttledSubmit = throttle((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (!emailValid) {
      alert("Please use a different email.");
      return;
    }
    registerMutation.mutate({ email, password });
  }, 2000);

  return (
   <div className="flex justify-center items-center h-screen">
  <form
    onSubmit={throttledSubmit}
    className="flex flex-col space-y-4 w-80 p-4 border rounded shadow"
  >
    <h2 className="text-xl font-semibold text-center">Register</h2>
    <input
      type="email"
      placeholder="Email"
      value={email}
      onChange={(e) => {
        setEmail(e.target.value);
        checkEmail(e.target.value);
      }}
      className="border p-2 rounded"
      required
    />
    {!emailValid && (
      <span className="text-red-500 text-sm">Email already taken</span>
    )}
    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="border p-2 rounded"
      required
    />
    <input
      type="password"
      placeholder="Confirm Password"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      className="border p-2 rounded"
      required
    />
    <button
      type="submit"
      disabled={registerMutation.isPending}
      className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
    >
      {registerMutation.isPending ? "Registering..." : "Register"}
    </button>
  </form>
</div>

  );
}
