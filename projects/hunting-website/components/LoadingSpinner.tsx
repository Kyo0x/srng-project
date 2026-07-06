export default function LoadingSpinner() {
  // simple but does the job
  return (
    <div className="flex items-center justify-center min-h-[400px] bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
    </div>
  );
}
