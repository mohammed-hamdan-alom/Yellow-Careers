import DashboardLayout from "@/components/Layout/DashboardLayout";
import React, { useContext } from "react";
import AuthContext from "@/context/AuthContext";

const baseUrl = "/job-seeker";

const navigation = [
  { name: "Matched Jobs", to: "/dashboard" },
  { name: "Resume", to: "/resume" },
  { name: "Saved Jobs", to: "/saved-jobs" },
  { name: "Applied Jobs", to: "/applied-jobs" },
];

const userNavigation = [{ name: "My Profile", href: `${baseUrl}/profile` }, { name: "Sign out" }];

export default function JobSeekerLayout() {
  const { user } = useContext(AuthContext);
  console.log(user);

  const userInfo = {
    email: user.email,
    imageUrl:
      "https://t3.ftcdn.net/jpg/05/53/79/60/360_F_553796090_XHrE6R9jwmBJUMo9HKl41hyHJ5gqt9oz.jpg",
  };

  return (
    <DashboardLayout
      user={userInfo}
      navigation={navigation}
      userNavigation={userNavigation}
      baseUrl={baseUrl}
    />
  );
}
