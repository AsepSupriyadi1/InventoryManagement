import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AllProducts from "./pages/Product/AllProducts";
import AddProduct from "./pages/Product/AddProduct";
import DetailsProduct from "./pages/Product/DetailsProduct";
import AllSupplier from "./pages/Supplier/all-supplier";
import AddSupplier from "./pages/Supplier/add-supplier";
import DetailSupplier from "./pages/Supplier/DetailSupplier";
import AddUser from "./pages/User/AddUser";
import UserProfile from "./pages/UserProfile";
import AllUser from "./pages/User/AllUser";
import { useContext } from "react";
import { AuthContext } from "./context/auth-context";
import ErrorPage from "./pages/ErrorPage";
import AllOutlet from "./pages/Outlet/AllOutlet";
import AddOutlet from "./pages/Outlet/AddOutlet";
import DetailOutlet from "./pages/Outlet/DetailsOutlet";
function App() {
  const { isLoggedIn, currentUser } = useContext(AuthContext);

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* LOGIN REQUIRED */}
        {isLoggedIn && (
          <>
            <Route path="/dashboard" element={<Dashboard />} />

            {/* USER ROUTES */}
            {currentUser.userRole === "SUPER_ADMIN" && (
              <>
                <Route path="/all-users" element={<AllUser />} />
                <Route path="/add-user" element={<AddUser />} />

                {/* OUTLET ROUTES */}
                <Route path="/all-outlets" element={<AllOutlet />} />
                <Route path="/add-outlet" element={<AddOutlet />} />
                <Route path="/detail-outlet/:outletId" element={<DetailOutlet />} />
              </>
            )}

            <Route path="/profile" element={<UserProfile />} />

            {/* PRODUCT ROUTES */}
            <Route path="/all-products" element={<AllProducts />} />
            <Route path="/add-products" element={<AddProduct />} />
            <Route path="/detail-product/:productId" element={<DetailsProduct />} />

            {/* SUPPLIER ROUTES */}
            <Route path="/all-suppliers" element={<AllSupplier />} />
            <Route path="/add-supplier" element={<AddSupplier />} />
            <Route path="/detail-supplier/:supplierId" element={<DetailSupplier />} />
          </>
        )}
      </Routes>
    </>
  );
}

export default App;
