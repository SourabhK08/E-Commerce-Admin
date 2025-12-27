type StatCardProps = {
  title: string;
  value: string | number;
};

export default function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow border border-black dark:border-gray-400 ">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {title}
      </p>
      <h3 className="text-2xl font-bold mt-2">
        {value}
      </h3>
    </div>
  );
}
