'use client';

import { useProductContext } from '../../contexts/product-provider';
import { ProductOption, ProductVariant } from '../../lib/types';

type Combination = {
  id: string;
  availableForSale: boolean;
  [key: string]: string | boolean;
};

export default function VariantSelector({
  options,
  variants
}: {
  options: ProductOption[]
  variants: ProductVariant[]
}) {
  const { state, updateOption, updateURL } = useProductContext();
  const hasNoOptionsOrJustOneOption =
    !options.length || (options.length === 1 && options[0]?.values.length === 1);

  if (hasNoOptionsOrJustOneOption) {
    return null;
  }

  return (
    <div>
      {options.map(option => {
        const optionNameLowerCase = option.name.toLowerCase();

        return (
          <fieldset key={option.name}>
            <legend>{option.name}</legend>
            {option.values.map(value => {
              const isActive = state[optionNameLowerCase] === value;

              return (
                <button
                  key={value}
                  onClick={() => {
                    const newState = updateOption(optionNameLowerCase, value);
                    updateURL(newState);
                  }}
                >
                  {isActive ? `Active! ${value}` : value }
                </button>
              )
            })}
          </fieldset>
        )
      })}
    </div>
  )
}