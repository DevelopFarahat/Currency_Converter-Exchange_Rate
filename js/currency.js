
let baseCurrency = document.getElementById("baseCurrency");
let baseC = document.getElementById("filterCurrency");
let dataTable = document.getElementById("dataTable");
let targetCurrency = document.getElementById("targetCurrency");
let updatedDate = document.querySelector("[name='lastUpdate-text']");
let currencyFilterTxt = document.querySelector("[name='filter-text']");
let sortSelect = document.querySelector(".select-sort");
let tableTBody = document.querySelector("tbody");
//tableTBody.remove();
let requestURL_Currency_name = "https://api.exchangerate.host/symbols";
let currencies_Names_code = [];
let currencies_values = [];
let baseName = "EGP";
let sortType;
let request = new XMLHttpRequest();
request.open("GET", requestURL_Currency_name);
request.responseType = "json";
request.send();
let counter = 1;
request.onload = function () {
  let responseCurrency = request.response;
  for (let key in responseCurrency) {
    if (key == "symbols") {
      for (let obj in responseCurrency[key]) {
        currencies_Names_code.push(Object.values(responseCurrency[key][obj]));
      }
    }
  }
  currencies_Names_code.sort((a, b) => a[0].charCodeAt(0) - b[0].charCodeAt(0));

  for (let i = 0; i < currencies_Names_code.length; i++) {
    let currencyNameAsBase = document.createElement("option");
    currencyNameAsBase.classList.add("opt");
    currencyNameAsBase.value = currencies_Names_code[i][1];
    currencyNameAsBase.innerHTML = currencies_Names_code[i][0];
    baseCurrency.append(currencyNameAsBase);
    let currencyNameasTarget = document.createElement("option");
    currencyNameasTarget.value = currencies_Names_code[i][1];
    currencyNameasTarget.innerHTML = currencies_Names_code[i][0];
    targetCurrency.append(currencyNameasTarget);
    let currencyNameAsFilter = document.createElement("option");
    currencyNameAsFilter.classList.add("opt");
    currencyNameAsFilter.id = "optionFilter" + counter;
    currencyNameAsFilter.value = currencies_Names_code[i][1];
    currencyNameAsFilter.innerHTML = currencies_Names_code[i][0];
    baseC.append(currencyNameAsFilter);
    if (currencyNameAsFilter.value == "EGP")
      currencyNameAsFilter.setAttribute("selected", "selected");
  }
  counter++;
};
let htmlElement_name = [];
let htmlElement_abbr = [];
let htmlElement_amount = [];
let sor_dsc = 'on';
let elementCreationStatus = 'on';
function getCurrencyDetails(sortType = "dsc") {
  let requestURLForFilterCurrency = `https://api.exchangerate.host/latest?base=${baseName}`;
  let req = new XMLHttpRequest();
  req.open("GET", requestURLForFilterCurrency);
  req.responseType = "json";
  req.send();
  req.onload = function () {
    let reponseValues = req.response;
    for (let values in reponseValues) {
      if (values == "date") updatedDate.innerHTML = reponseValues[values];
      updatedDate.style.color = "#FFFFFF";
      updatedDate.style.background = "#FF0000";
      if (values == "rates") {
        currencies_values = Object.entries(reponseValues[values]);
      }
    }
    if (sortType === "dsc") {
      currencies_values.sort((a, b) => b[1] - a[1]);
    } else {
      currencies_values.sort((a, b) => a[1] - b[1]);
    }
    for (let i = 0; i < currencies_values.length; i++) {
      let matchedCurrencyName = currencies_Names_code.find(
        (item) => item[1] === currencies_values[i][0]
      );
      if (sortType === 'dsc' && sor_dsc === 'on' && elementCreationStatus === 'on') {
        let rowTable = document.createElement("tr");
        rowTable.addEventListener('mouseover',()=>{
          markCellTableAmount.style.background = "#000928";
        });
        rowTable.addEventListener('mouseleave',()=>{
          markCellTableAmount.style.background = "#FF0000";
        });
        let cellTableName = document.createElement("td");
        cellTableName.append(matchedCurrencyName[0]);
        rowTable.append(cellTableName);

        let cellTableAbbr = document.createElement("td");
        cellTableAbbr.append(currencies_values[i][0]);
        rowTable.append(cellTableAbbr);
        let cellTableAmount = document.createElement("td");
        let markCellTableAmount = document.createElement("mark");
          markCellTableAmount.style.cssText = "color:#FFFFFF;background:#FF0000";
          markCellTableAmount.append(
          Number.parseFloat(currencies_values[i][1]).toFixed(2)
        );
        cellTableAmount.append(markCellTableAmount);
        rowTable.append(cellTableAmount);
        tableTBody.append(rowTable);
        dataTable.append(tableTBody);
        htmlElement_name.push(cellTableName);
        htmlElement_abbr.push(cellTableAbbr);
        htmlElement_amount.push(cellTableAmount);
      } else {
        htmlElement_name[i].innerHTML = matchedCurrencyName[0];
        htmlElement_abbr[i].innerHTML = currencies_values[i][0];
        htmlElement_amount[i].innerHTML = `<mark style="color:#FFFFFF;background:#FF0000;">${Number.parseFloat(currencies_values[i][1]).toFixed(2)}</mark>`
      }

      if (dataTable.children[1].nodeName === "TBODY") {
        dataTable.children[1].children[i].setAttribute("data-according-to", baseName);
      }
    }
  }
}
setTimeout(()=>{
  getCurrencyDetails();
},0);
//getCurrencyDetails();
baseC.addEventListener("change", function (evnet) {
  baseName = baseC.value;
  if (evnet.target.getAttribute('data-according-to') !== 'EGP')
    elementCreationStatus = 'off';
  getCurrencyDetails(sortType);
});
sortSelect.addEventListener("change", function (event) {
  sortType = event.target.value;
  if (sortType === 'dsc')
    sor_dsc = 'off';
  getCurrencyDetails(sortType);
});
//filter table
currencyFilterTxt.onkeyup = function () {
  const inputStr = currencyFilterTxt.value.toUpperCase();
  document
    .querySelectorAll("#dataTable tr:not(.header)")
    .forEach((tr) => {
      const anyMatch = [...tr.children].some((td) =>
        td.textContent.toUpperCase().includes(inputStr)
      );
      if (anyMatch) tr.style.removeProperty("display");
      else tr.style.display = "none";
    });
};
let requestURLForCurrencyConvert;
let currencyFrom;
let currencyTo;
let amountValue;
let userInputValue = document.getElementById("userInputValue");
let resultTxt = document.getElementById("resultValue");
baseCurrency.onchange = function getUserBaseCurrency() {
  currencyFrom = baseCurrency.value;
  if (
    amountValue !== undefined &&
    currencyFrom !== undefined &&
    currencyTo !== undefined
  ) {
    if (amountValue !== "") {
      getResult();
    } else {
      resultTxt.value = "0.00";
    }
  }
};
targetCurrency.onchange = function getUserTargetCurrency() {
  currencyTo = targetCurrency.value;
  if (
    amountValue !== undefined &&
    currencyFrom !== undefined &&
    currencyTo !== undefined
  ) {
    if (amountValue !== "") {
      getResult();
    } else {
      resultTxt.value = "0.00";
    }
  }
};
userInputValue.onkeyup = function getUserAmountValue() {
  amountValue = userInputValue.value;
  if (
    amountValue !== undefined &&
    currencyFrom !== undefined &&
    currencyTo !== undefined
  ) {
    if (amountValue !== "") {
      getResult();
    } else {
      resultTxt.value = "0.00";
    }
  }
};
function getResult() {
  requestURLForCurrencyConvert = `https://api.exchangerate.host/convert?from=${currencyFrom}&to=${currencyTo}&amount=${amountValue}`;
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", requestURLForCurrencyConvert);
  xhttp.responseType = "json";
  xhttp.send();
  xhttp.onload = function () {
    let currencyConvertedResponse = this.response;
    for (let currency in currencyConvertedResponse) {
      if (currency == "result") {
        if (
          !isNaN(
            Number.parseFloat(currencyConvertedResponse[currency]).toFixed(2)
          )
        ) {
          resultTxt.value = Number.parseFloat(
            currencyConvertedResponse[currency]
          ).toFixed(2);
        }
      }
    }
  };
}
