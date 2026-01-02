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

  if (!options.length) {
    return null;
  }

  return (
    <div className='grid grid-cols-2 gap-3'>
      {options.map(option => {
        const optionNameLowerCase = option.name.toLowerCase();

        return (
          <fieldset key={option.name}>
            <legend>{option.name}</legend>
            <select
              required
              value={state[optionNameLowerCase] || ""} 
              className='w-full p-1 rounded-xs border border-transparent transition-border ease-in-out duration-250 hover:border-gray-400/50 bg-gray-400/15' 
              onChange={(e) =>{
                const newState = updateOption(optionNameLowerCase, e.target.value);
                updateURL(newState);
              }}
            >
              <option disabled value="">{`Select ${option.name}`}</option>
              {option.values.map(value => {
                return (
                  <option key={value} value={value}>
                    {value}
                  </option>
                )
              })}
            </select>
          </fieldset>
        )
      })}
    </div>
  )
}