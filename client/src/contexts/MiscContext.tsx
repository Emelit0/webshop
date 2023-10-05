import { Context, createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import isEmptySearch from "../utils/isEmptySearch";

interface MiscContextI extends Context<{}> {
  cart: Product[];
  cartNumber: number;
  cartAddItem: (item: Product) => void;
  cartRemoveItem: (item: Product) => void;
  changeQuantity: (product: Product, number: number) => void;
  checkoutPrice: number;
  setCart: (cart: Product[]) => void;
  updateCartInfo: (cart: Product[]) => void;
  trashCart: () => void;
  isSm: boolean;
  isMd: boolean;
  toggleFilters: () => void;
  filtersOpen: boolean;
}

export type Product = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  description: string;
  images: string[];
  tags: string; //changes from array to string
  userId: number;
  createdAt: string;
  file?: File;
  category: string;
  imagesPath?: string[];
  ratings?: number[];
  ratingsAvg?: number;
};

const MiscContext = createContext({}) as MiscContextI;

export function MiscProvider({ children }: { children: JSX.Element }) {
  const [sm, setSm] = useState<boolean>(window.innerWidth < 1000);
  const [md, setMd] = useState<boolean>(window.innerWidth < 1200);
  const [filtersOpen, setFiltersOpen] = useState(!sm);
  const [cartNumber, setCartNumber] = useState<number>(0);
  const [cart, setCart] = useState<Product[]>([]);
  const [checkoutPrice, setCheckoutPrice] = useState<string>("0.00");
  const navigate = useNavigate();
  useEffect(() => {
    setCart(getCart());
  }, []);

  function resetCartNumber(passCart: Product[]) {
    let number = 0;
    for (let i = 0; i < passCart.length; i++) number += passCart[i].quantity;
    setCartNumber(number);
  }

  function getCheckoutPrice(passCart: Product[]) {
    let price = 0;
    for (let i = 0; i < passCart.length; i++) {
      price += passCart[i].price * passCart[i].quantity;
    }
    const split = price.toString().split(".");
    let dol, cen;
    if (split.length > 1) cen = split[1];
    else cen = "00";
    dol = split[0];
    const retPrice = dol + "." + cen;
    setCheckoutPrice(retPrice);
  }

  function updateCartInfo(passCart: Product[]) {
    resetCartNumber(passCart);
    getCheckoutPrice(passCart);
  }

  function getCart() {
    const stored = localStorage.getItem("cart");
    let newCart;
    if (stored) newCart = JSON.parse(stored);
    if (newCart) {
      newCart = newCart.filter(
        (item: Product) =>
          typeof item.quantity === "number" && item.quantity > 0
      );
      localStorage.setItem("cart", JSON.stringify(newCart));
      updateCartInfo(newCart);
      return newCart;
    }
    return [];
  }
  function cartAddItem(item: Product) {
    const cartItem = cart.find((cartItem) => cartItem.id === item.id) || null;
    changeQuantity(item, cartItem ? cartItem.quantity + 1 : 1);
  }

  function cartRemoveItem(id: number) {
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].id === id) {
        if (cart[i].quantity > 1) {
          cart[i].quantity -= 1;
          if (cart[i].quantity === 0) {
            setCart(cart.filter((item) => item.id !== Number(id)));
            localStorage.setItem("cart", JSON.stringify(cart));
            return;
          } else {
            setCart([...cart]);
            localStorage.setItem("cart", JSON.stringify(cart));
            return;
          }
        }
      }
    }
    setCart(cart.filter((item) => item.id !== Number(id)));
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function cartRemoveAllItem(id: number) {
    const newCart = cart.filter((item) => item.id !== Number(id));
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    updateCartInfo(newCart);
  }

  function changeQuantity(product: Product, quantity: number) {
    if (typeof quantity !== "number") return;
    if (quantity == 0) {
      cartRemoveAllItem(product.id);
      return;
    }
    const newCart: Product[] = [];
    let hasChanged = false;
    for (let i = 0; i < cart.length; i++) {
      newCart.push(cart[i]);
      if (cart[i].id === product.id) {
        newCart[i].quantity = quantity;
        hasChanged = true;
      }
      setCart([...newCart]);
      localStorage.setItem("cart", JSON.stringify([...newCart]));
      updateCartInfo([...newCart]);
    }
    if (!hasChanged) {
      product.quantity = quantity;
      newCart.push(product);
      setCart([...newCart]);
      localStorage.setItem("cart", JSON.stringify([...newCart]));
      updateCartInfo([...newCart]);
    }
  }

  function trashCart() {
    setCart([]);
    localStorage.setItem("cart", JSON.stringify([]));
    updateCartInfo([]);
    navigate("/search");
  }

  useEffect(() => {
    setSm(window.innerWidth < 1000);
    setMd(window.innerWidth < 1200);
    onresize = () => {
      setSm(window.innerWidth < 1000);
      setMd(window.innerWidth < 1200);
    };
    return () => {
      onresize = null;
    };
  }, []);

  function toggleFilters() {
    setFiltersOpen((prev) => !prev);
  }

  const value = {
    cart,
    cartAddItem,
    cartRemoveItem,
    changeQuantity,
    cartNumber,
    checkoutPrice,
    setCart,
    updateCartInfo,
    trashCart,
    isSm: sm,
    toggleFilters,
    filtersOpen,
    isMd: md,
  };

  return <MiscContext.Provider value={value}>{children}</MiscContext.Provider>;
}

export function useMisc() {
  return useContext(MiscContext) as MiscContextI;
}
