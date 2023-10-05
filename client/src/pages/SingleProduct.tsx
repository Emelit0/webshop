import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Rating from "../components/Rating";
import { Product, useMisc } from "../contexts/MiscContext";

export default function SingleProduct() {
  const { id } = useParams();
  const { isSm } = useMisc();
  const [product, setProduct] = useState<Product>();
  const navigate = useNavigate();
  if (!id) {
    navigate("/search");
    return null;
  }

  useEffect(() => {
    (async () => {
      const product = await getProduct();
      if (product != null)
        setProduct({ ...product.product, imagesPath: product.image });
    })();
  }, []);

  async function getProduct() {
    const res = await fetch(`${import.meta.env.VITE_API}/single/${id}`, {
      headers: {
        method: "GET",
      },
    });
    if (res.ok) {
      return res.json();
    } else {
      return null;
    }
  }

  return (
    <div
      className={`
    relative left-0 right-0 mx-auto flex w-[40rem] max-w-full flex-col items-center justify-center gap-6 
    rounded-3xl border-[.5px] border-black bg-neutral-200 ${
      isSm ? "p-6" : "p-12"
    }
    shadow-[0_0_5px_1px_#00000050] transition-all duration-200 
    hover:shadow-[0_0_8px_2px_#00000070] 
    dark:border-white dark:bg-neutral-900 dark:shadow-[0_0_5px_1px_#ffffff80] 
    dark:hover:shadow-[0_0_10px_2px_#ffffff90]
  `}
    >
      <div className="h-full w-full">
        <div className="flex gap-2">
          <h2 className="text-xl font-bold">{product?.name}</h2>
          <p>{product?.description}</p>
          <div className="flex w-32 items-start">
            <span
              className={`py-[.5rem] font-bold ${
                isSm ? "text-md" : "text-2xl"
              }`}
            >
              ${product?.price.toString().split(".")[0]}
            </span>
            <span className={isSm ? "text-sm" : "text-lg"}>
              {product?.price.toString().split(".")[1] ?? "00"}
            </span>
          </div>
          {product?.category}
        </div>
        {product?.tags}
        {product?.imagesPath && <img src={product.imagesPath[0]} alt="" />}
        <Rating rating={product?.ratingsAvg} />
      </div>
    </div>
  );
}
