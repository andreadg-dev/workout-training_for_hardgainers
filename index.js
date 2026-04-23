(function ($) {
  const STORAGE_KEY = "hardgainers531_1rm_v1";
  const DEFAULTS = { squat: 100, deadlift: 50, bench: 100, press: 50 };

  function isMobileLike() {
    var ua = navigator.userAgent || "";
    return /Android|iPhone|iPad|iPod/i.test(ua);
  }

  function roundKg(x) {
    if (!isFinite(x)) return NaN;
    return Math.round(x * 2) / 2; // nearest 0.5kg
  }

  function fmtKg(x) {
    if (!isFinite(x)) return "—";
    var s = (Math.round(x * 2) / 2).toFixed(1);
    return s.replace(/\.0$/, "") + " kg";
  }

  function liftKeyFromName(mainLift) {
    var s = (mainLift || "").toLowerCase();
    if (s.indexOf("squat") >= 0) return "squat";
    if (s.indexOf("deadlift") >= 0) return "deadlift";
    if (s.indexOf("bench") >= 0) return "bench";
    return "press";
  }

  function loadState() {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return $.extend({}, DEFAULTS);
    try {
      return $.extend({}, DEFAULTS, JSON.parse(raw));
    } catch (e) {
      return $.extend({}, DEFAULTS);
    }
  }

  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function calcTM(oneRM) {
    return roundKg(oneRM * 0.85);
  }

  function calcWeightFromTM(tm, pct) {
    return roundKg(tm * (pct / 100));
  }

  function updateTMDisplay(state) {
    $("#tmSquat").text(fmtKg(calcTM(state.squat)));
    $("#tmBench").text(fmtKg(calcTM(state.bench)));
    $("#tmDeadlift").text(fmtKg(calcTM(state.deadlift)));
    $("#tmPress").text(fmtKg(calcTM(state.press)));
  }

  function setInputsFromState(state) {
    $("#inSquat").val(state.squat);
    $("#inBench").val(state.bench);
    $("#inDeadlift").val(state.deadlift);
    $("#inPress").val(state.press);
  }

  function getStateFromInputs() {
    return {
      squat: parseFloat($("#inSquat").val()),
      bench: parseFloat($("#inBench").val()),
      deadlift: parseFloat($("#inDeadlift").val()),
      press: parseFloat($("#inPress").val()),
    };
  }

  function renderProgram() {
    var $root = $("#program");
    $root.empty();

    $root.append(
      $("<div/>")
        .addClass("small muted")
        .html(
          'Source: <a href="' +
            PROGRAM.source +
            '" target="_blank" rel="noopener">jimwendler.com</a>',
        ),
    );

    var $notes = $("<div/>").addClass("note");
    var $ul = $("<ul/>").css({ margin: "8px 0 0 18px", padding: 0 });

    $.each(PROGRAM.notes, function (_, n) {
      $ul.append($("<li/>").text(n));
    });
    $notes.append($ul);
    $root.append($notes);

    $.each(PROGRAM.weeks, function (_, wk) {
      var $wk = $("<div/>")
        .addClass("week")
        .attr("data-week", wk.week)
        .css({ marginTop: "14px" });

      // Week pill (clickable)
      var $pill = $(
        '<div class="pill week-pill" style="margin-top: 10px;">Week <b>' +
          wk.week +
          "</b></div>",
      );
      // Default: collapsed (days hidden). We'll leave it closed (no is-open).
      $wk.append($pill);

      // Container for days (toggle this)
      var $daysWrap = $("<div/>").addClass("week-days");
      $.each(wk.days, function (_, day) {
        var $day = $("<div/>").addClass("day");
        var $head = $("<div/>").addClass("head");
        $head.append($("<div/>").addClass("title").text(day.day));
        $head.append(
          $("<div/>")
            .addClass("badge")
            .text("Main Lift: " + day.main_lift),
        );
        $day.append($head);

        var $body = $("<div/>").addClass("body");
        $body.append(
          $("<div/>")
            .addClass("k")
            .text("Warm-Up: " + day.warm_up.join(" • ")),
        );

        var $sets = $("<div/>")
          .addClass("sets")
          .attr("data-main-lift", day.main_lift)
          .css({ marginTop: "10px" });
        $body.append(
          $("<div/>")
            .css({
              marginTop: "10px",
              fontWeight: 700,
              fontSize: "12px",
              letterSpacing: ".25px",
            })
            .text("Main Lift Work"),
        );

        $.each(day.sets, function (_, st) {
          var $line = $("<div/>")
            .addClass("setline")
            .attr("data-percent", st.percent_tm);

          var leftText = st.percent_tm + "% x " + st.reps;
          if (st.sets && st.sets > 1) {
            leftText =
              st.sets + " sets of " + st.reps + " @ " + st.percent_tm + "%";
          }

          var $lhs = $("<div/>").addClass("lhs");
          $lhs.append($("<span/>").addClass("tag").text(st.type));
          $lhs.append($("<span/>").text(leftText));
          if (st.notes) {
            $lhs.append(
              $("<span/>")
                .addClass("muted small")
                .text("— " + st.notes),
            );
          }

          var $rhs = $("<div/>")
            .addClass("rhs")
            .html('<span class="mono js-weight">—</span>');
          $line.append($lhs).append($rhs);

          $sets.append($line);
        });

        $body.append($sets);

        var $as = $("<div/>").css({ marginTop: "10px" });
        $as.append(
          $("<div/>")
            .css({
              fontWeight: 700,
              fontSize: "12px",
              letterSpacing: ".25px",
            })
            .text("Assistance"),
        );
        var $asul = $("<ul/>").css({
          margin: "6px 0 0 18px",
          padding: 0,
        });
        $.each(day.assistance, function (_, a) {
          $asul.append($("<li/>").addClass("small muted").text(a));
        });
        $as.append($asul);
        $body.append($as);

        $day.append($body);
        $daysWrap.append($day);
      });

      $wk.append($daysWrap);
      $root.append($wk);
    });
  }

  function updateAllWeights(state) {
    var tm = {
      squat: calcTM(state.squat),
      bench: calcTM(state.bench),
      deadlift: calcTM(state.deadlift),
      press: calcTM(state.press),
    };

    $(".sets").each(function () {
      var $sets = $(this);
      var key = liftKeyFromName($sets.data("main-lift"));
      var tmVal = tm[key];

      $sets.find(".setline").each(function () {
        var $line = $(this);
        var pct = parseFloat($line.data("percent"));
        var w = calcWeightFromTM(tmVal, pct);
        $line.find(".js-weight").text(fmtKg(w));
      });
    });
  }

  function wireInputs() {
    $("#inSquat,#inBench,#inDeadlift,#inPress").on("input change", function () {
      var state = getStateFromInputs();
      saveState(state);
      updateTMDisplay(state);
      updateAllWeights(state);
    });

    $("#btnResetDefaults").on("click", function () {
      var state = $.extend({}, DEFAULTS);
      saveState(state);
      setInputsFromState(state);
      updateTMDisplay(state);
      updateAllWeights(state);
    });

    $("#btnClearStorage").on("click", function () {
      localStorage.removeItem(STORAGE_KEY);
      var state = $.extend({}, DEFAULTS);
      setInputsFromState(state);
      updateTMDisplay(state);
      updateAllWeights(state);
    });
  }

  // NEW: week pill toggle (default collapsed)
  function wireWeekToggle() {
    $("#program").on("click", ".week-pill", function () {
      var $pill = $(this);
      var $week = $pill.closest(".week");
      var $days = $week.find(".week-days").first();

      $pill.toggleClass("is-open");
      $days.stop(true, true).slideToggle(180);
    });

    // Ensure all collapsed by default (in case of SSR differences)
    $(".week-days").hide();
    $(".week-pill").removeClass("is-open");
  }

  function setupAntiRefreshMitigations() {
    if (isMobileLike()) {
      $("#mobileNote").show();
    }

    $(window).on("pageshow", function () {
      var state = loadState();
      setInputsFromState(state);
      updateTMDisplay(state);
      updateAllWeights(state);
    });

    var wakeLock = null;
    function requestWakeLock() {
      if (!("wakeLock" in navigator)) return;
      navigator.wakeLock
        .request("screen")
        .then(function (lock) {
          wakeLock = lock;
        })
        .catch(function () {});
    }
    $(document).one("click keydown touchstart", function () {
      requestWakeLock();
    });
    $(document).on("visibilitychange", function () {
      if (document.visibilityState === "visible" && wakeLock === null) {
        requestWakeLock();
      }
    });
  }

  function showDayWorkout() {
    $("#program").on("click", ".day .head", function () {
      const dayHeader = $(this);
      dayHeader.next().slideToggle();
    });
  }

  $(function () {
    renderProgram();

    var state = loadState();
    //console.log(state);
    setInputsFromState(state);
    updateTMDisplay(state);
    updateAllWeights(state);

    wireInputs();
    wireWeekToggle();
    setupAntiRefreshMitigations();
    showDayWorkout();
  });
})(jQuery);
