'use client'

import { useSearchParams } from "next/navigation";
import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";

interface ProductStateType {
    [key: string]: string
}

interface ProductContextType {
    state: ProductStateType
    updateOption: (name: string, value: string) => ProductStateType
    updateURL: (newState: ProductStateType) => void
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export default function ProductProvider({ children }: { children: React.ReactNode }) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const getInitialState = () => {
        const params: ProductStateType = {};
        for (const [key, value] of searchParams.entries()) {
        params[key] = value;
        }
        return params;
    };

    const [productState, setProductState] = useState(getInitialState());

    const updateOption = (name: string, value: string) => {
        const updatedOption = { [name]: value };
        const newState = { ...productState, ...updatedOption }
        setProductState(newState);
        return newState;
    };

    const updateURL = (newState: ProductStateType) => {
        const params = new URLSearchParams(window.location.search);
        Object.entries(newState).forEach(([key, value]) => {
            params.set(key, value);
        });
        router.push(`?${params.toString()}`, { scroll: false });
    };

    const context: ProductContextType = {
        state: productState,
        updateOption,
        updateURL,
    }

    return (
        <ProductContext.Provider value={context}>{children}</ProductContext.Provider>
    )
}

export function useProductContext() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
}