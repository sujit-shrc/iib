const toolbar = document.querySelector(".toolbar");
let selectedRowId = null;

toolbar.addEventListener("click", (e) => {
  const value = e.target.id;
  console.log(value);
  switch (value) {
    case "sort-inc":
      sortData("asc");
      break;
    case "sort-desc":
      sortData("desc");
      break;
    case "delete":
      if (selectedRowId !== null) {
        console.log(selectedRowId);
        deleteRow(selectedRowId);
        selectedRowId = null;
      } else {
        alert("Please select a row to delete.");
      }
      break;
    case "reload":
      createTable();
      break;
    case "save":
      saveToFile();
      break;
    case "new":
      openForm(e);
      break;
  }
});

document.querySelector("form").addEventListener("submit", createRow);
document.querySelector(".close").addEventListener("click", (e) => {
  e.preventDefault();
  document.querySelector("form").classList.add("hidden");
});

function createTable() {
  const loader = document.getElementById("loader");
  loader.style.display = "block";
  const tablebody = document.querySelector("tbody");
  const storedData = loadData();

  tablebody.innerHTML = "";

  setTimeout(() => {
    storedData.forEach((data) => {
      const row = document.createElement("tr");
      row.innerHTML = `
      <td>
      <ion-icon name="checkmark-outline"></ion-icon>
        <span>${data.id}</span> - &nbsp; ${data.chemical}
      </td>

      <td>${data.vendor}</td>
      <td>${data.density}</td>
      <td>${data.viscosity}</td>
      <td>${data.packaging}</td>
      <td>${data.packSize}</td>
      <td>${data.unit}</td>
      <td>${data.quantity}</td>
    `;

      row.addEventListener("click", () => {
        row.classList.toggle("selected");
        selectRow(row, data.id);
      });
      tablebody.appendChild(row);
    });
    loader.style.display = "none";
  }, 500);
}

function selectRow(rowElement, rowId) {
  const previouslySelectedRow = document.querySelector(".selected");

  if (previouslySelectedRow) {
    previouslySelectedRow.classList.remove("selected");
  }

  rowElement.classList.add("selected");
  selectedRowId = rowId;
}

function openForm() {
  const form = document.querySelector("form");
  const body = document.querySelector("body");
  body.scrollIntoView();
  if (form.classList.contains("hidden")) {
    form.classList.remove("hidden");
    form.classList.add("add-row");
  }
}

function createRow(e) {
  e.preventDefault();
  const id = countRows() + 1;
  const form = e.target;
  const data = {
    id: id,
    chemical: form.chemical.value,
    vendor: form.vendor.value,
    density: form.density.value,
    viscosity: form.viscosity.value,
    packaging: form.packaging.value,
    packSize: form.packSize.value,
    unit: form.unit.value,
    quantity: form.quantity.value,
  };
  console.log(data);
  addData(data);
  form.reset();
  form.classList.add("hidden");
}

function saveToFile() {
  const storedData = loadData();
  const data = JSON.stringify(storedData, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "chemicalstore.json";
  a.click();
  URL.revokeObjectURL(url);
}

function loadData() {
  const storedData = localStorage.getItem("chemicalstore");
  if (storedData) {
    return JSON.parse(storedData);
  } else {
    const sampleData = getSampleData();
    saveData(sampleData);
    return sampleData;
  }
}

function saveData(data) {
  localStorage.setItem("chemicalstore", JSON.stringify(data));
}

function addData(data) {
  const storedData = loadData();
  storedData.push(data);
  saveData(storedData);
  createTable();
}

function updateRow(data) {
  const storedData = loadData();
  const index = storedData.findIndex((item) => item.id === data.id);
  storedData[index] = data;
  saveData(storedData);
  createTable();
}

function deleteRow(id) {
  console.log(id);
  const storedData = loadData();
  const index = storedData.findIndex((item) => item.id === id);
  storedData.splice(index, 1);
  saveData(storedData);
  createTable();
}

function sortData(sortType) {
  const storedData = loadData();
  if (sortType === "asc") {
    storedData.sort((a, b) => a.id - b.id);
  } else {
    storedData.sort((a, b) => b.id - a.id);
  }
  saveData(storedData);
  createTable();
}

function countRows() {
  const storedData = loadData();
  return storedData.length;
}

function getSampleData() {
  const chemicals = [
    "Acetone",
    "Benzene",
    "Chloroform",
    "Dichloromethane",
    "Ethanol",
    "Formaldehyde",
    "Glycerol",
    "Hexane",
    "Isopropanol",
    "Methanol",
    "Phenol",
    "Toluene",
    "Xylene",
    "Water",
    "Nitric Acid",
  ];
  const vendors = [
    "Sigma-Aldrich",
    "Merck",
    "Fisher Scientific",
    "Honeywell",
    "Spectrum Chemicals",
    "Thermo Fisher Scientific",
    "VWR International",
    "Alfa Aesar",
    "Avantor",
    "TCI Chemicals",
    "Acros Organics",
    "Strem Chemicals",
    "Santa Cruz Biotechnology",
    "Cayman Chemical",
    "Cayman Chemical",
  ];
  const packagings = [
    "Bottle",
    "Can",
    "Drum",
    "Bag",
    "Pail",
    "Jug",
    "Carboy",
    "Tote",
    "Cylinder",
    "Cask",
    "Barrel",
    "Box",
    "Carton",
    "Case",
    "Crate",
  ];
  const units = [
    "Litre",
    "Kilogram",
    "Gram",
    "Millilitre",
    "Pound",
    "Ounce",
    "Gallon",
    "Pint",
    "Quart",
    "Cup",
    "Tablespoon",
    "Teaspoon",
    "Fluid Ounce",
    "Cubic Metre",
    "Cubic Foot",
  ];

  const sampleData = [];

  for (let i = 0; i < 15; i++) {
    sampleData.push({
      id: i + 1,
      chemical: chemicals[i],
      vendor: vendors[i],
      density: Math.random() * 100,
      viscosity: Math.random() * 100,
      packaging: packagings[i],
      packSize: Math.floor(Math.random() * 100),
      unit: units[i],
      quantity: Math.floor(Math.random() * 100),
    });
  }

  return sampleData;
}

document.addEventListener("DOMContentLoaded", () => {
  createTable();
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("service-worker.js")
      .then((registration) => {
        console.log("ServiceWorker registered with scope:", registration.scope);
      })
      .catch((error) => {
        console.log("ServiceWorker registration failed:", error);
      });
  });
}
