const tabs = document.querySelectorAll(".tabs");
const tabMenu = document.querySelectorAll(".tab-menu");
const splashScreen = document.querySelector(".splash-screen")

window.addEventListener('DOMContentLoaded', (event) => {
  setTimeout(() => {
    splashScreen.classList.add("hidden")
  }, 2000)
});
// console.log("tabs", tabs)
// console.log("tabMenu", tabMenu)

console.log("---------------------");

const showTab = (id) => {
  const tabEl = id + "Tab";
  tabs.forEach((tab) => {
    tab.classList.add("hidden");
    if (tab.id == tabEl) {
      tab.classList.remove("hidden");
    }
  });
};

const openTab = (id) => {
  tabMenu.forEach((tab) => {
    tab.classList.remove("selected");
    if (tab.id == id) {
      tab.classList.add("selected");
    }
  });
  // console.log(id);
  showTab(id);
};
