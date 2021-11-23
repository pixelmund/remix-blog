import { Post } from "@prisma/client";
import { LoaderFunction, ActionFunction, redirect } from "remix";
import Form from "~/components/Form";
import { SubmitButton } from "~/components/SubmitButton";
import { z } from "zod";
import { Input, ActionData } from "~/components/Input";
import { db } from "~/utils/db.server";
import { getUserId, requireUserId } from "~/utils/session.server";
import { convertIssues } from "~/utils/zod";
import { TextArea } from "~/components/TextArea";

export let loader: LoaderFunction = async ({ request }) => {
  return requireUserId(request);
};

const PostSchema = z.object({
  title: z.string({}).min(6),
  content: z.string({}).min(6),
});

type PostSchemaType = z.infer<typeof PostSchema>;
type PostSchemaError = Record<keyof PostSchemaType, string | undefined>;
type NewPostAction = ActionData<PostSchemaError, PostSchemaType>;

function convertToSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
}

export let action: ActionFunction = async ({
  request,
}): Promise<Response | NewPostAction> => {
  const userId = await getUserId(request);

  let form = await request.formData();
  let title = form.get("title") as string;
  let content = form.get("content") as string;

  const fields = {
    title,
    content,
  };

  const input = await PostSchema.safeParseAsync(fields);

  if (!input.success) {
    return {
      fields,
      fieldErrors: convertIssues(input.error.issues),
    };
  }

  try {
    const post = await db.post.create({
      data: {
        title: input.data.title,
        content: input.data.content,
        slug: convertToSlug(input.data.title),
        user: {
          connect: {
            id: userId!,
          },
        },
      },
    });

    return redirect(`/posts/${post.slug}`);
  } catch (error) {
    console.log(error);
    
    return {
      formError: "An unknown error occured",
      fields,
      fieldErrors: {
        title: "",
        content: "",
      },
    };
  }
};

export default function Post() {
  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4">
      <div className="text-7xl font-extrabold text-gray-900 mt-8">
        Create new Post
      </div>
      <Form className="mt-8">
        <Input className="w-full" name="title" type="text" label="Title" />
        <TextArea className="w-full" name="content" label="Content" />
        <SubmitButton className="mt-4">Publish</SubmitButton>
      </Form>
    </div>
  );
}
