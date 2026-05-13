import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar.jsx";
import { Footer } from "../components/Footer.jsx";

export function MainLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}
