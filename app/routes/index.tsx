import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4 mt-12">
      <h1 className="text-8xl font-extrabold text-gray-900 mt-8">
        Remix Blog
      </h1>
      <p className="text-3xl text-gray-900 font-medium mt-6">
        It uses prisma, zod for validation and offers authentication/sessions.
      </p>
      <Link
        to="/posts"
        className="inline-flex items-center px-4 py-1.5 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-500 focus:border-purple-700 active:bg-purple-700 transition ease-in-out duration-150 disabled:cursor-not-allowed mt-12"
      >
        View Posts
      </Link>
    </div>
  );
}
