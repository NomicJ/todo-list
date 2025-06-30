import "./scss/style.scss";
import * as storage from "./ts/storage";

import {
  setupContactsToggle,
  setupSidebarToggle,
  initCustomSelect,
} from "./ts/ui-contacts";

storage.initStorage();
setupSidebarToggle();
setupContactsToggle();
initCustomSelect();
