import { Mail, Phone, Github, Linkedin } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  const quickLinks = [
    { label: "Home", href: "#home" },
    { label: "Count Objects", href: "#counter" },
    { label: "About", href: "#how-it-works" },
    { label: "Contact", href: "mailto:shashanklambat1@gmail.com" },
  ];

  const socialLinks = [
    {
      icon: Mail,
      href: "mailto:shashanklambat1@gmail.com",
      label: "Email",
    },
    {
      icon: Github,
      href: "https://github.com/Shashanklambat",
      label: "GitHub",
    },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/shashank-lambat",
      label: "LinkedIn",
    },
  ];

  return (
    <footer className="py-12 bg-card border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="StackVision Logo" className="w-10 h-10 rounded-lg" />
              <span className="text-xl font-bold">
                Stack<span className="text-primary">Vision</span>
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              AI-powered stack object counting for construction, logistics, and
              warehouse management. See. Detect. Count.
            </p>
            <a
              href="tel:9623499410"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Phone className="w-4 h-4" />
              +91 9623499410
            </a>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Connect</h3>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} StackVision. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
