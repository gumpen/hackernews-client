"use client";

import { useEffect, useState } from "react";
import { validateUserInput } from "@/lib/validation";

interface User {
  id: string;
  about: string | null;
  created: Date;
  karma: number;
  submitted: number[];
}

export default function Login() {
  const [currentUser, setCurrentUser] = useState<User>();

  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerId, setRegisterId] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const fetchMe = async () => {
    const res = await fetch("/api/me", {
      method: "GET",
    });
    if (!res.ok) {
      return undefined;
    }
    const data: User = await res.json();
    setCurrentUser(data);
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const validateLoginForm = (el: React.FormEvent<HTMLFormElement>) => {
    if (currentUser) {
      el.preventDefault();
      console.error("user is already logged in");
    } else {
      try {
        validateUserInput(loginId, loginPassword);
      } catch (err: any) {
        el.preventDefault();
        console.error("user input is invalid");
      }
    }
  };

  const validateRegisterForm = (el: React.FormEvent<HTMLFormElement>) => {
    if (currentUser) {
      el.preventDefault();
      console.error("user is already logged in");
    } else {
      try {
        validateUserInput(registerId, registerPassword);
      } catch (err: any) {
        el.preventDefault();
        console.error("user input is invalid");
      }
    }
  };

  return (
    <div>
      <b>Login</b>
      <br />
      <br />
      <form
        className="mb-4"
        method="post"
        action={"/api/login"}
        onSubmit={validateLoginForm}
      >
        <table className="border-separate">
          <tbody>
            <tr>
              <td>username:</td>
              <td>
                <input
                  name="username"
                  className="border border-gray-500 py-px px-0.5"
                  type="text"
                  autoCapitalize="off"
                  autoCorrect="off"
                  size={20}
                  spellCheck={false}
                  onChange={(e) => setLoginId(e.target.value)}
                ></input>
              </td>
            </tr>
            <tr>
              <td>password:</td>
              <td>
                <input
                  name="password"
                  className="border border-gray-500 py-px px-0.5"
                  type="password"
                  size={20}
                  onChange={(e) => setLoginPassword(e.target.value)}
                ></input>
              </td>
            </tr>
          </tbody>
        </table>
        <br />
        <input
          className="border border-gray-500 bg-gray-200 text-sm py-px px-1.5"
          type="submit"
          value="login"
        ></input>
      </form>
      <a>Forgot your Password?</a>
      <br />
      <br />
      <b>Create Account</b>
      <br />
      <br />
      <form
        className="mb-4"
        method="post"
        action={"/api/register"}
        onSubmit={validateRegisterForm}
      >
        <table className="border-separate">
          <tbody>
            <tr>
              <td>username:</td>
              <td>
                <input
                  name="username"
                  className="border border-gray-500 py-px px-0.5"
                  type="text"
                  autoCapitalize="off"
                  autoCorrect="off"
                  size={20}
                  spellCheck={false}
                  onChange={(e) => setRegisterId(e.target.value)}
                ></input>
              </td>
            </tr>
            <tr>
              <td>password:</td>
              <td>
                <input
                  name="password"
                  className="border border-gray-500 py-px px-0.5"
                  type="password"
                  size={20}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                ></input>
              </td>
            </tr>
          </tbody>
        </table>
        <br />
        <input
          className="border border-gray-500 bg-gray-200 text-sm py-px px-1.5"
          type="submit"
          value="register"
        ></input>
      </form>
    </div>
  );
}
