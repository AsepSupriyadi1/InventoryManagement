import Footer from "./Footer";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <div className="container py-4 px-2 main-container">{children}</div>
      <Footer />
    </>
  );
};

export default Layout;
