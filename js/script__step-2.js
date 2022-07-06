import { getAllData, ajaxCreate } from "./script__ajax.js";
import { scrollTo } from "./script__scroll-to.js";
import { clickBtnBack, clickBtnNext } from "./script__click-btn.js";
import { writeCookie, readCookie, deleteCookie } from "./script__work-cookie.js";

document.addEventListener("DOMContentLoaded", () => {
    let scrollY;
    let background = document.querySelector(".background");

    let step2 = document.querySelector(".left__content .step-2");

    let vacancyName = step2.querySelector(".vacancy input"),
        vacancyErrorMessage = step2.querySelector(".vacancy .error-message");

    let specialisationErrorMessage = step2.querySelector(".specialisation .error-message"),
        specialisationList = step2.querySelector(".specialisation__list"),
        specialisationListItem = step2.querySelector(".specialisation__list .specialisation__item"),
        btnChangeSpecialisation = step2.querySelector(".specialisation .specialisation__change-btn");

    let popupCategories = document.querySelector(".popup__categories"),
        popupCategoriesItem,
        popupCategoriesClearBtn = popupCategories.querySelector(".clear"),
        popupCategoriesNextBtn = popupCategories.querySelector(".next"),
        popupCategoriesSearchBtn = popupCategories.querySelector(".search");

    let popupSpecialisation = document.querySelector(".popup__specialisation"),
        popupSpecialisationItem,
        popupSpecialisationClearBtn = popupSpecialisation.querySelector(".clear"),
        popupSpecialisationSaveBtn = popupSpecialisation.querySelector(".save"),
        popupSpecialisationBtnBack = popupSpecialisation.querySelector(".btn-back"),
        popupSpecialisationActiveCategories = popupSpecialisation.querySelector(".categories-active");

    let shortDescriptionText = step2.querySelector(".short__description-text"),
        shortDescriptionCount = step2.querySelector(".short__description-count span");

    let descriptionText,
        descriptionErrorMessage = step2.querySelector(".description .error-message"),
        descriptionCount = step2.querySelector(".description__text-count span");

    // поле ввод для описания вакансии
    function descriptionChange() {
        var Delta = Quill.import("delta");
        // инициализация области
        var quill = new Quill(".description__editor", {
            theme: "snow",
            // placeholder: 'Введите описание вакансии',
        });

        let descriptionLength;
        let descriptionLimitValue = 3000;
        // ввод текста в область
        quill.on("text-change", function (delta, old, source) {
            // выводить количество символов в тесксте

            descriptionLength = document.querySelector(".ql-editor").textContent.replace(/^\s+|\s+$|\s+(?=\s)/g, "").length;
            descriptionCount.textContent = descriptionLength;
            descriptionText = quill.getContents();
            // получение текста
            // console.log('quill.getText(): ', quill.getText().textContent);

            localStorage.setItem("description-vacancy(new__vacancy)", encodeURIComponent(JSON.stringify(descriptionText)));

            // удалять текст если он больше определённого количества
            if (descriptionLength > descriptionLimitValue) {
                quill.deleteText(descriptionLimitValue, descriptionLength);
            }
            // убрать сообщение об ошибке при вводе описания
            if (!descriptionErrorMessage.classList.contains("hide")) {
                document.querySelector(".description .ql-toolbar").classList.remove("error");
                document.querySelector(".description .ql-container").classList.remove("error");
                descriptionErrorMessage.classList.add("hide");
            }
        });

        // нажатие на кнопку очистить
        document.querySelector(".description__clear").addEventListener("click", () => {
            localStorage.removeItem("description-vacancy(new__vacancy)");
            quill.setContents();
        });

        // нажатие на кнопку далее
        document.querySelector(".step-2 .button .next").addEventListener("click", () => {
            // descriptionText = quill.getContents();
            localStorage.setItem("description-vacancy(new__vacancy)", encodeURIComponent(JSON.stringify(descriptionText)));
        });

        // очиста сообщения об ошибке если оно присутствует
        document.querySelector(".step-2 .description").addEventListener("click", () => {
            if (!descriptionErrorMessage.classList.contains("hide")) {
                document.querySelector(".description .ql-toolbar").classList.remove("error");
                document.querySelector(".description .ql-container").classList.remove("error");
                descriptionErrorMessage.classList.add("hide");
            }
        });

        // возращать значение при загрузке страници
        window.addEventListener(
            "load",
            function load() {
                if (localStorage.getItem("description-vacancy(new__vacancy)") != undefined) {
                    quill.setContents(JSON.parse(decodeURIComponent(localStorage.getItem("description-vacancy(new__vacancy)"))));
                } else {
                    quill.setContents([
                        {
                            insert: "Обязанности\n",
                        },
                        {
                            attributes: {
                                list: "bullet",
                            },
                            insert: "\n\n",
                        },
                        {
                            insert: "Требования\n",
                        },
                        {
                            attributes: {
                                list: "bullet",
                            },
                            insert: "\n\n",
                        },
                        {
                            insert: "Условия\n",
                        },
                        {
                            attributes: {
                                list: "bullet",
                            },
                            insert: "\n\n",
                        },
                    ]);
                }

                descriptionCount.textContent = descriptionLength;
            },
            false
        );
    }
    descriptionChange();

    document.addEventListener("click", (event) => {
        let target = event.target;

        // вввод названия вакансии
        function changeVacancyName() {
            if (target == vacancyName) {
                if (vacancyName.classList.contains("error")) {
                    vacancyName.classList.remove("error");
                    vacancyErrorMessage.classList.add("hide");
                }
                vacancyName.addEventListener("input", () => {
                    vacancyName.value = vacancyName.value.replace(/[^a-zа-яё0-9.,-/:'"+ ]/gi, "");
                    vacancyName.value = vacancyName.value;
                    if (vacancyName.classList.contains("error")) {
                        vacancyName.classList.remove("error");
                        vacancyErrorMessage.classList.add("hide");
                    }
                    writeCookie("vacancy-name(new__vacancy)", vacancyName.value.replace(/ +/g, " ").trim(), 30);
                    if (vacancyName.value.length == 0) {
                        deleteCookie("vacancy-name(new__vacancy)");
                    }
                });
            }
        }
        changeVacancyName();

        // нажатие на кнопку изменить специализацию
        function clickBtnChangeSpecialisation() {
            if (target == btnChangeSpecialisation) {
                background.classList.add("active");
                popupCategories.classList.add("active");
                scrollY = window.scrollY;
                scrollTo(popupCategories, scrollY);

                if (!specialisationErrorMessage.classList.contains("hide")) {
                    specialisationErrorMessage.classList.add("hide");
                }
            }
        }
        clickBtnChangeSpecialisation();

        // нажатия в popup Категории
        function clickPopupCategories() {
            // нажатие на элементы из списка в popup Категории
            if (target.closest(".item") && target.closest(".popup__categories")) {
                popupCategoriesItem = popupCategories.querySelectorAll(".item");
                popupCategoriesItem.forEach((item) => {
                    item.classList.remove("active");
                });
                target.closest(".item").classList.add("active");
                popupSpecialisationActiveCategories.textContent = target.closest(".item").querySelector("p").textContent;

                if (target.getAttribute("data-value") == "all") {
                    popupCategoriesClearBtn.disabled = false;
                    popupCategoriesNextBtn.disabled = true;
                    popupCategoriesSearchBtn.disabled = false;
                    popupCategoriesNextBtn.classList.add("hide");
                    popupCategoriesSearchBtn.classList.remove("hide");
                } else {
                    popupCategoriesClearBtn.disabled = false;
                    popupCategoriesNextBtn.disabled = false;
                    popupCategoriesSearchBtn.disabled = true;
                    popupCategoriesNextBtn.classList.remove("hide");
                    popupCategoriesSearchBtn.classList.add("hide");
                }

                writeCookie("popup-categories(new__vacancy)", target.closest(".item").getAttribute("data-value"), 30);
                // убрать элемент из списка специализаций при смене категорий
                specialisationListItem.textContent = "";
                specialisationListItem.setAttribute("data-value", "");
                specialisationList.classList.add("hide");
                // убрать все checkbox в popup Специализации при смене категории
                popupSpecialisationItem = popupSpecialisation.querySelectorAll(".item");
                popupSpecialisationItem.forEach((item) => {
                    item.querySelector("input").checked = false;
                });
                deleteCookie("popup-specialisation(new__vacancy)");
            }

            // нажатие на кнопку Сбросить
            if (target == popupCategoriesClearBtn) {
                popupCategoriesItem = popupCategories.querySelectorAll(".item");
                popupCategoriesItem.forEach((item) => {
                    item.classList.remove("active");
                });

                background.classList.remove("active");
                popupCategories.classList.remove("active");

                popupCategoriesClearBtn.disabled = true;
                popupCategoriesNextBtn.disabled = true;
                popupCategoriesSearchBtn.disabled = true;

                deleteCookie("popup-categories(new__vacancy)");

                // убрать элемент из списка специализаций при нажатии кнопки сбросить в popup Категории
                specialisationListItem.textContent = "";
                specialisationListItem.setAttribute("data-value", "");
                specialisationList.classList.add("hide");

                deleteCookie("popup-specialisation(new__vacancy)");
            }

            // нажатие на кнопку Далее
            if (target == popupCategoriesNextBtn) {
                popupCategories.classList.remove("active");
                popupSpecialisation.classList.add("active");

                let loader = `<div class="popup__specialisation-preloader">
                <img src="${templatePath}/images/preloader.svg" alt="preloader">
                  </div>`;

                popupSpecialisationSaveBtn.classList.add("disabled");

                popupSpecialisation.querySelector("ul").innerHTML = loader;

                let category = readCookie("popup-categories(new__vacancy)");

                $.ajax({
                    url: templatePath + "/ajax.php",
                    method: "POST",
                    dataType: "json",
                    data: {
                        type: "filter-specialisation",
                        category: category,
                    },
                    success: function (data) {
                        const DELAY_AFTER_LOAD = 250;

                        let interval = setInterval(function () {
                            let block = "";
                            data.forEach((item) => {
                                block += `
                            <label class="item radio-btn" data-id="${item.ID}" data-value="${item.NAME}">
                               <input type="radio" name="spec">
                               <span></span>
                               <p class="text-s14-h20-w400" data-value="${item.ID}" title="${item.NAME}">${item.NAME}</p>
                            </label>
                            `;
                            });
                            popupSpecialisationSaveBtn.classList.remove("disabled");
                            popupSpecialisation.querySelector("ul").innerHTML = "";
                            popupSpecialisation.querySelector("ul").innerHTML = block;
                            clearInterval(interval);
                        }, DELAY_AFTER_LOAD);
                    },
                    error: function (data) {
                        console.log(data.responseText);
                    },
                });
            }
        }
        clickPopupCategories();

        // закрытие popup Категории
        function closePopupCategories() {
            // нажатие на фон или нажатие на крестик
            if ((target == background && popupCategories.classList.contains("active")) || (target.closest(".close-popup") && target.closest(".popup__categories"))) {
                background.classList.remove("active");
                if (popupCategories.classList.contains("active")) {
                    popupCategories.classList.remove("active");
                    scrollTo(popupCategories, scrollY);
                }
            }
        }
        closePopupCategories();

        // нажатие в popup Специализации
        function clickPopupSpecialisation() {
            // получение элементов списка в popup Специализации при нажатии на кнопку далее в popup Категории
            if (target == popupCategoriesNextBtn) {
                popupSpecialisationItem = popupSpecialisation.querySelectorAll(".item");
            }

            // нажатие кнопки назад в popup Специализация
            if (target == popupSpecialisationBtnBack) {
                popupSpecialisation.classList.remove("active");
                popupCategories.classList.add("active");
            }

            // нажатие на элементы из popup Специализация
            if (target.closest(".item input") && target.closest(".popup__specialisation")) {
                if (target.closest(".item input").checked) {
                    popupSpecialisationItem.forEach((item) => {
                        item.querySelector("input").checked = false;
                    });
                    target.closest(".item input").checked = true;

                    writeCookie("popup-specialisation(new__vacancy)", target.closest(".item").getAttribute("data-value"), 30);
                    writeCookie("popup-specialisation-id(new__vacancy)", target.closest(".item").getAttribute("data-id"), 30);

                    specialisationList.classList.remove("hide");

                    specialisationListItem.textContent = target.closest(".item").textContent;
                    specialisationListItem.setAttribute("data-value", target.closest(".item").getAttribute("data-value"));
                    specialisationListItem.setAttribute("data-id", target.closest(".item").getAttribute("data-id"));

                    btnChangeSpecialisation.textContent = "Изменить специализацию";
                }
            }

            // нажатие кнопки очистить в popup Специализации
            if (target == popupSpecialisationClearBtn) {
                specialisationList.classList.add("hide");
                specialisationListItem.textContent = "";
                specialisationListItem.setAttribute("data-value", "");

                popupSpecialisationItem.forEach((item) => {
                    item.querySelector("input").checked = false;
                });
                specialisationList.classList.add("hide");
                deleteCookie("popup-specialisation(new__vacancy)");

                btnChangeSpecialisation.textContent = "Выбрать специализацию";
            }

            // нажатие кнопки поиск в popup Специализации
            if (target == popupSpecialisationSaveBtn) {
                background.classList.remove("active");
                if (popupSpecialisation.classList.contains("active")) {
                    popupSpecialisation.classList.remove("active");
                    scrollTo(popupSpecialisation, scrollY);
                }
            }
        }
        clickPopupSpecialisation();

        // закрытие popup Специализация
        function closePopupSpecialisation() {
            // нажатие на фон или нажатие на крестик
            if ((target == background && popupSpecialisation.classList.contains("active")) || (target.closest(".close-popup") && target.closest(".popup__specialisation"))) {
                background.classList.remove("active");
                if (popupSpecialisation.classList.contains("active")) {
                    popupSpecialisation.classList.remove("active");
                    scrollTo(popupSpecialisation, scrollY);
                }
            }
        }
        closePopupSpecialisation();

        // удаление списка выбранных специализаций при нажатии на крестик
        function clickRemoveBtnSpecialisation() {
            if (target.closest(".specialisation__list") && target.closest(".remove__btn")) {
                // убрать все элементы из списка специализаций при нажатии кнопки сбросить в popup Категории
                specialisationList.classList.add("hide");
                specialisationListItem.textContent = "";
                specialisationListItem.setAttribute("data-value", "");

                popupCategoriesItem = popupCategories.querySelectorAll(".item");
                popupCategoriesItem.forEach((item) => {
                    item.classList.remove("active");
                });

                popupCategoriesClearBtn.disabled = true;
                popupCategoriesNextBtn.disabled = true;
                popupCategoriesSearchBtn.disabled = true;

                deleteCookie("popup-categories(new__vacancy)");
                deleteCookie("popup-specialisation(new__vacancy)");

                btnChangeSpecialisation.textContent = "Выбрать специализацию";
            }
        }
        clickRemoveBtnSpecialisation();

        // ввод краткого описания
        function inputShortDescription() {
            shortDescriptionText.addEventListener("input", () => {
                shortDescriptionCount.textContent = shortDescriptionText.value.length;
                localStorage.setItem("short__description-vacancy(new__vacancy)", encodeURIComponent(JSON.stringify(shortDescriptionText.value.replace(/ +/g, " ").trim())));
                if (shortDescriptionText.value.length == 0) {
                    localStorage.removeItem("short__description-vacancy(new__vacancy)");
                }
            });
        }
        inputShortDescription();

        // нажатие на кнопки после ввода данных
        function clickBtn() {
            if (target.closest(".next") && target.closest(".step-2")) {
                let validateVacancyName = false;
                let validateSpecialisation = false;
                let validateDescriptionValue = false;

                if (vacancyName.value.replace(/^\s+|\s+$|\s+(?=\s)/g, "").length > 0) {
                    validateVacancyName = true;
                } else {
                    vacancyName.classList.add("error");
                    vacancyErrorMessage.classList.remove("hide");
                }

                if (readCookie("popup-specialisation(new__vacancy)") != undefined) {
                    validateSpecialisation = true;
                } else {
                    specialisationErrorMessage.classList.remove("hide");
                }

                if (document.querySelector(".ql-editor").textContent.replace(/^\s+|\s+$|\s+(?=\s)/g, "").length >= 150) {
                    validateDescriptionValue = true;
                } else {
                    document.querySelector(".description .ql-toolbar").classList.add("error");
                    document.querySelector(".description .ql-container").classList.add("error");
                    descriptionErrorMessage.classList.remove("hide");
                }

                if (validateVacancyName && validateSpecialisation && validateDescriptionValue) {
                    clickBtnNext();
                }
            }

            if (target.closest(".back") && target.closest(".step-2")) {
                clickBtnBack();
            }
        }
        clickBtn();
    });

    // получение данных для popup категорий
    function loadPopupCategories() {
        if (readCookie("popup-categories(new__vacancy)") != undefined) {
            btnChangeSpecialisation.addEventListener("click", () => {
                popupCategoriesItem = popupCategories.querySelectorAll(".item");

                popupCategoriesItem.forEach((item) => {
                    if (item.getAttribute("data-value") == readCookie("popup-categories(new__vacancy)")) {
                        item.classList.add("active");
                        popupSpecialisationActiveCategories.textContent = item.querySelector("p").textContent;

                        if (item.getAttribute("data-value") == "all") {
                            popupCategoriesClearBtn.disabled = false;
                            popupCategoriesNextBtn.disabled = true;
                            popupCategoriesSearchBtn.disabled = false;

                            popupCategoriesNextBtn.classList.add("hide");
                            popupCategoriesSearchBtn.classList.remove("hide");
                        } else {
                            popupCategoriesClearBtn.disabled = false;
                            popupCategoriesNextBtn.disabled = false;
                            popupCategoriesSearchBtn.disabled = true;

                            popupCategoriesNextBtn.classList.remove("hide");
                            popupCategoriesSearchBtn.classList.add("hide");
                        }
                    }
                });
            });
        }
    }
    // получение данных для popup специализация
    function loadPopupSpecialsation() {
        if (readCookie("popup-specialisation(new__vacancy)") != undefined && readCookie("popup-categories(new__vacancy)") != undefined) {
            popupSpecialisationItem = popupSpecialisation.querySelectorAll(".item");
            // установить checkbox
            popupSpecialisationItem.forEach((item) => {
                if (item.getAttribute("data-value") == readCookie("popup-specialisation(new__vacancy)")) {
                    item.querySelector("input").checked = true;

                    // добавить элементы в список Специализаций
                    specialisationList.classList.remove("hide");
                    specialisationListItem.textContent = item.textContent;
                    specialisationListItem.setAttribute("data-value", item.getAttribute("data-value"));
                }
            });

            btnChangeSpecialisation.textContent = "Изменить специализацию";
        }

        if (readCookie("popup-specialisation(new__vacancy)") != undefined) {
            let data = readCookie("popup-specialisation(new__vacancy)");
            let dataId = readCookie("popup-specialisation-id(new__vacancy)");

            let list = document.querySelector(".specialisation__list");
            list.classList.remove("hide");

            let item = list.querySelector(".specialisation__item");
            item.setAttribute("data-value", data);
            item.setAttribute("data-id", dataId);
            item.textContent = data;
        }
    }
    // получение данных для названия вакансии
    function loadVacancyName() {
        if (readCookie("vacancy-name(new__vacancy)") != undefined) {
            readCookie("vacancy-name(new__vacancy)");
            vacancyName.value = readCookie("vacancy-name(new__vacancy)");
        }
    }
    // получение данных для вывода краткого описания
    function loadShortDecription() {
        if (localStorage.getItem("short__description-vacancy(new__vacancy)") != undefined) {
            shortDescriptionText.value = JSON.parse(decodeURIComponent(localStorage.getItem("short__description-vacancy(new__vacancy)")));
            shortDescriptionCount.textContent = shortDescriptionText.value.length;
        }
    }

    window.addEventListener(
        "load",
        function load() {
            loadPopupCategories();
            loadPopupSpecialsation();
            loadVacancyName();
            loadShortDecription();
        },
        false
    );
});
