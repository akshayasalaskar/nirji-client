"use client";

import axios, { AxiosError } from "axios";
import Link from "next/link";
import React, { useState, useEffect, use } from "react";

import { FaFacebookF, FaGoogle, FaInstagram } from "react-icons/fa6";
import { baseURL } from "../../utils/constant";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { isLogin } from "../../utils/auth";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pageReady, setPageReady] = useState(false);
  const [profilename, setProfilename] = useState("");
  const [bio, setBio] = useState("");
  const [file, setFile] = useState<File | undefined>();

  const router = useRouter();

  useEffect(() => {
    const authenticate = async () => {
      if (await isLogin()) {
        router.push("/");
      } else {
        setPageReady(true);
      }
    };
    authenticate();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formdata = new FormData();
    formdata.append("name", name);
    formdata.append("email", email);
    formdata.append("password", password);
    formdata.append("profilename", profilename);
    formdata.append("bio", bio);
    if (file) formdata.append("file", file);

    axios
      .post(`${baseURL}/signup`, formdata, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        toast.success(
          <div>
            Account Created Successfully <br /> Please Login in
          </div>
        );
        router.push("/login");
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message);
      });
  };

  return (
    <>
      <div
        className={`${pageReady ? "block" : "hidden"} grid grid-cols-[30%,1fr]`}
      >
        <div className="bg-accent h-screen grid place-items-center">
          <div className="text-center w-full text-white space-y-8">
            <h2 className="font-bold text-4xl">Welcome Back!</h2>
            <div className="text-[#eeeeee] w-fit mx-auto">
              <p>To keep connected with us please</p>
              <p>please login with your personal info</p>

              <Link href="/login">
                <button className="uppercase px-4 py-2 w-[100%] rounded-full border-2 mt-8">
                  Login
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="h-screen grid place-items-center">
          <div className="text-center">
            <h1 className="text-accent mb-4 font-bold text-4xl">
              Create Account
            </h1>

            <form
              className="flex w-[300px] mx-auto flex-col pt-2 gap-2"
              onSubmit={handleSubmit}
            >
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input__style"
                type="text"
                placeholder="Name"
                required
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input__style"
                type="email"
                placeholder="Email"
                required
              />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input__style"
                type="password"
                placeholder="Password"
                required
              />
              <input
                value={profilename}
                onChange={(e) => setProfilename(e.target.value)}
                className="input__style"
                type="text"
                placeholder="Username"
                required
              />
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="input__style"
                placeholder="Bio"
                required
              />
              <input
                onChange={(e) => {
                  if (e.target.files) {
                    setFile(e.target.files[0]);
                  }
                }}
                className="input__style"
                type="file"
                placeholder="Profile Image"
              />

              <button className="uppercase bg-accent hover:bg-accentDark px-4 py-2 text-white mt-4">
                Sign up
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
