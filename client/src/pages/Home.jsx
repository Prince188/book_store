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
    <div className="bg-[#FBFAF7] min-h-screen text-[#2A2724] font-light">
      <Seo description="Browse our collection of books across all genres. Find your next great read at Bookstore." />

      {/* Hero */}
      <section className="px-5 pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <span className="w-6 h-px bg-[#C9B79C]" />
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#8A8278]">A quiet library</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-serif font-normal tracking-tight text-[#2A2724] leading-[1.05]">
            Stories worth
            <br />
            <span className="italic text-[#9C8B73]">slowing down</span> for.
          </h1>

          <p className="mt-8 text-base md:text-lg text-[#6B655D] max-w-xl leading-relaxed">
            A small, considered collection of books — chosen with care, arranged with intention.
          </p>

          <form onSubmit={handleSearch} className="mt-12 max-w-xl">
            <div className="flex items-center border-b border-[#D9D3C7] focus-within:border-[#9C8B73] transition-colors">
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search by title, author, or genre"
                className="flex-1 py-3 bg-transparent text-[#2A2724] placeholder:text-[#A8A096] text-base focus:outline-none"
              />
              <button
                type="submit"
                className="text-sm text-[#2A2724] hover:text-[#9C8B73] transition-colors px-2"
              >
                Search →
              </button>
            </div>
          </form>

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <span className="text-[#A8A096] text-xs uppercase tracking-wider">Explore</span>
            {['Fiction', 'Science', 'History', 'Philosophy', 'Art'].map((tag) => (
              <button
                key={tag}
                onClick={() => navigate(`/books?search=${tag}`)}
                className="text-[#6B655D] hover:text-[#9C8B73] transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="px-6 py-16 border-t border-[#EBE6DC]">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#8A8278]">Categories</span>
                <h2 className="text-2xl md:text-3xl font-serif mt-2 text-[#2A2724]">Browse by subject</h2>
              </div>
              <Link to="/books" className="text-sm text-[#6B655D] hover:text-[#9C8B73] transition-colors">
                View all →
              </Link>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  to={`/books?category=${cat._id}`}
                  className="text-sm text-[#6B655D] hover:text-[#9C8B73] border-b border-transparent hover:border-[#9C8B73] pb-0.5 transition-all"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured */}
      <section className="px-6 py-20 border-t border-[#EBE6DC]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#8A8278]">Selected</span>
              <h2 className="text-2xl md:text-3xl font-serif mt-2 text-[#2A2724]">Editors' picks</h2>
            </div>
            <Link to="/books" className="text-sm text-[#6B655D] hover:text-[#9C8B73] transition-colors">
              All books →
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
      <section className="px-6 py-20 border-t border-[#EBE6DC]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
          {[
            { t: 'Curated', d: 'Every title hand-picked, nothing filler.' },
            { t: 'Considered', d: 'Slow shipping, thoughtful packaging.' },
            { t: 'Trusted', d: 'Secure checkout, simple returns.' },
          ].map((f, i) => (
            <div key={i}>
              <span className="text-xs text-[#9C8B73]">0{i + 1}</span>
              <h3 className="mt-3 text-lg font-serif text-[#2A2724]">{f.t}</h3>
              <p className="mt-2 text-sm text-[#6B655D] leading-relaxed">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="px-6 py-24 border-t border-[#EBE6DC]">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#8A8278]">Letters</span>
          <h3 className="mt-3 text-3xl md:text-4xl font-serif text-[#2A2724]">
            A note, now and then.
          </h3>
          <p className="mt-4 text-[#6B655D]">
            Quiet recommendations, delivered occasionally — never noise.
          </p>
          <form className="mt-10 flex items-center border-b border-[#D9D3C7] focus-within:border-[#9C8B73] transition-colors max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 py-3 bg-transparent text-[#2A2724] placeholder:text-[#A8A096] text-base focus:outline-none text-center"
            />
            <button className="text-sm text-[#2A2724] hover:text-[#9C8B73] transition-colors px-2">
              Subscribe →
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
