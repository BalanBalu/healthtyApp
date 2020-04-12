import ConnectyCube from 'react-native-connectycube';
import { CONNECTY_CUBE } from '../../../../setup/config';
import { postService } from '../../../../setup/services/httpservices';
const splice = function(originalStr,idx, rem, str) {
  return originalStr.slice(0, idx) + str + originalStr.slice(idx + Math.abs(rem));
};
export default class AuthService {
  init = () => ConnectyCube.init(...CONNECTY_CUBE);

  signup = async (userId) => {
    try {
      debugger
      let endPoint = 'video-consulting/connectycube/signup/user/' + userId;
      let response = await postService(endPoint, {});
      let respData = response.data;
      console.log(respData)
      if (respData.success === true) {
        const finalResponseData = respData.data;
        const connectyCubePw = this.genePw(userId, finalResponseData.connectycube_pw);
        const loginRequest = {
          id: finalResponseData.connectycube_id,
          login: finalResponseData.connectycube_login,
          password: connectyCubePw
        }
        console.log(loginRequest);
        this.login(loginRequest).then(() => {
          console.log('Successfully Logged in')
        }).catch((e) => {
           alert('Login Failed because', JSON.stringify(e));
           console.log(e); 
        });
      }
      
      return respData;
    } catch (e) {
      console.log('error occured',  e);
      return {
          success: false,
          message: e + ' Occured! Please Try again'
      }
    }
  }
  
  login = user => {
    return new Promise((resolve, reject) => {
      ConnectyCube.createSession(user)
        .then(() =>
          ConnectyCube.chat.connect({
            userId: user.id,
            password: user.password,
          }),
        )
        .then(resolve)
        .catch(reject);
    });
  };

  logout = () => {
    ConnectyCube.chat.disconnect();
    ConnectyCube.destroySession();
  };
  genePw = (userId, connectycube_pw) => {
    const dyCPasswordHint = connectycube_pw.split('_');
    const connectyCubePw = splice(userId, Number(dyCPasswordHint[1]), 0, dyCPasswordHint[0]);
    return connectyCubePw;
  };
  
  loginToConnctyCube = (userId, connectycube) => {
      const connectyCubePw = this.genePw(userId, connectycube.connectycube_pw);
      const loginRequest = {
        id: connectycube.connectycube_id,
        login: connectycube.connectycube_login,
        password: connectyCubePw
      }
      this.login(loginRequest).then(() => {
        console.log('Successfully Logged in to ConnectyCube');
      }).catch((e) => {
         alert('Login Failed because', JSON.stringify(e));
         console.log(e); 
      });
  }
}
