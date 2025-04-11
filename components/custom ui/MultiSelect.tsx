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
  items: { _id: string; title: string }[]; 
  value: string[];
  onChange: (value: string[]) => void; // Recibe un array de IDs seleccionados
  onRemove: (value: string) => void; // Recibe el ID a eliminar
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  placeholder,
  items, 
  value,
  onChange,
  onRemove,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);

  // Filtrar los elementos seleccionados
  const selected = value
    .map((id) => items.find((item) => item._id === id))
    .filter(Boolean) as { _id: string; title: string }[];

  // Filtrar los elementos que aún no están seleccionados
  const selectables = items.filter((item) => !value.includes(item._id));

  return (
    <Command className="overflow-visible bg-white">
      <div className="flex gap-1 flex-wrap border rounded-md p-2">
        {selected.map((item) => (
          <Badge key={item._id}>
            {item.title}
            <button
              type="button"
              className="ml-1 hover:text-red-1"
              onClick={() => onRemove(item._id)}
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
            {selectables.map((item) => (
              <CommandItem
                key={item._id}
                onMouseDown={(e) => e.preventDefault()}
                onSelect={() => {
                  // Asegúrate de que no haya duplicados y actualiza el estado de forma inmutable
                  const updatedValue = [...new Set([...value, item._id])];
                  onChange(updatedValue); // Pasa el array actualizado al componente padre
                  setInputValue("");
                }}
                className="hover:bg-grey-2 cursor-pointer"
              >
                {item.title}
              </CommandItem>
            ))}
          </CommandList>
        )}
      </div>
    </Command>
  );
};

export default MultiSelect;