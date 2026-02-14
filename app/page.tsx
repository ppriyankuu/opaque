"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const tools = [
    {
      title: "Images to PDF",
      description:
        "Combine multiple images into a single PDF. 100% browser-based with no uploads.",
      route: "/img-to-pdf",
      badge: "Popular",
    },
    {
      title: "JPG to PNG",
      description:
        "Convert JPG/JPEG images to PNG format instantly and securely.",
      route: "/jpg-to-png",
      badge: "Convert",
    },
    {
      title: "Image Compressor",
      description:
        "Reduce image size while keeping quality. Perfect for faster sharing.",
      route: "/compress",
      badge: "Optimize",
    },
  ];

  return (
    <div className="min-h-[80vh] flex flex-col items-center px-4 
                pt-8 md:pt-28 lg:pt-20 
                justify-start md:justify-start lg:justify-start">
      {/* Hero Section */}
      <div className="text-center mb-14 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Opaque
        </h1>

        <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed">
          Privacy-first image tools that run entirely in your browser.
          <span className="text-secondary font-semibold">
            {" "}No uploads. No tracking.
          </span>
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid gap-8 w-full max-w-6xl grid-cols-1 md:grid-cols-3">
        {tools.map((tool) => (
          <div
            key={tool.title}
            className="card bg-neutral-900 border border-gray-800 shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <div className="card-body">
              <div className="flex justify-between items-center mb-2">
                <h2 className="card-title text-white">
                  {tool.title}
                </h2>

                <div className="badge badge-secondary badge-outline border-[1.85px] pt-[0.75px]">
                  {tool.badge}
                </div>
              </div>

              <p className="text-gray-400 text-sm leading-relaxed">
                {tool.description}
              </p>

              <div className="card-actions justify-end mt-6">
                <button
                  onClick={() => router.push(tool.route)}
                  className="btn btn-secondary btn-sm text-gray-900"
                >
                  Open Tool →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
