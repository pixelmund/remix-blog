import { ActionFunction, LoaderFunction } from "remix";
import { useSearchParams, redirect } from "remix";
import {
  createUser,
  createUserSession,
  getUserId,
} from "~/utils/session.server";
import { Input, ActionData } from "~/components/Input";
import Form from "~/components/Form";
import { SubmitButton } from "~/components/SubmitButton";
import { z } from "zod";
import { convertIssues } from "~/utils/zod";

export let loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);

  if (userId) {
    return redirect("/");
  }

  return {};
};

const RegisterSchema = z.object({
  email: z.string({}).email({}),
  username: z.string({}).min(4),
  password: z.string({}).min(6),
  redirectTo: z.string({}),
});

type RegisterSchemaType = z.infer<typeof RegisterSchema>;
type RegisterSchemaError = Record<keyof RegisterSchemaType, string | undefined>;
type RegisterAction = ActionData<RegisterSchemaError, RegisterSchemaType>;

export let action: ActionFunction = async ({
  request,
}): Promise<Response | RegisterAction> => {
  let form = await request.formData();
  let username = form.get("username") as string;
  let email = form.get("email") as string;
  let password = form.get("password") as string;
  let redirectTo = form.get("redirectTo") as string;

  const fields = {
    email,
    password,
    username,
    redirectTo,
  };

  const input = await RegisterSchema.safeParseAsync(fields);

  if (!input.success) {
    return {
      fields,
      fieldErrors: convertIssues(input.error.issues),
    };
  }

  let userOrError = await createUser({
    email: input.data.email,
    username: input.data.username,
    password: input.data.password,
  });

  if (typeof userOrError === "string") {
    return {
      fields: input.data,
      formError: userOrError,
    };
  }

  return createUserSession(userOrError.id, input.data.redirectTo);
};

export default function Register() {
  let [searchParams] = useSearchParams();
  return (
    <div className="content">
      <h1 className="text-6xl font-extrabold text-gray-900 text-center">
        Sign up
      </h1>
      <Form className="mt-8">
        <input
          type="hidden"
          name="redirectTo"
          value={searchParams.get("redirectTo") ?? "/"}
        />
        <Input className="w-full" name="email" type="email" label="E-Mail" />
        <Input
          className="w-full"
          name="username"
          type="text"
          label="Username"
        />
        <Input
          className="w-full"
          name="password"
          type="password"
          label="Password"
        />
        <SubmitButton className="mt-4">Submit</SubmitButton>
      </Form>
    </div>
  );
}
