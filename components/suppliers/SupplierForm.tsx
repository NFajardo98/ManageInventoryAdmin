"use client"

import { Separator } from '../ui/separator'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'
import Delete from '../custom ui/Delete'
import { SupplierType } from '@/lib/types/supplier'

// Creamos el schema
const formSchema = z.object({
  title: z.string().min(2).max(20),
  description: z.string().min(2).max(500).trim(),
  email: z.string().email(),
  address: z.string().min(2).max(100).trim(),
  city: z.string().min(2).max(50).trim(),
  country: z.string().min(2).max(50).trim(),
});

interface SupplierFormPromps {
  initialData?: SupplierType | null; //Must have question mark to make it optional
}

const SupplierForm: React.FC<SupplierFormPromps> = ({ initialData }) => {
  //Router permite interactuar con el enrutador de Next.js dentro de un componente funcional de React. (Para manejar navegacion en la app)
  const router = useRouter()
  // Para controlar errores
  const [loading, setLoading] = useState(false)

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? initialData : {
      title: "",
      description: "",
      email: "",
      address: "",
      city: "",
      country: "",
    },
  })

  // 2. Define a submit handler.
  const onSubmit = async (values: { title: string; description: string }) => {
    try {
      setLoading(true);
      const url = initialData
        ? `/api/suppliers/${initialData._id}`
        : "/api/suppliers";

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values), // Asegúrate de que los datos coincidan con lo que espera el backend
      });

      if (res.ok) {
        setLoading(false);
        toast.success(`Supplier ${initialData ? "updated" : "created"}`);
        router.push("/suppliers");
      } else {
        const errorData = await res.text(); // Cambia a `text` para leer el mensaje de error
        console.log("Error response:", errorData);
        toast.error(errorData || "Something went wrong! Please try again.");
      }
    } catch (err) {
      console.log("[suppliers_POST]", err);
      toast.error("Something went wrong! Please try again.");
    }
  };

  return (
    <div className="p-10">
      {initialData ? (
        <div className="flex items-center justify-between">
          <p className="text-heading2-bold">Edit Supplier</p>
          <Delete id={initialData._id} item="supplier" />
        </div>
      ) : (
        <p className="text-heading2-bold">Create Supplier</p>
      )}
      <Separator className="bg-grey-1 mt-4 mb-7" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/*Form field título*/}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Title" {...field} />
                </FormControl>
                <FormDescription>
                  {/*Aquí va una descripción si queremos*/}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/*Form field título*/}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  {/*Con esto indicamos que como maximo 5 filas de Description*/}
                  <Textarea placeholder="Description" {...field} rows={5} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Form field email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Form field address */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="Address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Form field city */}
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="City" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Form field country */}
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="Country" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-10">
            <Button type="submit" className="bg-blue-1 text-white" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </Button>
            <Button
              type="button"
              /*Cuando hacemos clic en discard nos va a mandar de vuelta al espacio de suppliers con el evento onClick*/
              onClick={() => router.push("/suppliers")}
              className="bg-blue-1 text-white"
            >
              Discard
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default SupplierForm
