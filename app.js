const tabs = document.querySelectorAll(".tabs");
const tabMenu = document.querySelectorAll(".tab-menu");

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
