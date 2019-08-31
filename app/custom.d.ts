import { Request } from 'express';
import User from './models/User';

interface AppSession {
  user?: User;
  destroy: () => void;
  save: () => void;
}

interface ExtendedRequest extends Request {
  __user: {
    id: string;
  };

  session: AppSession;

  user: User;
}

interface GqlContext {
  user: User;
}
