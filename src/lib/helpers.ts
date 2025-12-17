import { SelectedOption } from "@/src/lib/types";

export function createProductHref(productSlug: string, selectedOptions: SelectedOption[]) {
    const searchParams = new URLSearchParams();
    for (const so of selectedOptions) {
        searchParams.set(so.name, so.value);
    }
    const queryString = selectedOptions.length === 0 ? "" : "?" + searchParams.toString();

    return `/products/${productSlug}` + queryString
}