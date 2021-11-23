import { ReactNode } from "react";
import { Form } from "remix";

export interface Props {
  children: ReactNode;
  className?: string;
}

export type ActionData<
  FieldErrors = Record<string, string>,
  Fields = Record<string, any>
> = { formError?: string; fieldErrors?: FieldErrors; fields: Fields };

export default function CustomForm({
  children,
  className,
}: Props) {
 
  return (
    <Form method="post" className={className}>
      {children}
    </Form>
  );
}
