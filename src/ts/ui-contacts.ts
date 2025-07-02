import { contactsHandler } from "./contacts.js";
import { groupsHandler } from "./groups.js";
import { showToast } from "./ui-groups.js";

import { updateContactsStorage } from "./storage.js";
import IMask from "imask";

function formatPhoneNumber(phone: number): string {
  const digits = phone.toString().padStart(11, "0");
  const countryCode = digits.slice(0, 1);
  const operatorCode = digits.slice(1, 4);
  const part1 = digits.slice(4, 7);
  const part2 = digits.slice(7, 9);
  const part3 = digits.slice(9, 11);

  return `+${countryCode} (${operatorCode}) ${part1} - ${part2} - ${part3}`;
}

const sidebars = document.querySelectorAll(".sidebar[data-sidebar]");
const overlay = document.querySelector(".overlay") as HTMLElement | null;
const closeSidebar = () => {
  sidebars.forEach((s) => s.classList.remove("active"));
  overlay?.classList.remove("active");
};

function renderContacts() {
  const containers = document.querySelectorAll(".contacts__container ul[id]");
  const listIds = Array.from(containers).map((el) => el.id);

  listIds.forEach((id) => {
    const listContainer = document.getElementById(id);
    if (!listContainer) return;

    listContainer.innerHTML = "";

    const groupId = parseInt(id.replace("contacts-", ""), 10);

    const groupContacts = contactsHandler.items.filter(
      (contact) => contact.groupIndex === groupId
    );

    groupContacts.forEach((contact) => {
      const contactElement = createContactUI(
        contact.username,
        contact.phoneNumber
      );
      listContainer.appendChild(contactElement);
    });
  });
}

function createContactUI(name: string, phone: number): HTMLLIElement {
  const li = document.createElement("li");
  li.classList.add("contacts__item");

  const infoDiv = document.createElement("div");
  infoDiv.classList.add("contacts__info");

  const nameSpan = document.createElement("span");
  nameSpan.classList.add("contacts__name");
  nameSpan.textContent = name;

  infoDiv.appendChild(nameSpan);

  const actionsDiv = document.createElement("div");
  actionsDiv.classList.add("contacts__actions");

  const phoneSpan = document.createElement("span");
  phoneSpan.classList.add("contacts__phone");

  phoneSpan.textContent = `${formatPhoneNumber(phone)}`;

  const editBtn = document.createElement("button");
  editBtn.classList.add("contacts__edit");
  editBtn.type = "button";
  editBtn.setAttribute("aria-label", "Редактировать");
  editBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"
    xmlns="http://www.w3.org/2000/svg"><path opacity="0.3"
    d="M0 14.25V18H3.75L14.81 6.94L11.06 3.19L0 14.25ZM17.71 
    4.04C18.1 3.65 18.1 3.02 17.71 2.63L15.37 0.289998C14.98 
    -0.1 14.35 -0.1 13.96 0.29L12.13 2.12L15.88 5.87L17.71 
    4.04Z" fill="currentColor"/></svg>`;

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("contacts__delete");
  deleteBtn.type = "button";
  deleteBtn.setAttribute("aria-label", "Удалить");
  deleteBtn.innerHTML = `<svg width="16" height="20" viewBox="0 0 16 20" fill="none"
    xmlns="http://www.w3.org/2000/svg"><path opacity="0.3"
    d="M1.66664 17.3889C1.66664 18.55 2.61664 19.5 3.77775 
    19.5H12.2222C13.3833 19.5 14.3333 18.55 14.3333 
    17.3889V4.72222H1.66664V17.3889ZM4.26331 
    9.87333L5.75164 8.385L7.99997 10.6228L10.2378 
    8.385L11.7261 9.87333L9.48831 12.1111L11.7261 
    14.3489L10.2378 15.8372L7.99997 13.5994L5.7622 
    15.8372L4.27386 14.3489L6.51164 12.1111L4.26331 
    9.87333ZM11.6944 1.55556L10.6389 0.5H5.36108L4.30553 
    1.55556H0.611084V3.66667H15.3889V1.55556H11.6944Z"
    fill="currentColor"/></svg>`;

  deleteBtn.addEventListener("click", () => {
    contactsHandler.removeContact(phone);
    updateContactsStorage();
    li.remove();
  });
  editBtn.addEventListener("click", () => {
    const form = document.getElementById("newContactForm") as HTMLFormElement;
    (form.elements.namedItem("fullName") as HTMLInputElement).value = name;
    (form.elements.namedItem("phone") as HTMLInputElement).value = `${phone}`;

    const customSelect = form.querySelector(".custom-select__selected span");

    const contact = contactsHandler.items.find((c) => c.phoneNumber === phone);
    const groupTitle =
      groupsHandler.items.find((g) => g.id === contact?.groupIndex)?.title ||
      "Выберите группу";

    if (customSelect) {
      customSelect.textContent = groupTitle;
    }

    contactsHandler.removeContact(phone);
    updateContactsStorage();
    li.remove();

    document.querySelector('[data-sidebar="contact"]')?.classList.add("active");
  });

  actionsDiv.append(phoneSpan, editBtn, deleteBtn);

  li.append(infoDiv, actionsDiv);

  return li;
}

