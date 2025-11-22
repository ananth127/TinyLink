import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLinkStats } from '../api/links';
import Loader from '../components/Loader';
import CopyButton from '../components/CopyButton';

export default function Stats() {
    const { code } = useParams();
    const navigate = useNavigate();
    const [link, setLink] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchStats = async () => {
        try {
            setError('');
            const data = await getLinkStats(code);
            setLink(data);
        } catch (err) {
            if (err.response?.status === 404) {
                setError('Link not found. It may have been deleted.');
            } else {
                setError('Failed to load link stats. Please try again.');
            }
            console.error('Fetch error:', err);
        }
    };

    useEffect(() => {
        // Fetch stats on mount
        setLoading(true);
        fetchStats().finally(() => setLoading(false));

        // Auto-refresh click stats every 1s (without showing loader)
        const intervalId = setInterval(fetchStats, 1000);
        return () => clearInterval(intervalId);
    }, [code]);

    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader size="lg" />
            </div>
        );
    }

    if (error || !link) {
        return (
            <div className="min-h-screen bg-gray-50">
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <button
                            onClick={() => navigate('/')}
                            className="btn btn-secondary"
                        >
                            ← Back to Dashboard
                        </button>
                    </div>
                </header>
                <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="card text-center py-12">
                        <svg
                            className="w-16 h-16 mx-auto text-red-400 mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Error</h3>
                        <p className="text-gray-500 mb-4">{error}</p>
                        <button onClick={() => navigate('/')} className="btn btn-primary">
                            Go to Dashboard
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => navigate('/')}
                            className="btn btn-secondary"
                        >
                            ← Back to Dashboard
                        </button>
                        <h1 className="text-xl font-bold text-gray-900">Link Statistics</h1>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-6">
                    {/* Overview Card */}
                    <div className="card">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-3 border-b border-gray-200">
                                <span className="text-gray-600 font-medium">Short Code</span>
                                <code className="bg-primary-50 text-primary-700 px-3 py-1 rounded font-mono font-semibold">
                                    {link.code}
                                </code>
                            </div>
                            <div className="flex items-center justify-between py-3 border-b border-gray-200">
                                <span className="text-gray-600 font-medium">Short URL</span>
                                <div className="flex items-center gap-2">
                                    <a
                                        href={link.shortUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary-600 hover:text-primary-800 hover:underline font-mono"
                                    >
                                        {link.shortUrl}
                                    </a>
                                    <CopyButton text={link.shortUrl} />
                                </div>
                            </div>
                            <div className="flex items-center justify-between py-3 border-b border-gray-200">
                                <span className="text-gray-600 font-medium">Target URL</span>
                                <a
                                    href={link.targetUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary-600 hover:text-primary-800 hover:underline max-w-md truncate"
                                    title={link.targetUrl}
                                >
                                    {link.targetUrl}
                                </a>
                            </div>
                            <div className="flex items-center justify-between py-3 border-b border-gray-200">
                                <span className="text-gray-600 font-medium">Created</span>
                                <span className="text-gray-900">{formatDate(link.createdAt)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="card bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-primary-700 mb-1">Total Clicks</p>
                                    <p className="text-4xl font-bold text-primary-900">{link.clickCount}</p>
                                </div>
                                <div className="bg-primary-200 p-4 rounded-full">
                                    <svg
                                        className="w-8 h-8 text-primary-700"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-700 mb-1">Last Clicked</p>
                                    <p className="text-lg font-semibold text-green-900">
                                        {formatDate(link.lastClickedAt)}
                                    </p>
                                </div>
                                <div className="bg-green-200 p-4 rounded-full">
                                    <svg
                                        className="w-8 h-8 text-green-700"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Info Card */}
                    <div className="card bg-blue-50 border-blue-200">
                        <div className="flex items-start gap-3">
                            <svg
                                className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <div>
                                <h3 className="font-semibold text-blue-900 mb-1">About Click Tracking</h3>
                                <p className="text-sm text-blue-700">
                                    Every time someone visits your short link, we track the click and update the
                                    statistics. The "Last Clicked" timestamp shows when the link was most recently
                                    accessed.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
