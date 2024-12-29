import React from "react";
import { Sidebar } from "flowbite-react";
import { HiUser, HiArrowSmRight } from "react-icons/hi";
import { Link } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

export default function DashSidebar({ tab, setTab }) {
  const dispatch = useDispatch();
  const handleSignout = async () => {
      try {
        const res = await fetch("/api/user/signout", {
          method: "POST",
        });
        const data = await res.json();
        if (!res.ok) {
          console.error("Signout failed:", data.message);
        } else {
          dispatch(signoutSuccess());
          //console.log("Signout successful");
        }
      } catch (error) {
        console.error("Error during signout:", error.message);
      }
    };
  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={"User"}
              labelColor="dark"
              as="div"
              onClick={() => setTab("profile")} // Update tab state on click

            >
              Profile
            </Sidebar.Item>
          </Link>
          <Sidebar.Item icon={HiArrowSmRight} className="cursor-pointer" onClick={handleSignout}>
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
