import React from "react";
import menu_1 from "@/assets/images/menu_1.jpg";
import menu_2 from "@/assets/images/menu_2.jpg";
import menu_3 from "@/assets/images/menu_3.jpg";
import menu_4 from "@/assets/images/menu_4.webp";
import menu_5 from "@/assets/images/menu_5.jpg";
import menu_6 from "@/assets/images/menu_6.webp";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Autoplay } from "swiper/modules"; // Import Autoplay
import "swiper/css";
import "swiper/css/effect-cards";

export const Home = () => {
  const navigate = useNavigate();

  // Array of menu images
  const slides = [menu_1, menu_2, menu_3, menu_4, menu_5, menu_6];

  return (
    <div className="h-screen mt-[90px] md:mt-0">
      <div className="container mx-auto flex flex-col md:flex-row items-center h-screen px-4">
        {/* Left Side */}
        <div className=" md:flex-1 flex flex-col justify-start md:justify-center items-start mb-[40px] md:mb-0">
          <h3 className="text-[20px] md:text-[20px] font-bold leading-tight text-black mb-[10px] md:mb-0">
            <span className="font-bold text-[40px] md:text-[90px] text-[#0c66ff]">
              menu generator
            </span>
            <br />
          </h3>

          <h5 className="mt-4 max-w-xl text-lg text-black/80">
            Create beautiful, professional menus in minutes. Easily generate{" "}
            <span className="font-bold text-[20px]">QR codes</span> for website
            preview and export your menus as{" "}
            <span className="font-bold text-[20px]">PDF</span> to print hard
            copies. Get started for free.
          </h5>

          <button
            onClick={() => navigate("/my-menus")}
            className="w-full md:w-auto bg-[#0c66ff] p-3 rounded-[6px] mt-6 cursor-pointer shadow-lg transition hover:bg-blue-700 text-white"
          >
            Generate Now
          </button>
        </div>

        {/* Right Side */}
        <div className="flex-1">
          <Swiper
            effect={"cards"}
            grabCursor={true}
            modules={[EffectCards, Autoplay]} // Add Autoplay
            autoplay={{ delay: 3000, disableOnInteraction: false }} // Move every 1 second
            className="mySwiper"
          >
            {slides.map((img, index) => (
              <SwiperSlide key={index}>
                <img
                  src={img}
                  alt={`Menu ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};
