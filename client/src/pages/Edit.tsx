import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Product, useMisc } from "../contexts/MiscContext";
import Form from "../formElements/Form";
import Input from "../formElements/Input";
import TextArea from "../formElements/TextArea";

interface FormDataStruct {
  name: string;
  description: string;
  price: number;
  tags?: string;
  category?: string;
  images?: File[];
}
export default function EditProduct() {
  const { isSm } = useMisc();
  const { id } = useParams();
  const [fileOutlet, setFileOutlet] = useState<string>();
  const { user, isLoading: userIsLoading } = useAuth();
  const [product, setProduct] = useState<Product>();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      if (id) {
        const res = await fetch(`${import.meta.env.VITE_API}/single/${id}`);
        const data = await res.json();
        setProduct(data);
        try {
          setIsLoading(true);
          if (id) {
            const res = await fetch(`${import.meta.env.VITE_API}/single/${id}`);
            if (!res.ok) navigate("/404", { replace: true });
            else {
              const { product } = await res.json();
              setProduct(product);
            }
          }
        } catch (err) {
          navigate("/404", { replace: true });
        } finally {
          setIsLoading(false);
        }
      }
    })();
  }, []);

  if (userIsLoading) return null;
  if (isLoading) return null;
  if (!user) return null;

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      if (data.file[0]) formData.append("file", data.file[0]);
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price);
      if (data.category) formData.append("category", data.category);
      if (data.tags) formData.append("tags", data.tags);
      formData.append("userId", user.id?.toString());

      console.log(formData);

      if (id) {
        const res = await fetch(import.meta.env.VITE_API + "/single/" + id, {
          method: "PATCH",
          body: JSON.stringify(data),
          headers: {
            Authorization:
              "Bearer " +
              document.cookie
                .split(";")
                .filter((item) => item.startsWith("token="))[0]
                .split("=")[1],
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error(res.statusText);
        navigate("/products");
      } else {
        const res = await fetch(import.meta.env.VITE_API + "/single", {
          method: "POST",
          body: formData,
          headers: {
            Authorization:
              "Bearer " +
              document.cookie
                .split(";")
                .filter((item) => item.startsWith("token="))[0]
                .split("=")[1],
          },
        });
        if (!res.ok) throw new Error(res.statusText);
        navigate("/products");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center ${
        isSm ? "gap-4 p-4" : "gap-8 p-12"
      }`}
    >
      <h2 className={`capitalize ${isSm ? "text-lg" : "text-2xl"}`}>
        {id ? "Edit" : "Create"} product
      </h2>
      <div
        className="
        flex items-center justify-center gap-6 rounded-3xl border-[.5px] 
        border-black bg-neutral-200 p-12 transition-all 
        duration-200 dark:border-white
        dark:bg-neutral-900 dark:shadow-[-1_0_5px_1px_#ffffff80] 
        dark:hover:shadow-[0_0_10px_2px_#ffffff90]"
      >
        <Form onSubmit={onSubmit} className="flex flex-col items-center gap-3">
          <div>
            <Input
              name="name"
              type="text"
              options={{
                required: "Name is required",
              }}
              placementClassName="w-full"
              initialValue={product?.name}
            />
            <TextArea
              className="h-[120px]"
              name="description"
              placementClassName="w-full"
              options={{}}
              initialValue={product?.description}
            />
            <div className="flex gap-2">
              <Input
                name="price"
                type="number"
                className="h-[44px]"
                options={{
                  required: "Price is required",
                  min: {
                    value: 0,
                    message: "Price must be greater than 0",
                  },
                }}
                placementClassName="w-full"
                initialValue={product?.price?.toString()}
              />
              <Input
                className="h-[44px]"
                name="categoryName"
                placeholder="Category"
                type="text"
                placementClassName="w-full"
                options={{}}
                initialValue={product?.category}
              />
            </div>
            <Input
              name="tags"
              type="text"
              placementClassName="w-full"
              options={{}}
              initialValue={product?.tags}
            />
            <Input
              id="fileInput"
              name="file"
              type="file"
              placementClassName="w-full"
              className="w-20"
              initialValue={product?.file}
              setFileNamesOutlet={setFileOutlet}
            />
            <p className="m-4 flex justify-center">{fileOutlet || ""}</p>
            <div className="flex w-full justify-center">
              <button
                className="
                w-[100px] rounded-md bg-silk-blue 
                p-2 text-white transition-all
                duration-200 hover:brightness-95
                "
                type="submit"
              >
                Submit
              </button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
