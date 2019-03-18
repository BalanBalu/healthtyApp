import Home from "../../modules/screens/home";
import login from "../../modules/screens/auth/login";
import signup from "../../modules/screens/auth/signup";
import forgotpassword from "../../modules/screens/auth/forgotpassword";

export const routes = {
    // Home
    home: {
      name: 'home',
      path: 'home',
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
    }
  }