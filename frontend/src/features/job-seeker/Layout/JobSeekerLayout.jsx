import DashboardLayout from "@/components/Layout/DashboardLayout";

const baseUrl = "/job-seeker";

const user = {
  name: "Tom Cook",
  email: "tom@example.com",
  imageUrl:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};

const navigation = [
  { name: "Matched Jobs", to: "/dashboard" },
  { name: "Resume", to: "/resume" },
  { name: "Saved Jobs", to: "/saved-jobs" },
  { name: "Applied Jobs", to: "/applied-jobs" },
];

const userNavigation = [{ name: "Your Profile", href: `${baseUrl}/profile` }, { name: "Sign out" }];

export default function EmployerLayout() {
  return (
    <DashboardLayout
      user={user}
      navigation={navigation}
      userNavigation={userNavigation}
      baseUrl={baseUrl}
    />
  );
}
