"use client"

import { useRouter } from "next/navigation"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSearchContext } from "@/src/contexts/search-provider";

export default function SearchBar({ placeholder }: { placeholder: string }) {
    const router = useRouter();
    const { searchInput, setSearchInput, toggleDialog } = useSearchContext();
    return (
        <form 
            className="flex"
            onSubmit={(e) => {
                e.preventDefault();
        
                const params = new URLSearchParams();
                if (searchInput) {
                    params.set("q", searchInput);
                } else {
                    params.delete("q");
                }
                router.push(`/search?${params.toString()}`);
                toggleDialog(false);
            }}
        >
            <input
                required
                placeholder={placeholder}
                className="p-2 bg-foreground/10"
                onChange={(e) => {
                    setSearchInput(e.target.value);
                }}
                value={searchInput}
            >
            </input>
            <button className="cursor-pointer p-2 bg-foreground text-background">
                <MagnifyingGlassIcon aria-hidden="true" className="size-5 stroke-2" />
            </button>
        </form>
    )
}