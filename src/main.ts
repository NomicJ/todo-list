// import "./scss/style.scss";
import * as storage from "./ts/storage";

import {
  setupContactsToggle,
  setupSidebarToggle,
  initCustomSelect,
  initPhoneMask,
} from "./ts/ui-contacts";

storage.initStorage();
setupSidebarToggle();
setupContactsToggle();
initCustomSelect();
initPhoneMask();
