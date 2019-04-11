//import home from "../../modules/screens/home/index";
import categories from "../../modules/screens/categories";
import userprofile from "../../modules/screens/userprofile";
import login from "../../modules/screens/auth/login";
import signup from "../../modules/screens/auth/signup";
import forgotpassword from "../../modules/screens/auth/forgotpassword";
import finddoctor from "../../modules/screens/auth/finddoctor";
import userdetails from "../../modules/screens/auth/userdetails";
import MoreReviews from "../../modules/screens/MoreReviews";
import FilterDoctor from "../../modules/screens/FilterDoctor";
import FilterList from "../../modules/screens/FilterList";
import { Icon } from 'native-base';

export const AppRoutes = {
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
  morereviews: {
    name: 'morereviews',
    path: 'morereviews',
    screen: MoreReviews
  },
  filterdoctor: {
    name: 'filterdoctor',
    path: 'filterdoctor',
    screen: FilterDoctor
  },
  filterlist: {
    name: 'filterlist',
    path: 'filterlist',
    screen: FilterList
  }
}
