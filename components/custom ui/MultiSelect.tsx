"use client";

import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { X } from "lucide-react";

interface MultiSelectProps {
  placeholder: string;
  collections: CollectionType[];
  value: string[];
  onChange: (value: string[]) => void; // ⬅ Receives an array instead of a single string
  onRemove: (value: string) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  placeholder,
  collections,
  value,
  onChange,
  onRemove,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);

  // Filter selected collections
  const selected = value
    .map((id) => collections.find((collection) => collection._id === id))
    .filter(Boolean) as CollectionType[];

  // Filter collections that are not yet selected
  const selectables = collections.filter(
    (collection) => !value.includes(collection._id)
  );

  return (
    <Command className="overflow-visible bg-white">
      <div className="flex gap-1 flex-wrap border rounded-md p-2">
        {selected.map((collection) => (
          <Badge key={collection._id}>
            {collection.title}
            <button
              type="button"
              className="ml-1 hover:text-red-1"
              onClick={() => onRemove(collection._id)}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}

        <CommandInput
          placeholder={placeholder}
          value={inputValue}
          onValueChange={setInputValue}
          onBlur={() => setOpen(false)}
          onFocus={() => setOpen(true)}
        />
      </div>

      <div className="relative mt-2">
        {open && (
          <CommandList className="absolute w-full z-30 top-0 overflow-auto border rounded-md shadow-md bg-white">
            {selectables.map((collection) => (
              <CommandItem
                key={collection._id}
                onMouseDown={(e) => e.preventDefault()}
                onSelect={() => {
                  // Asegúrate de que no haya duplicados y actualiza el estado de forma inmutable
                  const updatedValue = [...new Set([...value, collection._id])];
                  onChange(updatedValue); // Pasa el array actualizado al componente padre
                  setInputValue("");
                }}
                className="hover:bg-grey-2 cursor-pointer"
              >
                {collection.title}
              </CommandItem>
            ))}
          </CommandList>
        )}
      </div>
    </Command>
  );
};

export default MultiSelect;
