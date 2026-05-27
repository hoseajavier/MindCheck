export default function SkeletonLoading() {
  return (
    <div className="flex-1 bg-[#F8FAFC] p-8 animate-pulse">
      <div className="space-y-6">
        <div>
          <div className="h-10 w-64 bg-gray-300 rounded mb-3" />

          <div className="h-5 w-96 bg-gray-300 rounded" />
        </div>

        <div className="h-36 bg-gray-300 rounded-3xl" />

        <div className="grid md:grid-cols-2 gap-6">
          <div className="h-28 bg-gray-300 rounded-3xl" />

          <div className="h-28 bg-gray-300 rounded-3xl" />
        </div>

        <div className="h-72 bg-gray-300 rounded-3xl" />

        <div className="space-y-4">
          <div className="h-20 bg-gray-300 rounded-2xl" />

          <div className="h-20 bg-gray-300 rounded-2xl" />

          <div className="h-20 bg-gray-300 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
