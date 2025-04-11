import {
  Boxes,
  UtensilsCrossed,
  ClipboardList,
  Truck,
  Warehouse, // Importamos el ícono Warehouse
} from "lucide-react";

export const navLinks = [
  {
    url: "/collections",
    icon: <Boxes />, // Ícono para grupos de comida
    label: "Collections",
  },
  {
    url: "/products",
    icon: <UtensilsCrossed />, // Ícono para comida
    label: "Products",
  },
  {
    url: "/orders",
    icon: <ClipboardList />, // Ícono para pedidos
    label: "Orders",
  },
  {
    url: "/inventory",
    icon: <Warehouse />, // Ícono para inventario
    label: "Inventory",
  },
  {
    url: "/suppliers",
    icon: <Truck />, // Ícono para proveedores
    label: "Suppliers",
  },
];