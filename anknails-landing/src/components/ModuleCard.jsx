export default function ModuleCard({ title }) {
  return (
    <div className="rounded-2xl bg-white/70 dark:bg-white/10 border border-pink-100 dark:border-neutral-700 backdrop-blur-md p-6 shadow-md hover:shadow-pink-200 dark:hover:shadow-pink-900 transition-all transform hover:-translate-y-1">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
        {title}
      </h2>
    </div>
  );
}
