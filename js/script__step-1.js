import {
  getAllData,
  ajaxUpdate
} from "./script__ajax.js";

import {
  scrollTo
} from "./script__scroll-to.js";
import {
  clickBtnBack,
  clickBtnNext
} from "./script__click-btn.js";
import {
  writeCookie,
  readCookie,
  deleteCookie
} from "./script__work-cookie.js";

function deleteAllCookie() {
  deleteCookie("step-now(new__vacancy)");
  deleteCookie("company-selected(new__vacancy)");
  deleteCookie("name-company-dont-show(new__vacancy)");
  deleteCookie("vacancy-city(new__vacancy)");
  deleteCookie("vacancy-name(new__vacancy)");
  deleteCookie("popup-categories(new__vacancy)");
  deleteCookie("popup-specialisation(new__vacancy)");
  deleteCookie("income-from(new__vacancy)");
  deleteCookie("income-upto(new__vacancy)");
  deleteCookie("work-format-select(new__vacancy)");
  deleteCookie("employment-select(new__vacancy)");
  deleteCookie("schedule-select(new__vacancy)");
  deleteCookie("temporary__employment(new__vacancy)");
  deleteCookie("working__mode(new__vacancy)");
  deleteCookie("income-additionally(new__vacancy)");
  deleteCookie("income-period(new__vacancy)");
  deleteCookie("income-currency(new__vacancy)");
  deleteCookie("income-percent(new__vacancy)");
  deleteCookie("bonuses-list(new__vacancy)");
  deleteCookie("experience(new__vacancy)");
  deleteCookie("contact__information-name(new__vacancy)");

  deleteCookie("skill-value(new__vacancy)");

  deleteCookie("languages-native(new__vacancy)");
  deleteCookie("driver__license-list1(new__vacancy)");
  deleteCookie("notification__applicant(new__vacancy)");
  deleteCookie("driver__license-list2(new__vacancy)");
  deleteCookie("response__options-list(new__vacancy)");
  deleteCookie("driver__license-checkbox(new__vacancy)");
  deleteCookie("response__options-checkbox(new__vacancy)");
  deleteCookie("contact__information-value(new__vacancy)");
  deleteCookie("send_response_notifications(new__vacancy)");
  deleteCookie("notification__applicant-checkbox(new__vacancy)");
  deleteCookie("work-format-select(new__vacancy)-id");
  deleteCookie("employment-select(new__vacancy)-id");
  deleteCookie("schedule-select(new__vacancy)-id");

  deleteCookie("popup-specialisation-id(new__vacancy)");
  deleteCookie("company-selected-id(new__vacancy)");

  localStorage.removeItem("description-vacancy(new__vacancy)");
  localStorage.removeItem("languages-value(new__vacancy)");
  localStorage.removeItem("short__description-vacancy(new__vacancy)");
}

