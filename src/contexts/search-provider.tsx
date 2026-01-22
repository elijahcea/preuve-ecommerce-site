"use client";

import { useSearchParams } from "next/navigation";
import { createContext, useContext, useState } from "react";

type SearchContextType = {
  searchInput: string | undefined;
  isDialogOpen: boolean;
  setSearchInput: (input: string) => void;
  toggleDialog: (isOpen: boolean) => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export default function SearchProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(
    searchParams.get("q")?.toString(),
  );

  const context: SearchContextType = {
    searchInput,
    isDialogOpen: isOpen,
    setSearchInput,
    toggleDialog: setIsOpen,
  };

  return <SearchContext value={context}>{children}</SearchContext>;
}

export function useSearchContext() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
