/* Automation Map, network mode: browser-side rules engine + chained-DAG
   renderer. Layout by dagre, motion by anime.js v4, both vendored.
   No backend. State lives in the URL hash: #id,id,id@industry.
   Emits PostHog events in production builds (window.posthog set by the
   analytics partial); degrades to no tracking everywhere else. */
(function () {
  "use strict";

  var DATA = JSON.parse(document.getElementById("map-data").textContent);
  var SYSTEMS = {};
  DATA.systems.forEach(function (s) { if (!s.build) SYSTEMS[s.id] = s; });
  var RECIPES = DATA.recipes;
  var ROLE_LABELS = DATA.roleLabels || {};
  var INDUSTRIES = {};
  (DATA.industries || []).forEach(function (i) { INDUSTRIES[i.id] = i; });

  var SYS_W = 176, SYS_H = 46, REC_W = 230, REC_H = 92;
  var selected = [];
  var industry = "";
  var prevKeys = {};          // node/edge keys from last render (for diffing)
  var prevRects = {};         // node key -> {x,y} for FLIP glides
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function narrow() { return window.matchMedia("(max-width: 860px)").matches; }

  var el = {};
  ["chipbar", "industry", "empty", "canvas", "wires", "locked", "locked-row",
   "ticker", "stamp", "tb-systems", "tb-pipelines", "tb-hours", "callout",
   "share-mail", "share-print", "radial"].forEach(function (id) {
    el[id.replace(/-(\w)/g, function (_, c) { return c.toUpperCase(); })] = document.getElementById(id);
  });
  el.chips = document.querySelectorAll(".map-chip");

  /* ================= matching ================= */

  function rolesOf(ids) {
    var roles = {};
    ids.forEach(function (id) {
      (SYSTEMS[id] ? SYSTEMS[id].roles || [] : []).forEach(function (r) {
        (roles[r] = roles[r] || []).push(id);
      });
    });
    return roles;
  }

  // all selected systems satisfying a role group, minus excluded ids
  function groupSystems(group, roles, exclude) {
    var out = [], seen = {};
    group.forEach(function (role) {
      (roles[role] || []).forEach(function (id) {
        if (!seen[id] && !(exclude && exclude[id])) { seen[id] = true; out.push(id); }
      });
    });
    return out;
  }

  function evaluate() {
    var roles = rolesOf(selected);
    var live = [], ghosts = [];
    RECIPES.forEach(function (r) {
      var srcIds = [], missing = [], used = {};
      r.src.forEach(function (group) {
        var hits = groupSystems(group, roles, null).slice(0, 3);
        if (hits.length) { hits.forEach(function (id) { used[id] = true; }); srcIds = srcIds.concat(hits); }
        else missing.push(group);
      });
      var dstIds = [];
      r.dst.forEach(function (group) {
        var hits = groupSystems(group, roles, used).slice(0, 2); // a system never feeds itself
        if (hits.length) dstIds = dstIds.concat(hits);
        else missing.push(group);
      });
      if (!missing.length) live.push({ recipe: r, src: srcIds, dst: dstIds });
      else if (missing.length === 1 && (srcIds.length || dstIds.length))
        ghosts.push({ recipe: r, src: srcIds, dst: dstIds, missing: missing[0] });
    });
    var prio = industry && INDUSTRIES[industry] ? INDUSTRIES[industry].priority : [];
    function rank(p) {
      var i = prio.indexOf(p.recipe.id);
      return i === -1 ? 1000 - p.recipe.hours : i;
    }
    live.sort(function (a, b) { return rank(a) - rank(b); });
    ghosts.sort(function (a, b) { return rank(a) - rank(b); });
    return { live: live, ghosts: ghosts }; // display caps ghosts; radial wants all
  }

  /* ================= graph + layout ================= */

  function buildGraph(live) {
    var g = new dagre.graphlib.Graph();
    g.setGraph({ rankdir: narrow() ? "TB" : "LR", nodesep: 16, ranksep: narrow() ? 46 : 74, marginx: 6, marginy: 6 });
    g.setDefaultEdgeLabel(function () { return {}; });
    live.forEach(function (p) {
      g.setNode("r:" + p.recipe.id, { width: REC_W, height: REC_H, pipe: p });
      p.src.concat(p.dst).forEach(function (id) {
        if (!g.hasNode("s:" + id)) g.setNode("s:" + id, { width: SYS_W, height: SYS_H, system: id });
      });
      p.src.forEach(function (id) { g.setEdge("s:" + id, "r:" + p.recipe.id); });
      p.dst.forEach(function (id) { g.setEdge("r:" + p.recipe.id, "s:" + id); });
    });
    dagre.layout(g);
    return g;
  }

  function sysNodeHTML(id) {
    var s = SYSTEMS[id];
    var icon = s.logo ? '<img src="' + s.logo + '" alt="">' : '<span class="sys-dot" style="background:' + (s.dot || "#999") + '"></span>';
    var role = (s.roles || [])[0] || "";
    var sub = (ROLE_LABELS[role] || role).replace(/\s*\(.*\)/, "");
    return icon + "<span>" + s.name.toUpperCase() + "<small>" + sub.toUpperCase() + "</small></span>";
  }

  /* ================= render ================= */

  function render() {
    closeRadial();
    var res = evaluate();
    var live = res.live, ghosts = res.ghosts.slice(0, 4);
    var any = selected.length > 0;
    el.empty.hidden = any;
    el.canvas.hidden = !any || !live.length;
    el.locked.hidden = !ghosts.length;
    el.callout.hidden = true;

    // ----- snapshot old positions for FLIP -----
    var oldRects = prevRects; prevRects = {};
    el.canvas.querySelectorAll(".node").forEach(function (n) { n.remove(); });

    var newKeys = {}, appeared = [], moved = [];
    if (live.length) {
      var g = buildGraph(live);
      var gw = g.graph().width, gh = g.graph().height;
      var avail = document.getElementById("canvas-scroll").clientWidth - 4;
      // fit when reasonable; below 0.6 stop shrinking and let it scroll,
      // so text never becomes unreadable but modest maps still fit at a glance
      var fit = avail / gw;
      var scale = fit >= 0.6 ? Math.min(1, fit) : 0.6;
      el.canvas.style.height = (gh * scale) + "px";
      el.canvas.style.width = gw + "px";
      el.canvas.style.transform = "scale(" + scale + ")";
      document.getElementById("canvas-scroll").style.width = "100%";

      el.wires.setAttribute("viewBox", "0 0 " + gw + " " + gh);
      el.wires.setAttribute("width", gw); el.wires.setAttribute("height", gh);
      el.wires.innerHTML = "";

      g.nodes().forEach(function (key) {
        var nd = g.node(key);
        var div = document.createElement("div");
        div.className = "node " + (nd.pipe ? "logic" : "sys");
        div.style.left = (nd.x - nd.width / 2) + "px";
        div.style.top = (nd.y - nd.height / 2) + "px";
        div.style.width = nd.width + "px";
        div.style.height = nd.height + "px";
        if (nd.pipe) {
          div.dataset.recipe = nd.pipe.recipe.id;
          div.innerHTML = "<span>" + nd.pipe.recipe.name.toUpperCase() + "</span>" +
            "<small>" + nd.pipe.recipe.blurb.toUpperCase() + "</small>" +
            '<small class="hours">EST. ' + nd.pipe.recipe.hours + " HRS/WK RECLAIMED</small>";
          bindPipe(div, nd.pipe);
        } else {
          div.dataset.system = nd.system;
          div.innerHTML = sysNodeHTML(nd.system);
          bindSys(div, nd.system);
        }
        el.canvas.appendChild(div);
        newKeys[key] = true;
        prevRects[key] = { x: nd.x, y: nd.y };
        if (!prevKeys[key]) appeared.push(div);
        else if (oldRects[key] && (oldRects[key].x !== nd.x || oldRects[key].y !== nd.y))
          moved.push({ eln: div, dx: oldRects[key].x - nd.x, dy: oldRects[key].y - nd.y });
      });

      var newWires = [];
      g.edges().forEach(function (e) {
        var a = g.node(e.v), b = g.node(e.w);
        var key = "e:" + e.v + ">" + e.w;
        newKeys[key] = true;
        var p = document.createElementNS("http://www.w3.org/2000/svg", "path");
        // route through dagre's computed points (respects layers, avoids nodes),
        // smoothed with quadratics through midpoints
        var pts = g.edge(e).points || [];
        var vert = g.graph().rankdir === "TB";
        var start = vert ? { x: a.x, y: a.y + a.height / 2 } : { x: a.x + a.width / 2, y: a.y };
        var end = vert ? { x: b.x, y: b.y - b.height / 2 } : { x: b.x - b.width / 2, y: b.y };
        var route = [start].concat(pts.slice(1, -1), [end]);
        var d = "M " + route[0].x + " " + route[0].y;
        if (route.length === 2) {
          var mx = (route[0].x + route[1].x) / 2, my = (route[0].y + route[1].y) / 2;
          d += vert
            ? " C " + route[0].x + " " + my + ", " + route[1].x + " " + my + ", " + route[1].x + " " + route[1].y
            : " C " + mx + " " + route[0].y + ", " + mx + " " + route[1].y + ", " + route[1].x + " " + route[1].y;
        } else {
          for (var i = 1; i < route.length - 1; i++) {
            var midx = (route[i].x + route[i + 1].x) / 2, midy = (route[i].y + route[i + 1].y) / 2;
            d += " Q " + route[i].x + " " + route[i].y + ", " + midx + " " + midy;
          }
          d += " L " + route[route.length - 1].x + " " + route[route.length - 1].y;
        }
        p.setAttribute("d", d);
        p.setAttribute("class", "wire");
        p.dataset.recipe = (g.node(e.v).pipe || g.node(e.w).pipe).recipe.id;
        el.wires.appendChild(p);
        if (!prevKeys[key]) newWires.push(p);
      });

      // ----- motion -----
      if (!reduceMotion && window.anime) {
        if (appeared.length) anime.animate(appeared, {
          opacity: [0, 1], translateY: [10, 0], scale: [0.95, 1],
          delay: anime.stagger(70, { start: 60 }), duration: 420, ease: "outBack(1.4)"
        });
        if (moved.length) moved.forEach(function (m) {
          anime.animate(m.eln, { translateX: [m.dx, 0], translateY: [m.dy, 0], duration: 420, ease: "inOutQuad" });
        });
        if (newWires.length) {
          var drawables = anime.svg.createDrawable(newWires);
          anime.animate(drawables, { draw: "0 1", delay: anime.stagger(90, { start: 140 }), duration: 520, ease: "inOutQuad" });
        }
      }
    }

    // ----- ghosts (locked strip) -----
    el.lockedRow.innerHTML = "";
    ghosts.forEach(function (gh) {
      var label = ROLE_LABELS[gh.missing[0]] || gh.missing[0];
      var n = document.createElement("button");
      n.type = "button";
      n.className = "node ghost";
      n.innerHTML = '<span class="plus">+</span><span>ADD ' + label.toUpperCase() +
        "<small>UNLOCKS: " + gh.recipe.name.toUpperCase() + "</small></span>";
      n.addEventListener("click", function (ev) { openRadial(n, ghostItems(gh), ev); });
      el.lockedRow.appendChild(n);
    });

    // ----- ticker / titleblock / stamp -----
    var hours = live.reduce(function (a, p) { return a + p.recipe.hours; }, 0);
    el.ticker.hidden = !any;
    if (any) {
      var t = "▸ " + (live.length ? "~" + hours + " HRS/WEEK OF MANUAL WORK RECLAIMED" : "NO PIPELINE YET");
      if (ghosts.length) t += " · " + ghosts.length + " MORE ONE SYSTEM AWAY";
      el.ticker.textContent = t;
    }
    el.tbSystems.textContent = selected.length + " SELECTED";
    el.tbPipelines.textContent = any ? (live.length + " FOUND" + (ghosts.length ? " · " + ghosts.length + " LOCKED" : "")) : "AWAITING INPUT";
    el.tbHours.textContent = live.length ? "~" + hours + " HRS/WK" : "·";

    var newPipes = live.filter(function (p) { return !prevKeys["r:" + p.recipe.id]; }).length;
    if (newPipes && live.length >= 2) stamp(live.length + " PIPELINES FOUND");

    prevKeys = newKeys;
    updateShare();
  }

  /* ================= node interactions ================= */

  function bindPipe(div, p) {
    div.addEventListener("click", function () { showCallout(p); highlight(p); });
    div.addEventListener("mouseenter", function () { highlight(p); });
    div.addEventListener("mouseleave", function () { highlight(null); });
  }

  function bindSys(div, id) {
    div.addEventListener("click", function (ev) { openRadial(div, sysItems(id), ev); });
  }

  function highlight(p) {
    el.canvas.querySelectorAll(".node").forEach(function (n) {
      n.classList.toggle("dim", !!p && n.dataset.recipe !== p.recipe.id &&
        !(n.dataset.system && (p.src.indexOf(n.dataset.system) !== -1 || p.dst.indexOf(n.dataset.system) !== -1)));
      n.classList.toggle("lit", !!p && n.dataset.recipe === p.recipe.id);
    });
    el.wires.querySelectorAll(".wire").forEach(function (w) {
      w.classList.toggle("hot", !!p && w.dataset.recipe === p.recipe.id);
      w.classList.toggle("faint", !!p && w.dataset.recipe !== p.recipe.id);
    });
  }

  function showCallout(p) {
    el.callout.hidden = false;
    el.callout.innerHTML =
      "<div><h3>" + p.recipe.name + "</h3><p>" + p.recipe.blurb + ".</p></div>" +
      '<span class="spec-kv">RECLAIMS<strong>~' + p.recipe.hours + " hrs/wk</strong></span>" +
      '<span class="spec-kv">BUILD<strong>' + p.recipe.effort + "</strong></span>" +
      '<span class="spec-kv">GO/NO-GO GATE<strong>' + p.recipe.gate + "</strong></span>";
    if (!reduceMotion && window.anime) anime.animate(el.callout, { opacity: [0, 1], translateY: [6, 0], duration: 250, ease: "outQuad" });
  }

  /* ----- radial grow menu ----- */

  function suggestFor(group, cap) {
    // unselected systems carrying any role in the group, logo-first
    var out = [];
    Object.keys(SYSTEMS).forEach(function (id) {
      if (selected.indexOf(id) !== -1) return;
      if ((SYSTEMS[id].roles || []).some(function (r) { return group.indexOf(r) !== -1; })) out.push(id);
    });
    out.sort(function (a, b) { return (SYSTEMS[b].logo ? 1 : 0) - (SYSTEMS[a].logo ? 1 : 0); });
    return out.slice(0, cap);
  }

  function ghostItems(gh) {
    return suggestFor(gh.missing, 5).map(function (id) {
      return { add: id, label: SYSTEMS[id].name, sub: "UNLOCKS " + gh.recipe.name.toUpperCase() };
    });
  }

  function sysItems(id) {
    var res = evaluate();
    var items = [];
    var seen = {};
    // 1) one-away unlocks where this system already participates
    res.ghosts.forEach(function (gh) {
      if (gh.src.indexOf(id) === -1 && gh.dst.indexOf(id) === -1) return;
      suggestFor(gh.missing, 2).forEach(function (sid) {
        if (seen[sid]) return; seen[sid] = true;
        items.push({ add: sid, label: SYSTEMS[sid].name, sub: "UNLOCKS " + gh.recipe.name.toUpperCase() });
      });
    });
    // 2) pairing suggestions: recipes further away that this system could anchor
    if (items.length < 4) {
      var myRoles = SYSTEMS[id].roles || [];
      var liveIds = {};
      res.live.forEach(function (p) { liveIds[p.recipe.id] = true; });
      var ghostIds = {};
      res.ghosts.forEach(function (gh) { ghostIds[gh.recipe.id] = true; });
      RECIPES.forEach(function (r) {
        if (items.length >= 5 || liveIds[r.id] || ghostIds[r.id]) return;
        var groups = r.src.concat(r.dst);
        var anchors = groups.some(function (gr) {
          return gr.some(function (role) { return myRoles.indexOf(role) !== -1; });
        });
        if (!anchors) return;
        for (var gi = 0; gi < groups.length; gi++) {
          var covered = groups[gi].some(function (role) { return myRoles.indexOf(role) !== -1; });
          if (covered) continue;
          var sug = suggestFor(groups[gi], 1)[0];
          if (sug && !seen[sug]) {
            seen[sug] = true;
            items.push({ add: sug, label: SYSTEMS[sug].name, sub: "TOWARD " + r.name.toUpperCase() });
            break;
          }
        }
      });
    }
    items = items.slice(0, 6);
    items.push({ remove: id, label: "Remove", sub: SYSTEMS[id].name.toUpperCase() });
    return items;
  }

  function openRadial(anchor, items, ev) {
    if (ev) ev.stopPropagation();
    closeRadial();
    if (!items.length) return;
    el.radial.hidden = false;
    el.radial.innerHTML = "";
    var sheet = document.getElementById("sheet");
    var sr = sheet.getBoundingClientRect(), ar = anchor.getBoundingClientRect();
    var cx = ar.left + ar.width / 2 - sr.left, cy = ar.top + ar.height / 2 - sr.top;

    if (narrow()) { el.radial.classList.add("as-sheet"); }
    else {
      el.radial.classList.remove("as-sheet");
      el.radial.style.left = cx + "px";
      el.radial.style.top = cy + "px";
    }
    // hug the clicked node: ring radius follows its rendered size
    var R = Math.max(58, Math.min(86, ar.width * 0.45 + 18)), n = items.length;
    var btns = items.map(function (it, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "ritem" + (it.remove ? " danger" : "");
      var icon = it.add && SYSTEMS[it.add].logo ? '<img src="' + SYSTEMS[it.add].logo + '" alt="">' : "";
      b.innerHTML = icon + "<span>" + (it.remove ? "✕ " : "+ ") + it.label.toUpperCase() + "<small>" + it.sub + "</small></span>";
      if (!narrow()) {
        var ang = -Math.PI / 2 + (i * 2 * Math.PI / Math.max(n, 3));
        b.style.left = Math.round(Math.cos(ang) * R) + "px";
        b.style.top = Math.round(Math.sin(ang) * R) + "px";
      }
      b.addEventListener("click", function (e2) {
        e2.stopPropagation();
        if (it.add) toggle(it.add, true);
        else if (it.remove) toggle(it.remove, false);
      });
      el.radial.appendChild(b);
      return b;
    });
    if (!reduceMotion && window.anime) {
      anime.animate(btns, { opacity: [0, 1], scale: [0.6, 1], delay: anime.stagger(40), duration: 260, ease: "outBack(1.6)" });
    }
  }

  function closeRadial() { el.radial.hidden = true; el.radial.innerHTML = ""; }
  document.addEventListener("click", function () { closeRadial(); });

  /* ================= state ================= */

  function track(name, props) {
    if (window.posthog && posthog.capture) posthog.capture(name, props);
  }

  function toggle(id, on) {
    var i = selected.indexOf(id);
    if (on && i === -1) selected.push(id);
    if (!on && i !== -1) selected.splice(i, 1);
    writeHash(); syncChips(); render();
    track("map_system_toggled", { system: id, on: on, selected_count: selected.length, industry: industry || "none" });
  }

  function readHash() {
    var h = decodeURIComponent(location.hash.replace(/^#/, ""));
    if (!h) return;
    var parts = h.split("@");
    selected = parts[0] ? parts[0].split(",").filter(function (id) { return SYSTEMS[id]; }) : [];
    industry = parts[1] && INDUSTRIES[parts[1]] ? parts[1] : "";
  }

  function writeHash() {
    var h = selected.join(",") + (industry ? "@" + industry : "");
    history.replaceState(null, "", h ? "#" + h : location.pathname);
  }

  function updateShare() {
    var url = location.origin + location.pathname + (selected.length ? "#" + selected.join(",") + (industry ? "@" + industry : "") : "");
    var body = "Here is my automation map:\n\n" + url + "\n\nWhat would these pipelines take to build?";
    el.shareMail.href = "mailto:" + DATA.email + "?subject=" + encodeURIComponent("My automation map") + "&body=" + encodeURIComponent(body);
  }

  function syncChips() {
    Array.prototype.forEach.call(el.chips, function (chip) {
      var on = selected.indexOf(chip.dataset.id) !== -1;
      chip.classList.toggle("on", on);
      chip.setAttribute("aria-pressed", String(on));
    });
    if (el.industry) el.industry.value = industry;
  }

  /* ================= events ================= */

  Array.prototype.forEach.call(el.chips, function (chip) {
    chip.addEventListener("click", function () {
      toggle(chip.dataset.id, selected.indexOf(chip.dataset.id) === -1);
    });
  });

  Array.prototype.forEach.call(document.querySelectorAll(".bin-tab"), function (tab) {
    tab.addEventListener("click", function () {
      Array.prototype.forEach.call(document.querySelectorAll(".bin-tab"), function (t) { t.classList.remove("on"); });
      tab.classList.add("on");
      var cat = tab.dataset.cat;
      Array.prototype.forEach.call(el.chips, function (chip) {
        if (cat === "all" || chip.dataset.cat === cat) chip.removeAttribute("data-hide");
        else chip.setAttribute("data-hide", "");
      });
    });
  });

  if (el.industry) el.industry.addEventListener("change", function () {
    industry = el.industry.value;
    writeHash(); render();
    track("map_industry_set", { industry: industry || "none", selected_count: selected.length });
  });

  if (el.sharePrint) el.sharePrint.addEventListener("click", function () {
    track("map_share", { method: "print", selected_count: selected.length, industry: industry || "none" });
    window.print();
  });

  if (el.shareMail) el.shareMail.addEventListener("click", function () {
    track("map_share", { method: "mail", selected_count: selected.length, industry: industry || "none" });
  });

  var stampTimer;
  function stamp(text) {
    if (reduceMotion) return;
    el.stamp.hidden = false;
    el.stamp.textContent = text;
    el.stamp.style.animation = "none";
    void el.stamp.offsetWidth;
    el.stamp.style.animation = "";
    clearTimeout(stampTimer);
    stampTimer = setTimeout(function () { el.stamp.hidden = true; }, 2600);
  }

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { prevKeys = {}; prevRects = {}; render(); }, 180);
  });

  /* ================= init ================= */
  readHash();
  syncChips();
  render();
})();
