"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { useRegister } from "@/hooks/auth/useRegister";

const formSchema = z.object({
  firstname: z
    .string()
    .min(2, "First name must be at least 2 characters.")
    .max(32, "First name must be at most 32 characters."),
  surname: z
    .string()
    .min(2, "Surname must be at least 2 characters.")
    .max(32, "Surname must be at most 32 characters."),
  email: z.string().email("Enter a valid email address."),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters.")
    .max(64, "Password must be at most 64 characters."),
});

export function RegisterForm() {
  const { register, loading } = useRegister();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      surname: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
    await register(data)
  }

  return (
    <form id="form-register" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        {/* First Name */}
        <div className="w-full grid grid-cols-2 gap-4">
          <Controller
            name="firstname"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-register-firstname">
                  First Name
                </FieldLabel>
                <Input
                  {...field}
                  id="form-register-firstname"
                  aria-invalid={fieldState.invalid}
                  placeholder="John"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Surname */}
          <Controller
            name="surname"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-register-surname">Surname</FieldLabel>
                <Input
                  {...field}
                  id="form-register-surname"
                  aria-invalid={fieldState.invalid}
                  placeholder="Doe"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        {/* Email */}
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-register-email">Email</FieldLabel>
              <Input
                {...field}
                id="form-register-email"
                aria-invalid={fieldState.invalid}
                placeholder="john@example.com"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Password */}
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-register-password">Password</FieldLabel>
              <Input
                {...field}
                id="form-register-password"
                type="password"
                aria-invalid={fieldState.invalid}
                placeholder="••••••••"
                autoComplete="off"
              />
              <FieldDescription>
                Your password should be at least 6 characters.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <Field orientation="horizontal" className="w-full py-2">
        <Button type="submit" form="form-register" className="w-full">
          {loading ? <Spinner/> : null} Register
        </Button>
      </Field>
    </form>
  );
}
