import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
const ErrorPage = () => {
  return (
    <>
      <h1>Bang Error bang</h1>
      <Link className="link" to="/login">
        Back to login
      </Link>
    </>
  );
};

export default ErrorPage;
