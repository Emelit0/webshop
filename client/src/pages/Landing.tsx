import { Link } from "react-router-dom";
import Carousel from "../components/Carousel";

export default function LandingPage() {
  return (
    <main className="flex grow flex-col items-center">
      <Link
        to="/search"
        className="
        my-20 rounded-2xl bg-brick-red py-6 px-10 
        font-display text-4xl font-semibold text-white 
        shadow-[0_0_5px_1px_#00000080] transition-all duration-200 hover:scale-105 
        hover:shadow-[0_0_10px_1px_#00000050] hover:brightness-110
        "
      >
        Get Started
      </Link>
      <Carousel images={["electronics.jpg", "clothing.jpg", "glassware.jpg"]} />
    </main>
  );
}
