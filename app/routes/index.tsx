import { LoaderFunction, useLoaderData, ActionFunction } from "remix";
import { Link } from "react-router-dom";
import { getUserFromSession, logout } from "~/utils/session.server";
import { User } from "@prisma/client";
import Form from "~/components/Form";

interface LoaderData {
  user: User | null;
}

export let loader: LoaderFunction = async ({ request }) => {
  const user = await getUserFromSession(request);

  return {
    user,
  };
};

export let action: ActionFunction = async ({ request }) => {
  return logout(request);
};

export default function Home() {
  const { user } = useLoaderData<LoaderData>();

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4 mt-12">
      <h1 className="text-8xl font-extrabold text-gray-900 mt-8">Remix Blog</h1>
      <p className="text-3xl text-gray-900 font-medium mt-6">
        It uses express, prisma, zod for validation and offers authentication/sessions as well as integrated tailwindcss
      </p>
      <div className="mt-12">
        {Boolean(user) ? (
          <div className="flex items-center">
            Hello {user!.username}{" "}
            <Form>
              <button
                className="ml-4 bg-gray-100 px-3 py-1.5 rounded-md"
                type="submit"
              >
                Logout
              </button>
            </Form>
          </div>
        ) : (
          <div>
            <Link
              className="bg-gray-100 px-3 py-1.5 rounded-md"
              to="/auth/login"
            >
              Login
            </Link>
          </div>
        )}
        <Link
          to="/posts"
          className="inline-flex items-center px-4 py-1.5 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-500 focus:border-purple-700 active:bg-purple-700 transition ease-in-out duration-150 disabled:cursor-not-allowed mt-8"
        >
          View Posts
        </Link>
      </div>
    </div>
  );
}
