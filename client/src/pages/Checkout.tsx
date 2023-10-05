import { Link } from "react-router-dom";
import CheckoutSummary from "../cards/Checkout";
import ProductPreview from "../cards/Product";
import DeliveryForm from "../cards/Shipping";
import { useAuth } from "../contexts/AuthContext";
import { Product, useMisc } from "../contexts/MiscContext";

export default function Checkout() {
  const { user } = useAuth();
  // Leaving cartAddItem to add mock data for now
  const { cart: items, checkoutPrice, trashCart, isSm } = useMisc();

  return (
    <div className="flex w-full justify-between px-8">
      {items.length ? (
        <div className="flex w-full flex-col items-center p-2">
          <div
            className={"flex w-full items-center " + (isSm ? "flex-col" : "")}
          >
            <div className="m-4 flex w-full max-w-3xl flex-col gap-8">
              <div className={`flex w-full flex-col items-center`}>
                <h1
                  className={
                    "self-center font-bold " +
                    (isSm ? "pt-3 pb-6 text-xl" : "pt-6 pb-12 text-2xl")
                  }
                >
                  Review Items
                </h1>
                <div className="flex w-full min-w-[20rem] flex-col items-center justify-center gap-3">
                  {items.map((item: Product) => {
                    return (
                      <ProductPreview
                        product={item}
                        type="checkout"
                        key={item.id}
                      />
                    );
                  })}
                </div>
              </div>
              <DeliveryForm
                title="Shipping"
                user={user}
                className="self-center"
              />
            </div>
            <CheckoutSummary price={checkoutPrice.toString()} />
          </div>
          <button
            onClick={trashCart}
            className="cursor-pointer rounded-md py-2 px-4 text-red-500 transition-all duration-100 hover:bg-black"
          >
            Trash Order
          </button>
        </div>
      ) : (
        <div className="m-4 flex w-full flex-col items-center gap-8">
          <h1 className="text-2xl font-bold">Your Cart is Empty</h1>
          <Link to="/search" className="hover:text-sky-400 hover:underline">
            Look for some products to add to your cart!
          </Link>
        </div>
      )}
    </div>
  );
}
