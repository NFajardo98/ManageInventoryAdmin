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

interface MultiSelectWithQuantityProps {
  placeholder: string;
  items: { _id: string; title: string; unit: string }[]; // Incluye la unidad del ingrediente
  value: { ingredientId: string; quantity: number }[];
  onChange: (value: { ingredientId: string; quantity: number }[]) => void;
  onRemove: (ingredientId: string) => void;
}

const MultiSelectWithQuantity: React.FC<MultiSelectWithQuantityProps> = ({
  placeholder,
  items,
  value,
  onChange,
  onRemove,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);

  // Filtrar los elementos seleccionados
  const selected = value.map((v) => ({
    ...v,
    ...items.find((item) => item._id === v.ingredientId),
  }));

  // Filtrar los elementos que aún no están seleccionados
  const selectables = items.filter(
    (item) => !value.some((v) => v.ingredientId === item._id)
  );

  return (
    <Command className="overflow-visible bg-white">
      <div className="flex gap-1 flex-wrap border rounded-md p-2">
        {selected.map((item) => (
          <Badge key={item.ingredientId}>
            {item.title} ({item.quantity} {item.unit})
            <button
              type="button"
              className="ml-1 hover:text-red-1"
              onClick={() => onRemove(item.ingredientId)}
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
                  const updatedValue = [
                    ...value,
                    { ingredientId: item._id, quantity: 1 }, // Cantidad inicial predeterminada
                  ];
                  onChange(updatedValue);
                  setInputValue("");
                }}
                className="hover:bg-grey-2 cursor-pointer"
              >
                {item.title} ({item.unit})
              </CommandItem>
            ))}
          </CommandList>
        )}
      </div>

      {/* Campo para ajustar la cantidad */}
      {selected.map((item) => (
        <div key={item.ingredientId} className="flex items-center gap-2 mt-2">
          <p className="text-sm">{item.title}:</p>
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={item.quantity || 0}
            onChange={(e) => {
              const updatedValue = value.map((v) =>
                v.ingredientId === item.ingredientId
                  ? { ...v, quantity: parseFloat(e.target.value) }
                  : v
              );
              onChange(updatedValue);
            }}
            className="border border-gray-300 rounded-md p-1 w-20"
          />
          <span className="text-sm">{item.unit}</span>
        </div>
      ))}
    </Command>
  );
};

export default MultiSelectWithQuantity;