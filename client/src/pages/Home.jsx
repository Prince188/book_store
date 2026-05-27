import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBooks, getCategories } from '../api';
import BookCard from '../components/BookCard';

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getBooks({ limit: 8 }).then((res) => setFeatured(res.data.books));
    getCategories().then((res) => setCategories(res.data));
  }, []);

  return (
    <div>
      <div className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to BookStore</h1>
          <p className="text-xl text-blue-200 mb-8">Discover your next favorite read</p>
          <Link
            to="/books"
            className="inline-block bg-yellow-500 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition"
          >
            Browse All Books
          </Link>
        </div>
      </div>

      {categories.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-6">Categories</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/books?category=${cat._id}`}
                className="bg-gray-100 px-5 py-2 rounded-full hover:bg-blue-100 hover:text-blue-800 transition"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Featured Books</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featured.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
