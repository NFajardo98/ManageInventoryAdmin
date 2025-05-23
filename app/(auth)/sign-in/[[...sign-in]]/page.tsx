import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-br from-[rgba(59,130,246,0.5)] via-[rgba(59,108,245,0.5)] to-[rgba(37,99,235,0.5)] relative overflow-hidden">
      {/* Elementos decorativos en el fondo */}
      <div className="absolute inset-0">
        {/* Logos distribuidos en el fondo */}
        <div className="absolute top-10 left-10 opacity-10">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-[200px] h-[200px] object-contain blur-sm"
          />
        </div>
        <div className="absolute bottom-20 right-20 opacity-10">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-[300px] h-[300px] object-contain blur-sm"
          />
        </div>
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-[400px] h-[400px] object-contain blur-md"
          />
        </div>
        <div className="absolute top-5 right-1/4 opacity-10">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-[250px] h-[250px] object-contain blur-sm"
          />
        </div>
        <div className="absolute bottom-10 left-1/4 opacity-10">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-[150px] h-[150px] object-contain blur-sm"
          />
        </div>
        <div className="absolute top-1/4 right-10 opacity-10">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-[200px] h-[200px] object-contain blur-sm"
          />
        </div>
      </div>

      {/* Contenedor del formulario */}
      <div className="relative z-10 bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <SignIn
          appearance={{
            elements: {
              card: "shadow-lg border border-gray-200 rounded-lg",
              formButtonPrimary:
                "bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300",
              formFieldInput:
                "border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-lg",
              formFieldLabel: "text-gray-700 font-medium",
            },
          }}
        />
      </div>
    </div>
  );
}