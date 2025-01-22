import React from "react";
import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-blue-600 text-gray-300 py-12 w-full flex justify-center">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-10 gap-6 md:gap-8 mb-8">
          {/* Company Info */}
          <div className="min-w-[200px] px-2 py-2 md:px-4 md:py-4">
            <h3 className="text-white text-lg font-semibold mb-4">Personna</h3>
            <p className="text-sm max-w-[250px]">
              Empowering individuals through innovative solutions and
              exceptional service.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="min-w-[160px] px-2 py-2 md:px-4 md:py-4">
            <h3 className="text-white text-lg font-semibold mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-sm hover:text-white transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm hover:text-white transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-sm hover:text-white transition-colors"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="min-w-[160px] px-2 py-2 md:px-4 md:py-4">
            <h3 className="text-white text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/faq"
                  className="text-sm hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="text-sm hover:text-white transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="min-w-[200px] px-2 py-2 md:px-4 md:py-4">
            <h3 className="text-white text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Mail size={16} />
                <span className="text-sm">info@personna.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} />
                <span className="text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} />
                <span className="text-sm">
                  123 Business Ave, Suite 100
                  <br />
                  New York, NY 10001
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="grid grid-cols-2 items-center pt-8 border-t border-gray-800 lg:flex lg:justify-between">
          <div>
            <p className="text-sm">&copy; 2025 Personna.</p>
          </div>
          <div className="flex gap-6">
            <Link
              href="/privacy-policy"
              className="text-sm hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="text-sm hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/cookies"
              className="text-sm hover:text-white transition-colors"
            >
              Cookies Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