const newContactForm = document.getElementById("newContactForm");

if (newContactForm) {
  newContactForm.addEventListener("submit", getNewContactData);
}

function getNewContactData(e: any) {
  e.preventDefault();

  const data = new FormData(e.currentTarget);

  const fullName = (data.get("fullName") as string)?.trim();
  const phone = (data.get("phone") as string)?.trim();

  const group = e.currentTarget
    .querySelector(".custom-select__selected span")
    ?.textContent.trim();

  let isValid = true;
  const inputs = e.currentTarget.querySelectorAll(".sidebar__input");
  inputs.forEach((input: HTMLInputElement) =>
    input.classList.remove("input-error")
  );

  const errorMessages = e.currentTarget.querySelectorAll(".error-message");
  errorMessages.forEach((msg: HTMLElement) => msg.classList.remove("active"));

  if (!fullName) {
    showInputError(e.currentTarget, "fullName");
    isValid = false;
  }

  if (!phone) {
    showInputError(e.currentTarget, "phone");
    isValid = false;
  }

  if (!group || group === "Выберите группу") {
    const groupSelect = e.currentTarget.querySelector(
      ".custom-select__wrapper"
    );
    if (groupSelect) groupSelect.classList.add("input-error");

    isValid = false;
  } else {
    const groupSelect = e.currentTarget.querySelector(
      ".custom-select__wrapper"
    );
    if (groupSelect) groupSelect.classList.remove("input-error");
  }

  if (!isValid) return;

  // if (!fullName || !phone || !group || group === "Выберите группу") {
  //   alert("Пожалуйста, заполните все поля.");
  //   return;
  // }

  const cleanPhone = Number(phone.replace(/\D/g, ""));

  const isDuplicate = contactsHandler.items.some(
    (c) => c.phoneNumber === cleanPhone
  );

  if (isDuplicate) {
    showToast("Контакт с таким номером уже существует!", "error");

    const phoneInput = e.currentTarget.elements.namedItem(
      "phone"
    ) as HTMLInputElement | null;
    phoneInput?.classList.add("input--error");
    phoneInput?.focus();

    return;
  }

  composeNewContact(fullName, cleanPhone, group);
  e.currentTarget.reset();

  closeSidebar();
}

function showInputError(form: HTMLFormElement, name: string) {
  const input = form.querySelector(`[name="${name}"]`) as HTMLInputElement;
  const error = form.querySelector(`.error-message[data-error-for="${name}"]`);

  input?.classList.add("input-error");
  if (error) error.classList.add("active");

  input?.addEventListener(
    "input",
    () => {
      input.classList.remove("input-error");
      if (error) error.classList.remove("active");
    },
    { once: true }
  );
}

