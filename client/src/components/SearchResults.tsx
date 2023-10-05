import { useLocation, useNavigate } from "react-router-dom";
import ProductPreview from "../cards/Product";
import { useMisc } from "../contexts/MiscContext";

export default function SearchResults({ data, setPage, page }: any) {
  const { isSm, filtersOpen } = useMisc();

  function increment() {
    if (page != 1) setPage((prev: any) => prev - 1);
  }

  function decrement() {
    if (data.length > 0) setPage((prev: any) => prev + 1);
  }

  return (
    <div
      className={
        "m-10 mt-0 flex w-full flex-col gap-2 transition-all duration-200" +
        (isSm ? " mr-0 items-center" : " mr-40") +
        (filtersOpen ? " ml-[20rem]" : !isSm ? " ml-[5rem]" : " ml-0")
      }
    >
      {(Array.isArray(data) &&
        data.length > 0 &&
        data.map((product: any) => (
          <ProductPreview
            key={product.id}
            product={product}
            type="search-page"
          />
        ))) || (
        <div className="flex h-fit w-[30rem] max-w-full gap-2">
          <div
            className={`
      relative flex w-[40rem] max-w-full bg-neutral-200
      p-8 shadow-[3px_3px_10px_1px_#00000060] transition-all 
      duration-200 hover:shadow-[0_0_12px_2px_#00000060] 
      hover:brightness-105 dark:bg-neutral-900 dark:hover:brightness-110
      ${isSm ? "rounded-xl" : "rounded-2xl"}
      `}
          >
            <h1 className="text-center text-lg">
              There are no items matching your search...
            </h1>
          </div>
        </div>
      )}
      <div className="mb-20 mt-4 flex w-[30rem] max-w-full flex-row items-center justify-center">
        <div className="group relative flex w-fit cursor-pointer items-center justify-center">
          <div className="pointer-events-none absolute left-0 right-0 bottom-0 top-0 m-auto aspect-square w-14 rounded-full bg-black opacity-20 transition-all duration-200 group-hover:opacity-30 dark:bg-white" />
          <button
            onClick={increment}
            className="aspect-square w-14 font-logo text-3xl"
          >
            {page != 1 && "-"}
          </button>
        </div>
        <span className="inline w-14 text-center align-middle font-logo text-3xl">
          {page}
        </span>
        <div className="group relative flex w-fit cursor-pointer items-center justify-center">
          <div className="pointer-events-none absolute left-0 right-0 bottom-0 top-0 m-auto aspect-square w-14 rounded-full bg-black opacity-20 transition-all duration-200 group-hover:opacity-30 dark:bg-white" />
          <button
            onClick={decrement}
            className="aspect-square w-14 font-logo text-3xl"
          >
            {data.length > 0 && "+"}
          </button>
        </div>
      </div>
    </div>
  );
}
