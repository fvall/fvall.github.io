import { useState, useEffect } from "react";

export default function Burger() {
  const [burger, setBurger] = useState(0);

  useEffect(() => {
    const div = document.getElementsByClassName("burger");
    setBurger(div[0]);
  });

  return (
    <div
      className="burger"
      onClick={() => {
        burger.classList.toggle("active");
        showNav();
      }}
    >
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}

function showNav() {
  const burger = document.getElementsByClassName("burger")[0];
  const nav = document.getElementsByClassName("hidden-nav")[0];
  if ("active" in burger.classList) {
    if ("hidden" in nav.classList) {
      nav.classList.toggle("hidden");
    }
  } else {
    if (!("hidden" in nav.classList)) {
      nav.classList.toggle("hidden");
    }
  }
}
