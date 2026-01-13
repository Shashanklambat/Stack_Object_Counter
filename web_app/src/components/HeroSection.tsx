import { ArrowRight, Scan, Zap, Shield } from "lucide-react";

const HeroSection = () => {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center pt-16 bg-hero-gradient relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in-up">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              See. Detect. Count.
            </span>
          </div>

          {/* Main Headline */}
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            AI-Powered Stack Object
            <br />
            <span className="gradient-text">Counting in Seconds</span>
          </h1>

          {/* Subtext */}
          <p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            Count boxes, pipes, bricks, and stacked materials using a single
            photo. Powered by advanced computer vision.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <a
              href="#counter"
              className="btn-ripple inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all duration-300 hover:scale-105 active:scale-95 shadow-elevated"
            >
              Try It Now
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-secondary-foreground font-semibold rounded-xl hover:bg-secondary/80 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Learn More
            </a>
          </div>

          {/* Feature Pills */}
          <div
            className="flex flex-wrap items-center justify-center gap-4 animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg shadow-card">
              <Scan className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Real-time Detection</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg shadow-card">
              <Shield className="w-4 h-4 text-success" />
              <span className="text-sm font-medium">99%+ Accuracy</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg shadow-card">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Instant Results</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
