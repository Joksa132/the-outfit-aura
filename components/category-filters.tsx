"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Card, CardContent } from "./ui/card";
import { SlidersHorizontal } from "lucide-react";
import { Slider } from "./ui/slider";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

type CategoryFiltersProps = {
  availableColors: string[];
  availableSizes: string[];
  onFilterChange: (filters: {
    sortBy: string;
    selectedColors: string[];
    selectedSizes: string[];
    priceRange: [number, number];
  }) => void;
  initialMinPrice: number;
  initialMaxPrice: number;
};

export function CategoryFilters({
  availableColors,
  availableSizes,
  onFilterChange,
  initialMinPrice,
  initialMaxPrice,
}: CategoryFiltersProps) {
  const [sortBy, setSortBy] = useState<string>("name");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    initialMinPrice,
    initialMaxPrice,
  ]);

  useEffect(() => {
    onFilterChange({ sortBy, selectedColors, selectedSizes, priceRange });
  }, [sortBy, selectedColors, selectedSizes, priceRange, onFilterChange]);

  const handleColorChange = (color: string, checked: boolean) => {
    if (checked) {
      setSelectedColors([...selectedColors, color]);
    } else {
      setSelectedColors(selectedColors.filter((c) => c !== color));
    }
  };

  const handleSizeChange = (size: string, checked: boolean) => {
    if (checked) {
      setSelectedSizes([...selectedSizes, size]);
    } else {
      setSelectedSizes(selectedSizes.filter((s) => s !== size));
    }
  };

  return (
    <>
      <div className="mb-6">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="name">Name: A to Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <SlidersHorizontal className="w-4 h-4" />
              <h2 className="font-semibold">Filters</h2>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Price Range</h3>
                <div className="px-2">
                  <Slider
                    value={priceRange}
                    onValueChange={(value) =>
                      setPriceRange(value as [number, number])
                    }
                    min={initialMinPrice}
                    max={initialMaxPrice}
                    step={1}
                    className="mb-4"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Colors</h3>
                <div className="space-y-3">
                  {availableColors.map((color) => (
                    <div key={color} className="flex items-center space-x-2">
                      <Checkbox
                        id={`color-${color}`}
                        checked={selectedColors.includes(color)}
                        onCheckedChange={(checked) =>
                          handleColorChange(color, checked as boolean)
                        }
                      />
                      <Label htmlFor={`color-${color}`}>{color}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Sizes</h3>
                <div className="space-y-3">
                  {availableSizes.map((size) => (
                    <div key={size} className="flex items-center space-x-2">
                      <Checkbox
                        id={`size-${size}`}
                        checked={selectedSizes.includes(size)}
                        onCheckedChange={(checked) =>
                          handleSizeChange(size, checked as boolean)
                        }
                      />
                      <Label htmlFor={`size-${size}`}>{size}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
