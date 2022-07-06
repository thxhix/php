import { getAllData, ajaxUpdate } from "./script__ajax.js";

import { scrollTo } from "./script__scroll-to.js";
import { clickBtnBack, clickBtnNext } from "./script__click-btn.js";
import { writeCookie, readCookie, deleteCookie } from "./script__work-cookie.js";

document.addEventListener("DOMContentLoaded", () => {
    let scrollY;
    let background = document.querySelector(".background");

    let step6 = document.querySelector(".left__content .step-6");

    let dopinfoBtn = step6.querySelector(".info-btn"),
        loadImageInput = step6.querySelector(".load__image-input"),
        errorMessage = step6.querySelector(".error-message");

    let popupDopinfo = document.querySelector(".popup__info-premium");

    // поле для загрузки картинок
    function loadFiles() {
        let fileInput = document.querySelector("#file-input");
        let arrFile = [];
        let arrResult = [];
        let previewList = document.querySelector(".step-6 .load__image-preview");
        let previewListItems;

        function addFiles(files) {
            if (!errorMessage.classList.contains("hide")) {
                errorMessage.classList.add("hide");
            }
            for (let i = 0; i < files.length; i++) {
                var reader = new FileReader();
                reader.readAsDataURL(files[i], "UTF-8");
                if (files[i].size / 1024 / 1024 < 10) {
                    reader.onload = function (event) {
                        var result = event.target.result;
                        if (arrFile.indexOf(result) == -1) {
                            arrResult.push(files);
                            arrFile.push(result);
                            createPreview(result);
                        }
                    };
                } else {
                    if (files.length > 1) {
                        errorMessage.classList.remove("hide");
                        errorMessage.textContent = "Некоторые из загружаемых файлов превышают допустимый размер";
                    } else {
                        errorMessage.classList.remove("hide");
                        errorMessage.textContent = "Загружаемый файл превышает допустимый размер";
                    }
                }
            }
            // loadImageInput.value = "";
        }

        function createPreview(result) {
            setTimeout(() => {
                let previewItem = `<div class="preview__item" data-value="">
                  <div class="inner">
                     <img src="${result}" alt="image">
                     <p class="preview__item-del"></p>
                  </div>
               </div>`;

                previewList.insertAdjacentHTML("beforeend", previewItem);

                previewListItems = document.querySelectorAll(".step-6 .load__image-preview .preview__item");
                previewListItems.forEach((item, index) => {
                    item.setAttribute("data-value", index);
                });
            }, 10);
        }

        fileInput.onchange = function (e) {
            let files = this.files;
            addFiles(files);
        };

        // function dragAccept(e) {
        //     stop(e);
        //     addFiles(e.dataTransfer.files);
        //     document.querySelector(".load__image").classList.remove("dragover");
        // }

        // function init() {
        //     var dd = document.getElementById("dragdrop");
        //     dd.ondragover = stop;
        //     dd.ondragleave = stop;
        //     // if ("FileReader" in window) {
        //     //     document.ondrop = dragAccept;
        //     // }
        // }

        function stop(e) {
            e.stopPropagation();
            e.preventDefault();
            document.querySelector(".load__image").classList.add("dragover");
        }

        // удаление загруженного файла
        function deleteFile() {
            let loadImagePreview = document.querySelector(".step-6 .load__image-preview");
            loadImagePreview.addEventListener("click", (event) => {
                let target = event.target;
                if (target.classList.contains("preview__item-del")) {
                    target.closest(".preview__item").remove();

                    let itemIndex = target.closest(".preview__item").getAttribute("data-value");

                    arrFile.forEach((elemArr, index) => {
                        if (index == itemIndex) {
                            arrFile.splice(index, 1);
                        }
                    });

                    setTimeout(() => {
                        let previewListItems = document.querySelectorAll(".step-6 .load__image-preview .preview__item");
                        previewListItems.forEach((item, index) => {
                            item.setAttribute("data-value", index);
                        });
                    }, 10);
                }
            });
        }
        deleteFile();

        // window.addEventListener("load", init);
    }
    loadFiles();

    // перемещение картинок
    function dragOverPreviewImage() {
        let tasksListElement = step6.querySelector(`.load__image-preview`);
        let taskElements = tasksListElement.getElementsByClassName(`preview__item`);

        for (const task of taskElements) {
            task.draggable = true;
        }

        tasksListElement.addEventListener(`dragstart`, (evt) => {
            evt.target.closest(".preview__item").classList.add(`selected`);
        });

        tasksListElement.addEventListener(`dragend`, (evt) => {
            evt.target.closest(".preview__item").classList.remove(`selected`);
        });

        tasksListElement.addEventListener(`dragover`, (evt) => {
            evt.preventDefault();

            const activeElement = tasksListElement.querySelector(`.selected`);
            const currentElement = evt.target.closest(".preview__item");
            let isMoveable;
            if (activeElement !== currentElement) {
                isMoveable = true;
            }

            if (!isMoveable) {
                return;
            }

            let nextElement;
            if (currentElement != null) {
                if (currentElement === activeElement.nextElementSibling) {
                    nextElement = currentElement.nextElementSibling;
                } else {
                    nextElement = currentElement;
                }
            }

            tasksListElement.insertBefore(activeElement, nextElement);
        });

        const getNextElement = (cursorPosition, currentElement) => {
            const currentElementCoord = currentElement.getBoundingClientRect();
            const currentElementCenter = currentElementCoord.y + currentElementCoord.height / 2;

            const nextElement = cursorPosition < currentElementCenter ? currentElement : currentElement.nextElementSibling;

            return nextElement;
        };

        tasksListElement.addEventListener(`dragover`, (evt) => {
            evt.preventDefault();

            const activeElement = tasksListElement.querySelector(`.selected`);
            const currentElement = evt.target;
            const isMoveable = activeElement !== currentElement && currentElement.classList.contains(`preview__item`);

            if (!isMoveable) {
                return;
            }

            const nextElement = getNextElement(evt.clientY, currentElement);

            if ((nextElement && activeElement === nextElement.previousElementSibling) || activeElement === nextElement) {
                return;
            }

            tasksListElement.insertBefore(activeElement, nextElement);
        });
    }
    dragOverPreviewImage();

    document.addEventListener("click", (event) => {
        let target = event.target;

        // функционал попапа с информацией о премиум вакансии
        function clickPopupDopinfo() {
            // открытие
            if (target == dopinfoBtn) {
                background.classList.add("active");
                popupDopinfo.classList.add("active");
                scrollY = window.scrollY;
                scrollTo(popupDopinfo, scrollY);
            }

            // закрытие
            if ((target == background && popupDopinfo.classList.contains("active")) || (target.closest(".close-popup") && target.closest(".popup__info-premium"))) {
                background.classList.remove("active");
                if (popupDopinfo.classList.contains("active")) {
                    popupDopinfo.classList.remove("active");
                    scrollTo(popupDopinfo, scrollY);
                }
            }
        }
        clickPopupDopinfo();

        // нажатие на кнопки поле ввода данных
        function clickBtn() {
            if (target.closest(".next") && target.closest(".step-6")) {
                ajaxUpdate(getAllData("draft-update"));
                clickBtnNext();
            }

            if (target.closest(".back") && target.closest(".step-6")) {
                clickBtnBack();
            }
        }
        clickBtn();
    });

    window.addEventListener("load", function load() {}, false);
});