document.addEventListener("DOMContentLoaded", () => {
  let scrollY;
  let background = document.querySelector(".background");

  let step1 = document.querySelector(".main .left__content .step-1");

  let companyErrorMessage = step1.querySelector(".company .error-message"),
    companyList = step1.querySelector(".company__list"),
    companyListItem,
    companySwitcher = step1.querySelector(".company .company__switcher input");

  let popupNewCompany = document.querySelector(".popup__new-company"),
    companyImageInputLoad = popupNewCompany.querySelector(".image__upload"),
    companyImage = popupNewCompany.querySelector(".image__picture"),
    companyImagePlaseholder = popupNewCompany.querySelector(".image__plaseholder"),
    companyImageAddButton = popupNewCompany.querySelector(".image__add"),
    companyImageAddMenu = popupNewCompany.querySelector(".image__add-menu"),
    companyImageLoadBtn = popupNewCompany.querySelector(".image__add-menu .load"),
    companyImageRemoveBtn = popupNewCompany.querySelector(".image__add-menu .remove"),
    companyNameInput = popupNewCompany.querySelector(".input__name"),
    companyNameList = popupNewCompany.querySelector(".input__list"),
    companyNameListItem,
    companyDescription = popupNewCompany.querySelector(".input__description"),
    companyDescriptionCount = popupNewCompany.querySelector(".input__description-count span"),
    companyInfoBlock = popupNewCompany.querySelector(".form__info"),
    companyInfoBlockName,
    companySaveBtn = popupNewCompany.querySelector(".save-btn");

  let cityInput = step1.querySelector(".locate__city .input input"),
    cityInputList = step1.querySelector(".locate__city .input .input__list"),
    cityErrorMessage = step1.querySelector(".locate__city .error-message "),
    cityAddItems = step1.querySelector(".locate__city .add-items"),
    inputCityArr = [];

  let cityAddress = step1.querySelector(".locate__address");

  let cityValue;
  let cityName;
  let popupNewAdress = document.querySelector(".popup__new-address"),
    popupNewAdressInput = popupNewAdress.querySelector(".input__address input"),
    popupNewAdressList = popupNewAdress.querySelector(".popup__new-address-inner .list"),
    popupNewAdressListInner = popupNewAdress.querySelector(".popup__new-address-inner .list-inner"),
    popupNewAdressActiveItem = popupNewAdress.querySelector(".popup__new-address-inner .active__item"),
    popupNewAdressActiveItemAddress = popupNewAdress.querySelector(".popup__new-address-inner .active__item .name"),
    popupNewAdressActiveItemInfo = popupNewAdress.querySelector(".popup__new-address-inner .active__item textarea"),
    popupNewAdressActiveItemCancel = popupNewAdress.querySelector(".popup__new-address-inner .active__item .cancel"),
    popupNewAdressActiveItemAdd = popupNewAdress.querySelector(".popup__new-address-inner .active__item .add"),
    popupNewAdressMap = popupNewAdress.querySelector(".popup__new-address-inner .map"),
    mapResizeIncrease = popupNewAdress.querySelector(".map__resize .increase"),
    mapResizeDecrease = popupNewAdress.querySelector(".map__resize .decrease"),
    mapLocation = popupNewAdress.querySelector(".map .map__location");

  // ввод текста в инпут
  function inputText(input, inputList) {
    input.value = input.value.replace(/[^а-яёa-z0-9 ,.;:/'"-]/gi, "");
    if (input.value.length > 0) {
      input.classList.add("active");
      input.parentNode.classList.add("active");
    } else {
      input.classList.remove("active");
      input.parentNode.classList.remove("active");
    }

    if (input.value.length >= 3) {
      inputList.classList.remove("hide");
    } else {
      inputList.classList.add("hide");
    }
  }

  // очистка инпута
  function clearInpur(input, inputList) {
    input.value = "";
    input.classList.remove("active");
    input.parentNode.classList.remove("active");
    inputList.classList.add("hide");
  }

  // создание элемента с городом
  function createItem(cityValue, cityName, addList, lat = null, lon = null) {
    let item = `
         <p class="item" data-value="${cityValue}" data-city="${cityName}" data-lat="${lat}" data-lon="${lon}">${cityName}<span class="remove-btn"></span></p>
         `;

    if (addList.classList.contains("hide")) {
      addList.classList.remove("hide");
    }
    addList.insertAdjacentHTML("beforeend", item);
  }

  // создание блока для ввода адресса офиса
  function createBlock(value, name, addressSpecified = null, address = null, type = null, lat = null, lon = null) {
    let checkedAttribute;
    let dontShowClass;
    let hideClass;
    let addressCity;
    if (addressSpecified != null) {
      checkedAttribute = "checked";
      dontShowClass = "";
      hideClass = "";
      addressCity = address;
    } else {
      checkedAttribute = "";
      dontShowClass = "dont-show";
      hideClass = "hide";
      addressCity = "";
    }

    let block = `
         <div div class="input-block" data-value="${value}" data-city="${name}" data-type="${type}" data-lot=${lat} data-lon=${lon}>
            <p class="city-name text-s14-h20-w500">${name}</p>
            <label class="locate__address-switcher switcher-btn" data-value="" data-name="">
               <input type="checkbox" ${checkedAttribute}>
               <span></span>
               <p>Указать адрес места работы</p>
            </label>
            <div class="inner ${dontShowClass}">
               <div class="input">
                  <div class="input__inner">
                     <input class="text-s14-h20-w400" type="text" placeholder="Начните вводить адрес из списка">
                  </div>
                  <div class="input__list text-s14-h20-w400 hide"></div>
               </div>
               <div class="add-items text-s15-h18-w400 ${hideClass}">
                  ${addressCity}
               </div>
            </div>
         </div >
         `;
    //  <p class="new__address-add text-s14-h20-w500">+ Добавить новый адрес</p>

    if (cityAddress.classList.contains("dont-show")) {
      cityAddress.classList.remove("dont-show");
    }
    cityAddress.insertAdjacentHTML("beforeend", block);
    cityAddress.style.maxHeight = `${cityAddress.scrollHeight}px`;
  }

  function handleLinkInput() {
    let input = document.querySelector(".modal-hh .mtModal-inner-body .mtModal-inner-body__list input.link-hh-input");

    input.addEventListener("input", () => {
      if (input.value.length >= 1) {
        input.parentNode.classList.add("active");
      } else {
        input.parentNode.classList.remove("active");
      }
    });
  }
  handleLinkInput();

  document.addEventListener("click", (event) => {
    let target = event.target;

    if (target.closest(".modal-trigger__open")) {
      actionsModal("open", target.closest(".modal-trigger__open").getAttribute("data-modal"));
    }

    if (target.closest(".modal-trigger__close")) {
      actionsModal("close", target.closest(".modal-trigger__close"));
    }

    if (target.closest(".modal-draft .mtModal-inner-actions .button-orange-fill")) {
      let radioList = document.querySelectorAll(".modal-draft .mtModal-inner-body__list .item");
      let idArr = [];

      radioList.forEach((item) => {
        if (item.querySelector("input.item__hidden").checked) {
          idArr = item.getAttribute("data-value").split(",");
        }
      });

      let Data = {};

      function arrToCookie(arr) {
        let cookie = [];
        for (var key in arr) {
          cookie.push(`"` + arr[key] + `"`);
        }
        cookie = "[" + cookie.toString() + "]";
        return cookie;
      }

      $.ajax({
        url: templatePath + "/ajax.php",
        method: "POST",
        dataType: "json",
        data: {
          type: "draft-open",
          id: idArr,
        },
        success: function (data) {
          deleteAllCookie();

          Data = data[0];

          let cityCount = [];

          let cityJson = [];

          data.forEach((item, key) => {
            if (item.PROPERTY_CITY_LIVE_ADDRESS_VALUE != null) {
              let temp = {
                id: item.ID,
                name: item.PROPERTY_CITY_NEW_VALUE,
              };

              cityCount.push(temp);

              cityJson[key] = {
                city: item.PROPERTY_CITY_NEW_VALUE,
                "city value": item.PROPERTY_CITY_NEW_VALUE,
                "city type": null,
                "address specified": true,
                address: `<p class="item" data-value="${item.PROPERTY_CITY_LIVE_ADDRESS_VALUE}" data-city="null" data-lat="${item.PROPERTY_LAT_VALUE}" data-lon="${item.PROPERTY_LNG_VALUE}">${item.PROPERTY_CITY_LIVE_ADDRESS_VALUE}<span class=remove-btn></span></p>`,
                lat: item.PROPERTY_LAT_VALUE,
                lon: item.PROPERTY_LNG_VALUE,
              };
            } else if (item.PROPERTY_CITY_NEW_VALUE != null) {
              let temp = {
                id: item.ID,
                name: item.PROPERTY_CITY_NEW_VALUE,
              };
              cityCount.push(temp);

              cityJson[key] = {
                city: item.PROPERTY_CITY_NEW_VALUE,
                "city value": item.PROPERTY_CITY_NEW_VALUE,
                "city type": null,
                "address specified": false,
                address: null,
                lat: item.PROPERTY_LAT_VALUE,
                lon: item.PROPERTY_LNG_VALUE,
              };
            }
          });

          cityJson = JSON.stringify(cityJson);
          cityCount = JSON.stringify(cityCount);

          let id_cookie = [];

          for (let i = 0; i < data.length; i++) {
            id_cookie.push(data[i].ID);
          }

          id_cookie = id_cookie.join(",");
          writeCookie("draft-stack(new-vacancy)", id_cookie, 30);
          writeCookie("city-count(new-vacancy)", cityCount, 30);

          if (Data.NAME && (Data.NAME != null || Data.NAME != undefined)) {
            writeCookie("vacancy-name(new__vacancy)", Data.NAME, 30);
          }
          if (Data.PROPERTY_DRAFT_STEP_VALUE && (Data.PROPERTY_DRAFT_STEP_VALUE != null || Data.PROPERTY_DRAFT_STEP_VALUE != undefined)) {
            writeCookie("step-now(new__vacancy)", Data.PROPERTY_DRAFT_STEP_VALUE, 30);
          }

          if (Data.PROPERTY_COMP_ID_VALUE && (Data.PROPERTY_COMP_ID_VALUE != null || Data.PROPERTY_COMP_ID_VALUE != undefined)) {
            writeCookie("company-selected(new__vacancy)", Data.PROPERTY_COMP_ID_VALUE, 30);
          }
          if (Data.PROPERTY_COMP_ID_VALUE && (Data.PROPERTY_COMP_ID_VALUE != null || Data.PROPERTY_COMP_ID_VALUE != undefined)) {
            writeCookie("company-selected-id(new__vacancy)", Data.PROPERTY_COMP_ID_VALUE, 30);
          }

          localStorage.setItem("vacancy-city(new__vacancy)", cityJson);

          if (Data.PROPERTY_PROFOBL_VALUE && (Data.PROPERTY_PROFOBL_VALUE != null || Data.PROPERTY_PROFOBL_VALUE != undefined)) {
            writeCookie("popup-specialisation-id(new__vacancy)", Data.PROPERTY_PROFOBL_VALUE[0], 30);
          }
          if (Data.PROPERTY_PROFOBL_VALUE && (Data.PROPERTY_PROFOBL_VALUE != null || Data.PROPERTY_PROFOBL_VALUE != undefined)) {
            writeCookie("popup-specialisation(new__vacancy)", Data.PROPERTY_PROFOBL_VALUE[0], 30);
          }

          if (Data.DETAIL_TEXT && (Data.DETAIL_TEXT != null || Data.DETAIL_TEXT != undefined)) {
            localStorage.setItem("description-vacancy(new__vacancy)", Data.DETAIL_TEXT);
          }
          if (Data.PREVIEW_TEXT && (Data.PREVIEW_TEXT != null || Data.PREVIEW_TEXT != undefined)) {
            localStorage.setItem("short__description-vacancy(new__vacancy)", encodeURIComponent(JSON.stringify(Data.PREVIEW_TEXT)));
          }
          if (Data.PROPERTY_GRAF_VALUE && (Data.PROPERTY_GRAF_VALUE != null || Data.PROPERTY_GRAF_VALUE != undefined)) {
            writeCookie("employment-select(new__vacancy)", Data.PROPERTY_GRAF_VALUE, 30);
          }
          if (Data.PROPERTY_GRAF_ENUM_ID && (Data.PROPERTY_GRAF_ENUM_ID != null || Data.PROPERTY_GRAF_ENUM_ID != undefined)) {
            writeCookie("employment-select(new__vacancy)-id", Data.PROPERTY_GRAF_ENUM_ID, 30);
          }

          if (Data.PROPERTY_GRAF_R_VALUE && (Data.PROPERTY_GRAF_R_VALUE != null || Data.PROPERTY_GRAF_R_VALUE != undefined)) {
            writeCookie("schedule-select(new__vacancy)", Data.PROPERTY_GRAF_R_VALUE, 30);
          }
          if (Data.PROPERTY_GRAF_R_ENUM_ID && (Data.PROPERTY_GRAF_R_ENUM_ID != null || Data.PROPERTY_GRAF_R_ENUM_ID != undefined)) {
            writeCookie("schedule-select(new__vacancy)-id", Data.PROPERTY_GRAF_R_ENUM_ID, 30);
          }

          if (Data.PROPERTY_WORK_FORMAT_VALUE && (Data.PROPERTY_WORK_FORMAT_VALUE != null || Data.PROPERTY_WORK_FORMAT_VALUE != undefined)) {
            writeCookie("work-format-select(new__vacancy)", Object.values(Data.PROPERTY_WORK_FORMAT_VALUE)[0], 30);
          }
          if (Data.PROPERTY_WORK_FORMAT_VALUE && (Data.PROPERTY_WORK_FORMAT_VALUE != null || Data.PROPERTY_WORK_FORMAT_VALUE != undefined)) {
            writeCookie("work-format-select(new__vacancy)-id", Object.keys(Data.PROPERTY_WORK_FORMAT_VALUE)[0], 30);
          }

          if (Data.PROPERTY_WORK_MODE_VALUE && (Data.PROPERTY_WORK_MODE_VALUE != null || Data.PROPERTY_WORK_MODE_VALUE != undefined)) {
            writeCookie("working__mode(new__vacancy)", arrToCookie(Data.PROPERTY_WORK_MODE_VALUE), 30);
          }

          if (Data.PROPERTY_TEMP_REG_VALUE && (Data.PROPERTY_TEMP_REG_VALUE != null || Data.PROPERTY_TEMP_REG_VALUE != undefined)) {
            writeCookie("temporary__employment(new__vacancy)", true, 30);
          }
          if (Data.PROPERTY_ZARPLATA_VALUE && (Data.PROPERTY_ZARPLATA_VALUE != null || Data.PROPERTY_ZARPLATA_VALUE != undefined)) {
            writeCookie("income-from(new__vacancy)", Data.PROPERTY_ZARPLATA_VALUE, 30);
          }
          if (Data.PROPERTY_ZARPLATA_MAX_VALUE && (Data.PROPERTY_ZARPLATA_MAX_VALUE != null || Data.PROPERTY_ZARPLATA_MAX_VALUE != undefined)) {
            writeCookie("income-upto(new__vacancy)", Data.PROPERTY_ZARPLATA_MAX_VALUE, 30);
          }
          if (Data.PROPERTY_SAL_PERIOD_VALUE && (Data.PROPERTY_SAL_PERIOD_VALUE != null || Data.PROPERTY_SAL_PERIOD_VALUE != undefined)) {
            writeCookie("income-period(new__vacancy)", Data.PROPERTY_SAL_PERIOD_VALUE, 30);
          }
          if (Data.PROPERTY_CURRENCY_TYPE_VALUE && (Data.PROPERTY_CURRENCY_TYPE_VALUE != null || Data.PROPERTY_CURRENCY_TYPE_VALUE != undefined)) {
            writeCookie("income-currency(new__vacancy)", Data.PROPERTY_CURRENCY_TYPE_VALUE, 30);
          }
          if (Data.PROPERTY_CHECK_PROCENT_VALUE && (Data.PROPERTY_CHECK_PROCENT_VALUE != null || Data.PROPERTY_CHECK_PROCENT_VALUE != undefined)) {
            writeCookie("income-percent(new__vacancy)", true, 30);
          }
          if (Data.PROPERTY_TAX_DED_VALUE && (Data.PROPERTY_TAX_DED_VALUE != null || Data.PROPERTY_TAX_DED_VALUE != undefined)) {
            writeCookie("income-additionally(new__vacancy)", Data.PROPERTY_TAX_DED_VALUE, 30);
          }
          if (Data.PROPERTY_ADD_COND_VALUE && (Data.PROPERTY_ADD_COND_VALUE != null || Data.PROPERTY_ADD_COND_VALUE != undefined)) {
            writeCookie("bonuses-list(new__vacancy)", arrToCookie(Object.values(Data.PROPERTY_ADD_COND_VALUE)), 30);
          }
          if (Data.PROPERTY_WORK_EXP_VALUE && (Data.PROPERTY_WORK_EXP_VALUE != null || Data.PROPERTY_WORK_EXP_VALUE != undefined)) {
            writeCookie("experience(new__vacancy)", Data.PROPERTY_WORK_EXP_VALUE, 30);
          }
          if (Data.PROPERTY_KEY_SKILLS_VALUE && (Data.PROPERTY_KEY_SKILLS_VALUE != null || Data.PROPERTY_KEY_SKILLS_VALUE != undefined)) {
            writeCookie("skill-value(new__vacancy)", arrToCookie(Object.values(Data.PROPERTY_KEY_SKILLS_VALUE)), 30);
          }
          if (Data.PROPERTY_FOREIGN_LANG_VALUE && (Data.PROPERTY_FOREIGN_LANG_VALUE != null || Data.PROPERTY_FOREIGN_LANG_VALUE != undefined)) {
            writeCookie("languages-native(new__vacancy)", parseInt(Object.values(Data.PROPERTY_FOREIGN_LANG_VALUE)[0]), 30);
          }
          if (Data.PROPERTY_DRIVER_LICENSE_VALUE && (Data.PROPERTY_DRIVER_LICENSE_VALUE != null || Data.PROPERTY_DRIVER_LICENSE_VALUE != undefined)) {
            writeCookie("driver__license-list1(new__vacancy)", arrToCookie(Object.values(Data.PROPERTY_DRIVER_LICENSE_VALUE)), 30);
          }
          if (Data.PROPERTY_HAS_AUTO_VALUE && (Data.PROPERTY_HAS_AUTO_VALUE != null || Data.PROPERTY_HAS_AUTO_VALUE != undefined)) {
            writeCookie("driver__license-checkbox(new__vacancy)", true, 30);
          }
          if (Data.PROPERTY_AUTO_CLASS_VALUE && (Data.PROPERTY_AUTO_CLASS_VALUE != null || Data.PROPERTY_AUTO_CLASS_VALUE != undefined)) {
            writeCookie("driver__license-list2(new__vacancy)", arrToCookie(Object.values(Data.PROPERTY_AUTO_CLASS_VALUE)), 30);
          }
          if (Data.PROPERTY_AVAILABLE_TO_VALUE && (Data.PROPERTY_AVAILABLE_TO_VALUE != null || Data.PROPERTY_AVAILABLE_TO_VALUE != undefined)) {
            writeCookie("response__options-list(new__vacancy)", arrToCookie(Object.values(Data.PROPERTY_AVAILABLE_TO_VALUE)), 30);
          }
          if (Data.PROPERTY_ONLY_LETTER_VALUE && (Data.PROPERTY_ONLY_LETTER_VALUE != null || Data.PROPERTY_ONLY_LETTER_VALUE != undefined)) {
            writeCookie("response__options-checkbox(new__vacancy)", true, 30);
          }
          if (Data.PROPERTY_NOTIFICATION_MANAGER_VALUE && (Data.PROPERTY_NOTIFICATION_MANAGER_VALUE != null || Data.PROPERTY_NOTIFICATION_MANAGER_VALUE != undefined)) {
            writeCookie("send_response_notifications(new__vacancy)", true, 30);
          }
          if (Data.PROPERTY_AUTO_ANSWER_VALUE && (Data.PROPERTY_AUTO_ANSWER_VALUE != null || Data.PROPERTY_AUTO_ANSWER_VALUE != undefined)) {
            writeCookie("notification__applicant-checkbox(new__vacancy)", true, 30);
          }
          if (Data.PROPERTY_PATTERN_AUTO_ANSWER_VALUE.TEXT && (Data.PROPERTY_PATTERN_AUTO_ANSWER_VALUE.TEXT != null || Data.PROPERTY_PATTERN_AUTO_ANSWER_VALUE.TEXT != undefined)) {
            writeCookie("notification__applicant(new__vacancy)", Data.PROPERTY_PATTERN_AUTO_ANSWER_VALUE.TEXT, 30);
          }

          // location.reload();
        },
        error: function (data) {
          console.log(data);
        },
      });

      // nameVacancy.textContent = readCookie("vacancy-name(new__vacancy)");
    }

    if (target.closest(".left__content .button .clear-form")) {
      deleteAllCookie();
      location.reload();
    }

    if (target.closest(".link-hh-button")) {
      if (document.querySelector(".link-hh-input").value.length > 0) {
        document.querySelector(".link-hh").classList.remove("error");

        let link = $(".modal-hh .mtModal-inner-body .mtModal-inner-body__list input.link-hh-input").val();

        $.ajax({
          url: templatePath + "/parser.php",
          method: "POST",
          dataType: "json",
          data: {
            url: link,
          },
          success: function (data) {
            deleteAllCookie();
            pasteToCookie(data);

            // $(".background").trigger("click");
          },
          error: function (data) {
            console.log(data.responseText);
          },
        });
      } else {
        document.querySelector(".link-hh").classList.add("error");
      }

      function pasteToCookie(data) {
        let city = "";
        let fullAddress = "";
        let lat = "";
        let lng = "";
        let metro = "";
        let name = data["name"] != null ? data["name"] : "";

        if (!data["name"] || data["name"] == null || data["name"] == undefined) {
          let errorPopup = document.querySelector(".error-popup");
          let errorPopupText = errorPopup.querySelector("#error_print");

          errorPopupText.textContent = "Не удалось скопировать вакансию";

          errorPopup.classList.remove("hide");

          let interval = setInterval(function () {
            errorPopup.classList.add("hide");
            errorPopupText.textContent = "";
            clearInterval(interval);
          }, 4000);
        } else {
          writeCookie("step-now(new__vacancy)", 1, 30);

          let cityJson = [];

          if (data["address"] != null && data["address"]["city"] != null) {
            city = data["address"]["city"];

            fullAddress = data["address"]["raw"] != null ? data["address"]["raw"] : "";

            lat = data["address"]["lng"] != null ? data["address"]["lng"] : "";
            lng = data["address"]["lat"] != null ? data["address"]["lat"] : "";

            metro = data["address"]["metro"] != null ? data["address"]["metro"]["station_name"] : "";

            let temp = {
              city: city,
              "city value": fullAddress,
              "city type": null,
              "address specified": fullAddress != "" ? true : false,
              address: fullAddress != "" ? `<p class="item" data-value="${fullAddress}" data-city="null" data-lat="${lat}" data-lon="${lng}">${fullAddress}<span class=remove-btn></span></p>` : null,
              lat: lat,
              lon: lng,
            };
            cityJson.push(temp);
          } else {
            city = data["area"]["name"];

            let temp = {
              city: city,
              "city value": city,
              "city type": null,
              "address specified": false,
              address: null,
              lat: null,
              lon: null,
            };
            cityJson.push(temp);
          }
          cityJson = JSON.stringify(cityJson);

          writeCookie("vacancy-city(new__vacancy)", cityJson, 30);
          writeCookie("vacancy-name(new__vacancy)", name, 30);

          if (data["specializations"] != null) {
            $.ajax({
              url: templatePath + "/ajax.php",
              method: "POST",
              dataType: "json",
              data: {
                type: "getCategoryParser",
                data: data["specializations"],
              },
              success: function (data) {
                writeCookie("popup-categories(new__vacancy)", data.main.ID, 30);
                writeCookie("popup-specialisation(new__vacancy)", data.spec[1], 30);
                writeCookie("popup-specialisation-id(new__vacancy)", data.spec[0], 30);
              },
              error: function (data) {},
            });
          }

          if (data.salary && (data.salary != null || data.salary != undefined)) {
            data.salary.from = data.salary.from != null ? data.salary.from : data.salary.to;
            data.salary.to = data.salary.to != null ? data.salary.to : data.salary.from;

            if (data.salary.from == data.salary.to) {
              writeCookie("income-from(new__vacancy)", data.salary.from, 30);
              writeCookie("income-upto(new__vacancy)", data.salary.from, 30);
            } else {
              writeCookie("income-from(new__vacancy)", data.salary.from, 30);
              writeCookie("income-upto(new__vacancy)", data.salary.to, 30);
            }

            if ((data.salary.gross = true)) {
              writeCookie("income-additionally(new__vacancy)", "на руки", 30);
            } else {
              writeCookie("income-additionally(new__vacancy)", "до вычета налогов", 30);
            }
          }
          if (data.employment && (data.employment != null || data.employment != undefined)) {
            writeCookie("employment-select(new__vacancy)", data.employment.name, 30);
          }
          if (data.schedule && (data.schedule != null || data.schedule != undefined)) {
            writeCookie("schedule-select(new__vacancy)", data.schedule.name, 30);

            switch (data.schedule.name) {
              case "Удаленная работа":
                writeCookie("work-format-select(new__vacancy)", "Удалённо", 30);
                writeCookie("work-format-select(new__vacancy)-id", 1726, 30);
                break;
            }
          }

          if ((data.accept_temporary = true)) {
            writeCookie("temporary__employment(new__vacancy)", true, 30);
          }

          if (data.working_time_intervals && (data.working_time_intervals != null || data.working_time_intervals != undefined)) {
            let list = data.working_time_intervals;
            let arr = [];

            for (let i = 0; i < list.length; i++) {
              let item = list[i];
              switch (item.name) {
                case "Можно работать сменами по 4–6 часов в день":
                  item.name = "Сменами по 4 – 6 часов";
                  break;
                case "Можно начинать работать после 16:00":
                  item.name = "Рабочий день с 16:00";
                  break;
              }
              arr.push(item.name);
            }
            arr = JSON.stringify(arr);
            writeCookie("working__mode(new__vacancy)", arr, 30);
          }

          if (data.experience && (data.experience != null || data.experience != undefined)) {
            // let name = data.experience.name;
            // switch (name) {
            //     case "Нет опыта":
            //         name = "Нет опыта";
            //         break;
            //     case "От 1 года до 3 лет":
            //         name = "От 1 года до 3 лет";
            //         break;
            //     case "От 3 до 6 лет":
            //         name = "От 3 до 6 лет";
            //         break;
            //     case "Более 6 лет":
            //         name = "Более 6 лет";
            //         break;
            // }
            writeCookie("experience(new__vacancy)", data.experience.name, 30);
          }

          if (data.key_skills && (data.key_skills != null || data.key_skills != undefined)) {
            let list = data.key_skills;
            let arr = [];
            for (let i = 0; i < list.length; i++) {
              let item = list[i];
              arr.push(item.name);
            }
            arr = JSON.stringify(arr);
            writeCookie("skill-value(new__vacancy)", arr, 30);
          }

          if (data.driver_license_types && (data.driver_license_types != null || data.driver_license_types != undefined)) {
            let list = data.driver_license_types;
            let arr = [];
            for (let i = 0; i < list.length; i++) {
              let item = list[i];
              arr.push(item.id);
            }
            arr = JSON.stringify(arr);
            writeCookie("driver__license-list1(new__vacancy)", arr, 30);
          }

          if (data.accept_kids || data.accept_handicapped || data.accept_incomplete_resumes) {
            let arr = [];

            if ((data.accept_handicapped = true)) {
              arr.push("С инвалидностью");
            }

            if ((data.accept_kids = true)) {
              arr.push("Возрастом от 14 лет");
            }

            if ((data.accept_incomplete_resumes = true)) {
              arr.push("Без резюме");
            }

            arr = JSON.stringify(arr);
            writeCookie("response__options-list(new__vacancy)", arr, 30);
          }

          if (data.response_letter_required) {
            writeCookie("response__options-checkbox(new__vacancy)", true, 30);
          }

          // console.log(data);
          location.reload();
        }
      }
    }

    function resetChoseManager() {
      if (target.closest(".company__list-item")) {
        let contactInformationHeaderItem = document.querySelector(".left__content .step-5 .contact__information-select-header .item");
        contactInformationHeaderItem.textContent = "Выберите менеджера вакансии";
        contactInformationHeaderItem.setAttribute("data-value", "");
        contactInformationHeaderItem.setAttribute("data-name", "");
        deleteCookie("contact__information-value(new__vacancy)");
        deleteCookie("contact__information-name(new__vacancy)");
      }
    }
    resetChoseManager();

    // выбор компании
    function selectCompany() {
      // нажатие на элементы из списка созданных компаний
      if (target.closest(".company__list-item input")) {
        if (!companyErrorMessage.classList.contains("hide")) {
          companyErrorMessage.classList.add("hide");
        }

        writeCookie("company-selected(new__vacancy)", target.closest(".company__list-item").getAttribute("data-name"), 30);
        writeCookie("company-selected-id(new__vacancy)", target.closest(".company__list-item").getAttribute("data-value"), 30);

        getCompanyManagers(readCookie("company-selected-id(new__vacancy)"));
        setCompanyInPreview(readCookie("company-selected-id(new__vacancy)"));

        resetChoseManager();
      }

      // нажатие на свитчер 'скрыть название компании'
      if (target == companySwitcher) {
        if (companySwitcher.checked) {
          writeCookie("name-company-dont-show(new__vacancy)", true, 30);
        } else {
          deleteCookie("name-company-dont-show(new__vacancy)");
        }
      }
    }
    selectCompany();

    // функционал попапа создания новой компании
    function popupNewCompanyCreate() {
      // открытие попапа создание новой компании
      if (target.closest(".company__new") && target.closest(".company")) {
        background.classList.add("active");
        popupNewCompany.classList.add("active");
        scrollY = window.scrollY;
        scrollTo(popupNewCompany, scrollY);
      }

      // закрытие попапа создание новой компании нажатием на фон или крестик
      if ((target == background && popupNewCompany.classList.contains("active")) || (target.closest(".close-popup") && target.closest(".popup__new-company"))) {
        background.classList.remove("active");
        popupNewCompany.classList.remove("active");
        scrollTo(popupNewCompany, scrollY);
        companyInfoBlock.classList.remove("active");
        companyDescription.value = "";
        companyDescriptionCount.textContent = 0;

        companyImage.style.display = "none";
        companyImage.src = "";
        companyImagePlaseholder.style.display = "block";
        companyImageInputLoad.value = "";
      }

      // функция для загрузки изображений
      function previewFile() {
        var reader = new FileReader();
        let imageLoad = companyImageInputLoad.files[0];

        if (imageLoad.size / 1024 / 1024 < 1) {
          reader.onloadend = function () {
            companyImage.setAttribute("src", reader.result);
          };

          reader.readAsDataURL(imageLoad);
          setTimeout(() => {
            companyImagePlaseholder.style.display = "none";
            companyImage.style.display = "block";
          }, 10);
        } else {
          companyImage.src = "";
          companyImage.style.display = "none";
          companyImagePlaseholder.style.display = "block";
          companyImagePlaseholder.querySelector("p").textContent = "Превышен размер";
          companyImagePlaseholder.querySelector("p").style.color = "red";
          setTimeout(() => {
            companyImagePlaseholder.querySelector("p").textContent = "Логотип";
            companyImagePlaseholder.querySelector("p").style.color = "inherit";
          }, 3000);
        }
      }

      // нажатие на меню добавления изображения
      if (target == companyImageAddButton) {
        companyImageAddMenu.classList.toggle("active");
      } else if (target !== companyImageAddButton && companyImageAddMenu.classList.contains("active")) {
        companyImageAddMenu.classList.remove("active");
      }

      // нажатие загрузить изображение
      if (target == companyImageLoadBtn) {
        companyImageInputLoad.addEventListener("change", () => {
          previewFile();
        });
        companyImageInputLoad.click();
      }

      // нажатие удалить изображение
      if (target == companyImageRemoveBtn) {
        companyImage.style.display = "none";
        companyImage.src = "";
        companyImagePlaseholder.style.display = "block";
        companyImageInputLoad.value = "";
      }

      // ввод данных в поле название компании
      if (target == companyNameInput) {
        companyNameInput.addEventListener("input", () => {
          if (companyNameInput.value.length >= 10) {
            companyNameList.classList.remove("hide");
            companyNameListItem = companyNameList.querySelectorAll(".item");

            var token = "";
            var query = companyNameInput.value;
            var optionsLoc = {
              method: "POST",
              mode: "cors",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: "Token " + token,
              },
              body: JSON.stringify({
                query: query,
              }),
            };
            async function getCompany() {
              let response = await fetch("https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party", optionsLoc);
              let content = await response.json();
              let companyItem = "";

              for (let index = 0; index < content.suggestions.length; index++) {
                let Company = {
                  type_short: content.suggestions[index].data.opf.short,
                  type_full: content.suggestions[index].data.opf.full,

                  name: content.suggestions[index].data.name.short,
                  name_full: content.suggestions[index].data.name.full,

                  inn: content.suggestions[index].data.inn,
                  kpp: content.suggestions[index].data.kpp,
                  ogrn: content.suggestions[index].data.ogrn,
                  ogrn_date: content.suggestions[index].data.ogrn_date,
                  okved: content.suggestions[index].data.okved,

                  address: content.suggestions[index].data.address.value,
                  city: content.suggestions[index].data.address.data.city,

                  management: {
                    name: content.suggestions[index].data.management.name,
                    post: content.suggestions[index].data.management.post,
                  },

                  status: content.suggestions[index].data.state.status,
                };

                companyItem += `
                                <div class="item" data-type="${Company.type_short}" data-type-full="${Company.type_full}" data-name="${Company.name}"  data-name-full="${Company.name_full}" data-inn="${Company.inn}" data-kpp="${Company.kpp}" data-ogrn="${Company.ogrn}" data-ogrn-date="${Company.ogrn_date}" data-okved="${Company.okved}" data-address="${Company.address}" data-address-city="${Company.city}" data-manager="${Company.management.name}"  data-status="${Company.status}">
                                    <p class="name text-s14-h20-w500">${Company.inn + " " + Company.name}</p>
                                    <p class="info text-s12-h14-w400">${Company.address}</p>
                                </div>
                                `;

                companyNameList.innerHTML = companyItem;
              }

              if (companyNameList.innerHTML != "") {
                companyNameList.classList.remove("hide");
              } else {
                companyItem = `<p class="placeholder">Нет совпадений</p>`;
                companyNameList.innerHTML = companyItem;
              }
            }
            getCompany();
          } else {
            companyNameList.classList.add("hide");
          }
        });
      }

      // if (cityInput.value.length >= 3) {
      // } else {
      //     cityInputList.classList.add("hide");
      //     cityInputList.innerHTML = "";
      // }

      // нажатие на элементы из списка названий компании
      if (target.closest(".item") && target.closest(".input-company")) {
        companyNameList.classList.add("hide");
        companyInfoBlock.classList.add("active");

        let currentItem = target.closest(".item");

        let Company = {
          type_short: currentItem.getAttribute("data-type"),
          type_full: currentItem.getAttribute("data-type-full"),

          name: currentItem.getAttribute("data-name"),
          name_full: currentItem.getAttribute("data-name-full"),

          inn: currentItem.getAttribute("data-inn"),
          kpp: currentItem.getAttribute("data-kpp"),
          ogrn: currentItem.getAttribute("data-ogrn"),
          ogrn_date: currentItem.getAttribute("data-ogrn-date"),
          okved: currentItem.getAttribute("data-okved"),

          address: currentItem.getAttribute("data-address"),
          city: currentItem.getAttribute("data-address-city"),

          management: {
            name: currentItem.getAttribute("data-manager"),
          },

          status: currentItem.getAttribute("data-status"),
        };

        let form = document.querySelector(".popup__new-company .form__info");

        form.setAttribute("data-type", Company.type_short);
        form.setAttribute("data-type-full", Company.type_full);

        form.setAttribute("data-name", Company.name);
        form.setAttribute("data-name-full", Company.name_full);

        form.setAttribute("data-inn", Company.inn);
        form.setAttribute("data-kpp", Company.kpp);
        form.setAttribute("data-ogrn", Company.ogrn);
        form.setAttribute("data-ogrn-date", Company.ogrn_date);
        form.setAttribute("data-okved", Company.okved);

        form.setAttribute("data-address", Company.address);
        form.setAttribute("data-address-city", Company.city);

        form.setAttribute("data-ceo", Company.management.name);

        form.setAttribute("data-status", Company.status);

        function timeConverter(UNIX_timestamp) {
          var a = new Date(UNIX_timestamp);
          var year = a.getFullYear();
          var month = String(a.getMonth() + 1).padStart(2, "0");
          var date = String(a.getDate()).padStart(2, "0");

          var time = date + "." + month + "." + year;
          return time;
        }

        let popup = document.querySelector(".popup__new-company");

        let title = popup.querySelector("#create_title");
        title.querySelector("h5").textContent = `${Company.type_short} "${Company.name_full}"`;
        title.querySelector("p").textContent = `${Company.type_full} "${Company.name}"`;

        let address = popup.querySelector("#create_address");
        address.querySelector("p.text").textContent = `${Company.address}`;

        let ceo = popup.querySelector("#create_ceo");
        ceo.querySelector(".ceo__info-name").textContent = `${Company.management.name}`;

        //

        let ogrn = popup.querySelector("#create_ogrn");
        ogrn.querySelector(".text .ogrn-value").textContent = `${Company.ogrn}`;
        ogrn.querySelector(".text .ogrn-date-value").textContent = `${timeConverter(+Company.ogrn_date)}`;

        let inn = popup.querySelector("#create_inn");
        inn.querySelector(".text .inn-value").textContent = `${Company.inn}`;
        inn.querySelector(".text .kpp-value").textContent = `${Company.kpp}`;

        let status = popup.querySelector("#create_status");

        if (Company.status == "ACTIVE") {
          Company.status = "Действующая организация";
        } else if (Company.status == "LIQUIDATED") {
          Company.status = "Организация ликвидирована";
        } else if ((Company.status = "LIQUIDATING")) {
          Company.status = "Организация в процессе ликвидации";
        } else {
          Company.status = "Ошибка";
        }

        status.querySelector(".text").textContent = `${Company.status}`;

        if (Company.status != "Действующая организация") {
          status.classList.add("completed");
        } else {
          status.classList.remove("completed");
        }

        let companyInfoBlockName = popupNewCompany.querySelector(".form__info .name h5").textContent;
      } else if (!target.closest(".item") && target.parentNode != companyNameList && !companyNameList.classList.contains("hide")) {
        companyNameInput.value = "";
        companyNameList.classList.add("hide");
      }

      // ввод значения в поле описания компании
      if (target == companyDescription) {
        companyDescription.addEventListener("input", () => {
          companyDescriptionCount.textContent = companyDescription.value.length;
        });
      }

      // нажатие кнопки сохранить
      if (target == companySaveBtn) {
        let info = document.querySelector(".popup__new-company .form__info");
        if (info.getAttribute("data-type") && info.getAttribute("data-name") && info.getAttribute("data-inn") && info.getAttribute("data-kpp") && info.getAttribute("data-ogrn")) {
          if (info.getAttribute("data-status") == "ACTIVE" || info.getAttribute("data-status") == "LIQUIDATING") {
            companySaveBtn.classList.add("dont-click");

            let form = document.querySelector(".popup__new-company .form__info");
            let companyInput = document.querySelector(".popup__new-company .form__input .input-company .input__name");
            let textarea = document.querySelector(".popup__new-company .form__input .input-company .input__description");

            var formData = new FormData();
            formData.append("file", $(".image__upload")[0].files[0]);

            formData.append("type", "create-company");

            formData.append("type_short", form.getAttribute("data-type"));
            formData.append("type_full", form.getAttribute("data-type-full"));

            formData.append("name", form.getAttribute("data-name"));
            formData.append("name_full", form.getAttribute("data-name-full"));

            formData.append("inn", form.getAttribute("data-inn"));
            formData.append("kpp", form.getAttribute("data-kpp"));
            formData.append("ogrn", form.getAttribute("data-ogrn"));
            formData.append("ogrn_date", form.getAttribute("data-ogrn-date"));
            formData.append("okved", form.getAttribute("data-okved"));

            formData.append("address", form.getAttribute("data-address"));
            formData.append("city", form.getAttribute("data-address-city"));

            formData.append("status", form.getAttribute("data-status"));
            formData.append("test", JSON.stringify(getAllData()));
            formData.append("companyDescription", textarea.value);

            $.ajax({
              url: templatePath + "/ajax.php",
              data: formData,
              processData: false,
              contentType: false,
              type: "post",
              dataType: "json",
              success: function (data) {
                let status = data.status;

                if (status == "success") {
                  companyInput.value = "";

                  companySaveBtn.classList.remove("dont-click");

                  companyListItem = companyList.querySelectorAll(".company__list-item input");

                  companyListItem.forEach((item) => {
                    item.checked = false;
                  });

                  let companyItem = `
                                   <label class="company__list-item radio-btn" data-value="${data.ID}" data-name="${data.name}">
                                      <input type="radio" name="company" checked>
                                      <span></span>
                                      <p>${data.name}</p>
                                   </label>
                                   `;
                  companyList.insertAdjacentHTML("beforeend", companyItem);

                  writeCookie("company-selected(new__vacancy)", data.name, 30);
                  writeCookie("company-selected-id(new__vacancy)", data.ID, 30);

                  getCompanyManagers(readCookie("company-selected-id(new__vacancy)"));
                  setCompanyInPreview(readCookie("company-selected-id(new__vacancy)"));

                  resetChoseManager();

                  clearFields();
                }

                if (status == "error") {
                  companySaveBtn.classList.remove("dont-click");

                  let errorPopup = document.querySelector(".error-popup");
                  let errorPopupText = errorPopup.querySelector("#error_print");
                  errorPopupText.textContent = data.error;

                  errorPopup.classList.remove("hide");

                  let interval = setInterval(function () {
                    errorPopup.classList.add("hide");
                    errorPopupText.textContent = "";
                    clearInterval(interval);
                  }, 4000);

                  clearFields();
                }

                function clearFields() {
                  background.classList.remove("active");
                  popupNewCompany.classList.remove("active");
                  scrollTo(popupNewCompany, scrollY);
                  companyInfoBlock.classList.remove("active");
                  companyDescription.value = "";
                  companyDescriptionCount.textContent = 0;

                  companyImage.style.display = "none";
                  companyImage.src = "";
                  companyImagePlaseholder.style.display = "block";
                  companyImageInputLoad.value = "";

                  form.removeAttribute("data-type");
                  form.removeAttribute("data-name");
                  form.removeAttribute("data-inn");
                  form.removeAttribute("data-kpp");
                  form.removeAttribute("data-ogrn");
                }
              },
              error: function (data) {
                console.log(data);
              },
            });
          } else {
            let errorPopup = document.querySelector(".error-popup");
            let errorPopupText = errorPopup.querySelector("#error_print");
            errorPopupText.textContent = "Нельзя добавить ликвидированную компанию!";

            errorPopup.classList.remove("hide");

            let interval = setInterval(function () {
              errorPopup.classList.add("hide");
              errorPopupText.textContent = "";
              clearInterval(interval);
            }, 4000);
          }
        } else {
          let errorPopup = document.querySelector(".error-popup");
          let errorPopupText = errorPopup.querySelector("#error_print");

          errorPopupText.textContent = "Заполните все поля!";

          errorPopup.classList.remove("hide");

          let interval = setInterval(function () {
            errorPopup.classList.add("hide");
            errorPopupText.textContent = "";
            clearInterval(interval);
          }, 4000);
        }
      }
    }
    popupNewCompanyCreate();

    // функционал ввода города
    function selectCity() {
      // нажатие на инпут для ввода города
      if (target == cityInput && target.closest(".locate__city")) {
        if (cityInput.classList.contains("error")) {
          cityInput.classList.remove("error");
          cityErrorMessage.classList.add("hide");
        }

        cityInput.addEventListener("input", () => {
          if (cityInput.classList.contains("error")) {
            cityInput.classList.remove("error");
            cityErrorMessage.classList.remove("error");
          }

          if (cityInput.value.length > 0) {
            cityInput.classList.add("active");
            cityInput.parentNode.classList.add("active");
          } else {
            cityInput.classList.remove("active");
            cityInput.parentNode.classList.remove("active");
          }

          if (cityInput.value.length >= 3) {
            var token = "";
            var query = cityInput.value;
            var optionsLoc = {
              method: "POST",
              mode: "cors",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: "Token " + token,
              },
              body: JSON.stringify({
                query: query,
                locations: [{
                    country: "Россия"
                  },
                  // { "country": "Азербайджан" },
                  // { "country": "Армения" },
                  // { "country": "Беларусь" },
                  // { "country": "Казахстан" },
                  // { "country": "Кыргызстан" },
                  // { "country": "Молдова" },
                  // { "country": "Таджикистан" },
                  // { "country": "Туркменистан" },
                  // { "country": "Узбекистан" },
                  // { "country": "Украина" },
                  // { "country": "Грузия" },
                ],
                from_bound: {
                  value: "city"
                },
                to_bound: {
                  value: "settlement"
                },
              }),
            };
            async function getAutoLoc() {
              let response = await fetch("https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address", optionsLoc);
              let content = await response.json();
              let cityItem = "";
              for (let index = 0; index < content.suggestions.length; index++) {
                let value = content.suggestions[index].value;
                let country = content.suggestions[index].data.country;

                let fias;
                if (content.suggestions[index].data.fias_level) {
                  fias = content.suggestions[index].data.fias_level;
                }

                let type;
                if (content.suggestions[index].data.city_type) {
                  type = "city";
                } else if (content.suggestions[index].data.settlement_type) {
                  type = "settlement";
                } else {
                  type = "";
                }

                let typeChar;
                if (content.suggestions[index].data.city_type) {
                  typeChar = content.suggestions[index].data.city_type;
                } else if (content.suggestions[index].data.settlement_type) {
                  typeChar = content.suggestions[index].data.settlement_type;
                }

                let city;
                if (content.suggestions[index].data.city) {
                  if (content.suggestions[index].data.settlement) {
                    city = content.suggestions[index].data.settlement;
                  } else {
                    city = content.suggestions[index].data.city;
                  }
                } else if (content.suggestions[index].data.settlement) {
                  city = content.suggestions[index].data.settlement;
                }

                let lat = content.suggestions[index].data.geo_lat;
                let lon = content.suggestions[index].data.geo_lon;

                if (!content.suggestions[index].data.city_district && (fias === "0" || fias === "1" || fias === "4" || fias === "6") && (typeChar === "г" || typeChar === "с" || typeChar === "гп" || typeChar === "п" || typeChar === "д" || typeChar === "пгт")) {
                  cityItem += `
                           <p class="item" data-value="${value}" data-country="${country}" data-city="${city}" data-type="${type}" data-lat="${lat}" data-lon="${lon}">
                              ${value}
                           </p >
                        `;
                }
              }
              cityInputList.innerHTML = cityItem;

              if (cityInputList.innerHTML != "") {
                cityInputList.classList.remove("hide");
              } else {
                cityItem = `<p class="placeholder">Нет совпадений</p>`;
                cityInputList.innerHTML = cityItem;
              }
            }
            getAutoLoc();
          } else {
            cityInputList.classList.add("hide");
            cityInputList.innerHTML = "";
          }
        });
      }

      // нажатие на элементы из выпадающего списка
      if (target.closest(".item") && target.parentNode == cityInputList) {
        clearInpur(cityInput, cityInputList);
        let cityValue = target.closest(".item").getAttribute("data-value");
        let cityName = target.closest(".item").getAttribute("data-city");
        let cityType = target.closest(".item").getAttribute("data-type");

        let cityLat = target.closest(".item").getAttribute("data-lat");
        let cityLon = target.closest(".item").getAttribute("data-lon");

        let cityNameArray = inputCityArr.find((elemArr) => elemArr.city == cityName);

        if (cityNameArray == undefined) {
          inputCityArr.push({
            city: cityName,
            "city value": cityValue,
            "city type": cityType,
            "address specified": false,
            address: null,
            lat: cityLat,
            lon: cityLon
          });
          writeCookie("vacancy-city(new__vacancy)", JSON.stringify(inputCityArr), 30);

          createItem(cityValue, cityName, cityAddItems, cityLat, cityLon);
          createBlock(cityValue, cityName, null, null, cityType, cityLat, cityLon);
        }
      } else if (!cityInputList.classList.contains("hide")) {
        clearInpur(cityInput, cityInputList);
      }

      // удаление элемента нажатием на крестик
      if (target.closest(".remove-btn") && target.closest(".add-items") && target.closest(".locate__city")) {
        target.closest(".item").remove();

        let cityName = target.closest(".item").getAttribute("data-city");
        inputCityArr.forEach((elemArr) => {
          if (cityName == elemArr["city"]) {
            inputCityArr.splice(inputCityArr.indexOf(elemArr), 1);

            // удаление блока с адресом
            cityAddress.querySelectorAll(".input-block").forEach((block) => {
              if (block.getAttribute("data-city") == cityName) {
                block.remove();
              }
            });

            if (inputCityArr.length > 0) {
              writeCookie("vacancy-city(new__vacancy)", JSON.stringify(inputCityArr), 30);
            } else {
              deleteCookie("vacancy-city(new__vacancy)");
              cityAddItems.classList.add("hide");
              cityAddress.style.maxHeight = `0px`;
              cityAddress.classList.add("dont-show");
            }
          }
        });
      }
    }
    selectCity();

    // функционал ввода адресса
    function selectAddress() {
      // переключение свитчера 'указать адресс офиса'
      if (target.tagName == "INPUT" && target.closest(".locate__address-switcher") && target.closest(".input-block") && target.closest(".locate__address")) {
        let inputBlock = target.closest(".input-block"),
          inputBlockSwitcher = inputBlock.querySelector("input"),
          inputBlockInner = inputBlock.querySelector(".inner");

        if (inputBlockSwitcher.checked) {
          inputBlockInner.classList.remove("dont-show");
          inputBlockInner.style.maxHeight = `${inputBlockInner.scrollHeight}px`;
          cityAddress.style.maxHeight = `${cityAddress.scrollHeight}px`;

          inputCityArr.forEach((elemArr) => {
            if (elemArr["city"] == inputBlock.getAttribute("data-city")) {
              elemArr["address specified"] = true;
            }
          });
          writeCookie("vacancy-city(new__vacancy)", JSON.stringify(inputCityArr), 30);
        } else {
          inputBlockInner.classList.add("dont-show");
          inputBlockInner.style.maxHeight = `0px`;
          cityAddress.style.maxHeight = `${cityAddress.scrollHeight}px`;

          inputCityArr.forEach((elemArr) => {
            if (elemArr["city"] == inputBlock.getAttribute("data-city")) {
              elemArr["address specified"] = false;
              elemArr["address"] = null;
            }
          });
          writeCookie("vacancy-city(new__vacancy)", JSON.stringify(inputCityArr), 30);
        }
      }

      //
      if (target.closest(".input__inner input") && target.closest(".input-block") && target.closest(".locate__address")) {
        let currentCity = target.closest(".input__inner input").parentNode.parentNode.parentNode.parentNode.getAttribute("data-city");
        let currentCityType = target.closest(".input__inner input").parentNode.parentNode.parentNode.parentNode.getAttribute("data-type");

        let input = target.closest(".input__inner input");
        let list = target.closest(".inner").querySelector(".input__list");

        input.addEventListener("input", () => {
          inputText(input, list);
        });

        input.addEventListener("input", () => {
          if (input.value.length >= 3) {
            var token = "";
            var query = input.value;

            var optionsLoc = {
              method: "POST",
              mode: "cors",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: "Token " + token,
              },

              body: {
                query: query,
                type: "ADDRESS",

                locations: {},
              },
            };

            if (currentCityType == "city") {
              optionsLoc.body.locations = {
                city: currentCity,
              };
            } else if (currentCityType == "settlement") {
              optionsLoc.body.locations = {
                settlement: currentCity,
              };
            } else {
              optionsLoc.body.locations = {};
            }

            optionsLoc.body = JSON.stringify(optionsLoc.body);

            async function getAutoLoc() {
              let response = await fetch("https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address", optionsLoc);
              let content = await response.json();
              let cityItem = "";
              for (let index = 0; index < content.suggestions.length; index++) {
                let value = content.suggestions[index].value;
                let country = content.suggestions[index].data.country;
                let cityType = content.suggestions[index].data.city_type_full;
                let city = content.suggestions[index].data.city;

                let lat = content.suggestions[index].data.geo_lat;
                let lon = content.suggestions[index].data.geo_lon;

                cityItem += `
                                    <p class="item" data-value="${value}" data-country="${country}" data-city="${city}" data-lat="${lat}" data-lon="${lon}">
                                        ${value}
                                    </p >
                                `;
              }
              list.innerHTML = cityItem;
              if (list.innerHTML != "") {
                list.classList.remove("hide");
              } else {
                cityItem = `<p class="placeholder">Нет совпадений</p>`;
                list.innerHTML = cityItem;
              }
            }
            getAutoLoc();
          }
        });
      }
      //

      // нажатие на элементах списка
      if (target.closest(".item") && target.closest(".input__list") && target.closest(".input-block")) {
        let block = target.closest(".input-block");
        let blockInner = block.querySelector(".inner");
        let input = block.querySelector(".input__inner input");
        let list = block.querySelector(".input__list");
        let addItem = block.querySelector(".add-items");

        addItem.textContent = "";
        let addressItem = target.closest(".item").cloneNode(true);
        let removeBtn = document.createElement("span");
        removeBtn.className = "remove-btn";
        addressItem.append(removeBtn);
        addItem.append(addressItem);
        addItem.classList.remove("hide");

        input.value = "";
        input.classList.remove("active");
        input.parentNode.classList.remove("active");
        list.classList.add("hide");

        blockInner.style.maxHeight = `${cityAddress.scrollHeight}px`;
        cityAddress.style.maxHeight = `${cityAddress.scrollHeight}px`;

        inputCityArr.forEach((elemArr) => {
          if (elemArr["city"] == block.getAttribute("data-city")) {
            elemArr["address"] = addressItem.outerHTML;
          }
        });
        writeCookie("vacancy-city(new__vacancy)", JSON.stringify(inputCityArr), 30);
      } else {
        cityAddress.querySelectorAll(".input__list").forEach((list) => {
          if (!list.classList.contains("hide")) {
            list.classList.add("hide");
            list.closest(".input").querySelector(".input__inner").classList.remove("active");
            list.closest(".input").querySelector(".input__inner input").classList.remove("active");
            list.closest(".input").querySelector(".input__inner input").value = "";
          }
        });
      }

      // удаление выбранных элементов
      if (target.closest(".remove-btn") && target.closest(".add-items") && target.closest(".locate__address")) {
        let nameCity = target.closest(".input-block").getAttribute("data-city");
        let addItemBLock = target.closest(".input-block").querySelector(".add-items");

        inputCityArr.forEach((elemArr) => {
          if (elemArr["city"] == nameCity) {
            elemArr["address"] = null;
          }
        });
        writeCookie("vacancy-city(new__vacancy)", JSON.stringify(inputCityArr), 30);
        target.closest(".item").remove();
        addItemBLock.classList.add("hide");
      }
    }
    selectAddress();

    // функционал попапа добавление нового адресса
    function clickPopupNewAddress() {
      // открытие попапа
      if (target.closest(".new__address-add") && target.closest(".input-block") && target.closest(".locate__address")) {
        background.classList.add("active");
        popupNewAdress.classList.add("active");
        scrollY = window.scrollY;
        scrollTo(popupNewAdress, scrollY);

        cityValue = target.closest(".input-block").getAttribute("data-value");
        cityName = target.closest(".input-block").getAttribute("data-city");

        popupNewAdressInput.value = `${cityValue}, `;

        setTimeout(() => {
          popupNewAdressInput.focus();
          popupNewAdressInput.click();
        }, 50);
      }

      // закрытие попапа нажатием на фон или крестик
      if ((target == background && popupNewAdress.classList.contains("active")) || (target.closest(".close-popup") && target.closest(".popup__new-address"))) {
        background.classList.remove("active");
        popupNewAdress.classList.remove("active");
        scrollTo(popupNewAdress, scrollY);

        popupNewAdressInput.value = "";
        popupNewAdressListInner.innerHTML = "";
        popupNewAdressList.classList.remove("active");
        popupNewAdressActiveItem.classList.remove("active");
        popupNewAdressMap.classList.add("active");
      }

      // ввод местоположения
      if (target == popupNewAdressInput || target.closest(".popup__new-address .input__address")) {
        popupNewAdressInput.addEventListener("input", () => {
          if (popupNewAdressInput.value.length >= 3) {
            popupNewAdressList.classList.add("active");
            popupNewAdressMap.classList.remove("active");

            var token = "";
            var query = popupNewAdressInput.value;
            var optionsLoc = {
              method: "POST",
              mode: "cors",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: "Token " + token,
              },
              body: JSON.stringify({
                query: query,
                locations: [{
                  city: `${cityName} `
                }],
                from_bound: {
                  value: "city",
                },
                to_bound: {
                  value: "house",
                },
              }),
            };
            async function getAutoLoc() {
              let response = await fetch("https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address", optionsLoc);
              let content = await response.json();
              let cityItem = "";
              for (let index = 0; index < content.suggestions.length; index++) {
                let country = content.suggestions[index].data.country != null ? content.suggestions[index].data.country : "";
                let region = content.suggestions[index].data.region_with_type != null ? ", " + content.suggestions[index].data.region_with_type : "";
                let city = content.suggestions[index].data.city_with_type != null ? ", " + content.suggestions[index].data.city_with_type : "";
                let street = content.suggestions[index].data.street_with_type != null ? content.suggestions[index].data.street_with_type : "";
                let houseType = content.suggestions[index].data.house_type != null ? ", " + content.suggestions[index].data.house_type : "";
                let house = content.suggestions[index].data.house != null ? " " + content.suggestions[index].data.house : "";
                let blockType = content.suggestions[index].data.block_type != null ? ", " + content.suggestions[index].data.block_type : "";
                let block = content.suggestions[index].data.block != null ? " " + content.suggestions[index].data.block : "";
                let geoLat = content.suggestions[index].data.geo_lat != null ? content.suggestions[index].data.geo_lat : "";
                let geoLon = content.suggestions[index].data.geo_lon != null ? content.suggestions[index].data.geo_lon : "";

                cityItem += `
                              <p class="item" data-value="${country}${region}${city}, ${street}${houseType}${house}${blockType}${block}" 
                              data-country="${content.suggestions[index].data.country}" 
                              data-city="${content.suggestions[index].data.city_with_type}" 
                              data-street="${content.suggestions[index].data.street_with_type}" 
                              data-houseType="${content.suggestions[index].data.house_type}" 
                              data-house="${content.suggestions[index].data.house}" 
                              data-blockType="${content.suggestions[index].data.block_type}" 
                              data-block="${content.suggestions[index].data.block}" 
                              data-postalCode="${content.suggestions[index].data.postal_code}" 
                              data-lat="${geoLat}" data-lon="${geoLon}">
                                 <span class="region">${country}${region}${city}</span><br>
                                 <span class="adress">${street}${houseType}${house}${blockType}${block}</span>
                              </p>`;
              }
              popupNewAdressListInner.innerHTML = cityItem;
            }
            getAutoLoc();
          } else {
            popupNewAdressList.classList.remove("active");
            popupNewAdressMap.classList.add("active");
          }

          if (popupNewAdressInput.value.length == 0) {
            popupNewAdressInput.value = `${cityValue}, `;
          }

          if (popupNewAdressActiveItem.classList.contains("active")) {
            popupNewAdressList.classList.add("active");
            popupNewAdressActiveItem.classList.remove("active");
            popupNewAdressActiveItemInfo.value = "";
          }
        });
      }

      // нажатие на элементы из полученного списка
      if (target.closest(".item") && target.closest(".list") && target.closest(".popup__new-address-inner")) {
        if (target.closest(".item").getAttribute("data-house") !== "null" && target.closest(".item").getAttribute("data-house") !== "") {
          popupNewAdressInput.value = target.closest(".item").getAttribute("data-value");

          popupNewAdressList.classList.remove("active");
          popupNewAdressActiveItem.classList.add("active");

          popupNewAdressActiveItemAddress.textContent = target.closest(".item").getAttribute("data-value");
        } else {
          popupNewAdressInput.value = target.closest(".item").getAttribute("data-value");

          popupNewAdressInput.classList.add("error");
          popupNewAdressInput.focus();
          setTimeout(() => popupNewAdressInput.classList.remove("error"), 1000);
        }
      }

      // нажатие кнопки отмена
      if (target == popupNewAdressActiveItemCancel) {
        popupNewAdressInput.value = `${cityValue}, `;
        popupNewAdressInput.focus();
        popupNewAdressListInner.innerHTML = "";
        popupNewAdressActiveItemInfo.value = "";
        popupNewAdressList.classList.remove("active");
        popupNewAdressActiveItem.classList.remove("active");
        popupNewAdressMap.classList.add("active");
      }

      // нажатие кнопки добавить
      if (target == popupNewAdressActiveItemAdd) {
        popupNewAdress.classList.remove("active");
        background.classList.remove("active");
        popupNewAdressInput.value = "";
        popupNewAdressListInner.innerHTML = "";
        popupNewAdressActiveItemInfo.value = "";
        popupNewAdressList.classList.remove("active");
        popupNewAdressActiveItem.classList.remove("active");
        popupNewAdressMap.classList.add("active");
      }
    }
    clickPopupNewAddress();

    // нажатие на нопки после вода данных
    function clickBtn() {
      if (target.closest(".next") && target.closest(".step-1")) {
        let validateCompany = false;
        let validateLocate = false;

        if (readCookie("company-selected(new__vacancy)") != undefined) {
          validateCompany = true;
        } else {
          companyErrorMessage.classList.remove("hide");
        }

        if (readCookie("vacancy-city(new__vacancy)") != undefined) {
          validateLocate = true;
        } else {
          cityInput.classList.add("error");
          cityErrorMessage.classList.remove("hide");
        }

        if (validateLocate && validateCompany) {
          if (readCookie("draft-stack(new-vacancy)") && readCookie("draft-stack(new-vacancy)") != null && readCookie("draft-stack(new-vacancy)") != undefined) {
            ajaxUpdate(getAllData("draft-update"));
          }
          clickBtnNext();
        }
      }
    }
    clickBtn();
  });

  function loadCookiesCompanySelected() {
    if (readCookie("company-selected-id(new__vacancy)") !== undefined) {
      companyListItem = companyList.querySelectorAll(".company__list-item");
      companyListItem.forEach((item) => {
        if (item.getAttribute("data-value") == readCookie("company-selected-id(new__vacancy)")) {
          item.querySelector("input").checked = true;
        }
      });
    }
    if (readCookie("company-selected-id(new__vacancy)") !== undefined) {
      getCompanyManagers(readCookie("company-selected-id(new__vacancy)"));
      setCompanyInPreview(readCookie("company-selected-id(new__vacancy)"));
    }
  }

  function loadCookiesCompanySwitcher() {
    if (readCookie("name-company-dont-show(new__vacancy)") != undefined) {
      companySwitcher.checked = true;
    }
  }

  function loadCookiesCity() {
    if (readCookie("vacancy-city(new__vacancy)") != undefined) {
      inputCityArr = JSON.parse(readCookie("vacancy-city(new__vacancy)"));
      inputCityArr.forEach((elemArr) => {
        createItem(elemArr["city value"], elemArr["city"], cityAddItems, elemArr["lat"], elemArr["lon"]);
        if (elemArr["address"] != null) {
          createBlock(elemArr["city value"], elemArr["city"], "address specified", elemArr["address"], elemArr["city type"], elemArr["lat"], elemArr["lon"]);
        } else {
          createBlock(elemArr["city value"], elemArr["city"], null, null, elemArr["city type"], elemArr["lat"], elemArr["lon"]);
        }
        cityAddress.style.maxHeight = `30000px`;
      });
    }
  }

  function loadCookiesManager() {
    if (readCookie("contact__information-name(new__vacancy)") !== undefined && readCookie("contact__information-value(new__vacancy)") !== undefined) {
      let select = document.querySelector(".step-5 .contact__information .contact__information-select .contact__information-select-header p.item");

      select.textContent = readCookie("contact__information-name(new__vacancy)");

      select.setAttribute("data-name", readCookie("contact__information-name(new__vacancy)"));
      select.setAttribute("data-value", readCookie("contact__information-value(new__vacancy)"));
    }
  }
  window.addEventListener(
    "load",
    function load() {
      loadCookiesCompanySelected();
      loadCookiesCompanySwitcher();
      loadCookiesManager();
      loadCookiesCity();
    },
    false
  );

  function setCompanyInPreview(company) {
    $.ajax({
      url: templatePath + "/ajax.php",
      method: "POST",
      dataType: "json",
      data: {
        type: "get-company-data",
        company_id: company,
      },

      success: function (data) {
        function declOfNum(n, text_forms) {
          n = Math.abs(n) % 100;
          var n1 = n % 10;
          if (n > 10 && n < 20) {
            return text_forms[2];
          }
          if (n1 > 1 && n1 < 5) {
            return text_forms[1];
          }
          if (n1 == 1) {
            return text_forms[0];
          }
          return text_forms[2];
        }

        let ratingDiv = document.querySelector(".popup__preview .basic__information .company__info .company__info-dopinfo .rating p");
        let reviewDiv = document.querySelector(".popup__preview .basic__information .company__info .company__info-dopinfo .reviews p");
        let dateDiv = document.querySelector(".popup__preview .basic__information .company__info .company__info-registration");

        ratingDiv.textContent = data.raiting;
        reviewDiv.textContent = data.reviews + " " + declOfNum(data.reviews, ["отзыв", "отзыва", "отзывов"]);
        dateDiv.textContent = "На AT-WORK с " + data.date;
      },
      error: function (data) {
        console.log(data.responseText);
      },
    });
  }

  function getCompanyManagers(company) {
    let container = document.querySelector(".contact__information-select-list");

    $.ajax({
      url: templatePath + "/ajax.php",
      method: "POST",
      dataType: "json",
      data: {
        type: "get-company-managers",
        company_id: company,
      },

      success: function (data) {
        let block = "";

        data.forEach((item) => {
          if (item.lastname) {
            block += `
                            <p class="item" data-value="${item.id}" data-name="${item.name + " " + item.lastname}">${item.name + " " + item.lastname}</p>
                        `;
          } else {
            block += `
                            <p class="item" data-value="${item.id}" data-name="${item.name}">${item.name}</p>
                        `;
          }
        });
        container.innerHTML = block;
      },
      error: function (data) {
        console.log(data.responseText);
      },
    });
  }
});

function actionsModal(action = null, modal = null) {
  let overlay = document.querySelector(".mtModal-overlay");

  if (!modal) {
    return console.log("Modal Action Error | Modal not found");
  }

  switch (action) {
    case "open":
      modalOpen(modal);
      break;
    case "close":
      modalClose();
      break;
    default:
      console.log("Modal Action Error | Action not found");
      return;
  }

  function modalOpen(modalId = null) {
    modalClose();
    document.body.style.overflow = "hidden";
    let modal = document.querySelector(`.mtModal.modal-${modalId}`);

    modal.classList.add("active");
    overlay.classList.add("active");
  }

  function modalClose() {
    let modals = document.querySelectorAll(`.mtModal.active`);
    document.body.style.overflow = "auto";
    modals.forEach((modal) => {
      modal.classList.remove("active");
    });
    if (overlay.classList.contains("active")) {
      overlay.classList.remove("active");
    }
  }
}
