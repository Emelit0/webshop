import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function useSearch(cleanQueryString: string, page: number) {
  const query = useQuery({
    queryKey: ["search", page, cleanQueryString],
    queryFn: () => fetchProducts(page, cleanQueryString),
  });
  return query;
}

async function fetchProducts(page: number, cleanQueryString: string) {
  try {
    const url = encodeURI(
      `${
        import.meta.env.VITE_API
        //need to update page number on pagination
      }/product/params?${cleanQueryString}`
    );
    console.log(url);
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.error(err);
    return [];
  }
}
