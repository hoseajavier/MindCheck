export default function SkeletonLoading() {
  return (
    <div className="flex-1 bg-[#F8FAFC] p-4 sm:p-6 md:p-8 pt-20 md:pt-8 animate-pulse space-y-6">
      <div className="space-y-3 border-b border-gray-200/50 pb-5">
        <div className="h-8 w-48 sm:w-64 bg-gray-200 rounded-lg" />
        <div className="h-4 w-full max-w-md bg-gray-200 rounded-md" />
      </div>

      <div className="h-32 sm:h-40 bg-gray-200 rounded-2xl sm:rounded-3xl" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="h-24 sm:h-28 bg-gray-200 rounded-2xl sm:rounded-3xl" />
        <div className="h-24 sm:h-28 bg-gray-200 rounded-2xl sm:rounded-3xl" />
      </div>

      <div className="h-60 sm:h-72 bg-gray-200 rounded-2xl sm:rounded-3xl" />

      <div className="space-y-3">
        <div className="h-16 bg-gray-200 rounded-xl sm:rounded-2xl" />
        <div className="h-16 bg-gray-200 rounded-xl sm:rounded-2xl" />
        <div className="h-16 bg-gray-200 rounded-xl sm:rounded-2xl" />
      </div>
    </div>
  );
}
