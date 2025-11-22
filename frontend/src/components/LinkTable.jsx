import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteLink } from '../api/links';
import CopyButton from './CopyButton';
import Loader from './Loader';

export default function LinkTable({ links, loading, onDelete }) {
  const navigate = useNavigate();
  const [deletingCode, setDeletingCode] = useState(null);

  const handleDelete = async (code) => {
    if (!confirm('Are you sure you want to delete this link?')) {
      return;
    }

    setDeletingCode(code);
    
    try {
      await deleteLink(code);
      if (onDelete) {
        onDelete(code);
      }
    } catch (error) {
      alert('Failed to delete link. Please try again.');
      console.error('Delete error:', error);
    } finally {
      setDeletingCode(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const truncateUrl = (url, maxLength = 50) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <Loader size="lg" />
        </div>
      </div>
    );
  }

  if (links.length === 0) {
    return (
      <div className="card text-center py-12">
        <svg
          className="w-16 h-16 mx-auto text-gray-400 mb-4"
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
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No links yet</h3>
        <p className="text-gray-500">Create your first short link using the form above.</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Short Code</th>
              <th>Target URL</th>
              <th className="text-center">Clicks</th>
              <th>Last Clicked</th>
              <th>Created</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {links.map((link) => (
              <tr key={link.code}>
                <td>
                  <div className="flex items-center gap-2">
                    <code className="bg-gray-100 px-2 py-1 rounded font-mono text-primary-600">
                      <a href={link.shortUrl} target="_blank" rel="noopener noreferrer">{link.code}</a>
                    </code>
                    <CopyButton text={link.shortUrl} className="text-xs px-2 py-1" />
                  </div>
                </td>
                <td>
                  <a
                    href={link.targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-800 hover:underline"
                    title={link.targetUrl}
                  >
                    {truncateUrl(link.targetUrl)}
                  </a>
                </td>
                <td className="text-center">
                  <span className="badge badge-info font-semibold">
                    {link.clickCount}
                  </span>
                </td>
                <td className="text-gray-600">
                  {formatDate(link.lastClickedAt)}
                </td>
                <td className="text-gray-600">
                  {formatDate(link.createdAt)}
                </td>
                <td>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => navigate(`/code/${link.code}`)}
                      className="btn btn-secondary text-xs px-3 py-1"
                    >
                      Stats
                    </button>
                    <button
                      onClick={() => handleDelete(link.code)}
                      disabled={deletingCode === link.code}
                      className="btn btn-danger text-xs px-3 py-1 flex items-center gap-1"
                    >
                      {deletingCode === link.code ? (
                        <>
                          <Loader size="sm" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Delete
                        </>
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
