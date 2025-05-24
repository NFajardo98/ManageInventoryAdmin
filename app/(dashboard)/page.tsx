"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { useEffect, useState } from "react";
import Link from "next/link";

interface TopOrderedProductType {
  title: string;
  totalQuantity: number;
}

interface InventoryProjectionType {
  title: string;
  stock: number;
  averageDailySales: number;
  daysLeft: number | null;
}

interface IngredientUsedType {
  unit: string; // Unidad del ingrediente
  ingredientId: string;
  totalQuantityUsed: number;
  ingredientName: string; // Nombre del ingrediente
  dailyAverage: number; // Promedio diario de uso
  daysLeft: number | null; // Días restantes
}

interface SalesTrendType {
  _id: string;
  totalSales: number;
}
interface ProfitMarginType {
  title: string;
  profitMargin: number;
}

interface StatisticsType {
  totalProducts: number;
  lowStockItems: number;
  totalSuppliers: number;
  pendingOrders: number;
  completedOrders: number;
  totalPendingAmount: number;
  topOrderedProducts: TopOrderedProductType[];
  inventoryProjection: InventoryProjectionType[];
  ingredientsUsed: IngredientUsedType[];
  mostProfitableProducts: ProfitMarginType[];
  salesTrends: SalesTrendType[];
}

