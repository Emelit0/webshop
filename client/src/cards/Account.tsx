import { useState } from "react";
import UserImage from "../components/UserImage";
import { useAuth, User } from "../contexts/AuthContext";
import { useMisc } from "../contexts/MiscContext";
import Form from "../formElements/Form";
import Input from "../formElements/Input";

export default function AccountCard({ user }: { user: User }) {
  const { isSm } = useMisc();
  const [createdAt] = useState(
    new Date(user.createdAt).toLocaleDateString("default", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  );
  const { setUserInformation, updateUser, signout } = useAuth();

  const onSubmit = async (data: FormData) => {
    // @ts-ignore
    await setUserInformation({ ...user, ...data });
    await updateUser();
  };

  return (
    <div
      className={`
      relative flex max-w-full flex-col items-center justify-center gap-6 
      rounded-3xl border-[.5px] border-black bg-neutral-200 ${
        isSm ? "p-6" : "p-12"
      }
      shadow-[0_0_5px_1px_#00000050] transition-all duration-200 
      hover:shadow-[0_0_8px_2px_#00000070] 
      dark:border-white dark:bg-neutral-900 dark:shadow-[0_0_5px_1px_#ffffff80] 
      dark:hover:shadow-[0_0_10px_2px_#ffffff90]
    `}
    >
      <h1 className={`font-bold ${isSm ? "text-xl" : "text-2xl"}`}>
        My Profile
      </h1>
      <span
        onClick={signout}
        className="absolute top-6 right-8 cursor-pointer text-blue-400 hover:underline"
      >
        Sign Out
      </span>
      <div className="flex gap-16">
        <div className="flex flex-col">
          <UserImage user={user} className="w-44" />
          <span className={`${isSm ? "text-sm" : "text-base"} opacity-60`}>
            User since {createdAt}
          </span>
        </div>
        <Form onSubmit={onSubmit} className="flex flex-col justify-around">
          <Input
            name="name"
            type="text"
            initialValue={user.name}
            options={{
              required: "Please enter a name.",
              maxLength: {
                value: 20,
                message: "Name must be less than 20 characters.",
              },
              minLength: {
                value: 3,
                message: "Name must be at least 3 characters.",
              },
            }}
          />
          <Input
            name="email"
            type="email"
            initialValue={user.email}
            options={{
              required: "Please enter an email.",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Please enter a valid email.",
              },
            }}
          />
          <button
            className="h-fit w-fit self-center rounded-lg bg-silk-blue p-3 text-white transition-all duration-200 hover:brightness-95 "
            type="submit"
          >
            Submit
          </button>
        </Form>
      </div>
    </div>
  );
}
