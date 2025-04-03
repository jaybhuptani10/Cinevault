import React from "react";
import {
  Twitter,
  Instagram,
  Facebook,
  Youtube,
  Mail,
  Github,
  Film,
} from "lucide-react";

const CineVaultFooter = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Discover",
      links: [
        { name: "Popular Films", url: "#" },
        { name: "New Releases", url: "#" },
        { name: "Top Rated", url: "#" },
        { name: "Upcoming", url: "#" },
        { name: "Classics", url: "#" },
      ],
    },
    {
      title: "Community",
      links: [
        { name: "Find Friends", url: "#" },
        { name: "Film Clubs", url: "#" },
        { name: "Discussions", url: "#" },
        { name: "User Lists", url: "#" },
        { name: "Events", url: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Help Center", url: "#" },
        { name: "API", url: "#" },
        { name: "For Developers", url: "#" },
        { name: "Accessibility", url: "#" },
        { name: "Careers", url: "#" },
      ],
    },
    {
      title: "About",
      links: [
        { name: "Our Story", url: "#" },
        { name: "Terms of Service", url: "#" },
        { name: "Privacy Policy", url: "#" },
        { name: "Contact Us", url: "#" },
        { name: "Press", url: "#" },
      ],
    },
  ];

  const socialLinks = [
    { icon: <Twitter size={20} />, url: "#", label: "Twitter" },
    { icon: <Instagram size={20} />, url: "#", label: "Instagram" },
    { icon: <Facebook size={20} />, url: "#", label: "Facebook" },
    { icon: <Youtube size={20} />, url: "#", label: "YouTube" },
    { icon: <Github size={20} />, url: "#", label: "GitHub" },
    { icon: <Mail size={20} />, url: "#", label: "Email" },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-6xl mx-auto px-4 pt-16 pb-8">
        {/* Logo and tagline */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center mr-3">
                <Film className="h-6 w-6 text-gray-900" />
              </div>
              <span className="text-2xl font-bold text-white">CineVault</span>
            </div>
            <p className="text-gray-400 mt-2 text-sm">
              Your personal cinema headquarters
            </p>
          </div>

          {/* Newsletter signup */}
          <div className="w-full md:w-auto">
            <p className="font-medium mb-2">Stay updated with film news</p>
            <div className="flex gap-1">
              <input
                type="email"
                placeholder="Your email address"
                className="bg-gray-800 text-white px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-gray-700"
              />
              <button className="bg-emerald-500  hover:bg-emerald-600 text-gray-900 font-medium px-2 py-2 rounded-lg transition-colors duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Footer navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h3 className="text-white font-semibold mb-4">{section.title}</h3>
              <ul>
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex} className="mb-2">
                    <a
                      href={link.url}
                      className="text-gray-400 hover:text-emerald-400 transition-colors duration-300"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social links */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.url}
              aria-label={social.label}
              className="bg-gray-800 p-3 rounded-full hover:bg-emerald-500 hover:text-gray-900 transition-colors duration-300"
            >
              {social.icon}
            </a>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-8 mt-8 text-sm text-center text-gray-500">
          <p>© {currentYear} CineVault. All rights reserved.</p>
          <p className="mt-2">
            Made with passion for film enthusiasts everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default CineVaultFooter;
