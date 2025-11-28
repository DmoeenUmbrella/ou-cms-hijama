import customers from "./customers";
import common from "./common";
import appointments from "./appointments";
import services from "./services";
import reports from "./reports";
import sessions from "./sessions";
import users from "./users";
import auth from "./auth";
import patient from "./patient";
import technicians from "./technicians";

export default {
  ...common,
  ...customers,
  ...appointments,
  ...services,
  ...reports,
  ...sessions,
  ...users,
  ...auth,
  ...patient,
  ...technicians,
};
