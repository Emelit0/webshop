import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EditIcon from "../assets/EditIcon";
import { useAuth } from "../contexts/AuthContext";
import { Product, useMisc } from "../contexts/MiscContext";
import Form from "../formElements/Form";
import Input from "../formElements/Input";

export default function ProductPreview({
  product,
  type,
}: {
  product: Product;
  type?: string;
}) {
  const { user, userLoggedIn } = useAuth();
  const { cartAddItem, changeQuantity, isSm } = useMisc();
  const [isOwner, setIsOwner] = useState(false);
  const { id, price, name, description, userId } = product;
  useEffect(() => {
    if (userLoggedIn) {
      if (user.id === product.userId) setIsOwner(true);
      else setIsOwner(false);
    }
  }, [user]);
  function handleAdd() {
    cartAddItem(product);
  }
  const split = price.toString().split(".");
  let first = split[0],
    second;

  if (split.length === 1) second = "00";
  else second = split[1];

  const d = "$" + first;
  let c = second;
  if (second.length === 1) c = `${second}0`;

  const checkout = (() => {
    if (isSm) {
      return type === "checkout" ? "py-2 px-4" : "py-3 px-4";
    } else return type === "checkout" ? "py-4 px-8" : "py-6 px-8";
  })();

  return (
    <div className="flex h-fit w-[30rem] max-w-full gap-2">
      {/* Images path not functional at the moment */}
      {/* {product?.imagesPath?.length && (
        <img
          src={`${import.meta.env.VITE_API}/${product.imagesPath[0]}`}
          crossOrigin="anonymous"
          alt="Product Image"
          className="flex aspect-square h-full items-center justify-center rounded-3xl bg-neutral-200 object-cover transition-colors duration-200 dark:bg-neutral-900"
        />
      )} */}
      <div
        className={`
      ${checkout} relative flex w-[40rem] max-w-full bg-neutral-200
      shadow-[3px_3px_10px_1px_#00000060] transition-all duration-200 
      hover:shadow-[0_0_12px_2px_#00000060] hover:brightness-105 
      dark:bg-neutral-900 dark:hover:brightness-110
      ${isSm ? "rounded-xl" : "rounded-2xl"}
      `}
      >
        <div>
          <Link
            className="hover:text-blue-300 hover:underline"
            to={`/product/${id}`}
          >
            <h2 className="w-fit font-body text-lg">{name}</h2>
          </Link>
          <div className="flex justify-start gap-4">
            <div className="flex flex-col">
              <div className="flex w-32 items-start">
                <span
                  className={`py-[.5rem] font-bold ${
                    isSm ? "text-md" : "text-2xl"
                  }`}
                >
                  {d}
                </span>
                <span className={isSm ? "text-sm" : "text-lg"}>{c}</span>
              </div>
              {/* {type === "checkout" && (
                <Form
                  onSubmit={async ({ quantity }) => {
                    changeQuantity(product, Number(quantity));
                  }}
                  className="flex items-center gap-2"
                >
                  <Input
                    name="quantity"
                    type="number"
                    initialValue={product?.quantity?.toString()}
                    className="w-20"
                  />
                  <button type="submit">Save</button>
                </Form>
              )} */}
            </div>
            <p className="w-full opacity-50">{description}</p>
          </div>
        </div>
        {type === "products-page" && (
          <Link
            to={`/edit/${id}`}
            className={"absolute " + (isSm ? "top-1 right-1" : "top-3 right-3")}
          >
            <EditIcon className={isSm ? "w-10" : "w-12"} />
          </Link>
        )}
        {type === "search-page" && (
          <button
            onClick={handleAdd}
            className="absolute bottom-3 right-3 rounded-lg bg-silk-blue p-2 text-sm text-white hover:brightness-95"
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}
