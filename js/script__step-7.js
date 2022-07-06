import { scrollTo } from "./script__scroll-to.js";
import { clickBtnBack, clickBtnNext } from "./script__click-btn.js";
import { writeCookie, readCookie, deleteCookie } from "./script__work-cookie.js";

import { getAllData, ajaxCreate } from "./script__ajax.js";

document.addEventListener("DOMContentLoaded", () => {
    let scrollY;
    let background = document.querySelector(".background");
    let popupPublication = document.querySelector(".popup__publication");
    let nameVacancy = popupPublication.querySelector("h5 span");
    let stepValue = document.querySelectorAll(".right__content .step__value");

    let step7 = document.querySelector(".left__content .step-7"),
        typePublicationItems = step7.querySelectorAll(".type__publication .item"),
        typePublicationItemsRadio = step7.querySelectorAll(".type__publication .item input"),
        typePublicationErrorMessage = step7.querySelector(".type__publication .error-message"),
        timePublicationSwitcher = step7.querySelector(".time__publication .time__publication-switcher input"),
        timePublicationDateInput = step7.querySelector(".time__publication-calendar .date__calendar"),
        timePublicationCalendar = step7.querySelector(".time__publication-calendar"),
        timePublicationTime = step7.querySelector(".time__publication-calendar .time"),
        timePublicationTimeInput = step7.querySelector(".time__publication-calendar .time__header .item"),
        timePublicationTimeItems = step7.querySelectorAll(".time__publication-calendar .time__list .item"),
        timePublicationInfoDate = step7.querySelector(".time__publication-info span.date"),
        timePublicationInfoTime = step7.querySelector(".time__publication-info span.time"),
        checkboxAgreement = step7.querySelector(".agreement"),
        checkboxAgreementInput = step7.querySelector(".agreement input");

    let nowDate = new Date().getDate();
    let nowMonth = new Date().getMonth() + 1;
    let nowYear = new Date().getFullYear();
    let nowHours = new Date().getHours();
    let nowDay;

    // перобразование даты в нужный формат
    function createNowDay() {
        if (nowDate < 10) {
            nowDate = String(`0${nowDate}`);
        }
        if (nowMonth < 10) {
            nowMonth = String(`0${nowMonth}`);
        }
        nowDay = String(`${nowDate}.${nowMonth}.${nowYear}`);
    }
    createNowDay();

    // изменение текста при выборе даты
    timePublicationDateInput.addEventListener("change", () => {
        if (timePublicationDateInput.value == nowDay) {
            timePublicationTimeItems.forEach((item) => {
                if (item.getAttribute("data-value") <= nowHours + 1) {
                    item.classList.add("hide");
                } else if (item.getAttribute("data-value") > nowHours + 1) {
                    item.classList.remove("hide");
                }
            });
        } else {
            timePublicationTimeItems.forEach((item) => {
                item.classList.remove("hide");
            });
        }

        timePublicationTimeInput.textContent = "Выберите время (+03:00 MSK)";
        timePublicationTimeInput.setAttribute("data-from", "");
        timePublicationTimeInput.setAttribute("data-upto", "");
        timePublicationTimeInput.setAttribute("data-value", "");
        timePublicationInfoTime.textContent = "";
        timePublicationTime.classList.remove("dont-click");
        timePublicationInfoDate.textContent = timePublicationDateInput.value;
    });

    // создание календаря
    function createCalendar(modeValue, datePeriod) {
        flatpickr.localize(flatpickr.l10ns.ru);
        flatpickr(".date__calendar", {
            inline: true,
            mode: modeValue,
            minDate: "today",
            maxDate: `30.12.${nowYear + 1}`,
            altInput: true,
            altFormat: "d.m.Y",
            dateFormat: "d.m.Y",
            monthSelectorType: "static",
            showMonths: 1,
            defaultDate: datePeriod,
            locale: {
                firstDayOfWeek: 1, // start week on Monday
            },
        });
    }
    createCalendar("single", [null]);

    document.addEventListener("click", (event) => {
        let target = event.target;

        // выбор типа публикации
        function clickTypePublication() {
            if (target.closest(".item") && target.closest(".type__publication")) {
                typePublicationItemsRadio.forEach((item) => {
                    item.checked = false;
                });

                target.closest(".item").querySelector("input").checked = true;

                if (!typePublicationErrorMessage.classList.contains("hide")) {
                    typePublicationErrorMessage.classList.add("hide");
                }

                writeCookie("type__publication(new__vacancy)", target.closest(".item").getAttribute("data-name"), 30);
            }
        }
        clickTypePublication();

        // выбор времени для публикации
        function selectTime() {
            if (target == timePublicationSwitcher) {
                if (timePublicationSwitcher.checked == true) {
                    timePublicationCalendar.classList.remove("dont-click");
                } else {
                    timePublicationCalendar.classList.add("dont-click");
                }
            }

            if (target.closest(".item") && target.closest(".time__list")) {
                timePublicationTimeInput.setAttribute("data-from", target.closest(".item").getAttribute("data-from"));
                timePublicationTimeInput.setAttribute("data-upto", target.closest(".item").getAttribute("data-upto"));
                timePublicationTimeInput.setAttribute("data-value", target.closest(".item").getAttribute("data-value"));
                timePublicationTimeInput.textContent = target.closest(".item").textContent;
                timePublicationTimeInput.insertAdjacentHTML("beforeend", ' <span style="color: var(--gray-700)">(+03:00 MSK)</span>');

                // изменение текста при выборе времени
                timePublicationInfoTime.textContent = `с ${target.closest(".item").getAttribute("data-from")} до ${target.closest(".item").getAttribute("data-upto")}`;
                timePublicationInfoTime.setAttribute("data-value", `${target.closest(".item").getAttribute("data-from")}-${target.closest(".item").getAttribute("data-upto")}`);
            }
        }
        selectTime();

        // нажатие на чекбокс приятие правил
        function clickAgreementCheckbox() {
            if (target.parentNode == checkboxAgreement) {
                if (checkboxAgreement.classList.contains("error")) {
                    checkboxAgreement.classList.remove("error");
                }
            }
        }
        clickAgreementCheckbox();

        // нажатие на кнопки после ввода данных
        function clickBtn() {
            if (target.closest(".publish") && target.closest(".step-7")) {
                // валидация шага 1
                let validateLocate = false;
                let validateCompany = false;
                function validateStep1() {
                    let step1 = document.querySelector(".left__content .step-1"),
                        locateCityInput = step1.querySelector(".locate__city .input__inner input"),
                        locateCityErrorMessage = step1.querySelector(".locate__city .error-message"),
                        companyErrorMessage = step1.querySelector(".company .error-message");

                    if (readCookie("vacancy-city(new__vacancy)") != undefined) {
                        validateLocate = true;
                    } else {
                        locateCityInput.classList.add("error");
                        locateCityErrorMessage.classList.remove("hide");
                    }

                    if (readCookie("company-selected(new__vacancy)") != undefined) {
                        validateCompany = true;
                    } else {
                        companyErrorMessage.classList.remove("hide");
                    }

                    if (!validateLocate || !validateCompany) {
                        stepValue.forEach((step) => {
                            if (step.getAttribute("data-value") == "1") {
                                step.classList.add("error");
                            }
                        });
                    } else {
                        stepValue.forEach((step) => {
                            if (step.getAttribute("data-value") == "1") {
                                if (step.classList.contains("error")) {
                                    step.classList.remove("error");
                                }
                            }
                        });
                    }
                }
                validateStep1();

                // валидация шага 2
                let validateSpecialisation = false;
                let validateVacancyName = false;
                let validateDescription = false;
                function validateStep2() {
                    let step2 = document.querySelector(".left__content .step-2"),
                        specialisationPromp = step2.querySelector(".specialisation .error-message"),
                        vacancyName = step2.querySelector(".vacancy input"),
                        descriptionErrorMessage = step2.querySelector(".description .error-message"),
                        descriptionCount = step2.querySelector(".description__text-count span");

                    if (readCookie("popup-specialisation(new__vacancy)") != undefined) {
                        validateSpecialisation = true;
                    } else {
                        specialisationPromp.classList.remove("hide");
                    }

                    if (readCookie("vacancy-name(new__vacancy)") != undefined) {
                        validateVacancyName = true;
                    } else {
                        vacancyName.classList.add("error");
                    }

                    if (document.querySelector(".ql-editor").textContent.replace(/^\s+|\s+$|\s+(?=\s)/g, "").length >= 150) {
                        validateDescription = true;
                    } else {
                        document.querySelector(".description .ql-toolbar").classList.add("error");
                        document.querySelector(".description .ql-container").classList.add("error");
                        descriptionErrorMessage.classList.remove("hide");
                    }

                    if (!validateSpecialisation || !validateVacancyName || !validateDescription) {
                        stepValue.forEach((step) => {
                            if (step.getAttribute("data-value") == "2") {
                                step.classList.add("error");
                            }
                        });
                    } else {
                        stepValue.forEach((step) => {
                            if (step.getAttribute("data-value") == "2") {
                                if (step.classList.contains("error")) {
                                    step.classList.remove("error");
                                }
                            }
                        });
                    }
                }
                validateStep2();

                // валидация шага 5
                let validateManager = false;
                function validateStep5() {
                    let step5 = document.querySelector(".left__content .step-5"),
                        contactInformationHeaderItem = step5.querySelector(".contact__information-select-header .item"),
                        contactInformationErrorMessage = step5.querySelector(".contact__information .error-message");

                    if (readCookie("contact__information-name(new__vacancy)") != undefined) {
                        validateManager = true;
                    } else {
                        contactInformationHeaderItem.parentNode.classList.add("error");
                        contactInformationErrorMessage.classList.remove("hide");
                    }

                    if (!validateManager) {
                        stepValue.forEach((step) => {
                            if (step.getAttribute("data-value") == "5") {
                                step.classList.add("error");
                            }
                        });
                    } else {
                        stepValue.forEach((step) => {
                            if (step.getAttribute("data-value") == "5") {
                                if (step.classList.contains("error")) {
                                    step.classList.remove("error");
                                }
                            }
                        });
                    }
                }
                validateStep5();

                // валидация шага 7
                let validateTypePublication = true;
                let validateCheckboxAgreement = false;
                function validateStep7() {
                    if (checkboxAgreementInput.checked) {
                        validateCheckboxAgreement = true;
                    } else {
                        checkboxAgreement.classList.add("error");
                    }

                    if (validateLocate && validateCompany && validateSpecialisation && validateVacancyName && validateDescription && validateManager && validateTypePublication && validateCheckboxAgreement) {
                        ajaxCreate(getAllData("draft-create"));

                        background.classList.add("active");
                        popupPublication.classList.add("active");
                        scrollY = window.scrollY;
                        scrollTo(popupPublication, scrollY);

                        nameVacancy.textContent = readCookie("vacancy-name(new__vacancy)");

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

                        deleteCookie("popup-specialisation-id(new__vacancy)");
                        deleteCookie("company-selected-id(new__vacancy)");

                        localStorage.removeItem("description-vacancy(new__vacancy)");
                        localStorage.removeItem("languages-value(new__vacancy)");
                        localStorage.removeItem("short__description-vacancy(new__vacancy)");
                    }
                }
                validateStep7();
            }

            if (target.closest(".back") && target.closest(".step-7")) {
                clickBtnBack();
            }
        }
        clickBtn();
    });

    // получение типа публикации при перезагрузке
    function loadTypePublication() {
        if (readCookie("type__publication(new__vacancy)") !== undefined) {
            typePublicationItems.forEach((item) => {
                if (item.getAttribute("data-name") == readCookie("type__publication(new__vacancy)")) {
                    item.querySelector("input").checked = true;
                }
            });
        }
    }

    window.addEventListener(
        "load",
        function load() {
            loadTypePublication();
        },
        false
    );
});
