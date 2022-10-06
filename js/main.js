const elSort = document.querySelector(`.js-sort`);
const elSearch = document.querySelector(`.js-search`);
const elMark = document.querySelector(`.js-mark`);
const elModal = document.querySelector(`.js-modal`);
const elList = document.querySelector(`.js-list`);
const elMarkButton = document.querySelector(`.js-mark-button`);
const elMarkList = document.querySelector(`.js-mark-list`);

const markArr = [];

const localCurrencies = window.localStorage.getItem(`token`);

let currencies = localCurrencies ? JSON.parse(localCurrencies) : [];

async function getDate(url) {
  try {
    const rawData = await fetch(url);
    const { data } = await rawData.json();
    currencies = data;
    window.localStorage.setItem(`token`, JSON.stringify(data));
  } catch (error) {
    console.error(error);
    console.error(`Internet uzildi`);
  }
}

getDate(`https://pressa-exem.herokuapp.com/api-49`);

// createElement
function render(data) {
  elList.innerHTML = ``;
  for (let i = 0; i < data.length; i++) {
    const element = data[i];

    const newItem = document.createElement(`tr`);
    newItem.dataset.id = element.id;

    const newCode = document.createElement(`th`);
    newCode.scope = `row`;
    newCode.textContent = element.Code;

    const newName = document.createElement(`td`);
    newName.textContent = element.CcyNm_UZ;

    const newLetterCode = document.createElement(`td`);
    newLetterCode.textContent = element.Ccy;

    const newValue = document.createElement(`td`);
    newValue.textContent = element.Diff;

    const newUpdatedData = document.createElement(`td`);
    newUpdatedData.textContent = element.Date;

    const newBookmark = document.createElement(`td`);

    const newLabel = document.createElement(`label`);
    newLabel.classList = `btn border border-dark js-bookmark`;

    const newCheck = document.createElement(`input`);
    newCheck.type = `checkbox`;
    newCheck.classList = `visually-hidden`;

    const newImg = document.createElement(`img`);
    newImg.width = 16;
    newImg.height = 16;
    newImg.src = `./images/bookmark.svg`;

    const newImgCheck = document.createElement(`img`);
    newImgCheck.classList = `d-none`;
    newImgCheck.width = 16;
    newImgCheck.height = 16;
    newImgCheck.src = `./images/bookmark-fill.svg`;

    // Bookmark
    newCheck.addEventListener(`click`, (evt) => {
      let parrentId = evt.target.parentNode.parentNode.parentNode.dataset.id;
      if (newCheck.checked == 1) {
        markArr.push(parrentId);
        elMark.textContent = markArr.length;
        newImg.classList.toggle(`d-none`);
        newImgCheck.classList.toggle(`d-none`);
      } else if (newCheck.checked == 0) {
        markArr.length--;
        elMark.textContent = markArr.length;
        newImg.classList.toggle(`d-none`);
        newImgCheck.classList.toggle(`d-none`);
      }
    });

    newItem.append(
      newCode,
      newName,
      newLetterCode,
      newValue,
      newUpdatedData,
      newBookmark
    );
    newBookmark.append(newLabel);
    newLabel.append(newCheck, newImg, newImgCheck);
    elList.appendChild(newItem);
  }
}
render(currencies);

// Sort
const sortArr = [...currencies];

elSort.addEventListener(`change`, () => {
  sortArr.sort((a, b) => {
    if (a.Diff * 1 > b.Diff * 1) return 1;
    if (a.Diff * 1 < b.Diff * 1) return -1;
    return 0;
  });
  if (elSort.value === `expensive`) {
    render(sortArr.reverse());
  } else if (elSort.value === `cheap`) {
    render(sortArr);
  }
});

// Search
const searchArr = [...currencies];

elSearch.addEventListener(`input`, () => {
  if (isNaN(elSearch.value)) {
    console.log(`iltimos`);
  } else {
    const searchValue = elSearch.value.trim() * 1;
    const searchData = searchArr.filter((proms) => proms.Diff > searchValue);
    render(searchData);
  }
});

// Modal
const modalStorage = window.localStorage.getItem(`modal`);

setTimeout(() => {
  if (!modalStorage) {
    elModal.click();
    window.localStorage.setItem(`modal`, JSON.stringify(`modal`));
  }
}, 10000);

// Loading
window.addEventListener(`load`, () => {
  const elLoading = document.querySelector(`.js-loading`);
  elLoading.classList.add(`d-none`);
});

// markList
elMarkButton.addEventListener(`click`, () => {
  elMarkList.innerHTML = ``;
  for (let i = 0; i < markArr.length; i++) {
    const markId = markArr[i];

    const newItem = document.createElement(`li`);
    newItem.classList = `d-flex mb-3 py-2 border-bottom`;

    const newName = document.createElement(`p`);
    newName.classList = `m-0`;

    const newValue = document.createElement(`p`);
    newValue.classList = `m-0 ms-auto`;

    sortArr.forEach((element) => {
      let newElId = element.id;
      let newElName = element.CcyNm_UZ;
      let newElValue = element.Diff;

      if (markId == newElId) {
        newName.textContent = newElName;
        newValue.textContent = newElValue;
      }
    });

    newItem.append(newName, newValue);
    elMarkList.append(newItem);
  }
});
