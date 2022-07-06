import { getAllData, ajaxUpdate } from "./script__ajax.js";

import { clickBtnBack, clickBtnNext } from "./script__click-btn.js";
import { writeCookie, readCookie, deleteCookie } from "./script__work-cookie.js";

document.addEventListener("DOMContentLoaded", () => {
    let step4 = document.querySelector(".left__content .step-4");

    let experienceItems = step4.querySelectorAll(".experience__items .item");

    let skillsStandartItem = step4.querySelectorAll(".skills__standart .item"),
        skillsInput = step4.querySelector(".skills__input input"),
        skillsInputList = step4.querySelector(".skills__input-list"),
        skillsInputListItems,
        skillsArray = [
            "способности к деловому общению",
            "организация и планирование рабочего времени",
            "внимательность к мелочам",
            "опыт работы с офисной техникой",
            "гибкость",
            "лояльность",
            "навыки делового лидерства",
            "работа с возражениями",
            "разрешение конфликтных ситуаций",
            "знание ПК",
            "обработка больших объемов информации",
            "делопроизводство",
            "работа с офисной техникой",
            "общение в соответствии с правилами этикета",
            "ведение переговоров",
            "знание соответствующего рынка",
            "выстраивание рабочих отношений",
            "навыки межличностного делового общения",
            "умение организовывать работу",
            "умение планировать",
            "умение принимать решения",
            "способность анализировать проблемы",
            "навыки управления проектами",
            "деловое лидерство",
            "управление персоналом",
            "поиск и привлечение клиентов",
            "управление продажами",
            "активные продажи",
            "аналитика продаж",
            "ведение переговоров",
            "организаторское мастерство",
            "знание кассовой дисциплины",
            "знание ресторанного бизнеса",
            "навыки обеспечения жизнедеятельности предприятия",
            "навыки общения с клиентами",
            "навыки организаторской работы",
            "знание программы 1С",
            "опыт работы с оргтехникой",
            "навыки размещения рекламы",
            "навыки управления персоналом",
            "знание основ делопроизводства",
            "владение оргтехникой",
            "тактичность, толерантность",
            "тайм-менеджмент",
            "эффективное общение",
            "грамотная речь",
            "обучаемость",
            "умение мотивировать и убеждать",
            "поиск компромиссов",
            "HTML",
            "CSS",
            "JavaScript",
            "PHP",
            "Python",
            "Adobe",
            "Adobe Photoshop ",
            "CorelDraw",
            "Adobe Illustrator",
            "Figma",
            "чтение и правка чужого кода",
            "опыт разработки ПО",
            "знание основ информационной безопасности",
            "работа с базами данных",
            "разработка приложений",
            "разработка сайтов ",
            "установка и отладка уже существующих программ",
            "знание принципов построения и работы сайтов и серверов",
            "работа с сетями и базами данных",
            "поддержка и верстка сайтов",
            "знание личных продаж",
            "знание кассы",
            "мерчандайзинг",
            "умение обучать других",
            "владение современными технологиями обучения",
            "мотивированность",
            "инициативность",
            "широкий кругозор",
            "энергичность",
            "эрудированность",
            "опыт эффективной коммуникации",
            "гибкость, терпимость в общении",
            "принятие решений",
            "организация, планирование",
            "критическое мышление",
            "способность мотивировать",
            "инициативность",
            "способность организовывать рабочий процесс",
            "умение поддеживать интерес слушателей",
            "грамотная речь",
            "умение общаться с людьми",
            "способность налаживать контакты",
            "деловая переписка",
            "стрессоустойчивость",
            "поиск информации в интернете",
            "стрессоустойчивость",
            "хорошая память",
            "оперативность",
            "ответственность",
            "внимательность",
            "опыт работы с сетью",
            "осуществление техподдержки и работа с клиентами",
            "диагностика сбоев и неполадок",
            "опыт работы с серверами",
            "проведение мониторинга работы систем",
            "установка оборудования",
            "контроль информационной безопасности",
            "работа с техническими документами",
            "знание международных стандартов",
            "знание налогового учета",
            "знание бухгалтерского учета",
            "знание управленческого учета",
            "наличие своей клиентской базы",
            "разработка аудиторских программ",
            "умение составлять и анализировать договоры",
            "представительство в судах",
            "осуществление претензионно-исковой деятельности",
            "составление юридических документов",
            "сопровождение деятельности компании",
            "правовое обеспечение работы организации",
            "опыт представления компании",
            "умение работать с правовыми документами",
            "умение работать с законодательными базами",
            "умение убеждать",
            "умение мотивировать",
            "контроль персонала на всех этапах работы",
            "стратегическое мышление",
            "критическое мышление",
            "способность к разрешению конфликтов",
            "управление временными, трудовыми ресурсами",
            "прогнозирование",
            "стратегическое планирование",
            "поиск нестандартных управленческих решений",
            "организаторские возможности",
            "стаж безаварийного вождения",
            "опыт работы на автомобилях представительского класса",
            "прекрасное знание требуемых маршрутов",
            "знание устройства автомобиля",
            "работа с путевыми документами",
            "отчетность по GAAP",
            "сертификат ACCA Dip IFR",
            "аттестат аудитора",
            "БЭСТ",
            "SUN",
            "CMS",
            "Консультант",
            "Гарант",
            "MS Office",
            "C++",
            "C#",
            "Java",
            "Go",
            "Ruby",
            "Swift",
            "MS SQL Server",
            "PostgreSQL",
            "MySQL",
            "MongoDB",
            "Docker",
            "FCE",
            "CAE",
            "TOEFL",
            "IELTS",
            "Kubernetes",
        ],
        skillsList = step4.querySelector(".skills__list"),
        skillsValueArray = [];

    let languagesNative = step4.querySelector(".languages__list .languages-native"),
        languagesNativeHeader = languagesNative.querySelector(".select-language .header"),
        languagesNativeList = languagesNative.querySelector(".select-language .list"),
        languagesNativeItems = languagesNative.querySelectorAll(".select-language .list .item"),
        languagesNativeClear = languagesNative.querySelector(".remove-language"),
        addLanguageBtn = step4.querySelector(".languages__list .add-language"),
        allLanguage = [],
        countLanguage = 0,
        languageValue,
        languageName,
        lavelValue,
        lavelName;

    let driverLicenseList1 = step4.querySelector(".driver__license .driver__license-list1"),
        driverLicenseList1Item = step4.querySelectorAll(".driver__license .driver__license-list1 .item"),
        driverLicenseArray1 = [];

    let driverLicenseCheckbox = step4.querySelector(".driver__license .driver__license-checkbox input");

    let driverLicenseList2 = step4.querySelector(".driver__license .driver__license-list2"),
        driverLicenseList2Item = step4.querySelectorAll(".driver__license .driver__license-list2 .item"),
        driverLicenseArray2 = [];

    let responseOptionsList = step4.querySelector(".response__options .response__options-list"),
        responseOptionsListItem = step4.querySelectorAll(".response__options .response__options-list .item"),
        responseOptionsArray = [],
        responseOptionsCheckbox = step4.querySelector(".response__options .response__options-checkbox input");

    // добавить элементы из массива в список
    skillsArray.forEach((elemArr) => {
        let listItem = document.createElement("p");
        listItem.className = "item";
        listItem.innerHTML = elemArr;
        skillsInputList.append(listItem);
    });
    // создание элeмента в списке со скилами
    function createNewSkillItem(elem) {
        let removeSkillItem = document.createElement("p");
        removeSkillItem.className = "remove-btn";
        let skillItem = document.createElement("p");
        skillItem.className = "item";
        skillItem.textContent = elem;
        skillItem.append(removeSkillItem);
        skillsList.append(skillItem);
    }

    document.addEventListener("click", (event) => {
        let target = event.target;
        // выбор опыта работы
        function selectExperience() {
            if (target.closest(".item input") && target.closest(".experience__items")) {
                writeCookie("experience(new__vacancy)", target.closest(".item").getAttribute("data-name"));
            }
        }
        selectExperience();

        // ввод скилов
        function inputSkills() {
            // ввод значений
            if (target == skillsInput) {
                // ввод значения в поле
                skillsInput.addEventListener("input", () => {
                    let inputValue = skillsInput.value.replace(/\s+/g, " ");
                    skillsInputListItems = skillsInputList.querySelectorAll(".item");
                    let count = 0;

                    if (inputValue != "" && inputValue.length > 1) {
                        skillsInputList.classList.remove("hide");
                        skillsInputListItems.forEach((item) => {
                            if (item.textContent.toLowerCase() !== inputValue.toLowerCase() && item.textContent.search(inputValue) == -1) {
                                item.classList.add("hide");
                                item.innerHTML = item.innerHTML;

                                // скрывать список если нет похожих элементов
                                count++;
                                if (count == skillsInputListItems.length) {
                                    skillsInputList.classList.add("hide");
                                }
                            } else {
                                item.classList.remove("hide");

                                // скрывать список если нет похожих элементов
                                count--;
                                if (count == skillsInputListItems.length) {
                                    skillsInputList.classList.add("hide");
                                }

                                let str = item.textContent;
                                item.innerHTML = insertMark(str, item.textContent.search(inputValue), inputValue.length);
                            }
                        });
                    } else {
                        skillsInputList.classList.add("hide");
                        skillsInputListItems.forEach(function (item) {
                            item.classList.remove("hide");
                            item.innerHTML = item.innerHTML;
                        });
                    }
                });
                // выделение совпавших символов при вводе данных в поле ключевых навыков
                function insertMark(str, pos, len) {
                    return str.slice(0, pos) + "<mark>" + str.slice(pos, pos + len) + "</mark >" + str.slice(pos + len);
                }
                // добавлять элементы нажатием клавици enter
                skillsInput.addEventListener("keydown", (e) => {
                    if (e.keyCode == 13 && skillsInput.value.length >= 2) {
                        if (skillsInput.value.replace(/\s+/g, " ") !== " ") {
                            if (skillsValueArray.indexOf(skillsInput.value.toLowerCase()) == -1 && skillsValueArray.indexOf(skillsInput.value.toUpperCase())) {
                                skillsValueArray.push(skillsInput.value.toLowerCase());
                                createNewSkillItem(skillsInput.value);
                            }
                            writeCookie("skill-value(new__vacancy)", JSON.stringify(skillsValueArray),30);

                            skillsInput.value = "";
                            skillsInputList.classList.add("hide");

                            if (skillsValueArray.length > 0) {
                                skillsList.classList.remove("hide");
                            }
                        } else {
                            skillsInput.value = "";
                        }
                    }
                });
            } else {
                skillsInput.value = "";
                if (!skillsInputList.classList.contains("hide")) {
                    skillsInputListItems = skillsInputList.querySelectorAll(".item");
                    skillsInputListItems.forEach((item) => {
                        item.classList.remove("hide");
                        item.innerHTML = item.innerHTML;
                    });
                    skillsInputList.classList.add("hide");
                }
            }

            // нажатие на элементы предложенные из списка
            if (target.closest(".item") && target.parentNode == skillsInputList) {
                if (skillsValueArray.indexOf(skillsInput.textContent.toLowerCase()) == -1 && skillsValueArray.indexOf(skillsInput.textContent.toUpperCase())) {
                    skillsInputList.classList.add("hide");
                    if (skillsValueArray.indexOf(target.textContent) == -1) {
                        skillsValueArray.push(target.textContent.toLowerCase());
                        createNewSkillItem(target.textContent);
                    }
                    writeCookie("skill-value(new__vacancy)", JSON.stringify(skillsValueArray),30);

                    if (skillsValueArray.length > 0) {
                        skillsList.classList.remove("hide");
                    }
                }
            }

            // выбор навыков из стандартного списка
            if (target.closest(".item") && target.closest(".skills__standart")) {
                target.closest(".item").classList.toggle("active");
                if (target.closest(".item").classList.contains("active")) {
                    if (skillsValueArray.indexOf(skillsInput.textContent.toLowerCase()) == -1 && skillsValueArray.indexOf(skillsInput.textContent.toUpperCase())) {
                        skillsInputList.classList.add("hide");
                        if (skillsValueArray.indexOf(target.textContent) == -1) {
                            skillsValueArray.push(target.textContent.toLowerCase());
                            createNewSkillItem(target.textContent);
                        }

                        writeCookie("skill-value(new__vacancy)", JSON.stringify(skillsValueArray),30);

                        if (skillsValueArray.length > 0) {
                            skillsList.classList.remove("hide");
                        }
                    }
                } else {
                    skillsValueArray.forEach((elemArr) => {
                        if (elemArr.toLowerCase() == target.closest(".item").textContent.toLowerCase()) {
                            // удалить эжлемент из списка уже добавленных
                            skillsList.querySelectorAll(".item").forEach((item) => {
                                if (elemArr.toLowerCase() == item.textContent.toLowerCase()) {
                                    item.remove();
                                }
                            });
                            // удалить значение из массива
                            skillsValueArray.splice(skillsValueArray.indexOf(elemArr), 1);
                            writeCookie("skill-value(new__vacancy)", JSON.stringify(skillsValueArray),30);
                        }
                    });
                    if (skillsValueArray.length == 0) {
                        deleteCookie("skill-value(new__vacancy)");
                    }
                }
            }

            // удаление элемента нажатием на крестик
            if (target.closest(".remove-btn") && target.closest(".skills__list")) {
                let currData = target.closest(".item").textContent.toLowerCase();

                // console.log(target.closest(".item").textContent);

                skillsValueArray.forEach((item) => {
                    if (item.toLowerCase() == currData) {
                        skillsValueArray.splice(skillsValueArray.indexOf(currData), 1);
                        target.closest(".item").remove();

                        deleteCookie("skill-value(new__vacancy)");

                        writeCookie("skill-value(new__vacancy)", JSON.stringify(skillsValueArray),30);
                    }
                });

                if (skillsValueArray.length == 0) {
                    skillsList.classList.add("hide");
                    deleteCookie("skill-value(new__vacancy)");
                }
            }
        }
        inputSkills();

        // выбор языков
        function clickLanguages() {
            // скрывать уже выбранные языки
            if (target.closest(".select-language") && target.closest(".languages__list")) {
                let languageItems = document.querySelectorAll(".languages__list .select-language .list .item");
                let array = [];
                let languageNameArray = [];
                let languageName;
                if (localStorage.getItem("languages-value(new__vacancy)") != undefined || readCookie("languages-native(new__vacancy)") != undefined) {
                    if (localStorage.getItem("languages-value(new__vacancy)") != undefined) {
                        array = JSON.parse(localStorage.getItem("languages-value(new__vacancy)"));
                        array.forEach((elem) => {
                            languageName = elem[0].split(":")[0];
                            languageNameArray.push(languageName);
                        });
                    }
                    if (readCookie("languages-native(new__vacancy)") != undefined) {
                        languageNameArray.push(readCookie("languages-native(new__vacancy)"));
                    }
                }

                languageItems.forEach((item) => {
                    if (languageNameArray.indexOf(item.getAttribute("data-name")) !== -1) {
                        item.classList.add("hide");
                    } else {
                        item.classList.remove("hide");
                    }
                });
            }

            // выбор родного языка
            if (target.closest(".select-language") && target.closest(".languages-native")) {
                languagesNativeList.classList.toggle("hide");

                window.scrollBy({
                    top: target.closest(".languages__list").scrollHeight,
                    behavior: "auto",
                });
            } else {
                if (!languagesNativeList.classList.contains("hide")) {
                    languagesNativeList.classList.add("hide");
                }
            }

            // нажатие в списке с родными языками
            if (target.closest(".item") && target.parentNode == languagesNativeList) {
                target.closest(".select-language").querySelector(".header .item").textContent = target.closest(".item").textContent;
                target.closest(".select-language").querySelector(".header .item").setAttribute("data-value", target.closest(".item").getAttribute("data-value"));
                target.closest(".select-language").querySelector(".header .item").setAttribute("data-name", target.closest(".item").getAttribute("data-name"));

                writeCookie("languages-native(new__vacancy)", target.closest(".item").getAttribute("data-name"), 30);
            }

            // очистка родного языка
            if (target == languagesNativeClear) {
                languagesNativeHeader.querySelector(".item").textContent = "Выберите язык";
                languagesNativeHeader.querySelector(".item").setAttribute("data-name", "");
                languagesNativeHeader.querySelector(".item").setAttribute("data-value", "");
                deleteCookie("languages-native(new__vacancy)");
                languagesNativeItems.forEach((item) => {
                    item.classList.remove("hide");
                });

                // если кнопки добавить еще нето то показать её
                if (addLanguageBtn.classList.contains("hide")) {
                    addLanguageBtn.classList.remove("hide");
                }
            }

            // нажатие на селекты вобора языка и выбора уровня языка
            if (target.closest(".header") && target.closest(".languages") && target.closest(".languages__list")) {
                if (target.closest(".select-language")) {
                    // если селект языка имеет класс hide
                    if (target.closest(".select-language").querySelector(".list").classList.contains("hide")) {
                        // удалить у открытых списков класс hide
                        document.querySelectorAll(".languages__list .languages .list").forEach((list) => {
                            if (!list.classList.contains("hide")) {
                                list.classList.add("hide");
                            }
                        });
                        // открыть тот по которому произошел клик
                        target.closest(".select-language").querySelector(".list").classList.remove("hide");
                    } else {
                        target.closest(".select-language").querySelector(".list").classList.add("hide");
                    }
                }
                if (target.closest(".select-lavel")) {
                    // если селект уровня языка имеет класс hide
                    if (target.closest(".select-lavel").querySelector(".list").classList.contains("hide")) {
                        // удалить у открытых списков класс hide
                        document.querySelectorAll(".languages__list .languages .list").forEach((list) => {
                            if (!list.classList.contains("hide")) {
                                list.classList.add("hide");
                            }
                        });
                        // открыть тот по которому произошел клик
                        target.closest(".select-lavel").querySelector(".list").classList.remove("hide");
                    } else {
                        target.closest(".select-lavel").querySelector(".list").classList.add("hide");
                    }
                }
                window.scrollBy({
                    top: target.closest(".languages__list").scrollHeight,
                    behavior: "auto",
                });
            } else {
                // удалить у открытых списков класс hide
                document.querySelectorAll(".languages__list .languages .list").forEach((list) => {
                    if (!list.classList.contains("hide")) {
                        list.classList.add("hide");
                    }
                });
            }

            // нажатие на элементы из выпадающего списка
            if (target.closest(".item") && target.closest(".list") && target.closest(".languages")) {
                target.parentNode.parentNode.querySelector(".header .item").textContent = target.closest(".item").textContent;
                target.parentNode.parentNode.querySelector(".header .item").setAttribute("data-value", target.closest(".item").getAttribute("data-value"));
                target.parentNode.parentNode.querySelector(".header .item").setAttribute("data-name", target.closest(".item").getAttribute("data-name"));

                // нажатие на элементы списка с языками
                if (target.closest(".select-language")) {
                    let languageItem = target.closest(".select-language").querySelector(".header .item");
                    let lavel = target.closest(".languages").querySelector(".select-lavel");
                    let lavelItem = lavel.querySelector(".header .item");

                    // разблокировать подле для ввода уровня языка и кнопку добавить еще язык
                    if (languageItem.getAttribute("data-value") != "") {
                        lavel.classList.remove("dont-click");
                    } else {
                        lavel.classList.add("dont-click");
                    }

                    // если последний элемент не заполнен, не разблокировать кнопку добавить еще язык
                    let lastItem = document.querySelectorAll(".languages__list .languages")[document.querySelectorAll(".languages__list .languages").length - 1];
                    if (lastItem.querySelector(".select-language .header .item").getAttribute("data-value") != "") {
                        addLanguageBtn.classList.remove("dont-click");
                    }

                    languageValue = target.closest(".item").getAttribute("data-value");
                    languageName = target.closest(".item").getAttribute("data-name");

                    // при выборе языка подтавить уровень по умолчанию
                    lavelItem.setAttribute("data-value", "a1");
                    lavelItem.setAttribute("data-name", "А1 – начальный");
                    lavelItem.textContent = "А1 – начальный";
                    lavelValue = lavelItem.getAttribute("data-value");
                    lavelName = lavelItem.getAttribute("data-name");
                }
                // нажатие на элементы с уровнем языков
                if (target.closest(".select-lavel")) {
                    let language = target.closest(".languages").querySelector(".select-language .header .item");
                    let lavel = target.closest(".languages").querySelector(".select-lavel .header .item");

                    languageName = language.getAttribute("data-name");
                    languageValue = language.getAttribute("data-value");

                    lavelValue = lavel.getAttribute("data-value");
                    lavelName = lavel.getAttribute("data-name");
                    // // запись значений в localStorage
                    let value = languageName + ":" + languageValue + ";" + lavelName + ":" + lavelValue;
                    allLanguage[target.closest(".languages").getAttribute("data-count")] = [value];
                    localStorage.setItem("languages-value(new__vacancy)", JSON.stringify(allLanguage));
                }
                // // запись значений в localStorage
                let value = languageName + ":" + languageValue + ";" + lavelName + ":" + lavelValue;
                allLanguage[target.closest(".languages").getAttribute("data-count")] = [value];
                localStorage.setItem("languages-value(new__vacancy)", JSON.stringify(allLanguage));
            }

            // нажатие кнопки добавить еще язык
            if (target == addLanguageBtn) {
                let languageClone = document.querySelector(".languages__list .languages").cloneNode(true);
                languageClone.className = "languages";
                languageClone.querySelector(".select-language .header .item").textContent = "Выберите язык";
                languageClone.querySelector(".select-language .header .item").setAttribute("data-name", "");
                languageClone.querySelector(".select-language .header .item").setAttribute("data-value", "");
                languageClone.querySelector(".select-lavel .header .item").textContent = "Выберите уровень";
                languageClone.querySelector(".select-lavel .header .item").setAttribute("data-name", "");
                languageClone.querySelector(".select-lavel .header .item").setAttribute("data-value", "");
                languageClone.querySelector(".select-lavel").classList.add("dont-click");
                target.before(languageClone);
                addLanguageBtn.classList.add("dont-click");

                // изменение индекса для поля с языком
                let lenguages = document.querySelectorAll(".languages__list .languages");
                for (let index = 0; index < lenguages.length; index++) {
                    lenguages[index].setAttribute("data-count", index);
                }

                // если языков больше одного убирать класс one
                if (lenguages.length > 0) {
                    lenguages.forEach((elem) => {
                        elem.classList.remove("one");
                    });
                }

                // скрывать кнопку добавть еще язык если кол-во полей равно кол-ву языков
                let countLanguages = document.querySelectorAll(".languages__list .languages").length;
                let countLanguageValue = document.querySelector(".languages__list .languages .select-language .list").querySelectorAll(".item").length;
                if (readCookie("languages-native(new__vacancy)") == undefined) {
                    if (countLanguages !== countLanguageValue) {
                        addLanguageBtn.classList.add("dont-click");
                    } else {
                        addLanguageBtn.classList.add("hide");
                    }
                } else {
                    if (countLanguages !== countLanguageValue - 1) {
                        addLanguageBtn.classList.add("dont-click");
                    } else {
                        addLanguageBtn.classList.add("hide");
                    }
                }

                // плавный скрол при нажатии на добавить еще язык
                window.scrollBy({
                    top: 70,
                    behavior: "smooth",
                });
            }

            // удаление языка
            if (target.closest(".remove-language") && target.closest(".languages")) {
                let allLanguagesItem = document.querySelectorAll(".languages__list .languages");

                if (allLanguagesItem.length != 1) {
                    let languagesLoadArray = JSON.parse(localStorage.getItem("languages-value(new__vacancy)"));
                    let languagesDataName = target.parentNode.querySelector(".select-language .header .item").getAttribute("data-name");
                    let languagesDataValue = target.parentNode.querySelector(".select-language .header .item").getAttribute("data-value");
                    let lavelDataName = target.parentNode.querySelector(".select-lavel .header .item").getAttribute("data-name");
                    let lavelDataValue = target.parentNode.querySelector(".select-lavel .header .item").getAttribute("data-value");

                    let languageString = languagesDataName + ":" + languagesDataValue + ";" + lavelDataName + ":" + lavelDataValue;

                    languagesLoadArray.map(function (event, i) {
                        if (event[0] == languageString) {
                            languagesLoadArray.splice(i, 1);
                        }
                    });
                    allLanguage.map(function (event, i) {
                        if (event[0] == languageString) {
                            allLanguage.splice(i, 1);
                        }
                    });
                    target.parentNode.remove();
                    let languages = document.querySelectorAll(".language__list .languages");
                    for (let index = 0; index < languages.length; index++) {
                        languages[index].setAttribute("data-count", index);
                    }
                    localStorage.setItem("languages-value(new__vacancy)", JSON.stringify(languagesLoadArray));

                    // если последний элемент не заполнен, не разблокировать кнопку добавить еще язык
                    let lastItem = document.querySelectorAll(".languages__list .languages")[document.querySelectorAll(".languages__list .languages").length - 1];
                    if (lastItem.querySelector(".select-language .header .item").getAttribute("data-value") != "") {
                        addLanguageBtn.classList.remove("dont-click");
                    }

                    // если удалился последний элемент показывать кнопку добавить еще
                    if (addLanguageBtn.classList.contains("hide")) {
                        addLanguageBtn.classList.remove("hide");
                    }
                } else {
                    target.parentNode.setAttribute("data-count", "0");
                    target.parentNode.querySelector(".select-language .header .item").textContent = "Выберите язык";
                    target.parentNode.querySelector(".select-language .header .item").setAttribute("data-name", "");
                    target.parentNode.querySelector(".select-language .header .item").setAttribute("data-value", "");
                    target.parentNode.querySelector(".select-lavel .header .item").textContent = "Выберите уровень";
                    target.parentNode.querySelector(".select-lavel .header .item").setAttribute("data-name", "");
                    target.parentNode.querySelector(".select-lavel .header .item").setAttribute("data-value", "");

                    let languagesList = target.parentNode.querySelectorAll(".select-language .list .item");
                    languagesList.forEach((elem) => {
                        elem.classList.remove("hide");
                    });

                    target.parentNode.querySelector(".select-lavel").classList.add("dont-click");
                    addLanguageBtn.classList.add("dont-click");

                    allLanguage.length = 0;
                    // localStorage.setItem('languages-value', JSON.stringify(allLanguage));

                    localStorage.removeItem("languages-value(new__vacancy)");
                }
            }
        }
        clickLanguages();

        // нажатие на списки
        function clickList(parent, arrayName, cookieName) {
            if (target.closest(".item") && target.parentNode == parent) {
                target.closest(".item").classList.toggle("active");
                if (target.closest(".item").classList.contains("active")) {
                    arrayName.push(target.closest(".item").getAttribute("data-name"));
                    writeCookie(cookieName, JSON.stringify(arrayName), 30);
                } else {
                    arrayName.forEach((elemArr) => {
                        if (elemArr == target.closest(".item").getAttribute("data-name")) {
                            arrayName.splice(arrayName.indexOf(elemArr), 1);
                            if (arrayName.length > 0) {
                                writeCookie(cookieName, JSON.stringify(arrayName), 30);
                            } else {
                                deleteCookie(cookieName);
                            }
                        }
                    });
                }
            }
        }
        clickList(driverLicenseList1, driverLicenseArray1, "driver__license-list1(new__vacancy)");
        clickList(driverLicenseList2, driverLicenseArray2, "driver__license-list2(new__vacancy)");
        clickList(responseOptionsList, responseOptionsArray, "response__options-list(new__vacancy)");

        // нажатие на чекбокс "Есть личный автомобиль"
        function clickDriverLicenseCheckbox() {
            if (target == driverLicenseCheckbox && target.closest(".driver__license-checkbox")) {
                if (driverLicenseCheckbox.checked) {
                    writeCookie("driver__license-checkbox(new__vacancy)", true, 30);
                    driverLicenseList2.classList.remove("dont-click");
                } else {
                    deleteCookie("driver__license-checkbox(new__vacancy)");
                    deleteCookie("driver__license-list2(new__vacancy)");
                    driverLicenseList2.classList.add("dont-click");
                    driverLicenseList2.querySelectorAll(".item").forEach((item) => {
                        item.classList.remove("active");
                    });
                }
            }
        }
        clickDriverLicenseCheckbox();

        // нажатие на чекбокс "Только с сопроводительным письмом"
        function clickResponseOptionsCheckbox() {
            if (target == responseOptionsCheckbox && target.closest(".response__options-checkbox")) {
                if (responseOptionsCheckbox.checked) {
                    writeCookie("response__options-checkbox(new__vacancy)", true, 30);
                } else {
                    deleteCookie("response__options-checkbox(new__vacancy)");
                }
            }
        }
        clickResponseOptionsCheckbox();

        // нажатие на кнопки после ввода данных
        function clickBtn() {
            if (target.closest(".next") && target.closest(".step-4")) {
                ajaxUpdate(getAllData("draft-update"));
                clickBtnNext();
            }

            if (target.closest(".back") && target.closest(".step-4")) {
                clickBtnBack();
            }
        }
        clickBtn();
    });

    // получение данных при перезагрузке страницы
    function loadExperience() {
        if (readCookie("experience(new__vacancy)") != undefined) {
            experienceItems.forEach((item) => {
                if (item.getAttribute("data-name") == readCookie("experience(new__vacancy)")) {
                    item.querySelector("input").checked = true;
                }
            });
        }
    }
    function loadSkillItem() {
        
        if (readCookie("skill-value(new__vacancy)") !== undefined) {
            skillsValueArray = JSON.parse(readCookie("skill-value(new__vacancy)"));
            skillsStandartItem.forEach((item) => {
                skillsValueArray.forEach((elemArr) => {
                    if (item.textContent.toLowerCase() == elemArr) {
                        item.classList.add("active");
                    }
                });
            });

            skillsValueArray.forEach((elemArr) => {
                createNewSkillItem(elemArr);
            });

            if (skillsValueArray.length > 0) {
                skillsList.classList.remove("hide");
            }
        }
    }
    function loadLanguagesNative() {
        if (readCookie("languages-native(new__vacancy)") != undefined) {
            languagesNativeItems.forEach((item) => {
                if (item.getAttribute("data-name") == readCookie("languages-native(new__vacancy)")) {
                    languagesNativeHeader.querySelector(".item").textContent = item.textContent;
                    languagesNativeHeader.querySelector(".item").setAttribute("data-name", item.getAttribute("data-name"));
                    languagesNativeHeader.querySelector(".item").setAttribute("data-value", item.getAttribute("data-value"));
                }
            });
        }
    }
    function loadLanguages() {
        if (localStorage.getItem("languages-value(new__vacancy)") != undefined) {
            allLanguage = JSON.parse(localStorage.getItem("languages-value(new__vacancy)"));
            if (allLanguage.length != 0) {
                let languageName = allLanguage[0][0].split(";")[0];
                let lavelName = allLanguage[0][0].split(";")[1];
                let languageNameArr = languageName.split(":");
                let lavelNameArr = lavelName.split(":");

                let languageItem = document.querySelector(".languages__list .languages");
                languageItem.querySelector(".select-language .header .item").textContent = languageNameArr[0];
                languageItem.querySelector(".select-language .header .item").setAttribute("data-name", languageNameArr[0]);
                languageItem.querySelector(".select-language .header .item").setAttribute("data-value", languageNameArr[1]);
                languageItem.querySelector(".select-lavel .header .item").textContent = lavelNameArr[0];
                languageItem.querySelector(".select-lavel .header .item").setAttribute("data-name", lavelNameArr[0]);
                languageItem.querySelector(".select-lavel .header .item").setAttribute("data-value", lavelNameArr[1]);

                if (languageItem.querySelector(".select-lavel .header .item").getAttribute("data-name") != "") {
                    languageItem.querySelector(".select-lavel").classList.remove("dont-click");
                }

                for (let index = 1; index < allLanguage.length; ++index) {
                    let languageName = allLanguage[index][0].split(";")[0];
                    let lavelName = allLanguage[index][0].split(";")[1];
                    let languageNameArr = languageName.split(":");
                    let lavelNameArr = lavelName.split(":");

                    countLanguage++;

                    let languageClone = languageItem.cloneNode(true);
                    languageClone.querySelector(".select-language .header .item").textContent = languageNameArr[0];
                    languageClone.querySelector(".select-language .header .item").setAttribute("data-name", languageNameArr[0]);
                    languageClone.querySelector(".select-language .header .item").setAttribute("data-value", languageNameArr[1]);
                    languageClone.querySelector(".select-lavel .header .item").textContent = lavelNameArr[0];
                    languageClone.querySelector(".select-lavel .header .item").setAttribute("data-name", lavelNameArr[0]);
                    languageClone.querySelector(".select-lavel .header .item").setAttribute("data-value", lavelNameArr[1]);

                    if (languageClone.querySelector(".select-lavel .header .item").getAttribute("data-name") != "") {
                        languageClone.querySelector(".select-lavel").classList.remove("dont-click");
                    }
                    languageClone.setAttribute("data-count", countLanguage);
                    addLanguageBtn.before(languageClone);
                }

                let filterLanguagesItem = document.querySelectorAll(".languages__list .languages");
                if (filterLanguagesItem.length == 1) {
                    filterLanguagesItem.forEach((elem) => {
                        elem.classList.add("one");
                    });
                } else if (filterLanguagesItem.length > 1) {
                    filterLanguagesItem.forEach((elem) => {
                        elem.classList.remove("one");
                    });
                }

                // скрывать кнопку добавть еще язык если кол-во полей равно кол-ву языков
                let countLanguages = document.querySelectorAll(".languages__list .languages").length;
                let countLanguageValue = document.querySelector(".languages__list .languages .select-language .list").querySelectorAll(".item").length;
                if (readCookie("languages-native(new__vacancy)") == undefined) {
                    if (countLanguages !== countLanguageValue) {
                        addLanguageBtn.classList.add("dont-click");
                    } else {
                        addLanguageBtn.classList.add("hide");
                    }
                } else {
                    if (countLanguages !== countLanguageValue - 1) {
                        addLanguageBtn.classList.add("dont-click");
                    } else {
                        addLanguageBtn.classList.add("hide");
                    }
                }

                // если последний элемент не заполнен, не разблокировать кнопку добавить еще язык
                let lastItem = document.querySelectorAll(".languages__list .languages")[document.querySelectorAll(".languages__list .languages").length - 1];
                if (lastItem.querySelector(".select-language .header .item").getAttribute("data-value") != "") {
                    addLanguageBtn.classList.remove("dont-click");
                }
            }
        }
    }
    function loadList1() {
        if (readCookie("driver__license-list1(new__vacancy)") !== undefined) {
            driverLicenseArray1 = JSON.parse(readCookie("driver__license-list1(new__vacancy)"));
            driverLicenseArray1.forEach((elemArr) => {
                driverLicenseList1Item.forEach((item) => {
                    if (elemArr == item.getAttribute("data-name")) {
                        item.classList.add("active");
                    }
                });
            });
        }
    }
    function loadList2() {
        if (readCookie("driver__license-list2(new__vacancy)") !== undefined) {
            driverLicenseArray2 = JSON.parse(readCookie("driver__license-list2(new__vacancy)"));
            driverLicenseArray2.forEach((elemArr) => {
                driverLicenseList2Item.forEach((item) => {
                    if (elemArr == item.getAttribute("data-name")) {
                        item.classList.add("active");
                    }
                });
            });
        }
    }
    function loadList3() {
        if (readCookie("response__options-list(new__vacancy)") !== undefined) {
            responseOptionsArray = JSON.parse(readCookie("response__options-list(new__vacancy)"));
            responseOptionsArray.forEach((elemArr) => {
                responseOptionsListItem.forEach((item) => {
                    if (elemArr == item.getAttribute("data-name")) {
                        item.classList.add("active");
                    }
                });
            });
        }
    }
    function loadDriverLicenseCheckbox() {
        if (readCookie("driver__license-checkbox(new__vacancy)") != undefined) {
            if (readCookie("driver__license-checkbox(new__vacancy)") == "true") {
                driverLicenseCheckbox.checked = true;
                driverLicenseList2.classList.remove("dont-click");
            }
        }
    }
    function loadResponseOptionsCheckbox() {
        if (readCookie("response__options-checkbox(new__vacancy)") != undefined) {
            responseOptionsCheckbox.checked = true;
        }
    }

    window.addEventListener(
        "load",
        function load() {
            loadExperience();
            loadSkillItem();
            loadLanguagesNative();
            loadLanguages();
            loadList1();
            loadList2();
            loadList3();
            loadDriverLicenseCheckbox();
            loadResponseOptionsCheckbox();
        },
        false
    );
});
