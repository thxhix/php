import { readCookie, writeCookie } from "./script__work-cookie.js";

// запись значений
export function getAllData(typeStr) {
    // Собираем инфу о компании
    let Company = {};

    let compList = document.querySelectorAll(".step-1 .company__list .company__list-item .chose-company__input");
    compList.forEach((item) => {
        if (item.checked) {
            Company.id = item.parentNode.getAttribute("data-value");
            Company.name = item.parentNode.getAttribute("data-name");
        }
    });
    let hideCompany = document.querySelector(".step-1 .company__switcher input");
    if (hideCompany.checked) {
        Company.hide = true;
    } else {
        Company.hide = false;
    }

    // Собираем инфу о городах
    let Cities = {};
    let cityList = document.querySelectorAll(".step-1 .locate__city .add-items .item");
    let addressList = document.querySelectorAll(".step-1 .locate__address .input-block");
    cityList.forEach((city, key) => {
        Cities[key] = {
            name: city.getAttribute("data-city"),
            lat: city.getAttribute("data-lat"),
            lon: city.getAttribute("data-lon"),
        };

        if (addressList[key].querySelector("label.switcher-btn input").checked && addressList[key].getAttribute("data-city") !== null) {
            if (city.getAttribute("data-city") == addressList[key].getAttribute("data-city")) {
                let address = addressList[key].querySelector(".inner .add-items .item");

                if (address) {
                    Cities[key]["address"] = {
                        address: address.getAttribute("data-value") ? address.getAttribute("data-value") : "",
                        lat: address.getAttribute("data-lat") ? address.getAttribute("data-lat") : "",
                        lon: address.getAttribute("data-lon") ? address.getAttribute("data-lon") : "",
                    };
                }
            }
        }
    });

    // Собираем инфу о Вакансии
    let Vacancy = {};
    let specialization = document.querySelector(".step-2 .specialisation__list p.specialisation__item");
    // Название
    Vacancy.name = document.querySelector(".step-2 .vacancy input").value;
    // Специализация
    Vacancy["specialization"] = {
        id: specialization.getAttribute("data-id"),
        name: specialization.getAttribute("data-value"),
    };
    if (document.querySelector(".step-2 .short__description-text").value != "") {
        // Описание
        Vacancy["description"] = {
            short: document.querySelector(".step-2 .short__description-text").value,
            full: localStorage.getItem("description-vacancy(new__vacancy)"),
        };
    } else {
        Vacancy["description"] = {
            short: null,
            full: localStorage.getItem("description-vacancy(new__vacancy)"),
        };
    }
    // Занятость (полная, частичная и т.д)
    let busy = document.querySelector(".step-3 .requirements__select .employment .employment__header .item");
    if (busy.getAttribute("data-value") == "" && busy.getAttribute("data-name") == "") {
        Vacancy["busyness"] = null;
    } else {
        Vacancy["busyness"] = {
            id: busy.getAttribute("data-value"),
            name: busy.getAttribute("data-name"),
        };
    }

    // График
    let schedule = document.querySelector(".step-3 .requirements__select .schedule .schedule__header .item");

    if (schedule.getAttribute("data-value") == "" && schedule.getAttribute("data-name") == "") {
        Vacancy["schedule"] = null;
    } else {
        Vacancy["schedule"] = {
            id: schedule.getAttribute("data-value"),
            name: schedule.getAttribute("data-name"),
        };
    }

    // Режим работы (Удаленка/офис)
    let workFormat = document.querySelector(".step-3 .requirements__select .work-format .work-format__header .item");

    if (workFormat.getAttribute("data-value") == "" && workFormat.getAttribute("data-name") == "") {
        Vacancy["work-format"] = null;
    } else {
        Vacancy["work-format"] = {
            id: workFormat.getAttribute("data-value"),
            name: workFormat.getAttribute("data-name"),
        };
    }

    // Возможно временное оформление
    let allowTemp = document.querySelector(".step-3 .requirements .requirements__checkbox label.checkbox-btn input");
    if (allowTemp.checked) {
        Vacancy["allow-temp"] = true;
    } else {
        Vacancy["allow-temp"] = false;
    }

    // Режим работы
    let workModeArr = [];
    let workingModeList = document.querySelectorAll(".step-3 .working__mode-list .item.active");
    workingModeList.forEach((item) => {
        workModeArr.push({
            id: item.getAttribute("data-value"),
            name: item.getAttribute("data-name"),
        });
    });
    if (workModeArr < 1) {
        Vacancy["working-mode"] = null;
    } else {
        Vacancy["working-mode"] = workModeArr;
    }

    // Предполагаемый уровень дохода
    let incomeInputs = document.querySelector(".step-3 .income__input");
    let incomeTypeList = document.querySelectorAll(".step-3 .income__additionally .item input");

    let incomeType = null;
    let incomeId = null;

    incomeTypeList.forEach((item) => {
        if (item.checked) {
            incomeType = item.parentNode.getAttribute("data-name");
            incomeId = item.parentNode.getAttribute("data-value");
        }
    });

    let percentAllow;
    let percentCheckbox = document.querySelector(".step-3 .income__percent label.checkbox-btn input");
    if (percentCheckbox.checked) {
        percentAllow = true;
    } else {
        percentAllow = false;
    }
    Vacancy["income"] = {
        from: incomeInputs.querySelector(".from input").getAttribute("data-value"),
        to: incomeInputs.querySelector(".upto input").getAttribute("data-value"),
        period: incomeInputs.querySelector(".period__select .period__select-header p.item").getAttribute("data-name"),
        period_id: incomeInputs.querySelector(".period__select .period__select-header p.item").getAttribute("data-value"),
        currency_id: incomeInputs.querySelector(".currency__select-header p.item").getAttribute("data-value"),
        currency_value: incomeInputs.querySelector(".currency__select-header p.item").getAttribute("data-name"),

        percent: percentAllow,
        income_type: incomeType,
        income_type_id: incomeId,
    };

    // Доступные бонусы
    let bonusList = document.querySelectorAll(".step-3 .bonuses__list .item.active");
    let bonusArr = [];
    bonusList.forEach((item) => {
        bonusArr.push({
            id: item.getAttribute("data-value"),
            name: item.getAttribute("data-name"),
        });
    });

    if (bonusArr.length < 1) {
        Vacancy["bonus"] = null;
    } else {
        Vacancy["bonus"] = bonusArr;
    }

    // Требуемый опыт
    let experienceList = document.querySelectorAll(".step-4 .experience__items .item input");

    Vacancy["experience"] = null;

    experienceList.forEach((item) => {
        if (item.checked) {
            Vacancy["experience"] = {
                id: item.parentNode.getAttribute("data-value"),
                name: item.parentNode.getAttribute("data-name"),
            };
        }
    });

    // Ключевые навыки
    let skillsArr = [];
    let skillList = document.querySelectorAll(".step-4 .skills__list .item");
    skillList.forEach((item) => {
        skillsArr.push({
            name: item.textContent,
        });
    });

    if (skillsArr.length < 1) {
        Vacancy["skills"] = null;
    } else {
        Vacancy["skills"] = skillsArr;
    }

    // Знание языков
    let langArr = [];
    let langNative = document.querySelector(".step-4 .languages__list .languages-native .select-language .header .item");

    if (langNative.getAttribute("data-value") == "" && langNative.getAttribute("data-name") == "") {
        langArr = [];
    } else {
        langArr.push({
            id: langNative.getAttribute("data-value"),
            name: langNative.getAttribute("data-name"),
            level: "native",
        });
    }

    let langAddList = document.querySelectorAll(".step-4 .languages__list .languages");
    langAddList.forEach((item) => {
        let lang = item.querySelector(".select-language .header .item");
        let level = item.querySelector(".select-lavel .header .item");

        if (lang.getAttribute("data-value") != "" && lang.getAttribute("data-name") != "" && level.getAttribute("data-value")) {
            langArr.push({
                id: lang.getAttribute("data-value"),
                name: lang.getAttribute("data-name"),
                level: level.getAttribute("data-value"),
            });
        }
    });
    Vacancy["languages"] = langArr;

    // Категория прав
    let driverLicArr = [];
    let driverLicList = document.querySelectorAll(".step-4 .driver__license-list1 .item.active");
    driverLicList.forEach((item) => {
        driverLicArr.push({
            id: item.getAttribute("data-value"),
            name: item.getAttribute("data-name"),
        });
    });
    if (driverLicArr.length < 1) {
        driverLicArr = false;
    }
    Vacancy["drive-license"] = driverLicArr;

    // Есть личный транспорт
    let hasCar = null;
    let hasCarCheckbox = document.querySelector(".step-4 .driver__license-checkbox input");
    if (hasCarCheckbox.checked) {
        hasCar = true;
    } else {
        hasCar = false;
    }

    Vacancy["hasCar"] = hasCar;

    if (hasCar) {
        let carClassArr = [];
        let carClassList = document.querySelectorAll(".step-4 .driver__license-list2 .item.active");
        carClassList.forEach((item) => {
            carClassArr.push({
                id: item.getAttribute("data-value"),
                name: item.getAttribute("data-name"),
            });
        });
        Vacancy["car"] = carClassArr;
    } else {
        Vacancy["car"] = null;
    }

    // Какие соискатели могут откликаться
    let whoCanArr = [];
    let whoCanList = document.querySelectorAll(".step-4 .response__options-list .item.active");
    if (whoCanList.length > 0) {
        whoCanList.forEach((item) => {
            whoCanArr.push({
                id: item.getAttribute("data-value"),
                name: item.getAttribute("data-name"),
            });
        });
    } else {
        whoCanArr = null;
    }
    Vacancy["who-can"] = whoCanArr;

    // Только с сопроводительным письмом
    let onlyWithMessage;
    let onlyWithMessageCheckbox = document.querySelector(".step-4 .response__options .response__options-checkbox input");

    if (onlyWithMessageCheckbox.checked) {
        onlyWithMessage = true;
    } else {
        onlyWithMessage = false;
    }
    Vacancy["only-with-message"] = onlyWithMessage;

    // Контактная информация
    let manager = document.querySelector(".step-5 .contact__information .contact__information-select .contact__information-select-header .item");
    let sendToMail;
    let sendToMailCheckbox = document.querySelector(".step-5 .contact__information label input");
    if (sendToMailCheckbox.checked) {
        sendToMail = true;
    } else {
        sendToMail = false;
    }
    Vacancy["manager"] = {
        id: manager.getAttribute("data-value"),
        name: manager.getAttribute("data-name"),
        ["send-to-mail"]: sendToMail,
    };

    // Оповещение соискателя о получении отклика
    let notify = null;
    let notifyCheckbox = document.querySelector(".step-5 .notification__applicant label input");
    if (notifyCheckbox.checked) {
        notify = true;
        let notifyText = readCookie("notification__applicant(new__vacancy)");
        Vacancy["notify"] = {
            enable: notify,
            text: notifyText,
        };
    } else {
        Vacancy["notify"] = false;
    }

    // Тип публикации вакансии
    let Publication = {};
    let publicationTypeList = document.querySelectorAll(".step-7 .type__publication .type__publication-list .item label input");
    publicationTypeList.forEach((item) => {
        if (item.checked) {
            Publication["publication-type"] = {
                id: item.parentNode.parentNode.getAttribute("data-value"),
                name: item.parentNode.parentNode.getAttribute("data-name"),
            };
        }
    });

    // Время публикации вакансии
    let publicateTime;
    let publicateTimeCheckbox = document.querySelector(".step-7 .time__publication .time__publication-switcher input");
    if (publicateTimeCheckbox.checked) {
        let date = document.querySelector(".step-7 .time__publication .time__publication-calendar .calendar .date__calendar.flatpickr-input").getAttribute("value");
        let timeInput = document.querySelector(".step-7 .time__publication .time__publication-calendar .time__header .item");

        if (timeInput.getAttribute("data-from") == "") {
            timeInput.setAttribute("data-from", "12:00");
        }

        if (timeInput.getAttribute("data-upto") == "") {
            timeInput.setAttribute("data-upto", "13:00");
        }

        publicateTime = `${date} ${timeInput.getAttribute("data-from")}:00`;
        Publication["timing"] = {
            ready: publicateTime,
            date: date,
            time_from: timeInput.getAttribute("data-from"),
            time_to: timeInput.getAttribute("data-upto"),
        };
    } else {
        Publication["timing"] = null;
    }

    let ids;
    let step;

    if (readCookie("draft-stack(new-vacancy)") && readCookie("draft-stack(new-vacancy)") != null && readCookie("draft-stack(new-vacancy)") != undefined) {
        ids = stringToJson(readCookie("draft-stack(new-vacancy)"), ",");
    } else {
        ids = null;
    }

    if (readCookie("step-now(new__vacancy)") && readCookie("step-now(new__vacancy)") != null && readCookie("step-now(new__vacancy)") != undefined) {
        step = readCookie("step-now(new__vacancy)");
    } else {
        step = null;
    }

    let cityCount = readCookie("city-count");

    let Form = {
        Company,
        Cities,
        Vacancy,
        Publication,
        cityCount,
    };

    Form.ids = ids;
    Form.step = step;

    var formData = new FormData();

    formData.append("type", `${typeStr}`);

    var ins = document.getElementById("file-input").files.length;
    for (var x = 0; x < ins; x++) {
        formData.append("fileToUpload[]", document.getElementById("file-input").files[x]);
    }

    formData.append("Data", JSON.stringify(Form));

    return formData;
}

