import { Box, CircleDot, Layers, Package, Grid3X3, Cylinder } from "lucide-react";

const objects = [
  {
    icon: Box,
    name: "Boxes",
    description: "Cardboard, wooden, and shipping containers",
    available: true,
  },
  {
    icon: Cylinder,
    name: "Pipes",
    description: "PVC, metal, and industrial piping",
    available: true,
  },
  {
    icon: Layers,
    name: "Bricks",
    description: "Construction bricks and blocks",
    available: true,
  },
  {
    icon: Package,
    name: "Pallets",
    description: "Stacked pallets and crates",
    coming: true,
  },
  {
    icon: Grid3X3,
    name: "Tiles",
    description: "Flooring and wall tiles",
    coming: true,
  },
  {
    icon: CircleDot,
    name: "Barrels",
    description: "Drums and cylindrical containers",
    coming: true,
  },
];

const SupportedObjectsSection = () => {
  return (
    <section id="objects" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Supported Objects
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our AI is trained to recognize and count various industrial materials
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {objects.map((obj, index) => (
            <div
              key={obj.name}
              className={`relative bg-card rounded-2xl p-6 shadow-card card-hover border ${
                obj.coming ? "border-border opacity-70" : "border-transparent"
              }`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {obj.coming && (
                <span className="absolute top-4 right-4 px-2 py-1 text-xs font-medium bg-secondary text-muted-foreground rounded-full">
                  Coming Soon
                </span>
              )}

              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  obj.coming ? "bg-muted" : "bg-primary/10"
                }`}
              >
                <obj.icon
                  className={`w-6 h-6 ${
                    obj.coming ? "text-muted-foreground" : "text-primary"
                  }`}
                />
              </div>

              <h3 className="text-lg font-semibold mb-2">{obj.name}</h3>
              <p className="text-sm text-muted-foreground">{obj.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SupportedObjectsSection;
