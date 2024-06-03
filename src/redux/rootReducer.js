import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// slices
import mailReducer from './slices/mail';
import chatReducer from './slices/chat';
import productReducer from './slices/product';
import calendarReducer from './slices/calendar';
import kanbanReducer from './slices/kanban';
import countries from './slices/countries';
import cities from './slices/cities';
import states from './slices/state';
import users from './slices/user';
import taxes from './slices/tax';
import timezone from './slices/timezone';
import currency from './slices/currency';
import instructors from './slices/instructor';
import vendors from './slices/vendors';
import categories from './slices/coursecategory';
import courses from './slices/courses';
import company from './slices/company';
import privelages from './slices/privelage';
import event from './slices/events';
import coupon from './slices/coupans';
import orders from './slices/orders';
import smtp from './slices/smtp';
import sendgrid from './slices/sendgrid';
import companyPaymentDetails from './slices/companyPayment';
import registrationEvents from './slices/eventRegistration';
import attendance from './slices/attendance';
import emailLogs from './slices/emailLogs';
import waitlist from './slices/waitlist';
import payment from './slices/payment';
import userType from './slices/userType';
import analytics from './slices/analytics'
// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

const productPersistConfig = {
  key: 'product',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout'],
};

const rootReducer = combineReducers({
  companyPaymentDetails,
  smtp,
  sendgrid,
  mail: mailReducer,
  chat: chatReducer,
  calendar: calendarReducer,
  kanban: kanbanReducer,
  product: persistReducer(productPersistConfig, productReducer),
  countries,
  states,
  cities,
  users,
  taxes,
  timezone,
  currency,
  instructors,
  vendors,
  categories,
  courses,
  company,
  privelages,
  event,
  coupon,
  orders,
  registrationEvents,
  attendance,
  emailLogs,
  waitlist,
  payment,
  userType,
  analytics,
});

export { rootPersistConfig, rootReducer };
