import home from "../../modules/screens/home";
import categories from "../../modules/screens/categories";
import userprofile from "../../modules/screens/userprofile";
import login from "../../modules/screens/auth/login";
import signup from "../../modules/screens/auth/signup";
import forgotpassword from "../../modules/screens/auth/forgotpassword";
import finddoctor from "../../modules/screens/auth/finddoctor";
export const routes = {
  // Home
  home: {
    name: 'home',
    path: 'home',
    screen: home,
  },
  categories: {
    name: 'categories',
    path: 'categories',
    screen: categories,
  },
  userprofile: {
    name: 'userprofile',
    path: 'userprofile',
    screen: userprofile,
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
  finddoctor: {
    name: ' finddoctor',
    path: ' finddoctor',
    screen: finddoctor,
  },

}