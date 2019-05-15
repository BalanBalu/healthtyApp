import Home from "../../modules/screens/home";
import categories from "../../modules/screens/categories";
import Profile from "../../modules/screens/userprofile";
import login from "../../modules/screens/auth/login";
import signup from "../../modules/screens/auth/signup";
import forgotpassword from "../../modules/screens/auth/forgotpassword";
import finddoctor from "../../modules/screens/auth/finddoctor";
import userdetails from "../../modules/screens/auth/userdetails";
import Reviews from "../../modules/screens/Reviews";
import doctorSearchList from "../../modules/screens/doctorSearchList";
import FilterList from "../../modules/screens/FilterList";
import PaymentPage from "../../modules/screens/PaymentPage";
import PaymentReview from "../../modules/screens/PaymentReview";
import PaymentSuccess from "../../modules/screens/PaymentSuccess";
//import MedicineSearch from "../../modules/screens/MedicineSearch";
// import MedicineSearchList from "../../modules/screens/MedicineSearchList";
// import MedicineCheckout from "../../modules/screens/MedicineCheckout";
// import MedicineCheckoutPage from "../../modules/screens/MedicineCheckoutPage";
// import MedicinePaymentResult from "../../modules/screens/MedicinePaymentResult";
// import MedicinePaymentSuccess from "../../modules/screens/MedicinePaymentSuccess";
import BookAppoinment from "../../modules/screens/bookappoinment";
import { Icon } from 'native-base';

export const AppRoutes = {
  Home: {
    name: 'Home',
    path: 'Home',
    screen: Home,
  },
  Profile: {
    name: 'Profile',
    path: 'Profile',
    screen: Profile,
  },
  login: {
    name: 'login',
    path: 'login',
    screen: login,
  },
  signup: {
    name: 'signup',
    path: 'signup',
    screen: signup,
  },
  forgotpassword: {
    name: 'forgotpassword',
    path: 'forgotpassword',
    screen: forgotpassword,
  },
  userdetails: {
    name: 'userdetails',
    path: 'userdetails',
    screen: userdetails,
  },
  categories: {
    name: 'categories',
    path: 'categories',
    screen: categories
  },
  reviews: {
    name: 'reviews',
    path: 'reviews',
    screen: Reviews
  },
  doctorsearchlist: {
    name: 'doctorsearchlist',
    path: 'doctorsearchlist',
    screen: doctorSearchList
  },
  filterlist: {
    name: 'filterlist',
    path: 'filterlist',
    screen: FilterList
  },
  paymentpage: {
    name: 'paymentpage',
    path: 'paymentpage',
    screen: PaymentPage
  },
  paymentreview: {
    name: 'paymentreview',
    path: 'paymentreview',
    screen: PaymentReview
  },
  paymentsuccess: {
    name: 'paymentsuccess',
    path: 'paymentsuccess',
    screen: PaymentSuccess
  },
  bookappoinment: {
    name: 'bookappoinment',
    path: 'bookappoinment',
    screen:  BookAppoinment
  },
}
