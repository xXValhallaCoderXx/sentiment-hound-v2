"use client";

import {
  TextInput,
  PasswordInput,
  type TextInputProps,
  type PasswordInputProps,
} from "@mantine/core";

interface FormFieldProps extends Omit<TextInputProps, "type"> {
  type?: "text" | "email" | "password";
  label: string;
  placeholder?: string;
}

export const FormField = ({
  type = "text",
  label,
  placeholder,
  ...props
}: FormFieldProps) => {
  if (type === "password") {
    return (
      <PasswordInput
        label={label}
        placeholder={placeholder}
        size="md"
        {...(props as PasswordInputProps)}
      />
    );
  }

  return (
    <TextInput
      type={type}
      label={label}
      placeholder={placeholder}
      size="md"
      {...props}
    />
  );
};

export default FormField;
