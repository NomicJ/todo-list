import { contactsHandler } from "./contacts.js";
import { groupsHandler } from "./groups.js";
import { updateGroupsStorage } from "./storage.js";
import { updateContactsStorage } from "./storage.js";

function createNewGroup(title) {
  groupsHandler.groupIdCount++;
  const newGroup = groupsHandler.createGroup(groupsHandler.groupIdCount, title);
  const newGroupIndex = groupsHandler.addGroup(newGroup);
  return newGroupIndex;
}

// =================================

const newGroupBtn = document.getElementById("newGroup");
const newGroupForm = document.getElementsByClassName("sidebar__container")[0];

const sidebarUserGroups =
  document.getElementsByClassName("sidebar__group-add")[0];
const mainUserGroups = document.getElementsByClassName("contacts")[0];
const selectUserGroups = document.getElementsByClassName(
  "custom-select__dropdown"
)[0];

newGroupBtn.addEventListener("click", showNewGroupForm);

function showNewGroupForm() {
  const title = (document.getElementById("inputGroup").value = "");

  newGroupForm.classList.add("active");
}

document.getElementById("saveGroup").addEventListener("click", () => {
  const title = document.getElementById("inputGroup").value;

  composeNewGroup(title);
  newGroupForm.classList.remove("active");
});

function composeNewGroup(title: string) {
  const groupIndex = createNewGroup(title);
  const groupUI = createGroupUI(groupsHandler.items[groupIndex], groupIndex);
  const groupMainUI = createGroupMainUI(
    groupsHandler.items[groupIndex],
    groupIndex
  );
  const groupSelectUI = createGroupSelectUI(
    groupsHandler.items[groupIndex],
    groupIndex
  );
  sidebarUserGroups.prepend(groupUI);
  mainUserGroups.prepend(groupMainUI);
  selectUserGroups.prepend(groupSelectUI);

  updateGroupsStorage();
  location.reload();
}

function renderGroups() {
  const fragment = document.createDocumentFragment();
  const fragment2 = document.createDocumentFragment();
  const fragment3 = document.createDocumentFragment();

  const totalGroups = groupsHandler.items.length;
  if (totalGroups !== 0) {
    for (let i = 0; i < totalGroups; i++) {
      const curGroup = groupsHandler.items[i];
      fragment.prepend(createGroupUI(curGroup, curGroup.id));
      fragment2.prepend(createGroupMainUI(curGroup, curGroup.id));
      fragment3.prepend(createGroupSelectUI(curGroup, curGroup.id));
    }
  }

  sidebarUserGroups.innerHTML = "";
  sidebarUserGroups.prepend(fragment);

  mainUserGroups.innerHTML = "";
  mainUserGroups.prepend(fragment2);

  selectUserGroups.innerHTML = "";
  selectUserGroups.prepend(fragment3);
}

function createGroupUI(group, groupIndex) {
  const item = document.createElement("li");

  const groupTitle = document.createElement("div");
  const deleteGroupBtn = document.createElement("button");

  item.classList.add("sidebar__group");

  groupTitle.classList.add("sidebar__input", "flex-g");
  deleteGroupBtn.classList.add("sidebar__delete", "sidebar_item-btn");

  groupTitle.textContent = group.title;

  deleteGroupBtn.innerHTML = `   <svg
                width="16"
                height="20"
                viewBox="0 0 16 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  opacity="0.3"
                  d="M1.66664 17.3889C1.66664 18.55 2.61664 19.5 3.77775 19.5H12.2222C13.3833 19.5 14.3333 18.55 14.3333 17.3889V4.72222H1.66664V17.3889ZM4.26331 9.87333L5.75164 8.385L7.99997 10.6228L10.2378 8.385L11.7261 9.87333L9.48831 12.1111L11.7261 14.3489L10.2378 15.8372L7.99997 13.5994L5.7622 15.8372L4.27386 14.3489L6.51164 12.1111L4.26331 9.87333ZM11.6944 1.55556L10.6389 0.5H5.36108L4.30553 1.55556H0.611084V3.66667H15.3889V1.55556H11.6944Z"
                  fill="currentColor"
                />
              </svg>`;

  item.append(groupTitle, deleteGroupBtn);
  item.addEventListener("click", (e) => {
    if (e.target.closest(".sidebar__delete")) {
      deleteGroup(groupIndex);
      location.reload();
      return;
    }
  });

  return item;
}
function createGroupMainUI(group, groupIndex) {
  const item = document.createElement("div");

  const headerContainer = document.createElement("div");
  const groupTitle = document.createElement("p");
  const openGroupBtn = document.createElement("button");

  const listContainer = document.createElement("ul");

  item.classList.add("contacts__container");

  headerContainer.classList.add("contacts__header");
  groupTitle.classList.add("contacts__title");
  openGroupBtn.classList.add("contacts__arrow");

  listContainer.classList.add("contacts__list", "contacts__list-collapsed");

  const safeId = `contacts-${groupIndex}`;
  listContainer.id = safeId;

  groupTitle.textContent = group.title;

  openGroupBtn.innerHTML = `  <svg
                class="contacts__arrow-icon"
                width="13"
                height="8"
                viewBox="0 0 13 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.8849 0.294983L6.29492 4.87498L1.70492 0.294983L0.294922 1.70498L6.29492 7.70498L12.2949 1.70498L10.8849 0.294983Z"
                  fill="currentColor"
                />
              </svg>`;

  headerContainer.append(groupTitle, openGroupBtn);

  item.append(headerContainer, listContainer);

  return item;
}

function createGroupSelectUI(group, groupIndex) {
  const item = document.createElement("li");

  item.classList.add("custom-select__option");

  item.textContent = group.title;

  return item;
}

function deleteGroup(index) {
  contactsHandler.removeGroupContacts(index);

  groupsHandler.removeGroupById(index);

  updateGroupsStorage();
  updateContactsStorage();
  renderGroups();
}

export { renderGroups };
