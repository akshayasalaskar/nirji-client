import Image from "next/image";

interface UserProps {
  bio: string;
  email: string;
  image: string;
  name: string;
  profilename: string;
}

export const UserDetailsCard: React.FC<UserProps> = ({
  bio,
  email,
  image,
  name,
  profilename,
}) => {
  return (
    <article className="rounded-xl  bg-accent p-4">
      <div className="flex items-center gap-4">
        <div className="flex  flex-col items-center ">
          {" "}
          <Image
            alt=""
            src={image}
            className="size-16 rounded-full object-cover"
            style={{ maxWidth: "200px", maxHeight: "200px" }}
            height={200}
            width={200}
          />
          <h2 className="text-2xl px-4 py-2 text-white mt-2">{name}</h2>
        </div>
        <div>
          <div className=" ">
            <ul className="-m-1 flex flex-col ml-4 flex-wrap">
              <li className="p-1 leading-none">
                <p className="text-xl px-4 py-2 text-white mt-1">
                  {" "}
                  {profilename}{" "}
                </p>
              </li>
              <li className="p-1 leading-none">
                <p className="text-md px-4 py-2 text-white mt-1"> {email} </p>
              </li>

              <li className="p-1 leading-none">
                <p className="text-md px-4 py-2 text-white mt-1"> {bio} </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </article>
  );
};
