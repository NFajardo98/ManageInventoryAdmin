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
import ImageUpload from '../custom ui/ImageUpload'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'
import Delete from '../custom ui/Delete'

// Creamos el schema
const formSchema = z.object({
  title: z.string().min(2).max(20),
  description: z.string().min(2).max(500).trim(),
  image: z.string(),
});

interface CollectionFormPromps {
  initialData?: CollectionType | null; //Must have question mark to make it optional
}

const CollectionForm: React.FC<CollectionFormPromps> = ({initialData}) => {
  //Router permite interactuar con el enrutador de Next.js dentro de un componente funcional de React. (Para manejar navegacion en la app)
  const router = useRouter()
  // Para controlar errores
  const[loading, setLoading] = useState(false)
  
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? initialData : {
      title: "",
      description: "",
      image: "",
    },
  })

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const url = initialData
        ? `/api/collections/${initialData._id}`
        : "/api/collections";
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(values),
      });
      if (res.ok) {
        setLoading(false);
        toast.success(`Collection ${initialData ? "updated" : "created"}`);
        window.location.href = "/collections"
        router.push("/collections");
      }
    } catch (err) {
      console.log("[collections_POST]", err);
      toast.error("Something went wrong! Please try again.");
    }
  };

  return (
    <div className="p-10">
      {initialData ? (
        <div className="flex items-center justify-between">
          <p className="text-heading2-bold">Edit Collection</p>
          <Delete id={initialData._id} item="collection" />
        </div>
      ) : (
        <p className="text-heading2-bold">Create Collection</p>
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
          {/*Form field título*/}
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <ImageUpload

                    value={field.value ? [field.value] : []}  // Si field value existe, tenemos field value y si no existe no tenemos nada
                    onChange={(url) => field.onChange(url)}   // Podemos cambiar el field a la url que subimos desde Cloudinary
                    onRemove={() => field.onChange("")}       // Para eliminar el field, lo dejamos vacio con ("")
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-10">
            <Button type="submit" className="bg-blue-1 text-white">
              Submit
            </Button>
            <Button
              type="button"
              /*Cuando hacemos clic en discard nos va a mandar de vuelta al espacio de collections con el evento onClick*/
              onClick={() => router.push("/collections")} 
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

export default CollectionForm
