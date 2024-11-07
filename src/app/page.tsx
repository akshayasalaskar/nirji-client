"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { isLogin, logOut, getUserDetails, getCookie } from "../utils/auth";
import { baseURL, imageUrl } from "../utils/constant";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import { UserDetailsCard } from "./components/UserDetailsCard";

interface UserDetails {
  bio: string;
  email: string;
  image: string;
  name: string;
  profilename: string;
}

interface ImageResponse {
  image: string;
}

export default function Home() {
  const router = useRouter();
  const [userDetails, setUserDetails] = useState<UserDetails>({
    bio: "",
    email: "",
    image: "",
    name: "",
    profilename: "",
  });
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    const authenticate = async () => {
      const loggedIn = await isLogin();
      if (!loggedIn.auth) {
        router.push("/login");
      } else {
        setUserDetails(loggedIn.data);
      }
    };

    const fetchUserData = async () => {
      const userData = await getUserDetails();
      setUserDetails({ ...userData, image: `${imageUrl}${userData.image}` });
    };

    authenticate();
    fetchUserData();
  }, [router]);

  useEffect(() => {
    const fetchUserImages = async () => {
      try {
        const response = await axios.get<{ images: string[] }>(
          `${baseURL}/getImages`,
          {
            headers: { token: getCookie("token") },
          }
        );
        setImages(response.data.images);
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false); // Set loading to false after fetch completes
      }
    };

    fetchUserImages();
  }, []);

  const handleLogOut = () => {
    logOut();
    toast.success("Logout Successfully");
    router.push("/login");
  };

  const handleImageUpload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedImage)
      return toast.error("Please select the image to be Uploaded");

    if (selectedImage.size > 5 * 1024 * 1024) {
      toast.error("File size should not exceed 5 MB");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await axios.post<ImageResponse>(
        `${baseURL}/uploadImages`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token: getCookie("token"),
          },
        }
      );

      setImages((prevImages) => [...prevImages, response.data.image]);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Failed to upload image");
    }
  };

  return (
    <>
      <main className="w-full">
        <div className="py-4 px-4 flex justify-between">
          <form
            onSubmit={handleImageUpload}
            className="flex gap-4 items-center"
          >
            <input
              type="file"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSelectedImage(e.target.files?.[0] || null)
              }
              className="file-input bg-accent px-4 py-2 text-white w-[200px] rounded-full hover:bg-accentDark"
            />
            <button
              type="submit"
              className="rounded-full bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-900"
            >
              Upload
            </button>
          </form>
          <button
            className="bg-accent px-4 py-2 mt-4 text-white w-[200px] rounded-full hover:bg-accentDark"
            onClick={handleLogOut}
          >
            Logout
          </button>
        </div>
      </main>

      <section className="py-4 px-4 ">
        <UserDetailsCard
          bio={userDetails.bio}
          email={userDetails.email}
          image={userDetails.image}
          name={userDetails.name}
          profilename={userDetails.profilename}
        />
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8 py-4 px-4 rounded-lg p-4 shadow-sm shadow-indigo-100">
        {loading ? (
          <p>Images Loading...</p>
        ) : images.length > 0 ? (
          images.map((img, index) => (
            <div key={index}>
              <Image
                src={`${imageUrl}${img}`}
                alt="Uploaded Image"
                width={400}
                height={400}
                className="rounded"
              />
            </div>
          ))
        ) : (
          <p>No Images has been Uploaded Yet</p>
        )}
      </div>
    </>
  );
}
