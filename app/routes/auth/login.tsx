import { ActionFunction, LoaderFunction } from "remix";
import { useSearchParams, redirect } from "remix";
import {
  authenticateUser,
  createUserSession,
  getUserId,
} from "~/utils/session.server";
import { Input } from "~/components/Input";
import Form, { ActionData } from "~/components/Form";
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

const LoginSchema = z.object({
  email: z.string({}).email({}),
  password: z.string({}).min(6),
  redirectTo: z.string({}),
});

type LoginSchemaType = z.infer<typeof LoginSchema>;
type LoginSchemaError = Record<keyof LoginSchemaType, string | undefined>;
type LoginAction = ActionData<LoginSchemaError, LoginSchemaType>;

export let action: ActionFunction = async ({
  request,
}): Promise<Response | LoginAction> => {
  let form = await request.formData();
  let email = form.get("email") as string;
  let password = form.get("password") as string;
  let redirectTo = form.get("redirectTo") as string;

  const fields = {
    email,
    password,
    redirectTo,
  };

  const input = await LoginSchema.safeParseAsync(fields);

  if (!input.success) {
    return {
      fields,
      fieldErrors: convertIssues(input.error.issues),
    };
  }

  let user = await authenticateUser({
    email: input.data.email,
    password: input.data.password,
  });

  if (!user) {
    return {
      fields: input.data,
      formError: `Username/Password combination is incorrect`,
    };
  }

  return createUserSession(user.id, input.data.redirectTo);
};

export default function Login() {
  let [searchParams] = useSearchParams();
  return (
    <div className="content">
      <h1 className="text-6xl font-extrabold text-gray-900 text-center">
        Sign in
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
          name="password"
          type="password"
          label="Password"
        />
        <SubmitButton className="mt-4">Submit</SubmitButton>
      </Form>
    </div>
  );
}
