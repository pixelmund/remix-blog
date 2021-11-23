import { Outlet } from "remix";

export default function Auth() {
  return (
    <div className="max-w-xl mx-auto p-8 bg-gray-50 md:mt-16 rounded-lg">
      <Outlet />
    </div>
  );
}
