"use client";

import { profile } from "console";
import { isLogin, logOut, getUserDetails } from "../../src/utils/auth";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { baseURL, imageUrl } from "../utils/constant";
import { toast } from "react-toastify";
import xyz from "../../public/img/beautifulme.jpg";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState({ name: "", email: "" });
  const [pageReady, setPageReady] = useState(true);
  const [userDetails, setUserDetails] = useState({
    bio: "",
    email: "",
    image: "",
    name: "",
    profilename: "",
  });

  useEffect(() => {
    const authenticate = async () => {
      const loggedIn = await isLogin();
      if (loggedIn.auth) {
        setUser(loggedIn.data);
        console.log("loggedIn.data", loggedIn.data);
      } else {
        router.push("/login");
      }
    };

    authenticate();
  }, []);

  const handleLogOut = () => {
    logOut();
    toast.success("Logout Successfully");
    router.push("/login");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserDetails();
        console.log("Fetched userData:", userData); // Log data before setting state
        setUserDetails({
          ...userData,
          image: `${imageUrl}${userData.image}`, // Assuming baseURL is the backend URL
        });
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserData();
  }, []);
  console.log("userDetails", userDetails);
  console.log("image", userDetails.image);
  return (
    <main
      className={`${
        pageReady ? "block" : "hidden"
      } w-full h-screen grid place-items-center`}
    >
      <div className="p-4 bg-accentDark text-white w-[400px] h-[250px] text-center space-y-4">
        <p>Hi {userDetails?.name}, Welcome!</p>
        <p>{userDetails?.email}</p>
        <div>
          {" "}
          <Image
            src={userDetails.image || "/img/beautifulme.jpg"} // Fallback to local image if userDetails.image is empty
            alt="User Profile"
            width={150} // Specify width for optimization
            height={150} // Specify height for optimization
            className="rounded-full" // Add any styling you want
          />
        </div>
        <button
          className="bg-accent px-4 py-2 text-white"
          onClick={handleLogOut}
        >
          Logout
        </button>
      </div>
    </main>
  );
}
