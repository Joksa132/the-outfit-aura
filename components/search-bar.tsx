"use client";

import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const encodedQuery = encodeURIComponent(searchQuery);

    router.push(`/search?query=${encodedQuery}`);
    setSearchQuery("");
  };

  return (
    <form onSubmit={handleSearch} className="relative flex-1">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search products..."
        className="pl-8"
      />
    </form>
  );
}
