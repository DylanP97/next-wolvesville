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
    const apiUrl = "https://node-wolvesville.onrender.com";

    if (isLogin) {
      try {
        const response = await fetch(`${apiUrl}/api/user/login`, {
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
        const response = await fetch(`${apiUrl}/api/user/signup`, {
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
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-white my-2">{isLogin ? "Login with your account" : "Register a new account"}</h1>
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
          <Button variant="ghost" color="secondary" className="w-[95%] m-2" type="submit">
            {isLogin ? "Login" : "Signup"}
          </Button>
        </div>
      </form>

      <div className="p-2 m-2 b-1 border border-black ">
        <p className="text-white">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={handleSwitch} style={{ cursor: "pointer", color: "violet" }}>
            {isLogin ? "Signup" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Connexion;
