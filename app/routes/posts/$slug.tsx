import { Post } from "@prisma/client";
import { useLoaderData, LoaderFunction } from "remix";
import { db } from "~/utils/db.server";

interface LoaderData {
  post: Post;
}

export let loader: LoaderFunction = async ({ params }) => {
  const post = await db.post.findUnique({ where: { slug: params.slug } });
  return {
    post,
  };
};

export default function Post() {
  const data = useLoaderData<LoaderData>();

  if (!data.post) return null;

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4">
      <div className="text-6xl font-extrabold text-gray-900 mt-8">
        {data.post.title}
      </div>
      <div className="mt-12">{data.post.content}</div>
    </div>
  );
}
