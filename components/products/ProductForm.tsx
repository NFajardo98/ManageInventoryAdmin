"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { Separator } from "../ui/separator";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import ImageUpload from "../custom ui/ImageUpload";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Delete from "../custom ui/Delete";
import MultiText from "../custom ui/MultiText";
import MultiSelect from "../custom ui/MultiSelect";
import Loader from "../custom ui/Loader";
import { CollectionType } from "@/lib/types/collection";
import { ProductType } from "@/lib/types/product";

const formSchema = z.object({
  title: z.string().min(2).max(20),
  description: z.string().min(2).max(500).trim(),
  media: z.array(z.string()),
  collections: z.array(z.string()),
  inventories: z
    .array(
      z.object({
        inventory: z.string(), // ID del inventario
        quantity: z.number().min(1), // Cantidad mínima de 1
      })
    )
    .optional(),
  allergens: z.array(z.string()),
  price: z.coerce.number().min(0.1),
  expense: z.coerce.number().min(0.1),
});

interface ProductFormProps {
  initialData?: ProductType | null;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData }) => {
  console.log("✅ ProductForm - initialData received:", initialData); // Aquí

  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState<CollectionType[]>([]);
  const [inventories, setInventories] = useState<{ _id: string; title: string, stock:number, unitPrice: number }[]>([]);

  const getCollections = async () => {
    try {
      const res = await fetch("/api/collections", {
        method: "GET",
      });
      const data = await res.json();
      setCollections(data);
      setLoading(false);
    } catch (err) {
      console.log("[collections_GET]", err);
      toast.error("Something went wrong! Please try again.");
    }
  };

  const getInventories = async () => {
    try {
      const res = await fetch("/api/inventory", {
        method: "GET",
      });
      const data = await res.json();
      console.log("✅ Inventories fetched:", data); // Aquí
      setInventories(data);
    } catch (err) {
      console.log("[inventories_GET]", err);
      toast.error("Something went wrong! Please try again.");
    }
  };

  
  useEffect(() => {
    getCollections();
  }, []);

  useEffect(() => {
    getInventories();
  }, []);

  console.log("✅ ProductForm - initialData received:", initialData);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
        ...initialData,
        collections: initialData.collections?.map((collection) => collection._id) || [],
        inventories: initialData.inventories?.map((inv) => ({
          inventory: typeof inv.inventory === "string" ? inv.inventory : inv.inventory._id, // Asegúrate de que sea un string
          quantity: inv.quantity, // Cantidad asociada
        })) || [],
        expense: initialData.expense || 0.1, // Asegúrate de que el expense esté definido
      }
      : {
        title: "",
        description: "",
        media: [],
        collections: [],
        inventories: [],
        allergens: [],
        price: 0.1,
        expense: 0.1,
      },
  });

    // Efecto para calcular automáticamente el expense
    useEffect(() => {
      const calculateExpense = () => {
        const inventoriesFromForm = form.getValues("inventories") || [];
        const totalExpense = inventoriesFromForm.reduce(
          (acc: number, inv: { inventory: string; quantity: number }) => {
            const inventoryItem = inventories.find((item) => item._id === inv.inventory);
            const unitPrice = inventoryItem?.unitPrice || 0;
            return acc + unitPrice * inv.quantity;
          },
          0
        );
        form.setValue("expense", parseFloat(totalExpense.toFixed(2))); // Actualiza el campo expense
      };
    
      calculateExpense();
    }, [form.watch("inventories"), inventories]); // Observa los cambios en inventories y form.watch("inventories")

  const handleKeyPress = (
    e:
      | React.KeyboardEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {

    try {
      const url = initialData
        ? `/api/products/${initialData._id}` // Update endpoint
        : "/api/products"; // Create endpoint
      const res = await fetch(url, {
        method: initialData ? "POST" : "POST", // Ensure correct method
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      console.log("Server response:", res);

      if (res.ok) {
        toast.success(`Product ${initialData ? "updated" : "created"}`);
        router.push("/products"); // Redirige a la página de productos
      } else {
        const errorData = await res.text();
        console.log("Error response:", errorData);
        toast.error(errorData || "Something went wrong! Please try again.");
      }
    } catch (err) {
      console.log("[products_POST]", err);
      toast.error("Something went wrong! Please try again.");
    }
  };


  return loading ? (
    <Loader />
  ) : (
    <div className="p-10">
      {initialData ? (
        <div className="flex items-center justify-between">
          <p className="text-heading2-bold">Edit Product</p>
          <Delete id={initialData._id} item="product" />
        </div>
      ) : (
        <p className="text-heading2-bold">Create Product</p>
      )}
      <Separator className="bg-grey-1 mt-4 mb-7" />
      <Form {...form}>
        <form
          onSubmit={(e) => {
            console.log("Form is ready to submit");
            console.log("Form errors:", form.formState.errors); // Inspecciona los errores
            form.handleSubmit((values) => {
              console.log("form.handleSubmit executed with values:", values);
              onSubmit(values);
            })(e);
          }}
          className="space-y-8"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Title"
                    {...field}
                    onKeyDown={handleKeyPress}
                  />
                </FormControl>
                <FormMessage className="text-red-1" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Description"
                    {...field}
                    rows={5}
                    onKeyDown={handleKeyPress}
                  />
                </FormControl>
                <FormMessage className="text-red-1" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="media"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value}
                    onChange={(url) => field.onChange([...field.value, url])}
                    onRemove={(url) =>
                      field.onChange([
                        ...field.value.filter((image) => image !== url),
                      ])
                    }
                  />
                </FormControl>
                <FormMessage className="text-red-1" />
              </FormItem>
            )}
          />

          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price €</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Price"
                      {...field}
                      onKeyDown={handleKeyPress}
                    />
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expense"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expense €</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Expense"
                      {...field}
                      disabled // Deshabilitado porque ahora es automático
                    />
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="allergens"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Allergens</FormLabel>
                  <FormControl>
                    <MultiText
                      placeholder="Allergens"
                      value={field.value}
                      onChange={(tag) => field.onChange([...field.value, tag])}
                      onRemove={(tagToRemove) =>
                        field.onChange([
                          ...field.value.filter((tag) => tag !== tagToRemove),
                        ])
                      }
                    />
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />

            {collections.length > 0 && (
              <FormField
                control={form.control}
                name="collections"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Collections</FormLabel>
                    <FormControl>
                      <MultiSelect
                        placeholder="Select collections"
                        items={collections}
                        value={field.value}
                        onChange={(newCollections) =>
                          field.onChange([...new Set([...field.value, ...newCollections])])
                        }
                        onRemove={(idToRemove) =>
                          field.onChange(field.value.filter((collectionId) => collectionId !== idToRemove))
                        }
                      />
                    </FormControl>
                    <FormMessage className="text-red-1" />
                  </FormItem>
                )}
              />
            )}

            {inventories.length > 0 && (
              <FormField
                control={form.control}
                name="inventories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Inventories</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        {(field.value || []).map((inv, index) => (
                          <div key={index} className="flex items-center gap-4">
                            <select
                              className="border rounded p-2 flex-1"
                              value={inv.inventory}
                              onChange={(e) => {
                                const updatedInventories = [...(field.value || [])];
                                updatedInventories[index].inventory = e.target.value;
                                field.onChange(updatedInventories);
                              }}
                            >
                              <option value="">Select Inventory</option>
                              {inventories.map((inventory) => (
                                <option key={inventory._id} value={inventory._id}>
                                  {inventory.title}
                                </option>
                              ))}
                            </select>
                            <Input
                              type="number"
                              placeholder="Quantity"
                              value={inv.quantity}
                              onChange={(e) => {
                                const updatedInventories = [...(field.value || [])];
                                updatedInventories[index].quantity = Number(e.target.value);
                                field.onChange(updatedInventories);
                              }}
                            />
                            <Button
                              type="button"
                              onClick={() => {
                                const updatedInventories = (field.value || []).filter((_, i) => i !== index);
                                field.onChange(updatedInventories);
                              }}
                              className="bg-red-500 text-white"
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          onClick={() =>
                            field.onChange([
                              ...(field.value || []),
                              { inventory: "", quantity: 1 },
                            ])
                          }
                          className="bg-blue-500 text-white"
                        >
                          Add Inventory
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-1" />
                  </FormItem>
                )}
              />
            )}
          </div>

          <div className="flex gap-10">
            <Button type="submit" className="bg-blue-1 text-white">
              Submit
            </Button>
            <Button
              type="button"
              onClick={() => router.push("/products")}
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

export default ProductForm;
