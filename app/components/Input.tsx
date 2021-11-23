import { InputHTMLAttributes } from "react";
import { useActionData } from "remix";

export interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
}

export type ActionData<
  FieldErrors = Record<string, string>,
  Fields = Record<string, any>
> = { formError?: string; fieldErrors?: FieldErrors; fields: Fields };

export function Input({
  name,
  defaultValue,
  label,
  type,
  className,
  ...restProps
}: Props) {
  const actionData = useActionData();
  const actionDataInitialValue = actionData?.fields?.[name];
  const actionDataError = actionData?.fieldErrors?.[name];
  const isInvalid = Boolean(actionDataError);

  return (
    <label className="block mt-4">
      <span className="block mb-2 text-sm text-gray-700 font-light">
        {label}
      </span>
      <input
        className={`block py-2.5 px-4 bg-gray-100 rounded-md text-gray-900 ${className}`}
        type={type}
        defaultValue={actionDataInitialValue ?? defaultValue}
        name={name}
        {...restProps}
        aria-invalid={isInvalid}
        aria-describedby={isInvalid ? `${name}-error` : undefined}
      />
      {isInvalid && (
        <p className="form-validation-error" role="alert" id={`${name}-error`}>
          {actionDataError}
        </p>
      )}
    </label>
  );
}
