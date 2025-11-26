import customers from "./customers";
import common from "./common";
import appointments from "./appointments";
import services from "./services";
import reports from "./reports";
import sessions from "./sessions";
import users from "./users";
import auth from "./auth";

export default {
  ...common,
  ...customers,
  ...appointments,
  ...services,
  ...reports,
  ...sessions,
  ...users,
  ...auth,
};
