import { useState } from 'react';
import { createLink } from '../api/links';
import Loader from './Loader';

export default function LinkForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    targetUrl: '',
    customCode: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState({});

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateCode = (code) => {
    if (!code) return true; // Optional field
    const codePattern = /^[A-Za-z0-9]{6,8}$/;
    return codePattern.test(code);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setErrors({});

    // Validation
    const newErrors = {};
    
    if (!formData.targetUrl.trim()) {
      newErrors.targetUrl = 'URL is required';
    } else if (!validateUrl(formData.targetUrl)) {
      newErrors.targetUrl = 'Please enter a valid URL';
    }

    if (formData.customCode && !validateCode(formData.customCode)) {
      newErrors.customCode = 'Code must be 6-8 alphanumeric characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const data = await createLink({
        targetUrl: formData.targetUrl.trim(),
        customCode: formData.customCode.trim() || undefined,
      });

      setSuccess(`Link created successfully! Short URL: ${data.shortUrl}`);
      setFormData({ targetUrl: '', customCode: '' });
      
      if (onSuccess) {
        onSuccess(data);
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setError('This short code is already taken. Please choose another.');
      } else {
        setError(err.response?.data?.message || 'Failed to create link. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">Create Short Link</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="targetUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Target URL <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="targetUrl"
            name="targetUrl"
            value={formData.targetUrl}
            onChange={handleChange}
            placeholder="https://example.com/very/long/url"
            className={`input ${errors.targetUrl ? 'border-red-500 focus:ring-red-500' : ''}`}
            disabled={loading}
          />
          {errors.targetUrl && (
            <p className="text-red-500 text-sm mt-1">{errors.targetUrl}</p>
          )}
        </div>

        <div>
          <label htmlFor="customCode" className="block text-sm font-medium text-gray-700 mb-1">
            Custom Short Code (optional)
          </label>
          <input
            type="text"
            id="customCode"
            name="customCode"
            value={formData.customCode}
            onChange={handleChange}
            placeholder="mycode (6-8 characters)"
            className={`input ${errors.customCode ? 'border-red-500 focus:ring-red-500' : ''}`}
            disabled={loading}
            maxLength={8}
          />
          {errors.customCode && (
            <p className="text-red-500 text-sm mt-1">{errors.customCode}</p>
          )}
          <p className="text-gray-500 text-xs mt-1">
            Leave empty to auto-generate. Must be 6-8 alphanumeric characters.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader size="sm" />
              Creating...
            </>
          ) : (
            'Create Short Link'
          )}
        </button>
      </form>
    </div>
  );
}