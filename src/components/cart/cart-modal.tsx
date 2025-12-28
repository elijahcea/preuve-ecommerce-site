'use client'

import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from '@headlessui/react'
import { useEffect, useState } from "react";
import { useCartContext } from "@/src/contexts/cart-provider";
import { createCartAndSetCookie } from "@/src/actions/cart";
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import Price from '../price';
import EditItemQuantityBtn from './edit-item-quantity-btn';

export default function CartModal() {
    const { cart } = useCartContext();
    const [isOpen, setIsOpen] = useState(false);

    const locale = "en-US";
    const currency = "USD";

    useEffect(() => {
      if (!cart) {
        createCartAndSetCookie();
      }
    }, [cart]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative cursor-pointer rounded-md px-2.5 py-1.5 text-sm font-semibold transition-bg ease-in-out duration-250 text-gray-900 hover:bg-gray-950/10"
      >
        <ShoppingCartIcon aria-hidden="true" className="size-6" />
        {!cart?.totalQuantity ? <></> : <div className='absolute bottom-5 left-6 bg-foreground rounded-full h-4 w-4 text-background text-xs'>{cart?.totalQuantity}</div> }
      </button>
      <Dialog open={isOpen} onClose={setIsOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity duration-250 ease-in-out data-closed:opacity-0"
        />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <DialogPanel
                transition
                className="pointer-events-auto w-screen max-w-md transform transition duration-250 ease-in-out data-closed:translate-x-full sm:duration-350"
              >
                <div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl">
                  <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                    <div className="flex items-start justify-between">
                      <DialogTitle className="text-lg font-medium text-gray-900">CART</DialogTitle>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          onClick={() => setIsOpen(false)}
                          className="cursor-pointer relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                        >
                          <span className="absolute -inset-0.5" />
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon aria-hidden="true" className="size-6" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-8">
                      <div className="flow-root">
                        {cart?.items.length === 0 ?
                            <div className='flex flex-col justify-center items-center gap-1'>
                                <ShoppingCartIcon aria-hidden="true" className="size-8 text-gray-900" />
                                <p className='font-bold text-gray-900'>Your cart is empty</p> 
                            </div>
                            : 
                            <ul role="list" className="-my-6 divide-y divide-gray-200">
                                {cart?.items.map((item) => (
                                    <li key={item.merchandise.id} className="flex py-6">
                                        {item.merchandise.image?.url ? (
                                            <div className="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                <Image alt={item.merchandise.image.altText || item.merchandise.name} src={item.merchandise.image.url} className="size-full object-cover" />
                                            </div>  
                                        ) : <></>}

                                        <div className="ml-4 flex flex-1 flex-col">
                                            <div>
                                              <div className="flex justify-between text-base font-medium text-gray-900">
                                                  <h3>
                                                    <Link href={item.merchandise.href} onNavigate={() => setIsOpen(false)}>{item.merchandise.name}</Link>
                                                  </h3>
                                                  <div className='flex gap-2.5 text-lg'>
                                                    <EditItemQuantityBtn item={item} action="minus" />
                                                    <p className='text-base'>{item.quantity}</p>
                                                    <EditItemQuantityBtn item={item} action="plus" />
                                                  </div>
                                              </div>
                                              <p className="mt-1 text-sm text-gray-500">
                                                {item.merchandise.selectedOptions.map(so => so.value).join(" / ")}
                                              </p>
                                          </div>
                                          <div className="flex flex-1 items-end justify-between text-sm">
                                            <Price locale={locale} currency={currency} amount={item.totalCost} styles={["text-gray-900"]} />
                                            <div className="flex">
                                                <EditItemQuantityBtn item={item} action='delete' />
                                            </div>
                                          </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        }
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <p>Subtotal</p>
                      <Price locale={locale} currency={currency} amount={cart?.cost.totalCost || 0} />
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                    <div className="mt-6">
                      <a
                        href="#"
                        className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-xs hover:bg-indigo-700"
                      >
                        Checkout
                      </a>
                    </div>
                    <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                      <p>
                        <button
                          type="button"
                          onClick={() => setIsOpen(false)}
                          className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          Continue Shopping
                          <span aria-hidden="true"> &rarr;</span>
                        </button>
                      </p>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  )
}