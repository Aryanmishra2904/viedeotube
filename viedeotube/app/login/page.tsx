"use client";
import React, { useState, useCallback } from "react";
import { debounce } from "lodash";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const router = useRouter();

  
  const checkEmail = useCallback(
    debounce((value: string) => {
      console.log("checking email exist", value);

      if (!value) {
        setEmailValid(null);
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        console.log("invalid email");
        setEmailValid(false);
      } else {
        console.log("valid email");
        setEmailValid(true);
      }
    }, 500),
    []
  );

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    checkEmail(e.target.value);
  };

 
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("Login failed");
      return res.json();
    },
    onSuccess: () => {
      router.push("/dashboard");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!emailValid) {
      alert("Please enter a valid email");
      return;
    }
    mutation.mutate();
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col space-y-4 w-80 p-4 border rounded"
      >
        <h2 className="text-xl font-semibold">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
          className="border p-2 rounded"
          required
        />
        {emailValid === false && (
          <span className="text-red-500 text-sm">Invalid email</span>
        )}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          {mutation.isPending ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
