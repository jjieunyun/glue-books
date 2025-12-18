'use client';

import type { RefObject } from 'react';
import type { Option } from '../SelectOption';

interface DropdownProps {
    options: Option[];
    isOpen: boolean;
    disabled?: boolean;
    openUpward?: boolean;
    selectedValue?: string | number | null | boolean;
    onSelect: (value: string | number | null | boolean) => void;
    selectedItemRef?: RefObject<HTMLLIElement | null>;
    header?: React.ReactNode;
}

export default function Dropdown({
    options,
    isOpen,
    disabled = false,
    openUpward = false,
    selectedValue,
    onSelect,
    selectedItemRef,
    header,
}: DropdownProps) {
    if (!isOpen || disabled) return null;

    return (
        <ul
            className={`absolute z-50 max-h-[200px] w-max min-w-full overflow-auto scrollbar-hide rounded-xl bg-white ${openUpward ? 'bottom-full mb-2' : 'mt-2'} shadow-lg border border-brand-100 ring-1 ring-black/5`}
        >
            {header}
            <div className="py-2">
                {options.map((option, idx) => {
                    const isSelected = selectedValue === option.value;
                    const isDisabled = option?.disabled === true;

                    return (
                        <li
                            key={idx}
                            ref={isSelected ? selectedItemRef : null}
                            className={`rounded-lg px-4 py-2 text-sm transition-colors ${isSelected ? 'bg-brand-100 font-medium text-brand-900' : 'bg-white hover:bg-brand-50 text-brand-800'} ${isDisabled ? 'cursor-not-allowed text-brand-300' : 'cursor-pointer'}`}
                            onClick={(e) => {
                                if (isDisabled) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    return;
                                }
                                onSelect(option.value);
                            }}>
                            {option.label}
                        </li>
                    );
                })}
            </div>
        </ul>
    );
}
