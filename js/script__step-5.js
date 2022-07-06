import { getAllData, ajaxUpdate } from "./script__ajax.js";

import { clickBtnBack, clickBtnNext } from "./script__click-btn.js";
import { writeCookie, readCookie, deleteCookie } from "./script__work-cookie.js";

document.addEventListener("DOMContentLoaded", () => {
    let step5 = document.querySelector(".left__content .step-5");

    let contactInformationHeaderItem = step5.querySelector(".contact__information-select-header .item"),
        contactInformationList = step5.querySelector(".contact__information-select-list"),
        contactInformationErrorMessage = step5.querySelector(".contact__information .error-message"),
        contactInformationCheckbox = step5.querySelector(".contact__information label input"),
        notificationApplicantCheckbox = step5.querySelector(".notification__applicant label input"),
        notificationApplicantText = step5.querySelector(".notification__applicant .notification__applicant-textarea"),
        notificationCount = step5.querySelector(".notification__text-count span"),
        variablesNotification = step5.querySelector(".notification__applicant .variables");

    // поле ввод для описания вакансии
    function descriptionChange() {
        var Delta = Quill.import("delta");
        // инициализация области
        let quill = new Quill(".notification__applicant-editor", {
            theme: "snow",
        });
        let notificationText,
            notificationLength,
            notificationLimitValue = 1000,
            cursorPosition;

        // ввод текста в область
        quill.on("text-change", function (delta, old, source) {
            // выводить количество символов в тесксте
            notificationLength = quill.getLength();
            notificationCount.textContent = notificationLength - 1;

            // удалять текст если он больше определённого количества
            if (notificationLength > notificationLimitValue) {
                quill.deleteText(notificationLimitValue, notificationLength);
            }
        });

        // нажатие на кнопку очистить
        document.querySelector(".notification__applicant-clear").addEventListener("click", () => {
            deleteCookie("notification__applicant(new__vacancy)");
            quill.setContents();
        });

        // нажатие на кнопку сохранить
        document.querySelector(".step-5 .button .next").addEventListener("click", () => {
            notificationText = quill.getContents();
            writeCookie("notification__applicant(new__vacancy)", encodeURIComponent(JSON.stringify(notificationText)), 30);
        });

        // получение позиции курсора
        document.querySelector("body").addEventListener("click", () => {
            cursorPosition = quill.getSelection();
        });

        // вставка переменных
        function pastVariables(variablesClassName) {
            variablesNotification.querySelector(variablesClassName).addEventListener("click", () => {
                if (cursorPosition) {
                    if (cursorPosition.length == 0) {
                        quill.insertText(cursorPosition.index, variablesNotification.querySelector(variablesClassName).getAttribute("data-value"));
                    } else {
                        quill.updateContents(new Delta().retain(cursorPosition.index).delete(cursorPosition.length).insert(variablesNotification.querySelector(variablesClassName).getAttribute("data-value")));
                    }
                }
            });
        }
        pastVariables(".variables__name");
        pastVariables(".variables__vacancy");
        pastVariables(".variables__name-contact");
        pastVariables(".variables__phone");
        pastVariables(".variables__email");
        pastVariables(".variables__name-company");

        // возращать значение при загрузке страници
        window.addEventListener(
            "load",
            function load() {
                if (readCookie("notification__applicant(new__vacancy)") != undefined) {
                    quill.setContents(JSON.parse(decodeURIComponent(readCookie("notification__applicant(new__vacancy)"))));
                } else {
                    quill.setContents([
                        {
                            insert: `Пример: Здравствуйте, [Name]!  Благодарим Вас за отклик. Компания [Name-company] рассмотрит Ваше резюме на вакансию [Vacancy] и позже сообщит Вам о своем решении.
      
С уважением, [HRName]`,
                        },
                    ]);
                }

                notificationLength = quill.getLength();
                notificationCount.textContent = notificationLength - 1;
            },
            false
        );
    }
    descriptionChange();

    document.addEventListener("click", (event) => {
        let target = event.target;

        // нажатие на выпадающем списке с контактной информацией о менеджерах
        function clickContactInformationHeaderItem() {
            // нажатие на селект
            if (target.closest(".contact__information-select-header") && target.closest(".step-5")) {
                contactInformationList.classList.toggle("hide");

                if (target.closest(".contact__information-select-header").classList.contains("error")) {
                    target.closest(".contact__information-select-header").classList.remove("error");
                    contactInformationErrorMessage.classList.add("hide");
                }
            } else {
                if (!contactInformationList.classList.contains("hide")) {
                    contactInformationList.classList.add("hide");
                }
            }
            // нажатие на элементы списка
            if (target.closest(".item") && target.closest(".contact__information-select-list")) {
                contactInformationHeaderItem.textContent = target.closest(".item").textContent;
                contactInformationHeaderItem.setAttribute("data-value", target.closest(".item").getAttribute("data-value"));
                contactInformationHeaderItem.setAttribute("data-name", target.closest(".item").getAttribute("data-name"));

                writeCookie("contact__information-value(new__vacancy)", target.closest(".item").getAttribute("data-value"), 30);
                writeCookie("contact__information-name(new__vacancy)", target.closest(".item").getAttribute("data-name"), 30);
            }
        }
        clickContactInformationHeaderItem();

        //

        // нажатие на чекбокс "Отправлять уведомления"
        function clickContactInformationCheckbox() {
            if (target == contactInformationCheckbox) {
                if (contactInformationCheckbox.checked) {
                    writeCookie("send_response_notifications(new__vacancy)", true, 30);
                } else {
                    deleteCookie("send_response_notifications(new__vacancy)");
                }
            }
        }
        clickContactInformationCheckbox();

        // нажатиена чекбокс "Включить автоответ"
        function clickNotificationApplicantCheckbox() {
            if (target == notificationApplicantCheckbox) {
                if (notificationApplicantCheckbox.checked) {
                    notificationApplicantText.classList.remove("dont-click");
                    writeCookie("notification__applicant-checkbox(new__vacancy)", true, 30);
                } else {
                    notificationApplicantText.classList.add("dont-click");
                    deleteCookie("notification__applicant-checkbox(new__vacancy)");
                }
            }
        }
        clickNotificationApplicantCheckbox();

        // нажатие на кнопки поле ввода данных
        function clickBtn() {
            if (target.closest(".next") && target.closest(".step-5")) {
                let validateContactInformation = false;

                if (contactInformationHeaderItem.getAttribute("data-name") !== "") {
                    validateContactInformation = true;
                }

                if (validateContactInformation) {
                    contactInformationHeaderItem.parentNode.classList.remove("error");
                    contactInformationErrorMessage.classList.add("hide");
                    validateContactInformation = false;

                    let stepValueItem = document.querySelectorAll(".right__content .step__value");
                    stepValueItem.forEach((step) => {
                        if (step.getAttribute("data-value") == target.closest(".step-5").getAttribute("data-value")) {
                            if (!step.classList.contains("hide")) {
                                step.classList.add("done");
                            }
                        }
                    });

                    ajaxUpdate(getAllData("draft-update"));
                    clickBtnNext();
                } else {
                    contactInformationHeaderItem.parentNode.classList.add("error");
                    contactInformationErrorMessage.classList.remove("hide");
                }
            }

            if (target.closest(".back") && target.closest(".step-5")) {
                clickBtnBack();
            }
        }
        clickBtn();
    });

    function loadContactInformationSelect() {
        if (readCookie("contact__information-value(new__vacancy)") != undefined && readCookie("contact__information-name(new__vacancy)") != undefined) {
            contactInformationHeaderItem.textContent = readCookie("contact__information-name(new__vacancy)");
            contactInformationHeaderItem.setAttribute("data-value", readCookie("contact__information-value(new__vacancy)"));
            contactInformationHeaderItem.setAttribute("data-name", readCookie("contact__information-name(new__vacancy)"));
        }
    }
    function loadContactInformationCheckbox() {
        if (readCookie("send_response_notifications(new__vacancy)") != undefined) {
            contactInformationCheckbox.checked = true;
        }
    }
    function loadNotificationApplicantCheckbox() {
        if (readCookie("notification__applicant-checkbox(new__vacancy)") != undefined) {
            notificationApplicantCheckbox.checked = true;
            notificationApplicantText.classList.remove("dont-click");
        }
    }

    window.addEventListener(
        "load",
        function load() {
            loadContactInformationSelect();
            loadContactInformationCheckbox();
            loadNotificationApplicantCheckbox();
        },
        false
    );
});
