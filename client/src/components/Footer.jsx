const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-lg font-semibold text-white">📚 BookStore</p>
        <p className="mt-2">Your one-stop shop for every book lover.</p>
        <p className="mt-4 text-sm">&copy; {new Date().getFullYear()} BookStore. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
