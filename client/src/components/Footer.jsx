const Footer = () => {
  return (
    <footer className="bg-[#FBFAF7] border-t border-[#EBE6DC]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-serif text-lg text-[#2A2724] mb-2">Bookstore</h3>
            <p className="text-sm text-[#6B655D] leading-relaxed">Discover your next favorite read. Curated with care.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#2A2724] mb-3">Quick links</h4>
            <div className="space-y-2 text-sm text-[#6B655D]">
              <p>Books</p>
              <p>Cart</p>
              <p>Favorites</p>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#2A2724] mb-3">Contact</h4>
            <div className="space-y-2 text-sm text-[#6B655D]">
              <p>hello@bookstore.com</p>
              <p>1-800-BOOKS</p>
            </div>
          </div>
        </div>
        <div className="border-t border-[#EBE6DC] mt-8 pt-8 text-center text-sm text-[#A8A096]">
          &copy; {new Date().getFullYear()} Bookstore. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
