"use client";

import Image from "next/image";
import RegisterForm from "@/components/auth/RegisterForm";
import useAuthAction from "@/hooks/useAuthAction";
import { RegisterRequest } from "@/lib/dtos/request/auth.req";

export default function RegisterPage() {
  const { registerMutation } = useAuthAction();

  const onSubmit = (data: RegisterRequest) => {
    registerMutation.mutate(data);
  };

  return (
    <section className="_social_registration_wrapper _layout_main_wrapper">
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
              <RegisterForm onSubmit={onSubmit} isPending={registerMutation.isPending} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

