"use client";

import Link from "next/link"
import SearchBar from "@/src/components/search-bar"
import CartModal from "@/src/components/cart/cart-modal"
import { Popover, PopoverButton, PopoverPanel, PopoverBackdrop, CloseButton } from "@headlessui/react"
import { Collection } from "../generated/prisma/client";
import { use } from "react";

export default function NavBar({ collectionsPromise }: { collectionsPromise: Promise<Collection[] | undefined> }) {
    const collections = use(collectionsPromise);
    return (
        <header className="border-b-[#e5e5e5] border-b">
            <div className="grid grid-cols-3 p-4 items-center">
                <nav>
                    <ul className="flex gap-2 font-semibold">
                        {!collections ? 
                            <p>Error fetching collections.</p> 
                            :
                            <Popover className="relative">
                                <PopoverButton className="border-b border-b-transparent cursor-pointer focus:outline-none data-active:border-b-inherit data-focus:outline data-hover:border-b-inherit">
                                    SHOP
                                </PopoverButton>
                                <PopoverPanel 
                                    transition
                                    anchor={{ to: "top start", gap: "4px" }}
                                    className="w-full bg-background text-sm/6 border-b border-b-[#e5e5e5] shadow-md transition duration-200 ease-in-out data-open:z-50 data-closed:-translate-y-1 data-closed:opacity-0"
                                >
                                    <div className="flex flex-col items-start gap-3 p-4">
                                        {collections.map(collection => 
                                            <CloseButton
                                                as={Link} 
                                                key={collection.slug} 
                                                href={`/collections/${collection.slug}`}
                                                className="border-b border-b-transparent hover:border-b-inherit"
                                            >
                                                {collection.name}
                                            </CloseButton>
                                        )}                                    
                                    </div>
                                </PopoverPanel>
                            </Popover>                    
                        }
                        <Link href="/lookbooks" className="border-b border-b-transparent hover:border-b-inherit">
                            LOOKBOOKS
                        </Link>
                        <Link href="/about" className="border-b border-b-transparent hover:border-b-inherit">
                            ABOUT
                        </Link>
                    </ul>
                </nav>
                <Link href="/" className="place-items-center">
                    <h1 className="font-semibold text-xl">PREUVE NEW YORK</h1>
                </Link>              
                <nav className="place-items-end">
                    <ul>
                        <SearchBar />
                        <CartModal />
                    </ul>
                </nav>
            </div>
        </header>
    )
}