import { getAllData, ajaxUpdate } from "./script__ajax.js";

import { clickBtnBack, clickBtnNext } from "./script__click-btn.js";
import { writeCookie, readCookie, deleteCookie } from "./script__work-cookie.js";

document.addEventListener("DOMContentLoaded", () => {
    let step3 = document.querySelector(".left__content .step-3");

    let workFormatHeader = step3.querySelector(".requirements__select .work-format__header"),
        workFormatList = step3.querySelector(".requirements__select .work-format__list"),
        employmentHeader = step3.querySelector(".requirements__select .employment__header"),
        employmentList = step3.querySelector(".requirements__select .employment__list"),
        scheduleHeader = step3.querySelector(".requirements__select .schedule__header"),
        scheduleList = step3.querySelector(".requirements__select .schedule__list"),
        temporaryEmployment = step3.querySelector(".requirements__checkbox input");

    let workingModeList = step3.querySelector(".working__mode-list"),
        workingModeListItem = step3.querySelectorAll(".working__mode-list .item"),
        workingModeArray = [];

    let incomeFrom = step3.querySelector(".income__input .from input"),
        incomeUpto = step3.querySelector(".income__input .upto input"),
        incomePeriodSelectHeader = step3.querySelector(".income__input .period__select-header"),
        incomePeriodSelectList = step3.querySelector(".income__input .period__select-list"),
        incomeCurrencySelectHeader = step3.querySelector(".income__input .currency__select-header"),
        incomeCurrencySelectList = step3.querySelector(".income__input .currency__select-list"),
        incomePercent = step3.querySelector(".income__percent input"),
        incomeAdditionallyItems;

    let bonusesList = step3.querySelector(".bonuses__list"),
        bonusesListItems = step3.querySelectorAll(".bonuses__list .item"),
        bonusesArray = [];

    // функция для ввода только чисел
    function checkDigits(input) {
        // проверка на пробелы
        if (input.value == false) {
            input.value = "";
        }

        if (input.value.length > 0) {
            let inputDataArr = input.value.split(/[- — /]/);
            let inputDataClear = inputDataArr.join("");
            let inputDataArrNew = inputDataClear.match(/.{1,1}/g);

            // отсекает первый ноль если больше 1 символа
            if (inputDataArrNew[0] == 0 && inputDataArrNew.length == 2) {
                inputDataArrNew.shift();
            }

            let inputDataArrClear = inputDataArrNew.filter(function (arr) {
                return arr.match(/^[1-9]|[0-9]|[0-9]$/g);
            });

            // фильтр на посторонние символы
            if (!inputDataArrNew[inputDataArrNew.length - 1].match(/[0-9]/)) {
                inputDataArrNew.length = inputDataArrNew.length - 1;
                input.value = inputDataArrNew.join("");
            }
            input.value = inputDataArrClear.join("");
        }
    }

    // создание полосы для выбора диапозона
    function priceSlider() {
        let sliderRange = $(".js-range-slider"),
            instance,
            min = 0,
            max,
            from,
            to;

        // переопределить максимальные и минимальные значения если есть cookie
        if (readCookie("income-upto(new__vacancy)") !== undefined) {
            if (readCookie("income-upto(new__vacancy)") > 300000) {
                max = readCookie("income-upto(new__vacancy)");
            } else {
                max = 300000;
            }
        } else {
            max = 300000;
        }

        // переопределить стандартный диапозон зарплаты если есть запись в cookie
        if (readCookie("income-from(new__vacancy)") !== undefined) {
            if (readCookie("income-from(new__vacancy)") == "") {
                from = 0;
            } else {
                from = readCookie("income-from(new__vacancy)");
            }
        } else {
            from = 15000;
        }

        if (readCookie("income-upto(new__vacancy)") !== undefined) {
            if (readCookie("income-upto(new__vacancy)") == "") {
                to = readCookie("income-from(new__vacancy)");
                max = 0;
            } else {
                to = readCookie("income-upto(new__vacancy)");
            }
        } else {
            to = 50000;
        }

        // инициализация слайдера
        sliderRange.ionRangeSlider({
            skin: "round",
            type: "double",
            min: min,
            max: max,
            from: from,
            to: to,
            step: 1000,
            hide_min_max: true,
            hide_from_to: true,
            onStart: updateInputs,
            onFinish: updateInputs,
            onChange: updateInputs,
        });

        instance = sliderRange.data("ionRangeSlider");

        // движение слайдера
        function updateInputs(data) {
            from = data.from;
            to = data.to;

            incomeFrom.setAttribute("data-value", from);
            incomeUpto.setAttribute("data-value", to);
            incomeFrom.value = from;
            incomeUpto.value = to;

            writeCookie("income-from(new__vacancy)", incomeFrom.value, 30);
            writeCookie("income-upto(new__vacancy)", incomeUpto.value, 30);
        }

        // ввод значения от
        incomeFrom.addEventListener("input", () => {
            incomeFrom.setAttribute("data-value", incomeFrom.value);
            let valueFrom = incomeFrom.getAttribute("data-value");

            // validate
            if (valueFrom < min) {
                valueFrom = min;
            } else if (valueFrom > to) {
                valueFrom = to;
            }

            if (valueFrom == "") {
                instance.update({
                    from: max,
                });
            } else {
                instance.update({
                    from: valueFrom,
                });
            }

            checkDigits(incomeFrom);
            writeCookie("income-from(new__vacancy)", incomeFrom.value, 30);
        });

        // ввод значения до
        incomeUpto.addEventListener("input", () => {
            incomeUpto.setAttribute("data-value", incomeUpto.value);
            let valueTo = incomeUpto.getAttribute("data-value");

            // validate
            if (valueTo < from) {
                valueTo = from;
            } else if (valueTo > max) {
                valueTo = max;
            }

            if (valueTo == "") {
                instance.update({
                    to: min,
                });
            } else {
                instance.update({
                    to: valueTo,
                });
            }

            checkDigits(incomeUpto);
            writeCookie("income-upto(new__vacancy)", incomeUpto.value, 30);
        });
    }
    priceSlider();

    document.addEventListener("click", (event) => {
        let target = event.target;

        // выпадающие списки
        function clickSelect(classHeader, parentClass, header, list, cookieName) {
            if (target.closest(classHeader) && target.closest(parentClass)) {
                list.classList.toggle("hide");
            } else {
                list.classList.add("hide");
            }

            if (target.closest(".item") && target.parentNode == list) {
                list.querySelectorAll(".item").forEach((item) => {
                    item.classList.remove("active");
                });
                target.closest(".item").classList.add("active");
                header.querySelector(".item").textContent = target.closest(".item").textContent;
                header.querySelector(".item").setAttribute("data-name", target.closest(".item").getAttribute("data-name"));
                header.querySelector(".item").setAttribute("data-value", target.closest(".item").getAttribute("data-value"));

                writeCookie(cookieName, target.closest(".item").getAttribute("data-name"), 30);
                writeCookie(cookieName + "-id", target.closest(".item").getAttribute("data-value"), 30);
            }
        }
        clickSelect(".work-format__header", ".requirements__select", workFormatHeader, workFormatList, "work-format-select(new__vacancy)");
        clickSelect(".employment__header", ".requirements__select", employmentHeader, employmentList, "employment-select(new__vacancy)");
        clickSelect(".schedule__header", ".requirements__select", scheduleHeader, scheduleList, "schedule-select(new__vacancy)");
        clickSelect(".period__select-header", ".income__input", incomePeriodSelectHeader, incomePeriodSelectList, "income-period(new__vacancy)");
        clickSelect(".currency__select-header", ".income__input", incomeCurrencySelectHeader, incomeCurrencySelectList, "income-currency(new__vacancy)");

        // функционал чекбокса временное оформление
        function clickTemporaryEmployment() {
            if (target == temporaryEmployment && target.closest(".requirements")) {
                if (temporaryEmployment.checked) {
                    writeCookie("temporary__employment(new__vacancy)", true, 30);
                } else {
                    deleteCookie("temporary__employment(new__vacancy)");
                }
            }
        }
        clickTemporaryEmployment();

        // нажатие на элементы режима работы
        function clickWorkingModeList() {
            if (target.closest(".item") && target.parentNode == workingModeList) {
                target.closest(".item").classList.toggle("active");
                if (target.closest(".item").classList.contains("active")) {
                    workingModeArray.push(target.closest(".item").getAttribute("data-name"));
                    writeCookie("working__mode(new__vacancy)", JSON.stringify(workingModeArray), 30);
                } else {
                    workingModeArray.forEach((elemArr) => {
                        if (elemArr == target.closest(".item").getAttribute("data-name")) {
                            workingModeArray.splice(workingModeArray.indexOf(elemArr), 1);
                            if (workingModeArray.length != 0) {
                                writeCookie("working__mode(new__vacancy)", JSON.stringify(workingModeArray), 30);
                            } else {
                                deleteCookie("working__mode(new__vacancy)");
                            }
                        }
                    });
                }
            }
        }
        clickWorkingModeList();

        // функционал чекбокса проценты
        function clickIncomePercent() {
            if (target == incomePercent && target.closest(".income__percent")) {
                if (incomePercent.checked) {
                    writeCookie("income-percent(new__vacancy)", true, 30);
                } else {
                    deleteCookie("income-percent(new__vacancy)");
                }
            }
        }
        clickIncomePercent();

        // нажатия на дополнительных условия
        function clickIncomeAdditionally() {
            if (target.closest(".item") && target.closest(".income__additionally")) {
                writeCookie("income-additionally(new__vacancy)", target.closest(".item").getAttribute("data-name"), 30);
            }
        }
        clickIncomeAdditionally();

        // выбор бонусов
        function clickBonusesList() {
            if (target.closest(".item") && target.parentNode == bonusesList) {
                target.closest(".item").classList.toggle("active");
                if (target.closest(".item").classList.contains("active")) {
                    bonusesArray.push(target.closest(".item").getAttribute("data-name"));
                    writeCookie("bonuses-list(new__vacancy)", JSON.stringify(bonusesArray), 30);
                } else {
                    bonusesArray.forEach((elemArr) => {
                        if (elemArr == target.closest(".item").getAttribute("data-name")) {
                            bonusesArray.splice(bonusesArray.indexOf(elemArr), 1);
                            if (bonusesArray.length > 0) {
                                writeCookie("bonuses-list(new__vacancy)", JSON.stringify(bonusesArray), 30);
                            } else {
                                deleteCookie("bonuses-list(new__vacancy)");
                            }
                        }
                    });
                }
            }
        }
        clickBonusesList();

        // нажатие на кнопки после ввода данных
        function clickBtn() {
            if (target.closest(".next") && target.closest(".step-3")) {
                // let stepValueItem = document.querySelectorAll('.right__content .step__value');
                // stepValueItem.forEach(step => {
                //    if (step.getAttribute('data-value') == target.closest('.step-3').getAttribute('data-value')) {
                //       if (!(step.classList.contains('hide'))) {
                //          step.classList.add('done')
                //       }
                //    }
                // })

                ajaxUpdate(getAllData("draft-update"));
                clickBtnNext();
            }

            if (target.closest(".back") && target.closest(".step-3")) {
                clickBtnBack();
            }
        }
        clickBtn();
    });

    // получение данных при перезагрузке страницы
    function loadSelect(cookieName, header, list) {
        if (readCookie(cookieName) !== undefined) {
            list.querySelectorAll(".item").forEach((item) => {
                if (item.getAttribute("data-name") == readCookie(cookieName)) {
                    list.querySelectorAll(".item").forEach((item) => {
                        item.classList.remove("active");
                    });
                    item.classList.add("active");

                    header.querySelector(".item").textContent = item.textContent;
                    header.querySelector(".item").setAttribute("data-name", item.getAttribute("data-name"));
                    header.querySelector(".item").setAttribute("data-value", item.getAttribute("data-value"));
                }
            });
        }
    }
    function loadTemporaryEmployment() {
        if (readCookie("temporary__employment(new__vacancy)") !== undefined) {
            temporaryEmployment.checked = true;
        }
    }
    function loadWorkingModeList() {
        if (readCookie("working__mode(new__vacancy)") !== undefined) {
            workingModeArray = JSON.parse(readCookie("working__mode(new__vacancy)"));
            workingModeArray.forEach((elemArr) => {
                workingModeListItem.forEach((item) => {
                    if (elemArr == item.getAttribute("data-name")) {
                        item.classList.add("active");
                    }
                });
            });
        }
    }
    function loadIncomePeriodSelect() {
        if (readCookie("income-period(new__vacancy)") == undefined) {
            writeCookie("income-period(new__vacancy)", incomePeriodSelectHeader.querySelector(".item").getAttribute("data-name"), 30);
        }
    }
    function loadIncomeCurrencySelect() {
        if (readCookie("income-currency(new__vacancy)") == undefined) {
            writeCookie("income-currency(new__vacancy)", incomeCurrencySelectHeader.querySelector(".item").getAttribute("data-name"), 30);
        }
    }
    function loadIncomePercent() {
        if (readCookie("income-percent(new__vacancy)") !== undefined) {
            if (readCookie("income-percent(new__vacancy)") === "true") {
                incomePercent.checked = true;
            }
        }
    }
    function loadIncomeAdditionally() {
        if (readCookie("income-additionally(new__vacancy)") !== undefined) {
            incomeAdditionallyItems = document.querySelectorAll(".income__additionally .item");
            incomeAdditionallyItems.forEach((item) => {
                if (item.getAttribute("data-name") == readCookie("income-additionally(new__vacancy)")) {
                    item.querySelector("input").checked = true;
                }
            });
        } else {
            incomeAdditionallyItems = document.querySelectorAll(".income__additionally .item");
            incomeAdditionallyItems.forEach((item) => {
                if (item.getAttribute("data-name") == "До вычета налогов") {
                    item.querySelector("input").checked = true;
                }
            });
        }
    }
    function loadBonusesList() {
        if (readCookie("bonuses-list(new__vacancy)") !== undefined) {
            bonusesArray = JSON.parse(readCookie("bonuses-list(new__vacancy)"));
            bonusesArray.forEach((elemArr) => {
                bonusesListItems.forEach((item) => {
                    if (elemArr == item.getAttribute("data-name")) {
                        item.classList.add("active");
                    }
                });
            });
        }
    }

    window.addEventListener(
        "load",
        function load() {
            loadSelect("work-format-select(new__vacancy)", workFormatHeader, workFormatList);
            loadSelect("employment-select(new__vacancy)", employmentHeader, employmentList);
            loadSelect("schedule-select(new__vacancy)", scheduleHeader, scheduleList);
            loadTemporaryEmployment();
            loadWorkingModeList();
            loadIncomePercent();
            loadIncomePeriodSelect();
            loadIncomeCurrencySelect();
            loadSelect("income-period(new__vacancy)", incomePeriodSelectHeader, incomePeriodSelectList);
            loadSelect("income-currency(new__vacancy)", incomeCurrencySelectHeader, incomeCurrencySelectList);
            loadIncomeAdditionally();
            loadBonusesList();
        },
        false
    );
});
