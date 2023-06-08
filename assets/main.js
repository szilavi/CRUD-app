const url = "http://localhost:3000/users/";
let modedUser = {};
let newUser = {};
let editInProgress = false;

//ADATOK KIOLVASÁSA ÉS MEGJELENÍTÉSE--------------------------------------------
async function get(url) {
  try {
    const response = await fetch(url);
    const users = await response.json();
    return users;
  } catch (e) {
    console.error(e.message);
    console.log("Baj van, valami nagyon nem oké!");
    return [];
  }
}
get(url);

async function setUpTable() {
  let rowsHTML = "";
  let users = await get(url);
  users = users.reverse();
  for (let i = 0; i < users.length; i++) {
    rowsHTML += `
    <tr class="tr-inputs">
    <td class="id">${users[i].id}</td>
    <td><input class="input-name" readonly="" value="${users[i].name}"></td>
    <td><input class="input-email" readonly="" value="${users[i].emailAddress}"></td>
    <td><input class="input-address" readonly="" value="${users[i].address}"></td>
    <td><button type="button" class="edit"><i class="fa-regular fa-pen-to-square"></i> Szerkesztés</button></td>
    <td><button type="button" class="remove"><i class="fa-solid fa-trash-can"></i> Törlés</button></td>
    <td style="visibility: hidden"><button type="button" class="save" style="visibility: hidden;"><i class="fa-regular fa-floppy-disk"></i></button><button type="button" class="cancel" style="visibility: hidden;"><i class="fa-solid fa-ban"></i></button></td>
    </tr>
    `;
  }
  document.querySelector("table tbody").innerHTML = rowsHTML;
  buttonsAction();
}

setUpTable();

//FETCH METÓDUSOK--------------------------------------------------------------------------------

async function deleteUser(userId) {
  const response = await fetch(url + userId, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
}

async function editUser(userId) {
  const response = await fetch(url + userId, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(modedUser),
  });
}

async function addUser() {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newUser),
  });
}

//GOMBOK MŰKÖDÉSRE BÍRÁSA-----------------------------------------------------------------------

