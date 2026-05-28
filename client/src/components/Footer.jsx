const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-serif text-xl font-semibold text-gray-900 mb-2">Bookstore</h3>
            <p className="text-sm text-gray-500 leading-relaxed">Discover your next favorite read. Curated with care.</p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-widest mb-3">Quick links</h4>
            <div className="space-y-2 text-sm text-gray-500">
              <p>Books</p>
              <p>Cart</p>
              <p>Favorites</p>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-widest mb-3">Contact</h4>
            <div className="space-y-2 text-sm text-gray-500">
              <p>hello@bookstore.com</p>
              <p>1-800-BOOKS</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-100 mt-8 pt-8 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Bookstore. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
