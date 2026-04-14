import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function UsersPage() {
  const { data: users } = await supabase
    .from("profiles")
    .select("id, email, full_name, plan, created_at, status")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark dark:text-white">User Management</h1>
        <p className="text-sm text-dark-6 mt-1">{users?.length || 0} users shown</p>
      </div>

      <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stroke dark:border-dark-3">
              <th className="px-6 py-4 text-left text-sm font-semibold text-dark dark:text-white">
                User
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-dark dark:text-white">
                Plan
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-dark dark:text-white">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-dark dark:text-white">
                Joined
              </th>
            </tr>
          </thead>
          <tbody>
            {(users || []).map((user) => (
              <tr
                key={user.id}
                className="border-b border-stroke dark:border-dark-3 hover:bg-gray-2 dark:hover:bg-dark-2"
              >
                <td className="px-6 py-4">
                  <p className="font-medium text-dark dark:text-white text-sm">
                    {user.full_name || "—"}
                  </p>
                  <p className="text-xs text-dark-6">{user.email}</p>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      user.plan === "elite"
                        ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                        : user.plan === "pro"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                          : user.plan === "starter"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                    }`}
                  >
                    {user.plan || "free"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      user.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.status || "active"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-dark-6">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
