import DashboardLayout from "@/components/Layout/DashboardLayout";
import React, { useContext } from "react";
import AuthContext from "@/context/AuthContext";

const baseUrl = "/employer";

const navigation = [
  { name: "Dashboard", to: "/dashboard" },
  { name: "Create Job Listing", to: "/create-job" },
  { name: "My Company", to: "/company" },
];

const userNavigation = [{ name: "Your Profile", href: `${baseUrl}/profile` }, { name: "Sign out" }];

export default function EmployerLayout() {
  const { user } = useContext(AuthContext);

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
