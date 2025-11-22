"use client";

import LoginForm from "@/components/auth/LoginForm";
import useAuthAction from "@/hooks/useAuthAction";
import { LoginRequest } from "@/lib/dtos/request/auth.req";
import Image from "next/image";

export default function LoginPage() {
  const { loginMutation } = useAuthAction();

  const onSubmit = (data: LoginRequest) => {
    loginMutation.mutate(data);
  };

  return (
    <section className="_social_login_wrapper _layout_main_wrapper">
      <div className="_shape_one">
        <Image
          src="/assets/images/shape1.svg"
          alt=""
          className="_shape_img"
          width={100}
          height={100}
        />
        <Image
          src="/assets/images/dark_shape.svg"
          alt=""
          className="_dark_shape"
          width={100}
          height={100}
        />
      </div>
      <div className="_shape_two">
        <Image
          src="/assets/images/shape2.svg"
          alt=""
          className="_shape_img"
          width={100}
          height={100}
        />
        <Image
          src="/assets/images/dark_shape1.svg"
          alt=""
          className="_dark_shape _dark_shape_opacity"
          width={100}
          height={100}
        />
      </div>
      <div className="_shape_three">
        <Image
          src="/assets/images/shape3.svg"
          alt=""
          className="_shape_img"
          width={100}
          height={100}
        />
        <Image
          src="/assets/images/dark_shape2.svg"
          alt=""
          className="_dark_shape _dark_shape_opacity"
          width={100}
          height={100}
        />
      </div>
      <div className="_social_login_wrap">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
              <div className="_social_login_left">
                <div className="_social_login_left_image">
                  <Image
                    src="/assets/images/login.png"
                    alt="Image"
                    className="_left_img"
                    width={800}
                    height={600}
                  />
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
              <LoginForm
                onSubmit={onSubmit}
                isPending={loginMutation.isPending}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
