import React, { FC, useRef, useState } from "react";
import { Button } from "../ui/Button";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";

interface DropdownMenuProps {
    onSelect: (isSuggestion: boolean) => void;
    isSuggestionMode: boolean;
    disabled?: boolean;
}

export const HighlightDropDown: FC<DropdownMenuProps> = ({
    onSelect,
    isSuggestionMode,
    disabled,
}) => {
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [isOpen, setIsOpen] = useState<boolean>(false);

    useOnClickOutside(dropdownRef, () => {
        setIsOpen(false);
    });

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" 
                    disabled={disabled}
                    onClick={() => setIsOpen(true)
                    }
                    id="menu-button" aria-expanded="true" aria-haspopup="true"
                >
                <div className="text-sm font-semibold text-gray-900">
                    {isSuggestionMode ? "Suggestion " : "View"}
                </div> 
                <svg className="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                    <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                </svg>
            </Button>
            {isOpen &&
                <div className="absolute left-0 z-10 mt-2 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none" 
                role="menu" aria-orientation="vertical" aria-labelledby="menu-button" id="dropdown-menu">
                    <div className="py-1" role="none">
                    <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700"
                        onClick={() => {
                            onSelect(false);
                            setIsOpen(false);
                        }}
                        role="menuitem"
                        id="menu-item-0">
                        Suggestion
                    </a>
                    <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700"
                        onClick={() => {
                            onSelect(true);
                            setIsOpen(false);
                        }}
                        role="menuitem"
                        id="menu-item-1"
                        >
                        View
                    </a>
                </div>
            </div> }
        </div>
    )
}