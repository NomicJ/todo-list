import { contactsHandler } from "./contacts.js";
import { groupsHandler } from "./groups.js";
import { renderContacts } from "./ui-contacts.js";
import { renderGroups } from "./ui-groups.js";
import type { Contact, Group } from "./types";

function initStorage() {
  groupsHandler.items = JSON.parse(localStorage.getItem("groups") || "null");
  contactsHandler.items = JSON.parse(
    localStorage.getItem("contacts") || "null"
  );

  if (groupsHandler.items === null || contactsHandler.items === null) {
    const testGroupsData: Group[] = [
      {
        id: 0,
        title: "Друзья",
      },
      {
        id: 1,
        title: "Коллеги",
      },
    ];
    const testContactsData: Contact[] = [
      contactsHandler.createContact("Семенов Дарья Сергеевна", 77782344483, 0),
      contactsHandler.createContact("Петров Игорь Генадьевич", 77786342413, 1),
    ];

    localStorage.setItem("groups", JSON.stringify(testGroupsData));
    localStorage.setItem("contacts", JSON.stringify(testContactsData));

    groupsHandler.items = testGroupsData;
    contactsHandler.items = testContactsData;
  }

  groupsHandler.init();

  renderGroups();
  renderContacts();
}

function updateGroupsStorage() {
  localStorage.setItem("groups", JSON.stringify(groupsHandler.items));
}

function updateContactsStorage() {
  localStorage.setItem("contacts", JSON.stringify(contactsHandler.items));
}

export { initStorage, updateGroupsStorage, updateContactsStorage };
