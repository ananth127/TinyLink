import { useState, useEffect } from 'react';
import { getAllLinks } from '../api/links';
import LinkForm from '../components/LinkForm';
import LinkTable from '../components/LinkTable';

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  const fetchLinks = async (search = '') => {
    try {
      setLoading(true);
      setError('');
      const data = await getAllLinks(search);
      setLinks(data);
    } catch (err) {
      setError('Failed to load links. Please refresh the page.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch links on mount
  useEffect(() => {
    fetchLinks();
  }, []);

  // Auto refresh click stats every second
  useEffect(() => {
    const clickStats = async () => {
      try {
        const data = await getAllLinks(searchQuery);
        setLinks(data);
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };

    const intervalId = setInterval(clickStats, 1000);
    return () => clearInterval(intervalId);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchLinks(searchQuery);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value === '') {
      fetchLinks('');
    }
  };

  const handleLinkCreated = () => {
    fetchLinks(searchQuery);
  };

  const handleLinkDeleted = (code) => {
    setLinks((prev) => prev.filter((link) => link.code !== code));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg
                className="w-8 h-8 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
              <h1 className="text-2xl font-bold text-gray-900">TinyLink</h1>
            </div>
            <div className="text-sm text-gray-600">URL Shortener Dashboard</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Create Link Form */}
          <LinkForm onSuccess={handleLinkCreated} />

          {/* Links List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Your Links</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {links.length} {links.length === 1 ? 'link' : 'links'}
                </span>
              </div>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="card">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search by code or URL..."
                  className="input flex-1"
                />
                <button type="submit" className="btn btn-primary">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      fetchLinks('');
                    }}
                    className="btn btn-secondary"
                  >
                    Clear
                  </button>
                )}
              </div>
            </form>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Links Table */}
            <LinkTable links={links} loading={loading} onDelete={handleLinkDeleted} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-600">
            © 2024 TinyLink. Built with React, Vite, and Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  );
}
