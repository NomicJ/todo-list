import "./scss/style.scss";

const wrapper = document.querySelector(".custom-select__wrapper");
const dropdown = wrapper.querySelector(".custom-select__dropdown");
const selected = wrapper.querySelector(".custom-select__selected span");
const options = wrapper.querySelectorAll(".custom-select__option");

wrapper.addEventListener("click", () => {
  dropdown.classList.toggle("custom-select__dropdown-visible");
  wrapper.classList.toggle("custom-select__wrapper-active");
});

options.forEach((option) => {
  option.addEventListener("click", (e) => {
    e.stopPropagation();
    selected.textContent = option.textContent;

    options.forEach((o) => o.classList.remove("custom-select__option-active"));
    option.classList.add("custom-select__option-active");

    dropdown.classList.remove("custom-select__dropdown-visible");
    wrapper.classList.remove("custom-select__wrapper-active");
  });
});

document.addEventListener("click", (e) => {
  if (!wrapper.contains(e.target)) {
    dropdown.classList.remove("custom-select__dropdown-visible");
    wrapper.classList.remove("custom-select__wrapper-active");
  }
});

export function setupContactsToggle(): void {
  const arrowButton = document.querySelector(
    ".contacts__header"
  ) as HTMLButtonElement | null;
  const contactList = document.querySelector(
    ".contacts__list"
  ) as HTMLUListElement | null;
  const title = document.querySelector(
    ".contacts__title"
  ) as HTMLElement | null;

  if (!arrowButton || !contactList || !title) return;

  arrowButton.addEventListener("click", () => {
    contactList.classList.toggle("contacts__list-collapsed");
    arrowButton.classList.toggle("contacts__arrow-rotated");
    title.classList.toggle("contacts__title-active");
  });
}

setupContactsToggle();

export function setupSidebarToggle(): void {
  const openButtons = document.querySelectorAll("[data-open-sidebar]");
  const sidebars = document.querySelectorAll(".sidebar[data-sidebar]");
  const closeButtons = document.querySelectorAll(".sidebar__close");
  const overlay = document.querySelector(".overlay") as HTMLElement | null;

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

  const closeSidebar = () => {
    sidebars.forEach((s) => s.classList.remove("active"));
    overlay?.classList.remove("active");
  };

  closeButtons.forEach((btn) => {
    btn.addEventListener("click", closeSidebar);
  });

  overlay?.addEventListener("click", closeSidebar);
}

setupSidebarToggle();