function composeNewContact(fullName: string, phone: number, group: string) {
  const groupId = groupsHandler.items.find((item) => item.title === group);

  if (!groupId) {
    return;
  }
  const newContact = contactsHandler.createContact(fullName, phone, groupId.id);
  contactsHandler.addContact(newContact);
  updateContactsStorage();

  const safeId = `contacts-${groupId.id}`;
  const targetContainer = document.getElementById(safeId);

  if (targetContainer) {
    targetContainer.prepend(createContactUI(fullName, phone));
  } else {
    console.warn(`Контейнер с id '${safeId}' не найден!`);
  }
}

function initCustomSelect(): void {
  document.querySelectorAll(".custom-select__wrapper").forEach((wrapper) => {
    const dropdown = wrapper.querySelector(".custom-select__dropdown");
    const selected = wrapper.querySelector(".custom-select__selected span");
    const options = wrapper.querySelectorAll(".custom-select__option");

    if (!dropdown || !selected || options.length === 0) return;

    wrapper.addEventListener("click", () => {
      dropdown.classList.toggle("custom-select__dropdown-visible");
      wrapper.classList.toggle("custom-select__wrapper-active");
    });

    options.forEach((option) => {
      option.addEventListener("click", (e) => {
        e.stopPropagation();

        selected.textContent = option.textContent;

        options.forEach((o) =>
          o.classList.remove("custom-select__option-active")
        );
        option.classList.add("custom-select__option-active");

        dropdown.classList.remove("custom-select__dropdown-visible");
        wrapper.classList.remove("custom-select__wrapper-active");
      });
    });

    document.addEventListener("click", (e) => {
      if (!wrapper.contains(e.target as Node)) {
        dropdown.classList.remove("custom-select__dropdown-visible");
        wrapper.classList.remove("custom-select__wrapper-active");
      }
    });
  });
}

function setupContactsToggle(): void {
  const containers = document.querySelectorAll(".contacts__container");

  containers.forEach((container) => {
    const arrowButton = container.querySelector(
      ".contacts__header"
    ) as HTMLButtonElement | null;
    const contactList = container.querySelector(
      ".contacts__list"
    ) as HTMLUListElement | null;
    const title = container.querySelector(
      ".contacts__title"
    ) as HTMLElement | null;

    if (!arrowButton || !contactList || !title) return;

    arrowButton.addEventListener("click", () => {
      contactList.classList.toggle("contacts__list-collapsed");
      arrowButton.classList.toggle("contacts__arrow-rotated");
      title.classList.toggle("contacts__title-active");
    });
  });
}
function setupSidebarToggle(): void {
  const openButtons = document.querySelectorAll("[data-open-sidebar]");

  const closeButtons = document.querySelectorAll(".sidebar__close");

  openButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetKey = btn.getAttribute("data-open-sidebar");
      const targetSidebar = document.querySelector(
        `.sidebar[data-sidebar="${targetKey}"]`
      );
      if (!targetSidebar || !overlay) return;

      sidebars.forEach((s) => s.classList.remove("active"));
      targetSidebar.classList.add("active");
      overlay.classList.add("active");
    });
  });

  closeButtons.forEach((btn) => {
    btn.addEventListener("click", closeSidebar);
  });

  overlay?.addEventListener("click", closeSidebar);
}

function initPhoneMask(): void {
  const newContactForm = document.getElementById(
    "newContactForm"
  ) as HTMLFormElement | null;
  if (!newContactForm) return;

  const phoneInput = newContactForm.elements.namedItem(
    "phone"
  ) as HTMLInputElement | null;
  if (!phoneInput) return;

  IMask(phoneInput, {
    mask: "+{7} (000) 000 - 00 - 00",
  });
}

export {
  renderContacts,
  setupContactsToggle,
  setupSidebarToggle,
  initCustomSelect,
  initPhoneMask,
};
