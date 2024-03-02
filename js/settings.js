/* The code is creating two charts using the Chart.js library. */
// popup.js

document.addEventListener("DOMContentLoaded", function() {
    const tabs = document.querySelectorAll(".tab");
    const tabContents = document.querySelectorAll(".tab-pane");
  
    tabs.forEach(tab => {
      tab.addEventListener("click", function() {
        const target = this.getAttribute("data-target");
  
        tabs.forEach(tab => {
          tab.classList.remove("active");
        });
  
        tabContents.forEach(content => {
          content.classList.remove("active");
        });
  
        this.classList.add("active");
        document.getElementById(target).classList.add("active");
        document.getElementById(target).classList.add("fade-in");
      });
    });
  });

const checkboxes = document.querySelectorAll('input[type="checkbox"]');

function saveCheckboxValues() {
  checkboxes.forEach((checkbox) => {
    localStorage.setItem(checkbox.id, checkbox.checked);
  });
}

function loadCheckboxValues() {
  checkboxes.forEach((checkbox) => {
    const savedValue = localStorage.getItem(checkbox.id);
    if (savedValue !== null) {
      checkbox.checked = savedValue === 'true';
    }
  });
}

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener('change', saveCheckboxValues);
});

window.addEventListener('DOMContentLoaded', loadCheckboxValues);