export function ajaxCreate(formData) {
    //  console.log(formData.files);
    if (readCookie("draft-stack(new-vacancy)") && (readCookie("draft-stack(new-vacancy)") != null || readCookie("draft-stack(new-vacancy)") != undefined)) {
        console.log("Уже есть в черновиках");
        // ajaxUpdate(getAllData("draft-update"));
    } else {
        console.log("Create");
        $.ajax({
            url: templatePath + "/ajax.php",
            data: formData,
            processData: false,
            contentType: false,
            dataType: "json",
            type: "post",

            success: function (data) {
                // var date = new Date();
                // date.setDate(date.getDate() + 30);
                // document.cookie = "draft-stack(new-vacancy)" + "=" + data.ID + "; expires=" + date.toUTCString();
            },
            error: function (data) {
                console.log(data);
            },
        });
    }
}

export function ajaxUpdate(formData) {
    return;
    console.log("Update");

    $.ajax({
        url: templatePath + "/ajax.php",
        data: formData,
        processData: false,
        contentType: false,
        type: "post",
        dataType: "json",
        success: function (data) {
            console.log(data);
            var date = new Date();
            date.setDate(date.getDate() + 30);
            let draft_stack = data.join(",");
            document.cookie = "draft-stack(new-vacancy)" + "=" + draft_stack + "; expires=" + date.toUTCString();
        },
        error: function (data) {
            console.log(data);
        },
    });
}

function stringToJson(str, limiter) {
    let Obj = {};
    let arr = str.split(limiter);

    arr.forEach((item, key) => {
        Obj[key] = item;
    });

    return Obj;
}
