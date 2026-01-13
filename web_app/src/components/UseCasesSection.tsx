import { HardHat, Warehouse, Truck, Building2 } from "lucide-react";

const useCases = [
  {
    icon: HardHat,
    title: "Construction Audits",
    description:
      "Quickly verify material quantities on construction sites. Track inventory and ensure deliveries match orders.",
  },
  {
    icon: Warehouse,
    title: "Warehouse Inventory",
    description:
      "Streamline stock counting in warehouses. Reduce manual counting time and improve accuracy.",
  },
  {
    icon: Truck,
    title: "Logistics Verification",
    description:
      "Verify shipment contents during loading and unloading. Create visual documentation instantly.",
  },
  {
    icon: Building2,
    title: "Government Inspection",
    description:
      "Support regulatory compliance with automated counting. Generate reports for audits.",
  },
];

const UseCasesSection = () => {
  return (
    <section id="use-cases" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Use Cases</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Trusted by professionals across industries
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {useCases.map((useCase, index) => (
            <div
              key={useCase.title}
              className="flex gap-5 bg-card rounded-2xl p-6 shadow-card card-hover"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <useCase.icon className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">{useCase.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {useCase.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;
