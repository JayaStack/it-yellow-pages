const Footer = () => {
  return (
    <footer className="bg-secondary text-gray-400 py-12 mt-auto border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 text-white mb-4">
              <div className="bg-primary text-secondary p-1 rounded font-bold text-lg">IT</div>
              <span className="text-lg font-bold">YellowPages</span>
            </div>
            <p className="text-sm leading-relaxed">
              Find the best businesses, services, and professionals in your city. Your trusted local search directory.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/" className="hover:text-primary transition-colors">Home</a></li>
              <li><a href="/search" className="hover:text-primary transition-colors">Browse Listings</a></li>
              <li><a href="/submit-business" className="hover:text-primary transition-colors">Add Business</a></li>
              <li><a href="/login" className="hover:text-primary transition-colors">Account</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Top Cities</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-primary transition-colors">Madurai</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Chennai</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Coimbatore</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Trichy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Contact Us</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Email: jayasarathy.dev@gmail.com</li>
              <li>Phone: +91 94429 56515</li>
              <li>Address: Kumbakonam, Tamil Nadu, India</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-xs">
          <p>© {new Date().getFullYear()} Use It Yellow Pages. All Rights Reserved. Built by Jaya Stack.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
