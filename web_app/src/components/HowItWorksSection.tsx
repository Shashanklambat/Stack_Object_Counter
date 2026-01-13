import { Upload, Cpu, BarChart3 } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Image",
    description:
      "Drag & drop or capture a photo of your stacked materials using your device camera.",
  },
  {
    icon: Cpu,
    title: "AI Detects Objects",
    description:
      "Our advanced AI scans and identifies each individual object in the stack automatically.",
  },
  {
    icon: BarChart3,
    title: "Get Count + Bounding Boxes",
    description:
      "Receive an accurate count with visual annotations showing exactly what was detected.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to accurately count your stacked materials
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative bg-card rounded-2xl p-8 shadow-card card-hover text-center"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Step Number */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm font-mono">
                {index + 1}
              </div>

              {/* Icon */}
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                <step.icon className="w-8 h-8 text-primary" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.description}</p>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
