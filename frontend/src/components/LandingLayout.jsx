import { Outlet } from "react-router-dom";
import FooterLanding from "./FooterLanding";
import Header from "./Header";

const LandingLayout = () => {
  return (
    <div className="bg-[#030712] min-h-screen">
      <Header />
      <main>
        <Outlet /> 
      </main>
      <FooterLanding />
    </div>
  );
};

export default LandingLayout;