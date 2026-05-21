import menu_1 from "@/assets/images/menu_1.jpg";
import menu_2 from "@/assets/images/menu_2.jpg";
import menu_3 from "@/assets/images/menu_3.jpg";
import menu_4 from "@/assets/images/menu_4.webp";
import menu_5 from "@/assets/images/menu_5.jpg";
import menu_6 from "@/assets/images/menu_6.webp";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Autoplay } from "swiper/modules"; // Import Autoplay
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import "swiper/css";
import "swiper/css/effect-cards";

export const Home = () => {
  const navigate = useNavigate();

  // Array of menu images
  const slides = [menu_1, menu_2, menu_3, menu_4, menu_5, menu_6];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/30">
      <div className="container mx-auto grid min-h-[calc(100vh-4rem)] items-center gap-10 py-10 md:grid-cols-[1.1fr_0.9fr]">
        <section className="flex flex-col items-start">
          <p className="mb-3 text-sm font-medium text-muted-foreground">
            Menu builder and print export
          </p>
          <h2 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
            Build printable menus from structured data.
          </h2>

          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground md:text-lg">
            Create professional menus, preview changes as you edit, and export
            an A4 PDF when the menu is ready.
          </p>

          <Button
            onClick={() => navigate("/my-menus")}
            size="lg"
            className="mt-7 w-full md:w-auto"
          >
            Generate Now
            <ArrowRight className="h-4 w-4" />
          </Button>
        </section>

        <Card className="border bg-background/80">
          <CardContent className="pt-6">
            <Swiper
              effect={"cards"}
              grabCursor={true}
              modules={[EffectCards, Autoplay]}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              className="mySwiper"
            >
              {slides.map((img, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={img}
                    alt={`Menu ${index + 1}`}
                    className="h-full w-full rounded-md object-cover shadow-lg"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
