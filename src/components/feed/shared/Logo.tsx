import Image from "next/image";

export default function Logo() {
  return (
    <Image
      src="/assets/images/logo.svg"
      alt="BuddyScript"
      width={0}
      height={0}
      className="_nav_logo"
      style={{ width: "auto", height: "auto" }}
      priority
    />
  );
}
