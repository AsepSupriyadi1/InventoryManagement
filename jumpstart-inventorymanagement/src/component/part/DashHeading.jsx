import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { Link } from "react-router-dom";

// data { title, icon, href }

const DashHeading = ({ data }) => {
  return (
    <>
      {/* HEADING */}
      <div className="d-flex align-items-center justify-content-between">
        <h5>{data.title}</h5>

        <Link className="link" to={"/" + data.href}>
          <div className="d-flex align-items-center">
            <FontAwesomeIcon icon={data.icon} className="me-2 bg-secondary-primary p-2 border" />
            <h3>
              {data.header[0]}
              {data.header[1]}
            </h3>
          </div>
        </Link>
      </div>
      {/* HEADING */}
    </>
  );
};

export default DashHeading;
