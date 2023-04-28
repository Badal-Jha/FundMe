import { Link } from "react-router-dom";
import { FaAngleDoubleRight } from "react-icons/fa";
import { FaBullhorn } from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";
import { CgProfile } from "react-icons/cg";

const Sidebar2 = () => {
  return (
    <nav
      className={`z-10 w-[76px] h-[93vh] fixed bg-[#1F5F5B] hover:w-64 group transition-all duration-300 ease-in flex justify-between items-center flex-col top-5`}
    >
      <ul className="p-0 m-0 flex flex-col items-center h-full w-full">
        <li className="font-bold  mb-4 text-center tracking-wide text-2xl text-white w-full">
          <div className="flex items-center h-20 text-white grayscale opacity-70 transition-all duration-300 hover:grayscale-0 hover:opacity-100 bg-gray-800 group-hover:justify-between">
            <span className="hidden ml-4 group-hover:block text-xl font-semibold">
              FundMe
            </span>
            <FaAngleDoubleRight className="rotate-0 transition-all duration-300 group-hover:-rotate-180 mx-6 text-2xl min-w-[2rem] " />
          </div>
        </li>
        <li className="w-full">
          <Link
            to="/"
            className="flex items-center h-20 text-white grayscale opacity-70 transition-all duration-300 hover:grayscale-0 hover:opacity-100 hover:bg-gray-800"
          >
            <RxDashboard className="mx-6 text-2xl min-w-[2rem]" />
            <span className="hidden ml-4 group-hover:block ">Dashboard</span>
          </Link>
        </li>
        <li className="w-full">
          <Link
            to="/create-campaign"
            className="flex items-center h-20 text-white grayscale opacity-70 transition-all duration-300 hover:grayscale-0 hover:opacity-100 hover:bg-gray-800"
          >
            <FaBullhorn className="mx-6 text-2xl min-w-[2rem]" />
            <span className="hidden ml-4 group-hover:block ">Campaign</span>
          </Link>
        </li>
        <li className="w-full">
          <Link
            to="/profile"
            className="flex items-center h-20 text-white grayscale opacity-70 transition-all duration-300 hover:grayscale-0 hover:opacity-100 hover:bg-gray-800"
          >
            <CgProfile className="mx-6 text-2xl min-w-[2rem]" />
            <span className="hidden ml-4 group-hover:block ">Profile</span>
          </Link>
        </li>

        {/* {navlinks.map((link,index) => (
          <li className="w-full" key={index}>
            <Link
              to={link.link}
              className="flex items-center h-20 text-white grayscale opacity-70 transition-all duration-300 hover:grayscale-0 hover:opacity-100 hover:bg-gray-800"
            >
              <AiFillHome className="mx-6 text-2xl min-w-[2rem]" />
              <span className="hidden ml-4 group-hover:block ">
                {link.name}
              </span>
            </Link>
          </li>
        ))} */}

        {/* <li className="w-full mt-auto"> */}
        {/* <div className="flex items-center h-20 text-white grayscale opacity-70 transition-all duration-300 hover:grayscale-0 hover:opacity-100 hover:bg-gray-800">
            <span className="mx-6 text-2xl min-w-[2rem] text-white font-thin border">
              FM
            </span> */}

        {/* <span className="hidden ml-4 group-hover:flex gap-4 text-xl ">
              <a href={`mailto: ${mail}`} className="hover:animate-spin">
                <MdMail />
              </a>
              <a
                href={githubLink}
                className="hover:animate-spin"
                target="_blank"
              >
                <BsGithub />
              </a>
              <a
                href={linkedinLink}
                className="hover:animate-spin"
                target="_blank"
              >
                <BsLinkedin />
              </a>
            </span> */}
        {/* </div>
        </li> */}
      </ul>
    </nav>
  );
};
export default Sidebar2;
