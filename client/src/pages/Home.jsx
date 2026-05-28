import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getBooks, getCategories } from '../api';
import BookCard from '../components/BookCard';
import Seo from '../components/Seo';

const Home = () => {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchVal, setSearchVal] = useState('');

  useEffect(() => {
    getBooks({ limit: 8 }).then((r) => setFeatured(r.data.books));
    getCategories().then((r) => setCategories(r.data));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) navigate(`/books?search=${encodeURIComponent(searchVal)}`);
  };

  return (
    <div className="bg-white min-h-screen">
      <Seo description="Browse our collection of books across all genres. Find your next great read at Bookstore." />

      {/* Hero */}
      <section className="px-6 pt-28 pb-24 md:pt-36 md:pb-32">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-[0.15em] mb-6">A quiet library</p>
          <h1 className="text-5xl md:text-7xl font-serif font-semibold text-gray-900 tracking-tight leading-[1.05]">
            Stories worth
            <br />
            <span className="italic text-indigo-500">slowing down</span> for.
          </h1>
          <p className="mt-6 text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
            A small, considered collection of books — chosen with care, arranged with intention.
          </p>

          <form onSubmit={handleSearch} className="mt-10 max-w-md mx-auto">
            <div className="flex items-center border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all overflow-hidden">
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search by title, author, or genre"
                className="flex-1 px-4 py-3 bg-transparent text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none"
              />
              <button type="submit" className="px-5 py-3 bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors">
                Search
              </button>
            </div>
          </form>

          <div className="mt-8 flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-sm">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Explore</span>
            {['Fiction', 'Science', 'History', 'Philosophy', 'Art'].map((tag) => (
              <button
                key={tag}
                onClick={() => navigate(`/books?search=${tag}`)}
                className="text-gray-600 hover:text-indigo-600 transition-colors font-medium"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="px-6 py-16 border-t border-gray-100">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Categories</p>
                <h2 className="text-2xl md:text-3xl font-serif font-semibold text-gray-900 mt-2">Browse by subject</h2>
              </div>
              <Link to="/books" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
                View all &rarr;
              </Link>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  to={`/books?category=${cat._id}`}
                  className="text-sm text-gray-600 hover:text-indigo-600 border-b-2 border-transparent hover:border-indigo-600 pb-0.5 transition-all font-medium"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured */}
      <section className="px-6 py-20 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Selected</p>
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-gray-900 mt-2">Editors' picks</h2>
            </div>
            <Link to="/books" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
              All books &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {featured.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="px-6 py-20 border-t border-gray-100 bg-gray-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
          {[
            { t: 'Curated', d: 'Every title hand-picked, nothing filler.' },
            { t: 'Considered', d: 'Slow shipping, thoughtful packaging.' },
            { t: 'Trusted', d: 'Secure checkout, simple returns.' },
          ].map((f, i) => (
            <div key={i} className="text-center">
              <span className="text-xs font-bold text-indigo-400">0{i + 1}</span>
              <h3 className="mt-3 text-lg font-serif font-semibold text-gray-900">{f.t}</h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="px-6 py-24 border-t border-gray-100">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Letters</p>
          <h3 className="mt-3 text-3xl md:text-4xl font-serif font-semibold text-gray-900">
            A note, now and then.
          </h3>
          <p className="mt-4 text-gray-500">
            Quiet recommendations, delivered occasionally — never noise.
          </p>
          <div className="mt-10 max-w-md mx-auto flex items-center border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all overflow-hidden">
            <input type="email" placeholder="your@email.com"
              className="flex-1 px-4 py-3 bg-transparent text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none text-center" />
            <button className="px-5 py-3 bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