function buttonsAction() {
  const editBtn = document.querySelectorAll(".edit");
  const removeBtn = document.querySelectorAll(".remove");

  //USER TÖRLÉSE--------------------------------------------------------------------------------

  removeBtn.forEach((element) => {
    element.addEventListener("click", deleteRow);
  });

  function deleteRow(e) {
    if (editInProgress) {
      inprogressToast();
      return false;
    }
    let userId = e.target.closest("tr").querySelector(".id").textContent;
    e.target.closest("tr").remove();
    createDeleteUserToast();
    deleteUser(userId);
  }

  //USER MÓDOSÍTÁSA ----------------------------------------------------------------------------

  editBtn.forEach((element) => {
    element.addEventListener("click", editRow);
  });

  function editRow(e) {
    if (editInProgress) {
      inprogressToast();
      return false;
    }
    editInProgress = true;
    let userId = e.target.closest("tr").querySelector("td.id").textContent;
    let userName = e.target.closest("tr").querySelector(".input-name");
    let emailAddress = e.target.closest("tr").querySelector(".input-email");
    let address = e.target.closest("tr").querySelector(".input-address");

    let allTd = e.target.closest("tr").querySelectorAll("td");

    allTd.forEach((td) => {
      td.style.background = "#ffc107";
    });

    let tempUser = {
      id: userId,
      name: userName.value,
      emailAddress: emailAddress.value,
      address: address.value,
    };

    userName.readOnly = false;
    emailAddress.readOnly = false;
    address.readOnly = false;

    e.target.closest("tr").querySelector(".save").style.visibility = "visible";
    e.target.closest("tr").querySelector(".cancel").style.visibility =
      "visible";
    e.target.closest("tr").querySelector(".edit").style.visibility = "hidden";
    e.target.closest("tr").querySelector(".remove").style.visibility = "hidden";

    //USER ADATAINAK MÓDOSÍTÁSÁNAK VISSZAVONÁSA  ---------------------------------------------

    const cancelBtn = document.querySelectorAll(".cancel");

    cancelBtn.forEach((element) => {
      element.addEventListener("click", cancelModifi);
    });

    function cancelModifi() {
      userId = tempUser.id;
      userName.value = tempUser.name;
      emailAddress.value = tempUser.emailAddress;
      address.value = tempUser.address;

      userName.readOnly = true;
      emailAddress.readOnly = true;
      address.readOnly = true;

      e.target.closest("tr").querySelector(".save").style.visibility = "hidden";
      e.target.closest("tr").querySelector(".cancel").style.visibility =
        "hidden";
      e.target.closest("tr").querySelector(".edit").style.visibility =
        "visible";
      e.target.closest("tr").querySelector(".remove").style.visibility =
        "visible";
      allTd.forEach((td) => {
        td.style.background = "#D3D3D3";
      });

      editInProgress = false;
      cancelBtn.forEach((element) => {
        element.removeEventListener("click", cancelModifi);
      });

      saveBtn.forEach((element) => {
        element.removeEventListener("click", modifiUserData);
      });
    }

    //user módosításának megerősítése -----------------------

    const saveBtn = document.querySelectorAll(".save");

    saveBtn.forEach((element) => {
      element.addEventListener("click", modifiUserData);
    });
    function modifiUserData() {
      const nameValidator =
        /^([a-zA-Z]{2,}\s[a-zA-Z]{1,}'?-?[a-zA-Z]{2,}\s?([a-zA-Z]{1,})?)/;

      if (nameValidator.test(userName.value)) {
        console.log("valid név");
      } else {
        notValidToast("név");
        return false;
      }

      const emailValidator = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

      if (emailValidator.test(emailAddress.value)) {
        console.log("valid email");
      } else {
        notValidToast("e-mail cím");
        return false;
      }

      const addressValidator =
        /^(\d+) ?([A-Za-z](?= ))? (.*?) ([^ ]+?) ?((?<= )APT)? ?((?<= )\d*)?$/;

      if (addressValidator.test(address.value)) {
        console.log("valid cím");
      } else {
        notValidToast("cím");
        return false;
      }

      modedUser = {
        id: userId,
        name: userName.value,
        emailAddress: emailAddress.value,
        address: address.value,
      };
      userName.readOnly = true;
      emailAddress.readOnly = true;
      address.readOnly = true;

      e.target.closest("tr").querySelector(".save").style.visibility = "hidden";
      e.target.closest("tr").querySelector(".cancel").style.visibility =
        "hidden";
      e.target.closest("tr").querySelector(".edit").style.visibility =
        "visible";
      e.target.closest("tr").querySelector(".remove").style.visibility =
        "visible";

      editUser(userId);
      saveBtn.forEach((element) => {
        element.removeEventListener("click", modifiUserData);
      });
      allTd.forEach((td) => {
        td.style.background = "#D3D3D3";
      });
      createModifiUserToast();
      editInProgress = false;
    }
  }

  // ÚJ USER HOZZÁADÁSA ------------------------------
  const createNewUser = document.querySelector(".newUser");

  createNewUser.addEventListener("click", createNewRow);

  function createNewRow() {
    if (editInProgress) {
      inprogressToast();
      return false;
    }
    editInProgress = true;
    const newUserBtn = document.querySelector(".newUser");
    newUserBtn.disabled = true;
    const tBody = document.querySelector("table tbody");
    const userId = document.querySelectorAll(".id");
    let highestNum = 0;
    userId.forEach((i) => {
      if (Number(i.textContent) > highestNum) {
        highestNum = Number(i.textContent);
      }
    });
    const newUSerRow = `<tr>
    <td class="id">${highestNum + 1}</td>
    <td style="background:#ffc107"><input class="newUser-input-name"></td>
    <td style="background:#ffc107"><input class="newUser-input-email"></td>
    <td style="background:#ffc107"><input class="newUser-input-address"></td>
    <td style="background:#ffc107"><button type="button" class="addUser" style="visibility: visible;"><i class="fa-solid fa-plus"></i> Hozzáad</button></td>
    <td style="background:#ffc107"><button type="button" class="undoUser" style="visibility: visible;"><i class="fa-solid fa-xmark"></i> Mégse</button></td>
    </tr>
    `;
    //tBody.innerHTML = newUSerRow + tBody.innerHTML;
    tBody.insertAdjacentHTML("beforebegin", newUSerRow);

    const newUserId = document.querySelector(".id");
    const newUserName = document.querySelector(".newUser-input-name");
    const newUserEmail = document.querySelector(".newUser-input-email");
    const newUserAddress = document.querySelector(".newUser-input-address");
    const addNewUserBtn = document.querySelector(".addUser");
    const undoNewUserBtn = document.querySelector(".undoUser");

    addNewUserBtn.addEventListener("click", postNewUser);

    function postNewUser() {
      const nameValidator =
        /^([a-zA-Z]{2,}\s[a-zA-Z]{1,}'?-?[a-zA-Z]{2,}\s?([a-zA-Z]{1,})?)/;

      if (nameValidator.test(newUserName.value)) {
        console.log("valid név");
      } else {
        notValidToast("név");
        return false;
      }

      const emailValidator = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

      if (emailValidator.test(newUserEmail.value)) {
        console.log("valid email");
      } else {
        notValidToast("e-mail cím");
        return false;
      }

      const addressValidator =
        /^(\d+) ?([A-Za-z](?= ))? (.*?) ([^ ]+?) ?((?<= )APT)? ?((?<= )\d*)?$/;

      if (addressValidator.test(newUserAddress.value)) {
        console.log("valid cím");
      } else {
        notValidToast("cím");
        return false;
      }

      newUser = {
        id: Number(newUserId.textContent),
        name: newUserName.value,
        emailAddress: newUserEmail.value,
        address: newUserAddress.value,
      };
      newUserBtn.disabled = false;
      createNewUserToast();
      addUser();
      editInProgress = false;
      setUpTable();
      addNewUserBtn.removeEventListener("click", postNewUser);
    }

    undoNewUserBtn.addEventListener("click", undoNewUser);

    function undoNewUser(e) {
      e.target.closest("tr").remove();
      newUserBtn.disabled = false;
      undoNewUserBtn.removeEventListener("click", undoNewUser);
      editInProgress = false;
    }
  }
}

//TOAST --------------------------------------------------------------------

let toastContainer;

(function initToast() {
  document.body.insertAdjacentHTML(
    "afterbegin",
    `<div class="toast__container"</div>`
  );
  toastContainer = document.querySelector(".toast__container");
})();

function createDeleteUserToast() {
  toastContainer.insertAdjacentHTML(
    "beforeend",
    `<p class='deleteUserToast'>
    Sikeresen törölted a felhasználót!
    </p>`
  );
  const toast = toastContainer.lastElementChild;
  toast.addEventListener("animationend", () => {
    toast.remove();
  });
}

function createModifiUserToast() {
  toastContainer.insertAdjacentHTML(
    "beforeend",
    `<p class='modifiUserToast'>
    Sikeresen módosítottad a felhasználó adatait!
    </p>`
  );
  const toast = toastContainer.lastElementChild;
  toast.addEventListener("animationend", () => {
    toast.remove();
  });
}

function createNewUserToast() {
  toastContainer.insertAdjacentHTML(
    "beforeend",
    `<p class='NewUserToast'>
    Sikeresen hozzáadtál egy új felhasználót a listához!
    </p>`
  );
  const toast = toastContainer.lastElementChild;
  toast.addEventListener("animationend", () => {
    toast.remove();
  });
}

function inprogressToast() {
  toastContainer.insertAdjacentHTML(
    "beforeend",
    `<p class='inprogressUserToast'>
    Előbb fejezd be az előző műveletet!
    </p>`
  );
  const toast = toastContainer.lastElementChild;
  toast.addEventListener("animationend", () => {
    toast.remove();
  });
}

function notValidToast(input) {
  toastContainer.insertAdjacentHTML(
    "beforeend",
    `<p class='notValidToast'>
    Nem megfelelő ${input} 
    </p>`
  );
  const toast = toastContainer.lastElementChild;
  toast.addEventListener("animationend", () => {
    toast.remove();
  });
}
