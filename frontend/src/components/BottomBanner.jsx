import React from "react";
import { assets, features } from "../assets/assets";

const BottomBanner = () => {
  return (
    <div className="mt-25 relative">
      <img
        src={assets.bottom_banner_image}
        alt="bottom banner"
        className="w-full hidden md:block "
      />

      <img
        src={assets.bottom_banner_image_sm}
        alt="bottom banner"
        className="w-full md:hidden"
      />

      <div className="absolute inset-0 flex flex-col items-center md:items-end md:justify-center pt-16 md:0 md:pr-24">
        <div>
          <h1 className="text-2xl md:text-3xl text-primary font-medium">
            Why we are best?
          </h1>
          {features.map((feature, index) => (
            <div className="flex items-center  gap-4 mt-2" key={index}>
              <img
                className="md:w-11 w-9"
                src={feature.icon}
                alt="feature icon"
              />
              <div>
                <h3 className="text-lg md:text-xl font-semibold">
                  {feature.title}
                </h3>
                <p className="text-gray-500/70">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BottomBanner;
