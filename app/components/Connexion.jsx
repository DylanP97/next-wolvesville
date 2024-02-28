"use client";

import { useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { useAuth } from "../providers/AuthProvider";
import { defaultAvatar } from "../lib/utils"

const Connexion = () => {
  const { setAuthInfo } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleSwitch = () => {
    setIsLogin((prevIsLogin) => !prevIsLogin);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/user/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
        if (response.ok) {
          const userData = await response.json();
          setAuthInfo(userData.username, userData.avatar, true);
        }
      } catch (error) {
        console.error("Login error:", error);
      }
    } else {
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/user/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password, defaultAvatar }),
        });

        console.log("Signup response:", response);
        if (response.ok) {
          setIsLogin(true);
        }
      } catch (error) {
        console.error("Signup error:", error);
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 from-10% via-indigo-700 via-30% to-blue-950 to-80% h-screen w-screen flex flex-col justify-center items-center">
      <h1 className="font-bold text-white my-2 text-xl">{isLogin ? "Login with your account" : "Register a new account"}</h1>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div>
            <Input
              color="secondary"
              isRequired
              type="text"
              label="Username"
              value={username}
              className="max-w-xs p-2"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        )}

        <div>
          <Input
            color="secondary"
            isRequired
            type="email"
            label="Email"
            value={email}
            className="max-w-xs p-2"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <Input
            color="secondary"
            isRequired
            type="password"
            label="Password"
            value={password}
            className="max-w-xs p-2"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <Button variant="shadow" color="secondary" className="w-[95%] m-2" type="submit">
            {isLogin ? "Login" : "Signup"}
          </Button>
        </div>
      </form>

      <div className="p-2 m-2">
        <p className="text-white">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={handleSwitch} style={{ cursor: "pointer", color: "pink", textDecoration: "underline" }}>
            {isLogin ? "Signup" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Connexion;
