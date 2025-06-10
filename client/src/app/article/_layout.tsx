import { ProtectedRoute } from "@/components/auth/protected-route";
import Footer from "@/components/Footer";
import React, { ReactNode } from "react";

const _layout = ({ children }: { children: ReactNode }) => {
  return (
    <ProtectedRoute>
      <div>
        {children}
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default _layout;
