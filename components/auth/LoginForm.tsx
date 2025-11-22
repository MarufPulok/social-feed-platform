"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SigninValidation } from "@/lib/validators/auth.validator";
import { LoginRequest } from "@/lib/dtos/request/auth.req";
import Image from "next/image";
import Link from "next/link";

interface LoginFormProps {
  onSubmit: (data: LoginRequest) => void;
  isPending?: boolean;
}

export default function LoginForm({ onSubmit, isPending = false }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: zodResolver(SigninValidation),
  });

  return (
    <div className="_social_login_content">
      <div className="_social_login_left_logo _mar_b28">
        <Image
          src="/assets/images/logo.svg"
          alt="Image"
          className="_left_logo"
          width={150}
          height={50}
        />
      </div>
      <p className="_social_login_content_para _mar_b8">Welcome back</p>
      <h4 className="_social_login_content_title _titl4 _mar_b50">
        Login to your account
      </h4>
      <button type="button" className="_social_login_content_btn _mar_b40">
        <Image
          src="/assets/images/google.svg"
          alt="Image"
          className="_google_img"
          width={20}
          height={20}
        />{" "}
        <span>Or sign-in with google</span>
      </button>
      <div className="_social_login_content_bottom_txt _mar_b40">
        {" "}
        <span>Or</span>
      </div>
      <form
        className="_social_login_form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="row">
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
            <div className="_social_login_form_input _mar_b14">
              <label className="_social_login_label _mar_b8">Email</label>
              <input
                type="email"
                className={`form-control _social_login_input ${
                  errors.email ? "is-invalid" : ""
                }`}
                {...register("email")}
              />
              {errors.email && (
                <div className="invalid-feedback d-block">
                  {errors.email.message}
                </div>
              )}
            </div>
          </div>
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
            <div className="_social_login_form_input _mar_b14">
              <label className="_social_login_label _mar_b8">Password</label>
              <input
                type="password"
                className={`form-control _social_login_input ${
                  errors.password ? "is-invalid" : ""
                }`}
                {...register("password")}
              />
              {errors.password && (
                <div className="invalid-feedback d-block">
                  {errors.password.message}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12">
            <div className="form-check _social_login_form_check">
              <input
                className="form-check-input _social_login_form_check_input"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault2"
                defaultChecked
              />
              <label
                className="form-check-label _social_login_form_check_label"
                htmlFor="flexRadioDefault2"
              >
                Remember me
              </label>
            </div>
          </div>
          <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12">
            <div className="_social_login_form_left">
              <p className="_social_login_form_left_para">Forgot password?</p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12 col-md-12 col-xl-12 col-sm-12">
            <div className="_social_login_form_btn _mar_t40 _mar_b60">
              <button
                type="submit"
                className="_social_login_form_btn_link _btn1"
                disabled={isPending}
              >
                {isPending ? "Logging in..." : "Login now"}
              </button>
            </div>
          </div>
        </div>
      </form>
      <div className="row">
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <div className="_social_login_bottom_txt">
            <p className="_social_login_bottom_txt_para">
              Dont have an account?{" "}
              <Link href="/auth/register">Create New Account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

