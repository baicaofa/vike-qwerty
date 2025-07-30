import { ForgotPasswordForm } from "./components/ForgotPasswordForm";
import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";
import { ResetPasswordForm } from "./components/ResetPasswordForm";
import type { View } from "./type";
import Header from "@/components/Header";
import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { usePageContext } from "vike-react/usePageContext";

export default function Page({
  pageContext: pageContextProp,
}: {
  pageContext?: any;
}) {
  const [view, setView] = useState<View>("login");
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const pageContextFromHook = usePageContext();
  const pageContext = pageContextFromHook || pageContextProp;
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const modeParam = params.get("mode");
    const tokenParam = params.get("token");
    const emailParam = params.get("email");

    if (modeParam === "resetPassword" && tokenParam && emailParam) {
      setToken(tokenParam);
      setEmail(emailParam);
      setView("resetPassword");
    }
  }, []);

  return (
    <Layout>
      <Header pageContext={pageContext} />
      <div className="flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg space-y-8 bg-white p-8 rounded-xl shadow-lg">
          {view === "login" && <LoginForm setView={setView} />}
          {view === "register" && <RegisterForm setView={setView} />}
          {view === "forgotPassword" && (
            <ForgotPasswordForm setView={setView} />
          )}
          {view === "resetPassword" && token && email && (
            <ResetPasswordForm token={token} email={email} setView={setView} />
          )}
        </div>
      </div>
    </Layout>
  );
}
