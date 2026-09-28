/*
=========================================================
CIRA CLUB — Shared Issue Road Map
File: cira-roadmap.js
Version: 1.2
Status: PILOT SHARED COMPONENT
Date: 2026-09-28

Purpose:
One shared Road Map renderer for all CIRA CLUB Issue pages.

v1.2:
- NEWS-001 canonical URL registry synchronized.
- STOP 3 default route corrected to /ciraclub/NEWS-001-AD10-BBU/.
- Fluency page canonical route recorded as /ciraclub/CIRA-NEWS-001-AD20-Fluency/.
- Shared component remains the single Road Map source for all NEWS-001 pages.

Usage:
<div
  id="cira-roadmap-root"
  data-cira-roadmap
  data-cira-issue="NEWS-001"
  data-cira-active-stop="3"
></div>

<script
  src="https://destinos-vk.github.io/cira-roadmap.js?v=1.2"
  defer
></script>

IMPORTANT:
- Internal methodological STOP order is fixed.
- Public links are enabled only when a real page exists.
- No dead links are generated.
=========================================================
*/

(function () {
  "use strict";

  const COMPONENT_VERSION = "1.2";

  const STOP_DEFINITIONS = [
    { id: 1, label: "Listen" },
    { id: 2, label: "Language" },
    { id: 3, label: "Fluency Training" },
    { id: 4, label: "Pattern Drills" },
    { id: 5, label: "Recombination" },
    { id: 6, label: "Conversation Stimulus" }
  ];

  /*
   * Issue-specific public routes.
   *
   * Add a URL only when the page really exists.
   * Null means: visible in the numbered pilot Road Map,
   * but not clickable.
   */
  const ISSUE_ROUTES = {
    "NEWS-001": {
      1: "/ciraclub/cira-club-homepage/",
      2: "/ciraclub/CIRA-NEWS-001-Vocabulary/",
      3: "/ciraclub/NEWS-001-AD10-BBU/",
      4: null,
      5: null,
      6: null
    }
  };

  /*
   * Canonical NEWS-001 page registry.
   * The Road Map uses only the default route of each STOP.
   * Local selectors use the specific function routes below.
   */
  const PAGE_ROUTES = {
    "NEWS-001": {
      listen: "/ciraclub/cira-club-homepage/",
      vocabulary: "/ciraclub/CIRA-NEWS-001-Vocabulary/",
      grammar: "/ciraclub/CIRA-NEWS-001-GRAMMA/",
      bbu: "/ciraclub/NEWS-001-AD10-BBU/",
      fluency: "/ciraclub/CIRA-NEWS-001-AD20-Fluency/"
    }
  };

  function injectStyles() {
    if (document.getElementById("cira-roadmap-component-styles")) {
      return;
    }

    const style = document.createElement("style");

    style.id = "cira-roadmap-component-styles";

    style.textContent = `
      .cira-roadmap--shared .cira-roadmap__inner {
        max-width: var(--cira-content-max, 1180px);
        overflow-x: auto;
        scrollbar-width: thin;
      }

      .cira-roadmap--shared .cira-roadmap__track {
        min-width: 920px;
        grid-template-columns: repeat(6, minmax(130px, 1fr));
      }

      .cira-roadmap--shared .cira-roadmap__track::before {
        left: 8.333%;
        right: 8.333%;
      }

      .cira-roadmap--shared .cira-stop {
        text-decoration: none;
      }

      .cira-roadmap--shared .cira-stop__label {
        font-size: 14px;
        line-height: 1.25;
      }

      .cira-roadmap--shared .cira-stop--link:hover .cira-stop__circle,
      .cira-roadmap--shared .cira-stop--link:focus-visible .cira-stop__circle {
        border-color: var(--cira-primary, #38475a);
      }

      .cira-roadmap--shared .cira-stop--link:focus-visible {
        outline: 3px solid var(--cira-focus, #5e83a6);
        outline-offset: 5px;
        border-radius: 12px;
      }

      .cira-roadmap--shared .cira-stop.is-pending {
        opacity: 0.66;
      }

      @media (max-width: 767px) {
        .cira-roadmap--shared .cira-roadmap__inner {
          padding-left: 16px;
          padding-right: 16px;
        }

        .cira-roadmap--shared .cira-roadmap__track {
          min-width: 850px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function createStop(stop, activeStop, routes) {
    const isActive = stop.id === activeStop;
    const href = routes ? routes[stop.id] : null;

    let node;

    if (href && !isActive) {
      node = document.createElement("a");
      node.href = href;
      node.className = "cira-stop cira-stop--link";
    } else {
      node = document.createElement("div");
      node.className = "cira-stop";

      if (!isActive && !href) {
        node.classList.add("is-pending");
      }
    }

    if (isActive) {
      node.classList.add("is-active");
      node.setAttribute("aria-current", "step");
    }

    if (href && isActive) {
      node.dataset.href = href;
    }

    node.setAttribute(
      "aria-label",
      `STOP ${stop.id} — ${stop.label}`
    );

    const circle = document.createElement("span");
    circle.className = "cira-stop__circle";
    circle.textContent = String(stop.id);

    const label = document.createElement("span");
    label.className = "cira-stop__label";
    label.textContent = stop.label;

    node.appendChild(circle);
    node.appendChild(label);

    return node;
  }

  function renderRoadMap(root) {
    const issue =
      root.dataset.ciraIssue ||
      "NEWS-001";

    const activeStop =
      Number(root.dataset.ciraActiveStop || "1");

    const routes =
      ISSUE_ROUTES[issue] || {};

    const nav =
      document.createElement("nav");

    nav.className =
      "cira-roadmap cira-roadmap--shared";

    nav.setAttribute(
      "aria-label",
      `${issue} Road Map`
    );

    const inner =
      document.createElement("div");

    inner.className =
      "cira-roadmap__inner";

    const track =
      document.createElement("div");

    track.className =
      "cira-roadmap__track";

    STOP_DEFINITIONS.forEach(function (stop) {
      track.appendChild(
        createStop(
          stop,
          activeStop,
          routes
        )
      );
    });

    inner.appendChild(track);
    nav.appendChild(inner);

    root.replaceWith(nav);
  }

  function init() {
    injectStyles();

    document
      .querySelectorAll(
        "[data-cira-roadmap]"
      )
      .forEach(renderRoadMap);

    console.info(
      "CIRA shared Road Map v" +
      COMPONENT_VERSION
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      { once: true }
    );
  } else {
    init();
  }

})();
