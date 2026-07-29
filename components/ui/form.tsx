"use client";
import {
  FormProvider,
  type FieldValues,
  type FormProviderProps,
} from "react-hook-form";
import type { ReactNode } from "react";
export function Form<T extends FieldValues>(props: FormProviderProps<T>) {
  return <FormProvider {...props} />;
}
export function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700">
      {label}
      {children}
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
}
