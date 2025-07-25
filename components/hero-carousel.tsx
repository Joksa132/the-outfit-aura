"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    image: "",
    title: "Slide 1 title",
    subtitle: "Slide 1 subtitle",
    description: "Slide 1 description",
    buttonText: "Slide 1 button",
    buttonLink: "/category/slide1",
  },
  {
    id: 2,
    image: "",
    title: "Slide 2 title",
    subtitle: "Slide 2 subtitle",
    description: "Slide 2 description",
    buttonText: "Slide 2 button",
    buttonLink: "/category/slide2",
  },
  {
    id: 3,
    image: "",
    title: "Slide 3 title",
    subtitle: "Slide 3 subtitle",
    description: "Slide 3 description",
    buttonText: "Slide 3 button",
    buttonLink: "/category/slide3",
  },
];

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) & slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="h-[70vh]">
      <div className="h-full relative">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={slide.image || "/placeholder.svg"}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white space-y-6 px-4 max-w-4xl">
                <p className="text-lg md:text-xl font-medium uppercase">
                  {slide.subtitle}
                </p>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-heading">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl max-w-2xl mx-auto">
                  {slide.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="text-lg px-8 py-3 bg-white text-black hover:bg-gray-100"
                  >
                    {slide.buttonText}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-black bg-transparent"
                  >
                    View All
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover-bg-white/30 text-white p-2 rounded-full transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>
      <Button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover-bg-white/30 text-white p-2 rounded-full transition-colors"
      >
        <ChevronRight className="w-6 h-6" />
      </Button>
    </div>
  );
}
