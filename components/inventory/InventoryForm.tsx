"use client";

import { Separator } from "../ui/separator";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Delete from "../custom ui/Delete";
import MultiSelect from "@/components/custom ui/MultiSelect"; // Asegúrate de importar MultiSelect
import { InventoryColumnType } from "@/lib/types/inventory";
import { SupplierType } from "@/lib/types/supplier"; // Asegúrate de importar el tipo SupplierType

// Creamos el schema para validar los datos del inventario
const formSchema = z.object({
  title: z.string().min(2).max(50), // Nombre del alimento
  quantity: z.number().min(1), // Cantidad mínima de 1
  unit: z.enum(["kilos", "grams", "units"]), // Validación de unidades
  description: z.string().optional(), // Descripción opcional
  supplier: z.array(
    z.object({
      _id: z.string(), // ID del proveedor
      title: z.string(), // Nombre del proveedor
    })
  ).min(1, "At least one supplier is required"), // Lista de proveedores
});

interface InventoryFormProps {
  initialData?: InventoryColumnType | null; // Must have question mark to make it optional
}

const InventoryForm: React.FC<InventoryFormProps> = ({ initialData }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<{ _id: string; title: string }[]>([]); // Estado para almacenar los suppliers

  // Función para cargar los suppliers desde la API
  const fetchSuppliers = async () => {
    try {
      const res = await fetch("/api/suppliers", { method: "GET" });
      const data = await res.json();
      setSuppliers(data);
    } catch (err) {
      console.error("[fetchSuppliers] ❌", err);
    }
  };

  useEffect(() => {
    fetchSuppliers(); // Cargar los suppliers al montar el componente
  }, []);

  // Configuración del formulario con validación de Zod
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          unit: ["kilos", "grams", "units"].includes(initialData.unit)
            ? (initialData.unit as "kilos" | "grams" | "units")
            : undefined, // Maneja valores no válidos
        }
      : {
          title: "",
          quantity: 0,
          unit: undefined,
          description: "",
          supplier: [],
        },
  });
  // Manejador de envío del formulario
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const url = initialData
        ? `/api/inventory/${initialData._id}`
        : "/api/inventory";

      const res = await fetch(url, {
        method: initialData ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        setLoading(false);
        toast.success(`Inventory item ${initialData ? "updated" : "created"}`);
        router.push("/inventory");
      } else {
        const errorData = await res.text();
        console.log("Error response:", errorData);
        toast.error(errorData || "Something went wrong! Please try again.");
      }
    } catch (err) {
      console.log("[inventory_POST/PUT]", err);
      toast.error("Something went wrong! Please try again.");
    }
  };

  return (
    <div className="p-10">
      {initialData ? (
        <div className="flex items-center justify-between">
          <p className="text-heading2-bold">Edit Inventory Item</p>
          <Delete id={initialData._id} item="inventory" />
        </div>
      ) : (
        <p className="text-heading2-bold">Create Inventory Item</p>
      )}
      <Separator className="bg-grey-1 mt-4 mb-7" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Campo para el nombre del alimento */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Campo para la cantidad */}
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Quantity"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} // Convertir a número
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Campo para la unidad de medida */}
          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <FormControl>
                  <select
                    className="border border-gray-300 rounded-lg p-2 w-full"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                  >
                    <option value="" disabled>
                      Select a unit
                    </option>
                    <option value="kilos">Kilos</option>
                    <option value="grams">Grams</option>
                    <option value="units">Units</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campo para la descripción */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Description" {...field} rows={5} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Campo para el proveedor */}
          {suppliers.length > 0 && (
            <FormField
              control={form.control}
              name="supplier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier</FormLabel>
                  <FormControl>
                    <MultiSelect
                      placeholder="Select suppliers" // Propiedad 'placeholder'
                      items={suppliers} // Lista de proveedores (debe ser un array con _id y title)
                      value={field.value.map((s) => s._id)} // IDs seleccionados
                      onChange={(newSupplierIds) => {
                        const selectedSuppliers = suppliers.filter((s) =>
                          newSupplierIds.includes(s._id)
                        );
                        field.onChange(selectedSuppliers); // Actualiza el array de objetos
                      }}
                      onRemove={(idToRemove) => {
                        const updatedSuppliers = field.value.filter(
                          (supplier) => supplier._id !== idToRemove
                        );
                        field.onChange(updatedSuppliers); // Elimina un proveedor del array
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />
          )}
          <div className="flex gap-10">
            <Button type="submit" className="bg-blue-1 text-white" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </Button>
            <Button
              type="button"
              onClick={() => router.push("/inventory")}
              className="bg-blue-1 text-white"
            >
              Discard
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default InventoryForm;