import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRoute({ isLogined, loading }: any) {

   if (loading) {
    return (
      <div className="bg-gray-900 w-full h-screen">
        loading
      </div>
    )
  }

  if (!isLogined) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}