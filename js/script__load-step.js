// загрузка последнего шага при перезагрузке
import { writeCookie, readCookie, deleteCookie } from "./script__work-cookie.js";

document.addEventListener("DOMContentLoaded", () => {
    let sections = document.querySelectorAll(".left__content .section-step");
    let steps = document.querySelectorAll(".right__content .step__value");

    if (readCookie("step-now(new__vacancy)") != undefined) {
        steps.forEach((step) => {
            if (step.getAttribute("data-value") < readCookie("step-now(new__vacancy)")) {
                step.classList.add("done");
            }
            if (step.getAttribute("data-value") == readCookie("step-now(new__vacancy)")) {
                steps.forEach((step) => {
                    step.classList.remove("now");
                });
                step.classList.add("now");
            }
        });

        sections.forEach((section) => {
            if (section.getAttribute("data-value") == readCookie("step-now(new__vacancy)")) {
                sections.forEach((section) => {
                    section.classList.add("hide");
                });
                section.classList.remove("hide");
            }
        });
    }
});
