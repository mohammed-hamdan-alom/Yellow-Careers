import DashboardLayout from '@/components/Layouts/DashboardLayout'

const baseUrl = '/employer';


{/* CHANGE USER INFORMATION LATER */}
const user = {
  name: 'Tom Cook',
  email: 'tom@example.com',
  imageUrl:
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}
const navigation = [
  { name: 'Dashboard', to: '/dashboard'},
  { name: 'Create Job Listing', to: '/create-job'},
  { name: 'My Company', to: '/company'},
]

const userNavigation = [
  { name: 'Your Profile', href: `${baseUrl}/profile`},
  { name: 'Settings', href: '#' },
  { name: 'Sign out'},
]

export default function EmployerLayout() {
  return <DashboardLayout user={user} navigation={navigation} userNavigation={userNavigation} baseUrl={baseUrl}/>  
}

