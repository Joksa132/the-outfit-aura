"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const slides = [
  {
    id: 1,
    image: "/slider-img1.jpg",
    title: "Discover Our New Denim Collection",
    subtitle: "Effortless Style",
    description:
      "From classic fits to modern cuts, find your perfect pair of jeans designed for comfort and durability.",
    buttonText: "Shop Jeans",
    buttonLink: "/category/jeans",
  },
  {
    id: 2,
    image: "/slider-img2.jpg",
    title: "The Modern Polo: Redefined",
    subtitle: "Timeless Comfort",
    description:
      "Experience the perfect blend of casual comfort and refined style with our latest polo designs.",
    buttonText: "Explore Polos",
    buttonLink: "/category/polos",
  },
  {
    id: 3,
    image: "/slider-img3.jpg",
    title: "Master Your Wardrobe: Essential Shirts",
    subtitle: "Sharp Looks",
    description:
      "Find versatile shirts for every occasion, crafted from premium fabrics for a flawless fit.",
    buttonText: "Find Your Shirt",
    buttonLink: "/category/shirts",
  },
];

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
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
    <div className="h-[70vh] relative">
      <div className="h-full relative">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 -z-10"
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
                <div className="flex gap-4 justify-center">
                  <Link href={slide.buttonLink} passHref>
                    <Button
                      size="lg"
                      className="text-lg px-8 py-3 bg-white text-black hover:bg-gray-100"
                    >
                      {slide.buttonText}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover-bg-white/30 text-white p-2 rounded-full transition-colors z-20"
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>
      <Button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover-bg-white/30 text-white p-2 rounded-full transition-colors z-20"
      >
        <ChevronRight className="w-6 h-6" />
      </Button>
    </div>
  );
}
