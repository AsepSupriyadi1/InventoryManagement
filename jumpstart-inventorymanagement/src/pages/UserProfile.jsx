import { faUser } from "@fortawesome/free-solid-svg-icons";
import Layout from "../component/Layout";
import DashHeading from "../component/part/DashHeading";

const UserProfile = () => {
  const metaPageData = {
    title: "User Profile",
    href: "profile",
    header: ["Profile", ""],
    icon: faUser,
  };

  return (
    <>
      <Layout>
        <DashHeading data={metaPageData} />
      </Layout>
    </>
  );
};

export default UserProfile;
