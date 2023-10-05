import { useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CartIcon from "../assets/CartIcon";
import Logo from "../assets/Logo";
import SearchIcon from "../assets/SearchIcon";
import { useAuth } from "../contexts/AuthContext";
import { useMisc } from "../contexts/MiscContext";
import { toggleTheme } from "../utils/settings";

export default function Navbar() {
  const { isSm, toggleFilters } = useMisc();
  const location = useLocation();
  const [centerSearchBar, setCenterSearchBar] = useState();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isLoading } = useAuth();

  const handleSearch = () => {
    if (location.pathname.includes("/search")) {
      navigate(
        `/search${
          searchRef.current?.value ? "?q=" + searchRef.current.value : ""
        }`,
        { replace: true }
      );
      queryClient.clear();
    } else navigate(`/search?q=${searchRef.current?.value}`);
  };

  const toggleDrawer = () => {
    if (drawerOpen && drawerRef?.current) {
      drawerRef.current.classList.add("translate-x-full");
      drawerRef.current.ontransitionend = () => {
        setDrawerOpen(false);
      };
    } else {
      setDrawerOpen(true);
      setTimeout(() => {
        if (drawerRef?.current)
          drawerRef.current.classList.remove("translate-x-full");
      }, 100);
    }
  };

  if (isSm)
    return (
      <nav className="px-2">
        <ul className="flex items-center justify-between">
          <SearchIcon
            onClick={toggleDrawer}
            className="w-10 cursor-pointer transition-transform duration-200 hover:scale-110"
          />
          <Link
            to="/search"
            className="transition-all duration-200 hover:scale-105"
          >
            <Logo isSmall />
          </Link>
          <Link
            to="/checkout"
            className="relative transition-all duration-200 hover:scale-105"
          >
            <CartIcon className="w-16 cursor-pointer transition-transform duration-200 hover:scale-110" />
          </Link>
        </ul>
        {drawerOpen && (
          <div
            className={`
          flex min-w-[20em] translate-x-full gap-2 rounded-lg bg-white-bright 
          p-3 shadow-blue-200 ring-blue-200 transition-all 
          duration-200 focus-within:shadow-[0_0_10px_2px_#bfdbfe] 
          focus-within:ring-[2px] hover:scale-[101.5%] hover:shadow-[0_0_10px_2px_#bfdbfe] 
          focus:outline-none focus:ring-2 dark:bg-neutral-800 
          dark:focus-within:shadow-[0_0_5px_#bfdbfe] dark:focus-within:ring-1
          dark:hover:shadow-[0_0_10px_0px_#bfdbfe]
          `}
            ref={drawerRef}
          >
            <input
              className="w-full bg-transparent outline-none"
              type="text"
              ref={searchRef}
              placeholder="Search for something..."
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
          </div>
        )}
      </nav>
    );
  return (
    <nav className="flex h-16 items-center justify-between gap-4 p-1">
      <div className="flex h-full w-full items-center gap-6">
        <Link
          to="/search"
          className="group flex items-center justify-center font-logo text-4xl transition-transform duration-200 hover:scale-105"
        >
          <Logo />
        </Link>
        <div
          className={`
          flex min-w-[20em] gap-2 rounded-lg bg-white-bright p-3 
          shadow-blue-200 ring-blue-200 transition-all duration-200 
          focus-within:shadow-[0_0_10px_2px_#bfdbfe] focus-within:ring-[2px] 
          hover:scale-[101.5%] hover:shadow-[0_0_10px_2px_#bfdbfe] focus:outline-none 
          focus:ring-2 dark:bg-neutral-800 dark:focus-within:shadow-[0_0_5px_#bfdbfe] 
          dark:focus-within:ring-1 dark:hover:shadow-[0_0_10px_0px_#bfdbfe]
          ${centerSearchBar ? "hidden " : ""}`}
        >
          <SearchIcon
            className="w-6 cursor-pointer transition-transform duration-200 hover:scale-110"
            onClick={handleSearch}
          />
          <input
            className="w-full bg-transparent outline-none"
            type="text"
            ref={searchRef}
            placeholder="Search for something..."
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
        </div>
      </div>

      <div className="flex h-full items-center gap-6">
        {!isLoading && !user && (
          <Link
            to="/signin"
            className="w-14 cursor-pointer hover:text-blue-400 hover:underline"
          >
            Sign In?
          </Link>
        )}
        <button
          className="rounded-md border-[2.5px] border-black bg-black p-2 
          font-display font-medium text-white transition-all duration-150 
          hover:scale-105 hover:bg-white hover:text-black 
          dark:border-white dark:bg-white dark:text-black dark:hover:bg-black
          dark:hover:text-white"
          onClick={toggleTheme}
        >
          Theme
        </button>
        <Link to="/checkout" className="relative">
          <CartIcon className="w-16 transition-transform duration-200 hover:scale-110" />
        </Link>
      </div>
    </nav>
  );
}
