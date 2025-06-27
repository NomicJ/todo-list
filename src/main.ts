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
