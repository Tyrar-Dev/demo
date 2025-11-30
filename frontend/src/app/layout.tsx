"use client";
import "./globals.css";
import Header from "@/components/layouts/header";
import Footer from "@/components/layouts/footer";
import { usePathname } from "next/navigation";
import { Toaster } from "sonner";
import { AnimatePresence } from "framer-motion";
import { Provider } from "react-redux";
import { persistor, store } from "@/redux/store";
import { useAutoLogin } from "@/hooks/useAutoLogin";
import ProtectedRoute from "@/components/auth/protechRoute";
import { PersistGate } from "redux-persist/integration/react";
import { useState } from "react";
import Sidebar from "@/components/admin/layouts/sidebar";
import HeaderAdmin from "@/components/admin/layouts/header";
import Chat from "@/components/chat/chat";

function AppWrapper({ children }: { children: React.ReactNode }) {
  useAutoLogin();
  return <>{children}</>;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [search, setSearch] = useState("");
  const isAuthRoute = pathname.startsWith("/auth");
  const isAdminRoute = pathname.startsWith("/admin");
  const isInformationRoute = pathname.startsWith("/information");
  const isUserRoute = !isAdminRoute && !isAuthRoute && !isInformationRoute;

  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <AppWrapper>
              <Toaster />

              {isAuthRoute && (
                <AnimatePresence mode="wait">
                  <div key={pathname}>{children}</div>
                </AnimatePresence>
              )}

              {isAdminRoute && (
                <ProtectedRoute roleAllowed="Admin">
                  <AnimatePresence mode="wait">
                    <div className="flex min-h-screen">
                      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                      <div className="flex-1 flex flex-col ml-64">
                        <HeaderAdmin search={search} setSearch={setSearch} />
                        <div>
                          {children}
                        </div>
                      </div>
                    </div>
                  </AnimatePresence>
                </ProtectedRoute>
              )}

              {isUserRoute && (
                <ProtectedRoute roleAllowed="User" allowGuest={true}>
                  <Header />
                  <AnimatePresence mode="wait">
                    <div key={pathname}>{children}</div>
                  </AnimatePresence>
                  <Footer />
                  <Chat />
                </ProtectedRoute>
              )}

              {isInformationRoute && (
                <AnimatePresence mode="wait">
                  <div key={pathname}>{children}</div>
                  <Chat />
                </AnimatePresence>
              )}
            </AppWrapper>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
