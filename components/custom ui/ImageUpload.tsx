import { CldUploadWidget } from 'next-cloudinary';
import { Plus, Trash } from 'lucide-react';

import { Button } from '../ui/button';
import Image from 'next/image';

interface ImageUploadProps {
  value: string[];  // Value es un array de strings
  onChange: (value: string) => void;  // On change es una funcion que recibe un string
  onRemove: (value: string) => void;  // On remove es una funcion que recibe un string
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onChange,
  onRemove,
  value,
}) => {
const onUpload = (result: unknown) => {
  if (
    typeof result === "object" &&
    result !== null &&
    "info" in result &&
    result.info &&
    typeof result.info === "object" &&
    "secure_url" in result.info &&
    typeof result.info.secure_url === "string"
  ) {
    onChange(result.info.secure_url);
  }
};
  return (
    <div>
      {/*Aqui mostramos la image en la website*/}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        {value.map((url) => ( // Value mapeará la url
          <div key={url} className="relative w-[200px] h-[200px]">
            <div className="absolute top-0 right-0 z-10">
              {/*Funcion para quitar la foto*/}
              <Button type="button" onClick={() => onRemove(url)} size="sm" className="bg-red-1 text-white">  
                {/*Trash icon importado de lucide-react*/}
                <Trash className="h-4 w-4" />   
              </Button>
            </div>
            <Image
              src={url} // url de Cloudinary
              alt="collection"
              className="object-cover rounded-lg"
              fill  // fillea el div
            />
          </div>
        ))}
      </div>

      {/*Aqui instanciamos nuestro upload preset*/}
      <CldUploadWidget uploadPreset="ManageInventory" onSuccess={onUpload}>
        {({ open }) => {
          return (
            <Button type="button" onClick={() => open()} className="bg-grey-1 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Upload Image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;
