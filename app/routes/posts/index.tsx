import type { Post } from "@prisma/client";
import { LoaderFunction, useLoaderData, Link } from "remix";
import { db } from "~/utils/db.server";

interface LoaderData {
  posts: Post[];
}

export let loader: LoaderFunction = async () => {
  const posts = await db.post.findMany({
    select: {
      id: true,
      slug: true,
      title: true,
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
    where: {},
    orderBy: {
      createdAt: 'desc'
    }
  });

  return { posts };
};

export default function Home() {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4">
      <div className="flex align-items center justify-between">
        <h1 className="text-8xl font-extrabold text-gray-900 mt-8 mb-12">
          Posts
        </h1>
        <div className="flex items-center">
          <Link
            className="inline-flex items-center px-4 py-1.5 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-500 focus:border-purple-700 active:bg-purple-700 transition ease-in-out duration-150 disabled:cursor-not-allowed"
            to={`/posts/new`}
          >
            Add new Post
          </Link>
        </div>
      </div>
      <div>
        {data?.posts.map((post) => {
          return (
            <div
              className="bg-gray-50 py-4 px-4 mb-6 rounded-lg flex justify-between items-center"
              key={post.id}
            >
              <h3 className="text-4xl text-gray-900 font-semibold">
                {post.title}
              </h3>
              <Link
                className="inline-flex items-center px-4 py-1.5 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-500 focus:border-purple-700 active:bg-purple-700 transition ease-in-out duration-150 disabled:cursor-not-allowed"
                to={`/posts/${post.slug}`}
              >
                Read post
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
