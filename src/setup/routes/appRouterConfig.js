import Home from "../../modules/screens/home";
import categories from "../../modules/screens/categories";
import userprofile from "../../modules/screens/userprofile";
import login from "../../modules/screens/auth/login";
import signup from "../../modules/screens/auth/signup";
import forgotpassword from "../../modules/screens/auth/forgotpassword";
import finddoctor from "../../modules/screens/auth/finddoctor";
import userdetails from "../../modules/screens/auth/userdetails";
import { Icon } from 'native-base';

export const AppRoutes = {
  Home: {
    name: 'Home',
    path: 'Home',
    screen: Home,
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
  }
}
