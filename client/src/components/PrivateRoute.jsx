import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";// Outlet is a hook that renders the child route's element if the user is authenticated, and Navigate redirects to the sign-in page.

export default function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);

  return currentUser ? <Outlet /> : <Navigate to="/sign-in" />; // This code checks if the user is authenticated by checking if the currentUser state is truthy. If the user is authenticated, it renders the child route's element using the Outlet component. If the user is not authenticated, it redirects to the sign-in page using the Navigate component.
}