export default function Home() {
  const [statistics, setStatistics] = useState<StatisticsType>({
    totalProducts: 0,
    lowStockItems: 0,
    totalSuppliers: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalPendingAmount: 0,
    topOrderedProducts: [],
    inventoryProjection: [],
    ingredientsUsed: [],
    mostProfitableProducts: [],
    salesTrends: [],
  });

  const [showAllProducts, setShowAllProducts] = useState(false);

  const fetchStatistics = async () => {
    try {
      const res = await fetch("/api/main");
      if (res.ok) {
        const data = await res.json();
        setStatistics(data);
      } else {
        console.error("Failed to fetch statistics");
      }
    } catch (err) {
      console.error("Error fetching statistics:", err);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  const toggleShowAllProducts = () => {
    setShowAllProducts(!showAllProducts);
  };

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <h1 className="text-heading2-bold font-bold text-gray-800 mb-6">Admin Dashboard</h1>
    
      {/* Quick Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Link  href="/products" className="p-6 bg-blue-100 rounded-lg shadow hover:bg-blue-200 transition">
          <h3 className="text-lg font-bold text-blue-800">Total Products</h3>
          <p className="text-2xl font-bold">{statistics.totalProducts}</p>
        </Link >
        <Link href="/notifications" className="p-6 bg-green-100 rounded-lg shadow hover:bg-green-200 transition">
          <h3 className="text-lg font-bold text-green-800">Low Stock Items</h3>
          <p className="text-2xl font-bold">{statistics.lowStockItems}</p>
        </Link>
        <Link href="/suppliers" className="p-6 bg-yellow-100 rounded-lg shadow hover:bg-yellow-200 transition">
          <h3 className="text-lg font-bold text-yellow-800">Suppliers</h3>
          <p className="text-2xl font-bold">{statistics.totalSuppliers}</p>
        </Link>
        <Link href="/orders?status=pending" className="p-6 bg-red-100 rounded-lg shadow hover:bg-red-200 transition">
          <h3 className="text-lg font-bold text-red-800">Pending Orders</h3>
          <p className="text-2xl font-bold">{statistics.pendingOrders}</p>
        </Link>
        <Link href="/orders?status=completed" className="p-6 bg-red-100 rounded-lg shadow hover:bg-red-200 transition">
          <h3 className="text-lg font-bold text-red-800">Completed Orders</h3>
          <p className="text-2xl font-bold">{statistics.completedOrders}</p>
        </Link>
        <div className="p-6 bg-red-100 rounded-lg shadow">
          <h3 className="text-lg font-bold text-red-800">Total Earnings</h3>
          <p className="text-2xl font-bold">{statistics.totalPendingAmount} €</p>
        </div>
      </div>

      {/* Top Ordered Products */}
      <div className="bg-white p-8 rounded-lg shadow-lg mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Top Ordered Products</h2>
        {statistics.topOrderedProducts.length > 0 ? (
          <>
            <ul className="space-y-4">
              {statistics.topOrderedProducts
                .slice(0, showAllProducts ? statistics.topOrderedProducts.length : 3)
                .map((product, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        #{index + 1}: {product.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Ordered {product.totalQuantity} times
                      </p>
                    </div>
                    <span className="text-xl font-bold text-purple-600">
                      {product.totalQuantity}
                    </span>
                  </li>
                ))}
            </ul>
            {statistics.topOrderedProducts.length > 3 && (
              <button
                onClick={toggleShowAllProducts}
                className="mt-4 flex items-center justify-center text-purple-600 hover:text-purple-800 transition"
              >
                {showAllProducts ? "Show Less ▲" : "Show More ▼"}
              </button>
            )}
          </>
        ) : (
          <p className="text-gray-600">No data available for top ordered products.</p>
        )}
      </div>

      {/* Ingredients Used */}
      <div className="bg-white p-8 rounded-lg shadow-lg mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Ingredients Used</h2>
        {statistics.ingredientsUsed.length > 0 ? (
          <>
            <ul className="space-y-4">
              {statistics.ingredientsUsed
                .sort((a, b) => {
                  // Ordenar por daysLeft en orden creciente
                  if (a.daysLeft === null) return 1; // Mover null al final
                  if (b.daysLeft === null) return -1; // Mover null al final
                  return a.daysLeft - b.daysLeft; // Ordenar por daysLeft
                })
                .slice(0, showAllProducts ? statistics.ingredientsUsed.length : 3)
                .map((ingredient, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        #{index + 1}: {ingredient.ingredientName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Total Quantity Used: {ingredient.totalQuantityUsed} {ingredient.unit}
                      </p>
                      <p className="text-sm text-gray-600">
                        Daily Average Usage: {ingredient.dailyAverage} {ingredient.unit}/day
                      </p>
                      <p className="text-sm text-gray-600">
                        Days Left to Threshold:{" "}
                        {ingredient.daysLeft !== null
                          ? `${ingredient.daysLeft} days`
                          : "Not applicable"}
                      </p>
                    </div>
                  </li>
                ))}
            </ul>
            {statistics.ingredientsUsed.length > 3 && (
              <button
                onClick={toggleShowAllProducts}
                className="mt-4 flex items-center justify-center text-purple-600 hover:text-purple-800 transition"
              >
                {showAllProducts ? "Show Less ▲" : "Show More ▼"}
              </button>
            )}
          </>
        ) : (
          <p className="text-gray-600">No data available for ingredients used.</p>
        )}
      </div>

      {/* Most Profitable Products */}
      <div className="bg-white p-8 rounded-lg shadow-lg mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Most Profitable Products</h2>
        {statistics.mostProfitableProducts.length > 0 ? (
          <>
            <ul className="space-y-4">
              {statistics.mostProfitableProducts
                .slice(0, showAllProducts ? statistics.mostProfitableProducts.length : 3)
                .map((product, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        #{index + 1}: {product.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Profit Margin: {parseFloat(product.profitMargin.toString()).toFixed(2)} €
                      </p>
                    </div>
                  </li>
                ))}
            </ul>
            {statistics.mostProfitableProducts.length > 3 && (
              <button
                onClick={toggleShowAllProducts}
                className="mt-4 flex items-center justify-center text-purple-600 hover:text-purple-800 transition"
              >
                {showAllProducts ? "Show Less ▲" : "Show More ▼"}
              </button>
            )}
          </>
        ) : (
          <p className="text-gray-600">No data available for most profitable products.</p>
        )}
      </div>

      {/* Sales Trends */}
      <div className="bg-white p-8 rounded-lg shadow-lg mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Sales Trends</h2>
        {typeof window !== "undefined" && statistics.salesTrends.length > 0 ? (
          <div className="overflow-x-auto">
            <LineChart
              width={Math.min(window.innerWidth - 40, 700)} // Ajusta el ancho dinámicamente
              height={400}
              data={statistics.salesTrends}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              style={{ backgroundColor: "#f9fafb", borderRadius: "8px", padding: "10px" }}
            >
              <XAxis
                dataKey="_id"
                stroke="#4b5563"
                tick={{ fontSize: 12, fill: "#6b7280" }}
                label={{ value: "Date", position: "insideBottomRight", offset: -10, fill: "#4b5563" }}
              />
              <YAxis
                stroke="#4b5563"
                tick={{ fontSize: 12, fill: "#6b7280" }}
                label={{ value: "Total Sales (€)", angle: -90, position: "insideLeft", fill: "#4b5563" }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e5e7eb" }}
                labelStyle={{ color: "#4b5563", fontWeight: "bold" }}
                itemStyle={{ color: "#6b7280" }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                wrapperStyle={{ color: "#4b5563", fontSize: "14px" }}
              />
              <Line
                type="monotone"
                dataKey="totalSales"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ r: 5, fill: "#6366f1" }}
                activeDot={{ r: 8, fill: "#4f46e5" }}
              />
            </LineChart>
          </div>
        ) : (
          <p className="text-gray-600">No data available for sales trends.</p>
        )}
      </div>
    </div>
  );
}