import { ReactNode } from "react";
import { Form, useActionData } from "remix";

export interface Props {
  children: ReactNode;
  className?: string;
}

export type ActionData<
  FieldErrors = Record<string, string>,
  Fields = Record<string, any>
> = { formError?: string; fieldErrors?: FieldErrors; fields: Fields };

export default function CustomForm({ children, className }: Props) {
  const actionData = useActionData<ActionData>();
  const formError = actionData?.formError;

  return (
    <Form method="post" className={className}>
      {children}
      {formError ? (
        <div className="bg-red-200 py-5 px-3 text-red-700">
          <p>{formError}</p>
        </div>
      ) : null}
    </Form>
  );
}
