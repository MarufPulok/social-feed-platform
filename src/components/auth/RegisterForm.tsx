"use client";

import { registerReqSchema } from "@/dtos/request/auth.req.dto";
import { useRegister } from "@/hooks/useAuthQuery";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const registerFormSchema = registerReqSchema
  .extend({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to terms & conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerFormSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registerMutation = useRegister();

  // Handle OAuth errors
  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      const errorMessages: Record<string, string> = {
        oauth_failed: "Google sign-in failed. Please try again.",
        oauth_cancelled: "Google sign-in was cancelled.",
        oauth_not_configured: "Google sign-in is not configured.",
        invalid_token: "Invalid authentication token.",
        no_email: "No email found in Google account.",
        account_inactive: "Your account is inactive. Please contact support.",
      };
      toast.error(errorMessages[error] || "An error occurred during sign-in.");

      // Remove error from URL
      const newUrl = window.location.pathname;
      router.replace(newUrl);
    }
  }, [searchParams, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerMutation.mutateAsync({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });
      toast.success("Registration successful!");
      router.push("/feed");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleGoogleSignIn = () => {
    window.location.href = "/api/auth/google";
  };
  return (
    <section className="_social_registration_wrapper _layout_main_wrapper">
      <div className="_shape_one">
        <Image
          src="/svg/shape1.svg"
          alt=""
          className="_shape_img"
          width={200}
          height={200}
        />
        <Image
          src="/svg/dark_shape.svg"
          alt=""
          className="_dark_shape"
          width={200}
          height={200}
        />
      </div>
      <div className="_shape_two">
        <Image
          src="/svg/shape2.svg"
          alt=""
          className="_shape_img"
          width={200}
          height={200}
        />
        <Image
          src="/svg/dark_shape1.svg"
          alt=""
          className="_dark_shape _dark_shape_opacity"
          width={200}
          height={200}
        />
      </div>
      <div className="_shape_three">
        <Image
          src="/svg/shape3.svg"
          alt=""
          className="_shape_img"
          width={200}
          height={200}
        />
        <Image
          src="/svg/dark_shape2.svg"
          alt=""
          className="_dark_shape _dark_shape_opacity"
          width={200}
          height={200}
        />
      </div>
      <div className="_social_registration_wrap">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
              <div className="_social_registration_right">
                <div className="_social_registration_right_image">
                  <Image
                    src="/assets/images/registration.png"
                    alt="Image"
                    width={800}
                    height={600}
                  />
                </div>
                <div className="_social_registration_right_image_dark">
                  <Image
                    src="/assets/images/registration1.png"
                    alt="Image"
                    width={800}
                    height={600}
                  />
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
              <div className="_social_registration_content">
                <div className="_social_registration_right_logo _mar_b28">
                  <Image
                    src="/svg/logo.svg"
                    alt="Image"
                    className="_right_logo"
                    width={150}
                    height={50}
                  />
                </div>
                <p className="_social_registration_content_para _mar_b8">
                  Get Started Now
                </p>
                <h4 className="_social_registration_content_title _titl4 _mar_b50">
                  Registration
                </h4>
                <button
                  type="button"
                  className="_social_registration_content_btn _mar_b40"
                  onClick={handleGoogleSignIn}
                >
                  <Image
                    src="/svg/google.svg"
                    alt="Image"
                    className="_google_img"
                    width={20}
                    height={20}
                  />{" "}
                  <span className="font-bold">Register with google</span>
                </button>
                <div className="_social_registration_content_bottom_txt _mar_b40">
                  {" "}
                  <span>Or</span>
                </div>
                <form
                  className="_social_registration_form"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div className="row">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8">
                          First Name
                        </label>
                        <input
                          type="text"
                          className={`form-control _social_registration_input ${
                            errors.firstName ? "border-red-500" : ""
                          }`}
                          {...register("firstName")}
                          disabled={registerMutation.isPending}
                        />
                        {errors.firstName && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.firstName.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8">
                          Last Name
                        </label>
                        <input
                          type="text"
                          className={`form-control _social_registration_input ${
                            errors.lastName ? "border-red-500" : ""
                          }`}
                          {...register("lastName")}
                          disabled={registerMutation.isPending}
                        />
                        {errors.lastName && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.lastName.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8">
                          Email
                        </label>
                        <input
                          type="email"
                          className={`form-control _social_registration_input ${
                            errors.email ? "border-red-500" : ""
                          }`}
                          {...register("email")}
                          disabled={registerMutation.isPending}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8">
                          Password
                        </label>
                        <input
                          type="password"
                          className={`form-control _social_registration_input ${
                            errors.password ? "border-red-500" : ""
                          }`}
                          {...register("password")}
                          disabled={registerMutation.isPending}
                        />
                        {errors.password && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.password.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8">
                          Repeat Password
                        </label>
                        <input
                          type="password"
                          className={`form-control _social_registration_input ${
                            errors.confirmPassword ? "border-red-500" : ""
                          }`}
                          {...register("confirmPassword")}
                          disabled={registerMutation.isPending}
                        />
                        {errors.confirmPassword && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.confirmPassword.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
                      <div className="form-check _social_registration_form_check">
                        <input
                          className={`form-check-input _social_registration_form_check_input ${
                            errors.agreeToTerms ? "border-red-500" : ""
                          }`}
                          type="checkbox"
                          id="agreeToTerms"
                          {...register("agreeToTerms")}
                          disabled={registerMutation.isPending}
                        />
                        <label
                          className="form-check-label _social_registration_form_check_label"
                          htmlFor="agreeToTerms"
                        >
                          I agree to terms & conditions
                        </label>
                      </div>
                      {errors.agreeToTerms && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.agreeToTerms.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-xl-12 col-sm-12">
                      <div className="_social_registration_form_btn _mar_t40 _mar_b60">
                        <button
                          type="submit"
                          className="_social_registration_form_btn_link _btn1"
                          disabled={registerMutation.isPending}
                        >
                          {registerMutation.isPending
                            ? "Registering..."
                            : "Register now"}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
                <div className="row">
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                    <div className="_social_registration_bottom_txt">
                      <p className="_social_registration_bottom_txt_para">
                        Already have an account?{" "}
                        <Link href="/login">Login here</Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
