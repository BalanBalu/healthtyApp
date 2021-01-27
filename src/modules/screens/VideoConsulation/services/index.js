import Auth from './auth-service';
 import Call from './call-service';
 import CallKeep from './callkeep-service';
 import CallProcess from './call-processor-setup';

export const AuthService = new Auth();
export const CallService = new Call();
export const CallKeepService = new CallKeep();
export const CallProcessSetupService = new CallProcess();
export const REMOTE_USER_END_CALL_REASONS = {
    CALL_FAILED: 1,
    REMOTE_USER_ENDED_CALL: 2,
    REMOTE_USER_DID_NOT_ANSWER: 3
}