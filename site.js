(function () {
    function mathReady() {
        return new Promise(function (resolve) {
            var tries = 0;
            (function tick() {
                var mj = window.MathJax;
                if (mj && mj.startup && mj.startup.promise) {
                    mj.startup.promise.then(resolve, resolve);
                    return;
                }
                if (tries++ > 80) {
                    resolve();
                    return;
                }
                setTimeout(tick, 100);
            })();
        });
    }

    window.printLecture = function () {
        document.body.classList.remove("print-problems");
        window.print();
    };

    window.printProblems = function () {
        document.body.classList.add("print-problems");
        window.print();
    };

    window.addEventListener("afterprint", function () {
        document.body.classList.remove("print-problems");
        document.body.classList.remove("print-all");
    });

    function buildLectureGuide() {
        if (!document.body.classList.contains("lecture")) return;
        var problem = document.querySelector(".problem-box");
        if (!problem || document.getElementById("page-guide")) return;
        if (!problem.id) problem.id = "sec-problem";

        var paper = document.querySelector(".paper-card");
        if (paper && !paper.id) paper.id = "sec-answer";

        var stops = [].slice.call(document.querySelectorAll("section[data-nav], section[data-q]"));
        stops.forEach(function (section, i) {
            if (!section.id) section.id = "sec-stop-" + i;
        });

        var guide = document.createElement("nav");
        guide.className = "guide";
        guide.id = "page-guide";
        guide.setAttribute("aria-label", "本页目录");

        var path = document.createElement("p");
        path.className = "path-note";
        path.textContent = "按原题顺序往下看。后一问接前一问的结论。";
        guide.appendChild(path);

        var jump = document.createElement("div");
        jump.className = "q-nav";

        function addLink(href, text, extraClass) {
            var link = document.createElement("a");
            link.href = href;
            if (extraClass) link.className = extraClass;
            link.textContent = text;
            jump.appendChild(link);
        }

        addLink("#" + problem.id, "原题");
        stops.forEach(function (section) {
            addLink(
                "#" + section.id,
                section.getAttribute("data-q") || section.getAttribute("data-nav") || "本节"
            );
        });
        if (paper) addLink("#" + paper.id, "标准解答", "is-answer");
        guide.appendChild(jump);
        problem.parentNode.insertBefore(guide, problem);

        var tools = document.querySelector(".bar-tools");
        if (tools && !tools.querySelector(".guide-jump")) {
            var back = document.createElement("a");
            back.className = "home-link guide-jump";
            back.href = "#page-guide";
            back.textContent = "本页目录";
            tools.insertBefore(back, tools.firstChild);
        }
    }

    function lecturePart(html) {
        var doc = new DOMParser().parseFromString(html, "text/html");
        var box = doc.querySelector(".container");
        if (!box) return "";
        [].slice.call(box.querySelectorAll("script, .interactive-panel")).forEach(function (node) {
            node.remove();
        });
        return "<article class=\"lecture-part\">" + box.innerHTML + "</article>";
    }

    function printAllLectures(button) {
        var label = button.textContent;
        var win = window.open("", "_blank");
        if (!win) return;
        button.disabled = true;
        button.textContent = "正在排好讲义…";
        var links = [].slice.call(document.querySelectorAll("nav.catalog a.topic"));
        Promise.all(links.map(function (link) {
            return fetch(link.getAttribute("href")).then(function (res) {
                if (!res.ok) throw new Error("missing");
                return res.text();
            });
        })).then(function (pages) {
            var css = new URL("site.css", location.href).href;
            var mj = new URL("vendor/tex-svg.js", location.href).href;
            var html = "<!DOCTYPE html><html lang=\"zh-CN\"><head><meta charset=\"UTF-8\"><title>记一数学 · 讲义</title>"
                + "<link rel=\"stylesheet\" href=\"" + css + "\">"
                + "<script>window.MathJax={tex:{inlineMath:[['\$','\$'],['\\\\(','\\\\)']],displayMath:[['\$\$','\$\$'],['\\\\[','\\\\]']]},svg:{fontCache:'global'},startup:{pageReady:function(){return MathJax.startup.defaultPageReady().then(function(){setTimeout(function(){window.focus();window.print();},400);});}}};<\/script>"
                + "<script src=\"" + mj + "\"><\/script></head><body class=\"lecture print-book\">"
                + pages.map(lecturePart).join("")
                + "</body></html>";
            var url = URL.createObjectURL(new Blob([html], { type: "text/html;charset=utf-8" }));
            win.location.href = url;
        }).then(function () {
            button.disabled = false;
            button.textContent = label;
        }, function () {
            button.disabled = false;
            button.textContent = label;
            win.close();
        });
    }

    function bind() {
        var all = document.getElementById("printAll");
        if (all) {
            all.addEventListener("click", function () {
                var label = all.textContent;
                all.disabled = true;
                all.textContent = "正在排版公式…";
                mathReady().then(function () {
                    document.body.classList.add("print-all");
                    window.print();
                }).then(function () {
                    all.disabled = false;
                    all.textContent = label;
                }, function () {
                    all.disabled = false;
                    all.textContent = label;
                });
            });
        }
        var lectures = document.getElementById("printLectures");
        if (lectures) {
            lectures.addEventListener("click", function () {
                printAllLectures(lectures);
            });
        }
    }

    function buildTopLink() {
        if (!document.body.classList.contains("lecture")) return;
        if (document.querySelector(".to-top")) return;
        var link = document.createElement("a");
        link.className = "to-top";
        link.href = "#page-guide";
        link.textContent = "返回顶部";
        document.body.appendChild(link);
        function onScroll() {
            link.classList.toggle("is-on", window.scrollY > 640);
        }
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
    }

    function syncAskSpace() {
        var bar = document.getElementById("nowAsking");
        if (!bar) return;
        document.documentElement.style.setProperty("--ask-space", bar.offsetHeight + "px");
    }

    function watchAskSpace() {
        if (!document.body.classList.contains("lecture")) return;
        var bar = document.getElementById("nowAsking");
        if (!bar) return;
        syncAskSpace();
        window.addEventListener("resize", syncAskSpace);
        if (window.ResizeObserver) new ResizeObserver(syncAskSpace).observe(bar);
        var mj = window.MathJax;
        if (mj && mj.startup && mj.startup.promise) mj.startup.promise.then(syncAskSpace, syncAskSpace);
    }

    function start() {
        bind();
        buildLectureGuide();
        buildTopLink();
        watchAskSpace();
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
    else start();
})();
