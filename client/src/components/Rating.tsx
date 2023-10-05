import { useState } from "react";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function Rating({ rating }: { rating?: number }) {
  const [hover, setHover] = useState(false);

  async function handleMouseOver(index: number) {
    setHover(true);
    await sleep(0);
    const stars = document.querySelectorAll(".ratings-container .star");
    for (let i = 0; i < stars.length; i++) {
      const star = stars[i];
      if (i <= index - 1) {
        for (let elem of star.children) {
          elem.classList.remove("fill-gray-400");
          elem.classList.add("fill-yellow-400");
        }
      } else {
        for (let elem of star.children) {
          elem.classList.remove("fill-yellow-400");
          elem.classList.add("fill-gray-400");
        }
      }
    }
  }

  async function handleMouseLeave() {
    setHover(false);
    await sleep(0);
    const stars = document.querySelectorAll(".ratings-container .star");
    for (let i = 0; i < stars.length; i++) {
      for (let elem of stars[i].children)
        elem.classList.remove("fill-yellow-400", "fill-gray-400");
    }
  }

  if (rating) {
    return (
      <div className="ratings-container flex gap-1">
        {(() => {
          let state: "full" | "half" | "empty";
          const stars = [];
          for (let i = 0; i < 5; i++) {
            if (rating >= i + 0.2 && rating <= i + 0.8) state = "half";
            else if (rating >= i + 0.8) state = "full";
            else state = "empty";
            stars.push(
              <Star
                key={i}
                state={state}
                index={i}
                handleMouseOver={handleMouseOver}
                handleMouseLeave={handleMouseLeave}
                hover={hover}
              />
            );
          }
          return stars;
        })()}
      </div>
    );
  } else {
    return (
      <div className="ratings-container flex gap-1">
        {(() => {
          const stars = [];
          for (let i = 1; i < 6; i++)
            stars.push(
              <Star
                key={i}
                state="empty"
                index={i}
                handleMouseOver={handleMouseOver}
                handleMouseLeave={handleMouseLeave}
                hover={hover}
              />
            );
          return stars;
        })()}
      </div>
    );
  }
}

function Star({
  state,
  index,
  handleMouseOver,
  handleMouseLeave,
  hover,
}: {
  state: "empty" | "full" | "half";
  index: number;
  handleMouseOver: (index: number) => void;
  handleMouseLeave: () => void;
  hover: boolean;
}) {
  return (
    <svg
      className="star w-8 cursor-pointer transition-all duration-200 hover:scale-125"
      viewBox="0 0 96 91"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onMouseOver={() => handleMouseOver(index)}
      onMouseLeave={handleMouseLeave}
    >
      <path
        d="M77.3893 90.4509L48 69.0983V0L59.2257 34.5491H95.5529L66.1636 55.9017L77.3893 90.4509Z"
        className={`transition-all duration-200 ${
          hover ? "" : state === "empty" ? "fill-gray-300" : "fill-yellow-300"
        }`}
      />
      <path
        d="M18.6107 90.4509L48 69.0983V0L36.7743 34.5491H0.447144L29.8364 55.9017L18.6107 90.4509Z"
        className={`transition-all duration-200 ${
          hover ? "" : state === "full" ? "fill-yellow-300" : "fill-gray-300"
        }`}
      />
    </svg>
  );
}
