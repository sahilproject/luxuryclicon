"use client";

import { useRouter } from "next/navigation";
import Signin from "../../Components/SinginForm";

export default function SigninPage() {
  const router = useRouter();

  const handleClose = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-start justify-center pt-12">
      <Signin onClose={handleClose} />
    </div>
  );
}