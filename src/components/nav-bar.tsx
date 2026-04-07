"use client";

import Link from "next/link";
import SearchModal from "@/src/components/search/search-modal";
import CartModal from "@/src/components/cart/cart-modal";
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  PopoverBackdrop,
  CloseButton,
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
} from "@headlessui/react";
import { use, useState } from "react";
import { CollectionPreview } from "../lib/types";
import { XMarkIcon, Bars3Icon } from "@heroicons/react/24/outline";

export default function NavBar({
  collectionsPromise,
}: {
  collectionsPromise: Promise<CollectionPreview[] | null>;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const collections = use(collectionsPromise);
  return (
    <header className="border-b-[#e5e5e5] border-b grid grid-cols-[1fr_2fr_1fr] px-4 py-1 items-center min-h-16">
      <nav className="md:hidden">
        <button
          onClick={() => setIsOpen(true)}
          className="relative cursor-pointer transition-opacity ease-in-out duration-250 text-foreground hover:opacity-60 align-middle"
        >
          <Bars3Icon className="size-7" />
        </button>
        <Dialog open={isOpen} onClose={setIsOpen} className="relative z-15">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-500/75 transition-opacity duration-250 ease-in-out data-closed:opacity-0"
          />

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10 sm:pr-16">
                <DialogPanel
                  transition
                  className="pointer-events-auto w-screen max-w-64 transform transition duration-250 ease-in-out data-closed:-translate-x-full sm:duration-350"
                >
                  <div className="flex h-full flex-col overflow-y-auto bg-background shadow-xl">
                    <div className="flex-1 overflow-y-auto">
                      <div className="flex items-start justify-between py-4 px-2 border-b border-foreground/10">
                        <div className="flex h-7 items-center">
                          <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="cursor-pointer relative p-2 text-gray-400 hover:text-gray-500"
                          >
                            <XMarkIcon aria-hidden="true" className="size-6" />
                          </button>
                        </div>
                      </div>

                      <nav className="divide-y divide-foreground/10">
                        <div className="p-4">
                          <h2 className="font-semibold pb-2">SHOP</h2>
                          <ul className="flex flex-col gap-4">
                            {collections?.map((collection) => (
                              <CloseButton
                                as={Link}
                                key={collection.id}
                                href={`/collections/${collection.slug}`}
                              >
                                <li>{collection.title}</li>
                              </CloseButton>
                            ))}
                          </ul>
                        </div>
                        <div className="p-4">
                          <h2 className="font-semibold pb-2">INFO</h2>
                          <ul className="flex flex-col gap-4">
                            <CloseButton as={Link} href="/lookbooks">
                              Lookbooks
                            </CloseButton>
                            <CloseButton as={Link} href="/about">
                              About
                            </CloseButton>
                          </ul>
                        </div>
                      </nav>
                    </div>
                  </div>
                </DialogPanel>
              </div>
            </div>
          </div>
        </Dialog>
      </nav>

      <nav className="max-md:hidden">
        <ul className="flex gap-2 font-semibold">
          {!collections ? (
            <p>Error fetching collections.</p>
          ) : (
            <Popover className="relative">
              <PopoverButton className="border-b border-b-transparent cursor-pointer focus:outline-none data-active:border-b-inherit data-focus:outline data-hover:border-b-inherit">
                SHOP
              </PopoverButton>
              <PopoverPanel
                transition
                anchor={{ to: "top start", gap: "4px" }}
                className="w-full bg-background text-sm/6 border-b border-b-[#e5e5e5] shadow-md transition duration-200 ease-in-out data-closed:-translate-y-1 data-closed:opacity-0"
              >
                <div className="flex flex-col items-start gap-3 p-4">
                  {collections.map((collection) => (
                    <CloseButton
                      as={Link}
                      key={collection.slug}
                      href={`/collections/${collection.slug}`}
                      className="border-b border-b-transparent hover:border-b-inherit"
                    >
                      {collection.title}
                    </CloseButton>
                  ))}
                </div>
              </PopoverPanel>
            </Popover>
          )}
          <Link
            href="/lookbooks"
            className="border-b border-b-transparent hover:border-b-inherit"
          >
            LOOKBOOKS
          </Link>
          <Link
            href="/about"
            className="border-b border-b-transparent hover:border-b-inherit"
          >
            ABOUT
          </Link>
        </ul>
      </nav>
      <Link href="/" className="place-items-center">
        <h1 className="font-semibold text-xl">PREUVE NEW YORK</h1>
      </Link>
      <nav className="place-items-end">
        <ul className="flex align-middle gap-3 md:gap-6">
          <SearchModal />
          <CartModal />
        </ul>
      </nav>
    </header>
  );
}
