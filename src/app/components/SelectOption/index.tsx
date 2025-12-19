'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import useClickOutside from '../../hooks/useClickOutside';
import Dropdown from '../Dropdown';

function ChevronIcon({ className }: { className?: string }) {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function CloseIcon({ className }: { className?: string }) {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function getContainerClasses(opts: {
    disabled: boolean;
    theme: 'gray' | 'white';
    error: boolean;
    isDeletable: boolean;
    isSelected: boolean;
    variant?: 'default' | 'input';
}): string {
    const {
        disabled,
        theme,
        error,
        isDeletable,
        isSelected,
        variant = 'default',
    } = opts;

    if (disabled) {
        return 'cursor-not-allowed border border-glue-200 bg-glue-50 text-glue-300 font-medium';
    }

    if (error) {
        return 'border border-red-500 cursor-pointer text-glue-900 font-medium';
    }

    if (isDeletable) {
        return 'cursor-pointer bg-glue-100 border border-glue-300 text-glue-900 font-medium';
    }

    if (isSelected) {
        if (variant === 'input') {
            return 'bg-glue-50 cursor-pointer text-glue-900 font-medium';
        }
        return 'cursor-pointer bg-glue-100 border border-glue-300 text-glue-900 font-medium';
    }

    if (theme === 'gray') {
        return 'bg-glue-50 cursor-pointer text-glue-800 font-medium border border-transparent';
    }

    if (theme === 'white') {
        return 'bg-white cursor-pointer text-glue-800 border border-glue-200 font-medium';
    }

    return 'border border-glue-200 bg-white cursor-pointer text-glue-800 font-medium';
}

export interface Option {
    value: string | number | null | boolean;
    label: string | React.ReactNode;
    disabled?: boolean;
}

interface CustomSelectOptionProps {
    options: Option[];
    width?: string;
    height?: string;
    selectedOption: string | number | null | boolean;
    handleSelectOption: (option: string | number | null | boolean) => void;
    theme?: 'gray' | 'white';
    labelPrefix?: string;
    error?: boolean;
    className?: string;
    disabled?: boolean;
    placeholder?: string;
    useDeleteButton?: boolean;
    defaultOption?: Option;
    label?: string;
    defaultValue?: string | number | null | boolean;
    variant?: 'default' | 'input';
}

const getSelectedOption = ({
    options,
    selectedOption,
}: {
    options: Option[];
    selectedOption: string | number | null | boolean;
}) => options.find((item) => item.value === selectedOption);

export default function SelectOption({
    options = [],
    width = 'w-[200px]',
    height = 'h-10',
    error = false,
    selectedOption,
    handleSelectOption,
    theme = 'gray',
    labelPrefix,
    className = '',
    disabled = false,
    placeholder,
    useDeleteButton = false,
    defaultOption,
    label,
    defaultValue,
    ...props
}: CustomSelectOptionProps) {
    const { isOpen, setIsOpen, dropdownRef } = useClickOutside();
    const containerRef = useRef<HTMLDivElement>(null);
    const [openUpward, setOpenUpward] = useState(false);

    const [currentOption, setCurrentOption] = useState<Option | undefined>(
        getSelectedOption({ options, selectedOption }),
    );

    const toggleDropdown = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
        }
    };

    const selectedItemRef = useRef<HTMLLIElement>(null);

    const handleOptionClick = (value: string | number | null | boolean) => {
        const selected = getSelectedOption({ options, selectedOption: value });
        setCurrentOption(selected);
        handleSelectOption(value);
        setIsOpen(false);
    };

    useEffect(() => {
        const selected = getSelectedOption({ options, selectedOption });
        setCurrentOption(selected);
    }, [selectedOption, options]);

    useEffect(() => {
        if (isOpen && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const dropdownHeight = 200;
            const spaceBelow = window.innerHeight - rect.bottom;
            setOpenUpward(spaceBelow < dropdownHeight + 10);
        }
    }, [isOpen]);

    const resolvedDefaultValue = useMemo(() => {
        if (defaultValue !== undefined) return defaultValue;
        if (defaultOption) return defaultOption.value;
        if (options.length > 0) return options[0].value;
        return null;
    }, [defaultValue, defaultOption, options]);

    const isDeletable = useMemo(() => {
        if (!useDeleteButton) return false;
        const currentVal = currentOption?.value;
        if (currentVal === resolvedDefaultValue) return false;

        const isDefaultInOptions = options.some(
            (o) => o.value === resolvedDefaultValue,
        );
        if (currentVal === undefined && !isDefaultInOptions) return false;

        return true;
    }, [useDeleteButton, currentOption, resolvedDefaultValue, options]);

    const isSelectedValue = useMemo(() => {
        if (!currentOption) return false;
        if (defaultOption && currentOption.value === defaultOption.value)
            return false;
        return true;
    }, [currentOption, defaultOption]);

    return (
        <div
            {...props}
            ref={(el) => {
                dropdownRef.current = el as unknown as HTMLDivElement;
                containerRef.current = el;
            }}
            className={`relative ${width} ${className} min-w-[120px] select-none rounded-lg bg-transparent`}
        >
            <div
                className={`flex w-full items-center justify-between rounded-lg px-3 ${getContainerClasses(
                    {
                        disabled,
                        theme,
                        error,
                        isDeletable,
                        isSelected: isSelectedValue,
                        variant: props.variant,
                    },
                )} ${height}`}
                onClick={toggleDropdown}>
                <div className={`flex items-center overflow-hidden text-sm`}>
                    <span className="text-base font-medium text-glue-800 shrink-0">
                        {labelPrefix}
                    </span>
                    {label && (
                        <span className="mr-2 text-sm font-medium text-glue-800 shrink-0">
                            {label}
                        </span>
                    )}
                    <span
                        className={`truncate ${props.variant === 'default' ? 'font-medium' : 'font-medium ml-2'}`}>
                        {currentOption?.label || placeholder}
                    </span>
                </div>
                {isDeletable ? (
                    <button
                        type="button"
                        className="rounded-full bg-transparent p-1 transition-all duration-300 hover:bg-glue-200"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleOptionClick(resolvedDefaultValue);
                        }}>
                        <CloseIcon className="text-glue-800 cursor-pointer" />
                    </button>
                ) : (
                    <ChevronIcon
                        className={`text-glue-800 duration-300 ease-in-out cursor-pointer ${isOpen ? 'rotate-180 transform' : ''} ${disabled ? 'opacity-50' : ''}`}
                    />
                )}
            </div>

            <Dropdown
                options={options}
                isOpen={isOpen}
                disabled={disabled}
                openUpward={openUpward}
                selectedValue={currentOption?.value}
                onSelect={handleOptionClick}
                selectedItemRef={selectedItemRef}
            />
        </div>
    );
}
