'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { upload } from '@vercel/blob/client';
import { Skeleton } from '@/components/Skeleton';
import { ErrorDisplay } from '@/components/ErrorDisplay';

interface ImageAsset {
  url: string;
  pathname: string;
  filename: string;
  size: number;
  uploadedAt: string;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('nb-NO', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
}

export default function ImagesPage() {
  const router = useRouter();
  const { status } = useSession();

  const [images, setImages] = useState<ImageAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [deletingUrl, setDeletingUrl] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login');
  }, [status, router]);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/images');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to load images');
      setImages(data.images);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load images');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated') fetchImages();
  }, [status, fetchImages]);

  const uploadFiles = async (files: FileList | File[]) => {
    const fileList = Array.from(files);
    if (fileList.length === 0) return;

    setUploading(true);
    setUploadError(null);

    const results: ImageAsset[] = [];
    const errors: string[] = [];

    for (const file of fileList) {
      try {
        const ext = file.name.split('.').pop() ?? 'bin';
        const base = file.name.replace(/\.[^.]+$/, '').replace(/[^a-z0-9]/gi, '-').toLowerCase();
        const suffix = Math.random().toString(36).slice(2, 8);
        const pathname = `site-images/${base}-${suffix}.${ext}`;

        const blob = await upload(pathname, file, {
          access: 'public',
          handleUploadUrl: '/api/admin/images/upload',
        });

        results.push({
          url: blob.url,
          pathname: blob.pathname,
          filename: file.name,
          size: file.size,
          uploadedAt: new Date().toISOString(),
        });
      } catch (err) {
        errors.push(`${file.name}: ${err instanceof Error ? err.message : 'Failed'}`);
      }
    }

    if (results.length > 0) setImages(prev => [...results, ...prev]);
    if (errors.length > 0) setUploadError(errors.join('\n'));
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) uploadFiles(e.target.files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) uploadFiles(e.dataTransfer.files);
  };

  const copyUrl = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const deleteImage = async (url: string) => {
    setDeletingUrl(url);
    setConfirmDelete(null);
    try {
      const res = await fetch('/api/admin/images', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Delete failed');
      }
      setImages(prev => prev.filter(img => img.url !== url));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setDeletingUrl(null);
    }
  };

  if (status === 'loading' || status === 'unauthenticated') return null;

  return (
    <main className="flex-1 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <button
            onClick={() => router.push('/admin')}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors mb-4 inline-flex items-center gap-1"
          >
            ← Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Image Library</h1>
          <p className="text-sm text-gray-400 mt-1">Upload images and copy links to use around the site</p>
        </div>

        {/* Upload area */}
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`relative mb-8 border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer
            ${dragOver ? 'border-primary-400 bg-primary-50' : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'}
            ${uploading ? 'cursor-not-allowed opacity-60' : ''}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
            className="sr-only"
            onChange={handleFileChange}
            disabled={uploading}
          />
          {uploading ? (
            <p className="text-sm text-gray-500">Uploading...</p>
          ) : (
            <>
              <p className="text-sm font-medium text-gray-700">Drop images here or click to upload</p>
              <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP, GIF, SVG</p>
            </>
          )}
        </div>

        {uploadError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 whitespace-pre-line">
            {uploadError}
            <button onClick={() => setUploadError(null)} className="ml-3 text-red-400 hover:text-red-600 text-xs underline">Dismiss</button>
          </div>
        )}

        {error && <ErrorDisplay error={error} onRetry={fetchImages} />}

        {/* Image grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-20 text-gray-400 text-sm">
            No images yet. Upload your first one above.
          </div>
        ) : (
          <>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
              {images.length} image{images.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map(img => (
                <div key={img.url} className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-sm transition-shadow">
                  {/* Thumbnail */}
                  <div className="aspect-square bg-gray-50 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt={img.filename}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Info + actions */}
                  <div className="p-3">
                    <p className="text-xs font-medium text-gray-800 truncate mb-0.5" title={img.filename}>
                      {img.filename}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatBytes(img.size)} · {formatDate(img.uploadedAt)}
                    </p>

                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => copyUrl(img.url)}
                        className={`flex-1 text-xs py-1.5 px-2 rounded-lg border transition-colors ${
                          copiedUrl === img.url
                            ? 'bg-green-50 border-green-200 text-green-700'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {copiedUrl === img.url ? 'Copied!' : 'Copy link'}
                      </button>

                      {confirmDelete === img.url ? (
                        <button
                          onClick={() => deleteImage(img.url)}
                          disabled={deletingUrl === img.url}
                          className="text-xs py-1.5 px-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                          {deletingUrl === img.url ? '...' : 'Sure?'}
                        </button>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(img.url)}
                          className="text-xs py-1.5 px-2 rounded-lg border border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-400 transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </div>

                    {/* URL preview */}
                    <p
                      onClick={() => copyUrl(img.url)}
                      className="mt-2 text-xs text-gray-300 truncate cursor-pointer hover:text-primary-400 transition-colors"
                      title={img.url}
                    >
                      {img.url}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
