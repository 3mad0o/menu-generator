import React from "react";
import logo from "@/assets/images/logo.png";
export const Header = () => {
  return (
    <header className="h-[70px] bg-white right-0  flex flex-row justify-center items-center ">
      <div className="container">
        <div className="flex flex-row items-center gap-[15px]">
          <img className="w-[75px]" src={logo} alt="" />
          <h1>{`Menu Generator`}</h1>
        </div>
      </div>
    </header>
  );
};
