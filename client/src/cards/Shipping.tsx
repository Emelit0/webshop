import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useAuth } from "../contexts/AuthContext";
import { useMisc } from "../contexts/MiscContext";
import Form from "../formElements/Form";
import Input from "../formElements/Input";
import TextArea from "../formElements/TextArea";

interface DeliveryFormProps {
  user: any;
  title?: string;
  className?: string;
}

interface FormData {
  country?: string;
  city?: string;
  region?: string;
  addressLine1?: string;
  addressLine2?: string;
  postalCode?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  confirmEmail?: string;
  countryCallingCode?: string;
  phoneNumber?: string;
}

export default function DeliveryForm({ title, className }: DeliveryFormProps) {
  const { user, isLoading, setUserInformation } = useAuth();
  const [delivery, setDelivery] = useState<FormData>();
  const { isSm } = useMisc();
  const getDeliveryInformation = async () => {
    if (isLoading) return;
    if (!user) return;
    return {
      ...user?.address,
    };

    // Temporary solution
    // return {
    //   country: "United States",
    //   city: "San Francisco",
    //   region: "California",
    //   address: "123 Main St",
    //   address2: "Apt 1",
    //   postalCode: "94107",
    //   firstName: "Jane",
    //   lastName: "Doe",
    //   email: user.email,
    //   countryCallingCode: "+1",
    //   phoneNumber: "555-555-5555",
    // };
  };

  const onSubmit = async (data: FormData) => {
    await setUserInformation(user, data);
  };

  useEffect(() => {
    (async () => {
      const res = await getDeliveryInformation();
      if (res) setDelivery(res);
    })();
  }, [user, isLoading]);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div
      className={`
        flex min-h-[20rem] w-[30rem] min-w-fit max-w-full flex-col items-center justify-start
        gap-6 border-[.5px] border-black bg-neutral-200
        shadow-[0_0_5px_1px_#00000050] transition-all duration-200 
        hover:shadow-[0_0_8px_2px_#00000070] dark:border-white dark:bg-neutral-900 
        dark:shadow-[0_0_5px_1px_#ffffff80] dark:hover:shadow-[0_0_10px_2px_#ffffff90]
        ${className || ""} ${
        isSm ? "rounded-lg p-4 py-10" : "rounded-2xl p-12"
      }`}
    >
      <>
        <h2 className={`font-bold ${isSm ? "text-xl" : "text-2xl"}`}>
          {title || "Shipping Form"}
        </h2>
        {!user && <p className="mt-16">Please sign in.</p>}
        {user && (
          <Form
            onSubmit={onSubmit}
            className={`grid grid-cols-6 grid-rows-[8] gap-1 gap-x-3 ${
              isSm ? "w-[19rem]" : "w-full max-w-[30rem]"
            }`}
          >
            <Input
              type="text"
              name="country"
              options={{
                required: "Please enter a country.",
              }}
              initialValue={delivery?.country}
              placementClassName="col-span-2"
            />

            <Input
              type="text"
              name="city"
              options={{
                required: "Please enter a city.",
              }}
              initialValue={delivery?.city}
              placementClassName="col-span-2 row-start-2"
            />

            <Input
              type="text"
              name="region"
              options={{
                required: "Please enter a region.",
              }}
              initialValue={delivery?.region}
              placementClassName="col-span-2 row-start-2 col-start-3"
            />

            <Input
              type="text"
              name="postalCode"
              placeholder="Postal Code"
              options={{
                required: "Please enter a postal code.",
              }}
              initialValue={delivery?.postalCode}
              placementClassName="col-span-2 row-start-2 col-start-5"
            />

            <Input
              type="text"
              name="addressLine1"
              options={{
                required: "Please enter an address.",
              }}
              initialValue={delivery?.addressLine1}
              placementClassName="row-start-3 col-span-3"
            />

            <Input
              type="text"
              name="addressLine2"
              placeholder="Address 2"
              initialValue={delivery?.addressLine2}
              placementClassName="row-start-3 col-start-4 col-span-3"
            />

            <Input
              type="text"
              name="firstName"
              placeholder="First Name"
              options={{
                required: "Please enter a first name.",
              }}
              initialValue={delivery?.firstName}
              placementClassName="row-start-4 col-span-3"
            />

            <Input
              type="text"
              name="lastName"
              placeholder="Last Name"
              options={{
                required: "Please enter a last name.",
              }}
              initialValue={delivery?.lastName}
              placementClassName="row-start-4 col-start-4 col-span-3"
            />

            <Input
              type="text"
              name="email"
              options={{
                required: "Please enter an email address.",
                pattern: {
                  value: /^\S+@\S+\.\S+$/i,
                  message: "Please enter a valid email address.",
                },
              }}
              initialValue={delivery?.email}
              placementClassName="row-start-5 col-span-3"
            />

            <Input
              type="text"
              name="confirmEmail"
              placeholder="Confirm Email"
              options={{
                required: "Please confirm your email address.",
              }}
              placementClassName="row-start-5 col-start-4 col-span-3"
            />

            <Input
              type="text"
              name="phoneNumber"
              placeholder="Full Phone Number"
              options={{
                required: "Please enter a phone number.",
              }}
              initialValue={delivery?.phoneNumber}
              placementClassName="row-start-6 col-start-1 col-span-6"
            />

            <button
              className="
          col-span-2 col-start-3 row-start-[8] rounded-xl bg-emerald-600 
          p-3 text-white transition-all duration-200 
          hover:bg-emerald-400 hover:text-black hover:shadow-[0_0_5px_1px_#00000050] 
          dark:bg-emerald-500 dark:text-black dark:hover:bg-emerald-600 
          dark:hover:text-white dark:hover:shadow-[0_0_5px_1px_#ffffff50]"
              type="submit"
            >
              Submit
            </button>
          </Form>
        )}
      </>
    </div>
  );
}
