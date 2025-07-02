import React from "react";
import { assets } from "../../assets/assets";
import { NavLink } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { useContext } from "react";

const Sidebar = () => {
  const { isEducator } = useContext(AppContext);

  const menuItems = [
    { name: "Dashboard", path: "/educator", icon: assets.home_icon },
    { name: "Add Course", path: "/educator/add-course", icon: assets.add_icon },
    {
      name: "My Courses",
      path: "/educator/my-courses",
      icon: assets.my_course_icon,
    },
    {
      name: "Student Enrolled",
      path: "/educator/student-enrolled",
      icon: assets.person_tick_icon,
    },
  ];

  return (
    isEducator && (
      <div className="md:w-64 w-16 border-r min-h-screen text-base border-gray-500 bg-emerald-50/30 py-2 flex flex-col">
        {menuItems.map((item) => (
          <NavLink
            to={item.path}
            key={item.name}
            end={item.path === "/educator"}
             className={({ isActive }) =>
            `flex items-center md:flex-row flex-col md:justify-start justify-center py-3.5 md:px-10 gap-3 ${isActive
                  ? 'bg-emerald-100 border-r-[6px] border-emerald-600/90 text-emerald-900' 
                  : 'hover:bg-emerald-100/80 border-r-[6px] border-transparent text-gray-600 hover:text-emerald-700'
              }`
            }
          >
            <img src={item.icon} alt="" className="w-6 h-6" />
            <p className="md:block hidden text-center">{item.name}</p>
          </NavLink>
        ))}
      </div>
    )
  );
};

export default Sidebar;
