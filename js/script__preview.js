import { scrollTo } from "./script__scroll-to.js";
import { writeCookie, readCookie, deleteCookie } from "./script__work-cookie.js";

document.addEventListener("DOMContentLoaded", () => {
    let scrollY;

    let previewBtn = document.querySelector(".step-7 .button .preview");
    let background = document.querySelector(".background");
    let popupPreview = document.querySelector(".popup__preview");
    let closePopupPreview = popupPreview.querySelector(".close-popup");

    let vacancyName = popupPreview.querySelector(".vacancy__name"),
        vacancyLacation = popupPreview.querySelector(".vacancy__location"),
        vacancyLacationArr = [],
        experience = popupPreview.querySelector(".requirements .experience"),
        employment = popupPreview.querySelector(".requirements .employment"),
        schedule = popupPreview.querySelector(".requirements .schedule"),
        workingMode = popupPreview.querySelector(".working__mode"),
        workingModeValue = workingMode.querySelector(".value"),
        workingModeArr = [],
        temporaryClearance = popupPreview.querySelector(".temporary__clearance"),
        incomeValue = popupPreview.querySelector(".income__value"),
        incomeInfo = popupPreview.querySelector(".income__info"),
        companyName = popupPreview.querySelector(".company__info .company__info-name"),
        description = popupPreview.querySelector(".description__text"),
        quill = new Quill(description, {
            theme: "snow",
            readOnly: true,
            modules: {
                toolbar: false,
            },
        }),
        bonuses = popupPreview.querySelector(".bonuses"),
        bonusesArr = [],
        additionalRequirements = popupPreview.querySelector(".additional__requirements"),
        skill = popupPreview.querySelector(".skill"),
        skillArr = [],
        languages = popupPreview.querySelector(".languages"),
        languagesArr = [],
        driverLicense = popupPreview.querySelector(".driver__license"),
        driverLicenseArr = [],
        havingCar = popupPreview.querySelector(".having__car"),
        carClass = popupPreview.querySelector(".car__class"),
        carClassArr = [],
        responseOption = popupPreview.querySelector(".response__options"),
        responseOptionItems = popupPreview.querySelectorAll(".response__options .item"),
        responseOptionArr = [],
        vacancyPhoto = popupPreview.querySelector(".vacancy__photo"),
        vacancyPhotoPreview = popupPreview.querySelector(".vacancy__photo-preview");

    document.addEventListener("click", (event) => {
        let target = event.target;

        // открытие попапа Предпросмотр
        if (target == previewBtn) {
            background.classList.add("active");
            popupPreview.classList.add("active");
            scrollY = window.scrollY;
            scrollTo(popupPreview, scrollY);

            // вывод названия вакансии
            if (readCookie("vacancy-name(new__vacancy)") != undefined) {
                vacancyName.textContent = readCookie("vacancy-name(new__vacancy)");
            }

            // вывод местоположения вакансии
            if (readCookie("company-location-address(new__vacancy)") != undefined) {
                vacancyLacationArr = JSON.parse(readCookie("company-location-address(new__vacancy)"));
                let vacancyLocationItem;
                vacancyLacationArr.forEach((elemArr) => {
                    vacancyLocationItem = `<p class='item' data-value='${elemArr}'>${elemArr}</p>`;
                    vacancyLacation.insertAdjacentHTML("beforeend", vacancyLocationItem);
                });
            }

            // вывод опыта работы
            if (readCookie("experience(new__vacancy)") != undefined) {
                experience.classList.remove("hide");
                experience.querySelector(".value").textContent = readCookie("experience(new__vacancy)");
            }

            // вывод типа занятости
            if (readCookie("employment-select(new__vacancy)") != undefined) {
                employment.classList.remove("hide");
                employment.querySelector(".value").textContent = readCookie("employment-select(new__vacancy)");
            }

            // вывод графика работы
            if (readCookie("schedule-select(new__vacancy)") != undefined) {
                schedule.classList.remove("hide");
                schedule.querySelector(".value").textContent = readCookie("schedule-select(new__vacancy)");
            }

            // вывод режимов работы
            if (readCookie("working__mode(new__vacancy)") != undefined) {
                workingModeArr = JSON.parse(readCookie("working__mode(new__vacancy)"));

                workingMode.classList.remove("hide");
                let workingModeItem;

                workingModeArr.forEach((elemArr) => {
                    workingModeItem = `<p class='item' data-name='${elemArr}'>${elemArr}</p>`;
                    workingModeValue.insertAdjacentHTML("beforeend", workingModeItem);
                });
            }

            // вывод временного оформления
            if (readCookie("temporary__employment(new__vacancy)") != undefined) {
                temporaryClearance.classList.remove("hide");
            }

            // вывод зарплаты
            if (readCookie("income-from(new__vacancy)") != undefined || readCookie("income-upto(new__vacancy)") != undefined) {
                if ((readCookie("income-from(new__vacancy)") == "" && readCookie("income-upto(new__vacancy)") == "") || (readCookie("income-from(new__vacancy)") == "0" && readCookie("income-upto(new__vacancy)") == "0") || (readCookie("income-from(new__vacancy)") == "null" && readCookie("income-upto(new__vacancy)") == "") || (readCookie("income-from(new__vacancy)") == "0" && readCookie("income-upto(new__vacancy)") == "null")) {
                    incomeValue.textContent = `Доход не указан`;
                } else if ((readCookie("income-from(new__vacancy)") == "" && readCookie("income-upto(new__vacancy)") != "") || (readCookie("income-from(new__vacancy)") == "0" && readCookie("income-upto(new__vacancy)") != "") || (readCookie("income-from(new__vacancy)") == "" && readCookie("income-upto(new__vacancy)") != "null") || (readCookie("income-from(new__vacancy)") == "0" && readCookie("income-upto(new__vacancy)") != "null")) {
                    incomeValue.textContent = `до ${parseInt(readCookie("income-upto(new__vacancy)")).toLocaleString("ru")} ${readCookie("income-currency(new__vacancy)")}`;
                } else if ((readCookie("income-from(new__vacancy)") != "" && readCookie("income-upto(new__vacancy)") == "") || (readCookie("income-from(new__vacancy)") != "" && readCookie("income-upto(new__vacancy)") == "0") || (readCookie("income-from(new__vacancy)") != "null" && readCookie("income-upto(new__vacancy)") == "") || (readCookie("income-from(new__vacancy)") != "null" && readCookie("income-upto(new__vacancy)") == "0")) {
                    incomeValue.textContent = `от ${parseInt(readCookie("income-from(new__vacancy)")).toLocaleString("ru")} ${readCookie("income-currency(new__vacancy)")}`;
                } else if (readCookie("income-from(new__vacancy)") == readCookie("income-upto(new__vacancy)") || parseInt(readCookie("income-from(new__vacancy)")) > parseInt(readCookie("income-upto(new__vacancy)"))) {
                    incomeValue.textContent = `${parseInt(readCookie("income-from(new__vacancy)")).toLocaleString("ru")} ${readCookie("income-currency(new__vacancy)")}`;
                } else if (readCookie("income-from(new__vacancy)") != "" && readCookie("income-upto(new__vacancy)") != "" && parseInt(readCookie("income-from(new__vacancy)")) !== parseInt(readCookie("income-upto(new__vacancy)"))) {
                    incomeValue.textContent = `${parseInt(readCookie("income-from(new__vacancy)")).toLocaleString("ru")} - ${parseInt(readCookie("income-upto(new__vacancy)")).toLocaleString("ru")} ${readCookie("income-currency(new__vacancy)")}`;
                }
            }

            // вывод дополнительной информации к зарплате
            if (readCookie("income-period(new__vacancy)") != undefined) {
                incomeInfo.textContent = readCookie("income-period(new__vacancy)");
                if (readCookie("income-percent(new__vacancy)") != undefined) {
                    incomeInfo.textContent = `${readCookie("income-period(new__vacancy)")} + процент (премии)`;
                }
            }

            // вывод информации о компании
            if (readCookie("company-selected(new__vacancy)") != undefined) {
                companyName.textContent = readCookie("company-selected(new__vacancy)");
            }

            // вывод описания вакансии
            if (localStorage.getItem("description-vacancy(new__vacancy)") != undefined) {
                description.classList.remove("hide");
                quill.setContents(JSON.parse(decodeURIComponent(localStorage.getItem("description-vacancy(new__vacancy)"))));
            }

            // вывод доступных бонусов
            if (readCookie("bonuses-list(new__vacancy)") && (readCookie("bonuses-list(new__vacancy)") != undefined || readCookie("bonuses-list(new__vacancy)") != null || readCookie("bonuses-list(new__vacancy)") != "")) {
                bonuses.classList.remove("hide");
                bonusesArr = JSON.parse(readCookie("bonuses-list(new__vacancy)"));
                let bonusesItem;

                bonusesArr.forEach((elemArr) => {
                    bonusesItem = `<li class='item' data-value='${elemArr}'>${elemArr}</li>`;
                    bonuses.querySelector(".bonuses__value").insertAdjacentHTML("beforeend", bonusesItem);
                });
            } else {
                bonuses.classList.add("hide");
            }

            // вывод ключевых навыков
            if (readCookie("skill-value(new__vacancy)") != undefined) {
                additionalRequirements.classList.remove("hide");
                skill.classList.remove("hide");
                skillArr = JSON.parse(readCookie("skill-value(new__vacancy)"));
                let skillItem;
                skillArr.forEach((elemArr) => {
                    skillItem = `<p class='item text-s14-h20-w400' data-value='${elemArr}'>${elemArr}</p>`;
                    skill.querySelector(".skill__value").insertAdjacentHTML("beforeend", skillItem);
                });
            }

            if (readCookie("languages-native(new__vacancy)") != undefined) {
                let languagesItem = `
            <div class="languages__value-item">
               <p class="name">${readCookie("languages-native(new__vacancy)")}</p>
               <p class="lavel">Родной</p>
            </div>
            `;
                languages.querySelector(".languages__value").insertAdjacentHTML("beforeend", languagesItem);
            }

            // вывод знания языков
            if (localStorage.getItem("languages-value(new__vacancy)") != undefined) {
                additionalRequirements.classList.remove("hide");
                languages.classList.remove("hide");
                languagesArr = JSON.parse(localStorage.getItem("languages-value(new__vacancy)"));

                let languagesName;
                let languagesLavel;
                let languagesItem;

                languagesArr.forEach((elemArr) => {
                    languagesName = elemArr[0].split(";")[0].split(":")[0];
                    languagesLavel = elemArr[0].split(";")[1].split(":")[0];

                    languagesItem = `
                  <div class="languages__value-item">
                     <p class="name">${languagesName}</p>
                     <p class="lavel">${languagesLavel}</p>
                  </div>
                  `;
                    languages.querySelector(".languages__value").insertAdjacentHTML("beforeend", languagesItem);
                });
            }

            // вывод значения водительских прав
            if (readCookie("driver__license-list1(new__vacancy)") != undefined) {
                additionalRequirements.classList.remove("hide");
                driverLicense.classList.remove("hide");
                driverLicenseArr = JSON.parse(readCookie("driver__license-list1(new__vacancy)"));
                let driverLicenseItem;

                driverLicenseArr.forEach((elemArr) => {
                    driverLicenseItem = `
                  <p class="item">${elemArr}</p>
               `;
                    driverLicense.querySelector(".value").insertAdjacentHTML("beforeend", driverLicenseItem);
                });
            }

            // вывод значения наличие личного автомобиля
            if (readCookie("driver__license-checkbox(new__vacancy)") != undefined) {
                additionalRequirements.classList.remove("hide");
                havingCar.classList.remove("hide");
            }

            // вывод значения категории автомобиля
            if (readCookie("driver__license-list2(new__vacancy)") != undefined) {
                additionalRequirements.classList.remove("hide");
                carClass.classList.remove("hide");
                carClassArr = JSON.parse(readCookie("driver__license-list2(new__vacancy)"));
                let carClassItem;

                carClassArr.forEach((elemArr) => {
                    carClassItem = `
                  <p class="item">${elemArr}</p>
               `;
                    carClass.querySelector(".value").insertAdjacentHTML("beforeend", carClassItem);
                });
            }

            // вывод значения какие сооискатели могут откликаться
            if (readCookie("response__options-list(new__vacancy)") != undefined) {
                additionalRequirements.classList.remove("hide");
                responseOption.classList.remove("hide");
                responseOptionArr = JSON.parse(readCookie("response__options-list(new__vacancy)"));

                responseOptionArr.forEach((elemArr) => {
                    responseOptionItems.forEach((item) => {
                        if (elemArr == item.getAttribute("data-name")) {
                            item.classList.remove("hide");
                        }
                    });
                });
            }

            if (document.querySelectorAll(".load__image-preview .preview__item").length > 0) {
                vacancyPhoto.classList.remove("hide");
                let previewBlock = document.querySelector(".load__image-preview");
                let previewBlockClone = previewBlock.cloneNode(true);
                previewBlockClone.className = "image-preview";
                vacancyPhotoPreview.append(previewBlockClone);
            }
        }

        // закрытие попапа Предпросмотр нажатием на крестик или фон
        if (target == closePopupPreview || (target == background && popupPreview.classList.contains("active"))) {
            background.classList.remove("active");
            popupPreview.classList.remove("active");
            scrollTo(popupPreview, scrollY);

            vacancyName.textContent = "";
            vacancyLacation.innerHTML = "";

            experience.classList.add("hide");
            experience.querySelector(".value").textContent = "";
            employment.classList.add("hide");
            employment.querySelector(".value").textContent = "";
            schedule.classList.add("hide");
            schedule.querySelector(".value").textContent = "";
            workingMode.classList.add("hide");
            workingModeValue.textContent = "";
            temporaryClearance.classList.add("hide");

            bonuses.classList.remove("hide");
            bonuses.querySelector(".bonuses__value").textContent = "";

            additionalRequirements.classList.add("hide");

            skill.classList.add("hide");
            skill.querySelector(".skill__value").textContent = "";

            languages.classList.add("hide");
            languages.querySelector(".languages__value").textContent = "";

            driverLicense.classList.add("hide");
            driverLicense.querySelector(".value").textContent = "";

            havingCar.classList.add("hide");

            carClass.classList.add("hide");
            carClass.querySelector(".value").textContent = "";

            responseOption.classList.add("hide");
            responseOptionItems.forEach((item) => {
                item.classList.add("hide");
            });

            vacancyPhoto.classList.add("hide");
            if (vacancyPhotoPreview.querySelector(".image-preview") != null) {
                vacancyPhotoPreview.querySelector(".image-preview").remove();
            }
        }
    });
});
