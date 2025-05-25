import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const MainBanner = () => {
  return (
    <div className="relative">
      {/* ....desktop-view-banner... */}
      <img
        className="w-full hidden md:block"
        src={assets.main_banner_bg}
        alt="desktop-banner"
      />
      {/* ....mobile-view-banner... */}
      <img
        className="w-full md:hidden "
        src={assets.main_banner_bg_sm}
        alt="mobile-banner"
      />

      <div className="absolute inset-0 flex flex-col items-center md:items-start justify-end md:justify-center pb-24 md:pb-0 md:pl-18 lg:pl-24">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center md:text-left max-w-72 md:max-w-80 lg:max-w-105 px-4 leading-tight lg:leading-15">
          Freshness You can Trust,Savings You will love!
        </h1>

        <div className="flex items-center mt-6 font-medium ">
          <Link
            to={"/products"}
            className="px-3 md:px-9 py-3 group flex items-center gap-2 bg-primary hover:bg-primary-dull transition rounded text-white cursor-pointer"
          >
            Shop Now{" "}
            <img
              className="md:hidden transition group-focus:translate-x-1"
              src={assets.white_arrow_icon}
              alt="arrow"
            />
          </Link>

          <Link
            to={"/explore-deals"}
            className="group hidden md:flex px-9 py-3 group items-center gap-2  rounded-[10px] text-black cursor-pointer"
          >
            Explore deals{" "}
            <img
              className="transition group-hover:translate-x-1"
              src={assets.black_arrow_icon}
              alt="arrow"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MainBanner;
