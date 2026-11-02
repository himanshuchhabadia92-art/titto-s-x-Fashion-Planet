// Generates dummy men's-wear product images (SVG -> JPG) and writes a contact sheet.
// Usage: node scratch/gen-catalog.mjs [--upload]
// With --upload the images go to Cloudinary and prisma/demo-catalog.json is written.
import sharp from "sharp";
import fs from "fs";
import path from "path";
import "dotenv/config";

const W = 750,
  H = 1000;

/* ---------- helpers ---------- */
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const toHex = (r) => "#" + r.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
const mix = (h, to, t) => toHex(hex(h).map((v, i) => v + (hex(to)[i] - v) * t));
const dark = (h, t = 0.25) => mix(h, "#000000", t);
const light = (h, t = 0.25) => mix(h, "#ffffff", t);

const mirror = (d) => {
  let i = 0;
  return d.replace(/([MLQZ])|(-?\d+\.?\d*)/g, (m, cmd) => (cmd ? cmd : String(i++ % 2 === 0 ? W - Number(m) : m)));
};
const both = (d, fill, extra = "") => `<path d="${d}" fill="${fill}" ${extra}/><path d="${mirror(d)}" fill="${fill}" ${extra}/>`;

const defs = (id, c) => `
<defs>
  <linearGradient id="bg${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6f5f2"/><stop offset="1" stop-color="#e4e2dc"/></linearGradient>
  <linearGradient id="fab${id}" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#000" stop-opacity=".16"/><stop offset=".28" stop-color="#000" stop-opacity="0"/>
    <stop offset=".55" stop-color="#fff" stop-opacity=".07"/><stop offset="1" stop-color="#000" stop-opacity=".18"/>
  </linearGradient>
  <linearGradient id="fold${id}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#fff" stop-opacity=".08"/><stop offset="1" stop-color="#000" stop-opacity=".10"/>
  </linearGradient>
  <filter id="sh${id}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="14"/></filter>
</defs>`;

const stitch = (d, color, w = 2) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-dasharray="7 5" stroke-linecap="round"/>`;
const line = (d, color, w = 3, op = 1) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" opacity="${op}"/>`;
const buttons = (x, ys, color) => ys.map((y) => `<circle cx="${x}" cy="${y}" r="6" fill="${color}"/><circle cx="${x}" cy="${y}" r="2" fill="${dark(color, 0.5)}"/>`).join("");

/* ---------- garments ---------- */
function tee(c, o = {}) {
  const body = o.long
    ? "M250 150 L165 185 L95 700 L175 715 L215 400 L215 830 L535 830 L535 400 L575 715 L655 700 L585 185 L500 150 Q375 235 250 150 Z"
    : o.boxy
      ? "M250 150 L150 205 L85 350 L175 395 L215 330 L215 830 L535 830 L535 330 L575 395 L665 350 L600 205 L500 150 Q375 235 250 150 Z"
      : "M255 150 L170 195 L120 330 L195 365 L245 310 L245 820 L505 820 L505 310 L555 365 L630 330 L580 195 L495 150 Q375 235 255 150 Z";
  const arm = o.long ? [215, 400] : o.boxy ? [215, 330] : [245, 310];
  const hem = o.boxy ? [215, 535, 805] : [245, 505, 795];
  let s = `<path d="${body}" fill="${c}"/><path d="${body}" fill="url(#fab${o.id})"/>`;
  s += line(`M${o.boxy ? 250 : 255} 150 L${arm[0]} ${arm[1]}`, dark(c, 0.3), 2.5, 0.6);
  s += line(`M${o.boxy ? 500 : 495} 150 L${W - arm[0]} ${arm[1]}`, dark(c, 0.3), 2.5, 0.6);
  s += `<path d="M${o.boxy ? 250 : 255} 150 Q375 235 ${o.boxy ? 500 : 495} 150" fill="none" stroke="${dark(c, 0.22)}" stroke-width="16" stroke-linecap="round"/>`;
  s += `<path d="M285 156 Q375 200 465 156 Q375 215 285 156 Z" fill="${dark(c, 0.45)}" opacity=".45"/>`;
  s += stitch(`M${hem[0] + 4} ${hem[2]} L${hem[1] - 4} ${hem[2]}`, dark(c, 0.3), 2);
  s += line(`M300 420 Q330 520 310 700`, "#000", 6, 0.05) + line(`M470 440 Q440 560 465 720`, "#000", 6, 0.05);
  if (o.long) s += `<path d="M92 685 L172 700 L176 728 L96 713 Z" fill="${dark(c, 0.2)}"/><path d="${mirror("M92 685 L172 700 L176 728 L96 713 Z")}" fill="${dark(c, 0.2)}"/>`;
  if (o.graphic) s += graphic(o.graphic, c);
  return s;
}

function graphic(kind, base) {
  const fg = base === "#161616" || luminance(base) < 0.35 ? "#f3efe6" : "#1b1b1b";
  const acc = "#d9a441";
  if (kind === "sun")
    return `<g opacity=".95"><circle cx="375" cy="455" r="70" fill="${acc}"/><path d="M285 540 L345 440 L385 500 L425 450 L465 540 Z" fill="${fg}"/><path d="M265 560 H485" stroke="${fg}" stroke-width="6"/><path d="M290 585 H460" stroke="${fg}" stroke-width="4"/></g>`;
  if (kind === "bolt")
    return `<g><path d="M395 380 L325 505 L375 505 L350 610 L435 478 L383 478 Z" fill="${fg}"/><circle cx="375" cy="495" r="95" fill="none" stroke="${acc}" stroke-width="6"/></g>`;
  if (kind === "stripes")
    return `<g>${[0, 1, 2].map((i) => `<rect x="300" y="${430 + i * 34}" width="150" height="14" fill="${i === 1 ? acc : fg}"/>`).join("")}</g>`;
  if (kind === "mini") return `<g><circle cx="452" cy="380" r="16" fill="none" stroke="${acc}" stroke-width="4"/><circle cx="452" cy="380" r="5" fill="${acc}"/></g>`;
  return "";
}
const luminance = (h) => {
  const [r, g, b] = hex(h);
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
};

function shirt(c, o = {}) {
  const torso = "M245 150 L505 150 L528 830 L222 830 Z";
  const sleeveL = o.short
    ? "M245 150 L170 190 L122 335 L215 368 L238 290 Z"
    : "M245 150 L180 172 L128 640 L205 658 L238 330 Z";
  let s = `<path d="${torso}" fill="${c}"/>${both(sleeveL, c)}`;
  s += `<path d="${torso}" fill="url(#fab${o.id})"/>${both(sleeveL, "url(#fab" + o.id + ")")}`;
  if (o.stripe) {
    const lines = Array.from({ length: 40 }, (_, i) => `<rect x="${120 + i * 14}" y="120" width="2" height="740" fill="${o.stripe}" opacity=".35"/>`).join("");
    s += `<clipPath id="cl${o.id}"><path d="${torso}"/><path d="${sleeveL}"/><path d="${mirror(sleeveL)}"/></clipPath><g clip-path="url(#cl${o.id})">${lines}</g>`;
  }
  s += line("M245 150 L238 330", dark(c, 0.3), 2.5, 0.6) + line("M505 150 L512 330", dark(c, 0.3), 2.5, 0.6);
  if (!o.short) {
    s += both("M130 615 L205 633 L202 665 L127 647 Z", dark(c, 0.12));
  }
  // collar
  if (o.cuban) {
    s += `<path d="M375 235 L292 150 L322 120 L375 175 L428 120 L458 150 Z" fill="${light(c, 0.08)}" stroke="${dark(c, 0.3)}" stroke-width="2"/>`;
  } else {
    s += `<path d="M375 232 L292 142 L338 118 L378 176 Z" fill="${light(c, 0.1)}" stroke="${dark(c, 0.3)}" stroke-width="2"/>`;
    s += `<path d="${mirror("M375 232 L292 142 L338 118 L378 176 Z")}" fill="${light(c, 0.1)}" stroke="${dark(c, 0.3)}" stroke-width="2"/>`;
  }
  if (!o.cuban) s += `<rect x="360" y="232" width="30" height="598" fill="${dark(c, 0.06)}" opacity=".6"/>`;
  s += line("M375 232 L375 830", dark(c, 0.3), 2.5, 0.8);
  s += buttons(375, [275, 365, 455, 545, 635, 725], light(c, 0.55));
  s += `<rect x="288" y="335" width="68" height="76" fill="none" stroke="${dark(c, 0.3)}" stroke-width="2.5"/>${stitch("M293 340 H351 V404 H293 Z", dark(c, 0.25), 1.5)}`;
  s += stitch("M228 812 L522 812", dark(c, 0.3), 2);
  return s;
}

function hoodie(c, o = {}) {
  const torso = "M235 190 L515 190 L530 830 L220 830 Z";
  const sleeve = "M235 190 L150 232 L98 700 L182 716 L228 390 Z";
  let s = `<path d="M268 195 Q245 35 375 30 Q505 35 482 195 Q375 255 268 195 Z" fill="${dark(c, 0.18)}"/>`;
  s += `<path d="M300 195 Q290 92 375 86 Q460 92 450 195 Q375 240 300 195 Z" fill="${dark(c, 0.62)}"/>`;
  s += `<path d="${torso}" fill="${c}"/>${both(sleeve, c)}<path d="${torso}" fill="url(#fab${o.id})"/>${both(sleeve, "url(#fab" + o.id + ")")}`;
  s += `<path d="M268 195 Q375 262 482 195 L482 215 Q375 285 268 215 Z" fill="${dark(c, 0.14)}"/>`;
  s += line("M235 190 L228 390", dark(c, 0.32), 2.5, 0.6) + line("M515 190 L522 390", dark(c, 0.32), 2.5, 0.6);
  s += `<path d="M285 600 L465 600 L495 745 L255 745 Z" fill="${dark(c, 0.06)}" stroke="${dark(c, 0.3)}" stroke-width="2.5"/>`;
  s += line("M290 618 L305 745", dark(c, 0.3), 2, 0.6) + line("M460 618 L445 745", dark(c, 0.3), 2, 0.6);
  s += `<rect x="220" y="800" width="310" height="30" fill="${dark(c, 0.16)}"/>${both("M98 690 L182 706 L178 740 L94 724 Z", dark(c, 0.16))}`;
  s += line("M342 238 L336 345", "#efeadf", 5) + line("M408 238 L414 345", "#efeadf", 5);
  s += `<circle cx="336" cy="348" r="6" fill="#d8d2c4"/><circle cx="414" cy="348" r="6" fill="#d8d2c4"/>`;
  s += `<circle cx="342" cy="238" r="5" fill="${dark(c, 0.5)}"/><circle cx="408" cy="238" r="5" fill="${dark(c, 0.5)}"/>`;
  return s;
}

function jacket(c, o = {}) {
  const torso = "M235 175 L515 175 L525 800 L225 800 Z";
  const sleeve = "M235 175 L160 205 L100 690 L185 708 L228 380 Z";
  const style = o.style;
  let s = `<path d="${torso}" fill="${c}"/>${both(sleeve, c)}<path d="${torso}" fill="url(#fab${o.id})"/>${both(sleeve, "url(#fab" + o.id + ")")}`;
  s += line("M235 175 L228 380", dark(c, 0.32), 2.5, 0.6) + line("M515 175 L522 380", dark(c, 0.32), 2.5, 0.6);
  const trim = style === "bomber" ? dark(c, 0.22) : dark(c, 0.1);
  if (style === "bomber") {
    s += `<rect x="225" y="765" width="300" height="36" fill="${trim}"/>${both("M100 668 L185 686 L180 724 L95 706 Z", trim)}`;
    s += `<path d="M280 180 Q375 232 470 180 L470 138 Q375 190 280 138 Z" fill="${trim}"/>`;
    s += `<g stroke="${dark(c, 0.4)}" stroke-width="1.5" opacity=".6">${Array.from({ length: 14 }, (_, i) => `<path d="M${232 + i * 21} 768 V798"/>`).join("")}</g>`;
  } else if (style === "coach") {
    s += `<path d="M285 178 Q375 228 465 178 L465 140 Q375 190 285 140 Z" fill="${trim}"/>`;
    s += stitch("M228 786 L522 786", dark(c, 0.3));
    s += buttons(375, [250, 340, 430, 520, 610, 700], light(c, 0.3));
  } else {
    // denim / utility
    const accent = style === "denim" ? "#c98a3e" : dark(c, 0.35);
    s += `<path d="M375 232 L290 150 L335 122 L378 178 Z" fill="${light(c, 0.08)}" stroke="${accent}" stroke-width="2"/>`;
    s += `<path d="${mirror("M375 232 L290 150 L335 122 L378 178 Z")}" fill="${light(c, 0.08)}" stroke="${accent}" stroke-width="2"/>`;
    s += buttons(375, [265, 355, 445, 535, 625, 715], style === "denim" ? "#d4d0c8" : light(c, 0.3));
    const pockets = style === "denim" ? [[280, 320]] : [[280, 300], [280, 560]];
    for (const [x, y] of pockets) {
      s += `<rect x="${x}" y="${y}" width="70" height="72" fill="${dark(c, 0.05)}" stroke="${accent}" stroke-width="2.5"/>${both(`M${x} ${y} H${x + 70} V${y + 24} L${x + 35} ${y + 34} L${x} ${y + 24} Z`, dark(c, 0.12)).slice(0, 0)}`;
      s += `<rect x="${W - x - 70}" y="${y}" width="70" height="72" fill="${dark(c, 0.05)}" stroke="${accent}" stroke-width="2.5"/>`;
    }
    s += stitch("M228 786 L522 786", accent);
    s += line("M375 232 L375 800", accent, 2, 0.7);
    return s;
  }
  if (style === "bomber") {
    s += line("M375 190 L375 765", "#bdb7a8", 5) + `<path d="M375 190 L375 765" stroke="#8d887c" stroke-width="2" stroke-dasharray="3 3" fill="none"/>`;
    s += `<rect x="366" y="200" width="18" height="34" rx="4" fill="#d9d4c6" stroke="#8d887c"/>`;
    s += line("M268 560 L318 575", dark(c, 0.5), 5, 0.7) + line("M482 560 L432 575", dark(c, 0.5), 5, 0.7);
  } else {
    s += line("M375 178 L375 786", dark(c, 0.3), 2.5, 0.8);
  }
  return s;
}

function jeans(c, o = {}) {
  const wide = o.wide ? 40 : 0;
  const left = `M250 120 L375 120 L375 410 L${365} 880 L${215 - wide} 880 L${235 - wide / 2} 300 Z`;
  let s = `<path d="${left}" fill="${c}"/><path d="${mirror(left)}" fill="${c}"/>`;
  s += `<path d="${left}" fill="url(#fab${o.id})"/><path d="${mirror(left)}" fill="url(#fab${o.id})"/>`;
  if (o.fade) {
    s += `<ellipse cx="300" cy="420" rx="45" ry="95" fill="#fff" opacity=".13"/><ellipse cx="450" cy="420" rx="45" ry="95" fill="#fff" opacity=".13"/>`;
    s += `<ellipse cx="290" cy="640" rx="38" ry="80" fill="#fff" opacity=".08"/><ellipse cx="460" cy="640" rx="38" ry="80" fill="#fff" opacity=".08"/>`;
  }
  s += `<rect x="250" y="116" width="250" height="38" fill="${dark(c, 0.12)}"/>`;
  s += [270, 320, 430, 480].map((x) => `<rect x="${x - 5}" y="112" width="10" height="50" rx="2" fill="${dark(c, 0.25)}"/>`).join("");
  s += `<rect x="360" y="124" width="30" height="24" rx="3" fill="#cfcac0" stroke="#8d887c"/>`;
  s += line("M375 154 L375 330 Q375 365 340 358", "#d49a44", 2.5, 0.9) + stitch("M368 156 L368 326", "#d49a44", 1.5);
  s += line("M254 154 Q262 270 345 250", "#d49a44", 2.5, 0.85) + line("M496 154 Q488 270 405 250", "#d49a44", 2.5, 0.85);
  s += line("M240 300 L370 405", dark(c, 0.3), 2, 0.5) + line("M510 300 L380 405", dark(c, 0.3), 2, 0.5);
  s += stitch(`M${222 - wide} 862 L${360} 862`, "#d49a44", 2) + stitch(`M${W - 222 + wide} 862 L${W - 360} 862`, "#d49a44", 2);
  return s;
}

function trousers(c, o = {}) {
  const wide = o.cargo ? 25 : 0;
  const left = `M252 120 L375 120 L375 400 L${362} 880 L${232 - wide} 880 L${240 - wide / 2} 300 Z`;
  let s = `<path d="${left}" fill="${c}"/><path d="${mirror(left)}" fill="${c}"/>`;
  s += `<path d="${left}" fill="url(#fab${o.id})"/><path d="${mirror(left)}" fill="url(#fab${o.id})"/>`;
  s += `<rect x="252" y="116" width="246" height="34" fill="${dark(c, 0.1)}"/>`;
  s += [275, 330, 420, 475].map((x) => `<rect x="${x - 5}" y="112" width="10" height="46" rx="2" fill="${dark(c, 0.22)}"/>`).join("");
  s += `<circle cx="375" cy="132" r="9" fill="${light(c, 0.3)}"/>`;
  s += line("M375 150 L375 330", dark(c, 0.35), 2.5, 0.7);
  s += line("M312 880 L318 430 L312 160", dark(c, 0.3), 2, 0.35) + line("M438 880 L432 430 L438 160", dark(c, 0.3), 2, 0.35);
  if (o.pleat) s += line("M330 156 L328 230", dark(c, 0.35), 2.5, 0.6) + line("M420 156 L422 230", dark(c, 0.35), 2.5, 0.6);
  s += line("M256 170 Q290 215 292 285", dark(c, 0.35), 2.5, 0.7) + line("M494 170 Q460 215 458 285", dark(c, 0.35), 2.5, 0.7);
  if (o.cargo) {
    const p = dark(c, 0.07);
    s += `<rect x="${240 - wide}" y="470" width="82" height="92" fill="${p}" stroke="${dark(c, 0.35)}" stroke-width="2.5"/><rect x="${W - 322 + wide}" y="470" width="82" height="92" fill="${p}" stroke="${dark(c, 0.35)}" stroke-width="2.5"/>`;
    s += `<rect x="${240 - wide}" y="470" width="82" height="26" fill="${dark(c, 0.14)}"/><rect x="${W - 322 + wide}" y="470" width="82" height="26" fill="${dark(c, 0.14)}"/>`;
  }
  s += stitch(`M${238 - wide} 862 L${356} 862`, dark(c, 0.3), 2) + stitch(`M${W - 238 + wide} 862 L${W - 356} 862`, dark(c, 0.3), 2);
  return s;
}

const garments = { tee, shirt, hoodie, jacket, jeans, trousers };

function render(kind, color, opts, i) {
  const id = `${kind}${i}`;
  const fn = garments[kind];
  const isBottom = kind === "jeans" || kind === "trousers";
  const shadowY = isBottom ? 890 : 800;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${defs(id, color)}
<rect width="${W}" height="${H}" fill="url(#bg${id})"/>
<ellipse cx="375" cy="${shadowY}" rx="${isBottom ? 190 : 200}" ry="22" fill="#000" opacity=".18" filter="url(#sh${id})"/>
<g transform="${isBottom ? 'translate(0 20)' : 'translate(375 190) scale(1.14 0.86) translate(-375 -150)'}">${fn(color, { ...opts, id })}</g>
</svg>`;
}

/* ---------- catalog ---------- */
const T = ["S", "M", "L", "XL", "XXL"];
const B = ["28", "30", "32", "34", "36"];

const categories = [
  { name: "T-Shirts", slug: "tshirts", sortOrder: 1 },
  { name: "Full Sleeve T-Shirts", slug: "full-tshirts", sortOrder: 2 },
  { name: "Shirts", slug: "shirts", sortOrder: 3 },
  { name: "Hoodies", slug: "hoodies", sortOrder: 4 },
  { name: "Jackets", slug: "jackets", sortOrder: 5 },
  { name: "Jeans", slug: "jeans", sortOrder: 6 },
  { name: "Trousers", slug: "trousers", sortOrder: 7 },
  { name: "Bestsellers", slug: "bestsellers", sortOrder: 8 },
];

// kind, name, price, color, opts, category, bestseller, description
const products = [
  ["tee", "Classic Black Oversized Tee", 799, "#161616", { boxy: true, graphic: "mini" }, "tshirts", true, "Heavyweight 240 GSM cotton oversized tee with a dropped shoulder and ribbed neck. A everyday essential in black."],
  ["tee", "Off-White Boxy Tee", 849, "#ece7da", { boxy: true }, "tshirts", false, "Relaxed boxy fit in soft combed cotton. Clean, minimal and easy to layer."],
  ["tee", "Sage Sunset Graphic Tee", 999, "#8a9a7b", { boxy: true, graphic: "sun" }, "tshirts", true, "Oversized tee with a sunset graphic on the chest, printed with high-quality DTF."],
  ["tee", "Washed Grey Bolt Tee", 899, "#7d7f84", { boxy: true, graphic: "bolt" }, "tshirts", false, "Washed grey drop-shoulder tee with a bold bolt print."],
  ["shirt", "White Oxford Shirt", 1299, "#f3f1ea", {}, "shirts", false, "Classic full-sleeve oxford shirt with a button-down collar and chest pocket."],
  ["shirt", "Sky Blue Linen Shirt", 1499, "#a9c4dc", {}, "shirts", true, "Breathable linen-blend shirt in sky blue. Smart enough for work, easy enough for weekends."],
  ["shirt", "Olive Cuban Collar Shirt", 1399, "#6e7752", { short: true, cuban: true }, "shirts", false, "Short-sleeve Cuban collar shirt in olive with a relaxed, boxy drape."],
  ["shirt", "Navy Pinstripe Shirt", 1599, "#26334f", { stripe: "#ffffff" }, "shirts", false, "Full-sleeve pinstripe shirt in navy with a crisp spread collar."],
  ["hoodie", "Black Heavyweight Hoodie", 1799, "#171717", {}, "hoodies", true, "Heavyweight fleece pullover hoodie with a kangaroo pocket and ribbed cuffs."],
  ["hoodie", "Charcoal Pullover Hoodie", 1699, "#43464b", {}, "hoodies", false, "Soft brushed-fleece hoodie in charcoal. Warm without feeling bulky."],
  ["hoodie", "Cream Oversized Hoodie", 1899, "#e4dccb", {}, "hoodies", false, "Oversized cream hoodie with a roomy hood and dropped shoulders."],
  ["hoodie", "Forest Green Hoodie", 1799, "#2f4a3a", {}, "hoodies", false, "Deep forest green pullover hoodie with drawstring hood."],
  ["jacket", "Black Bomber Jacket", 2999, "#1a1a1a", { style: "bomber" }, "jackets", true, "Classic zip-up bomber with ribbed collar, cuffs and hem."],
  ["jacket", "Blue Denim Jacket", 2799, "#4b6a8f", { style: "denim" }, "jackets", false, "Rigid blue denim trucker jacket with contrast stitching and chest pockets."],
  ["jacket", "Olive Utility Jacket", 3199, "#59603f", { style: "utility" }, "jackets", false, "Button-up utility jacket with four flap pockets in a rugged olive cotton."],
  ["jacket", "Tan Coach Jacket", 2599, "#b49a74", { style: "coach" }, "jackets", false, "Lightweight snap-button coach jacket in tan. Perfect for transitional weather."],
  ["jeans", "Classic Indigo Straight Jeans", 1699, "#2c3f63", { fade: true }, "jeans", true, "Straight-fit jeans in mid-weight indigo denim."],
  ["jeans", "Black Slim Fit Jeans", 1799, "#1b1b1d", {}, "jeans", false, "Slim-fit black jeans with a hint of stretch for all-day comfort."],
  ["jeans", "Light Wash Baggy Jeans", 1999, "#7f9bbd", { wide: true, fade: true }, "jeans", true, "Baggy wide-leg jeans in a light wash for a relaxed streetwear look."],
  ["jeans", "Grey Washed Tapered Jeans", 1899, "#6a6d73", { fade: true }, "jeans", false, "Tapered jeans in a washed grey finish."],
  ["trousers", "Beige Chino Trousers", 1499, "#c9b79a", {}, "trousers", false, "Slim-straight cotton chinos in beige."],
  ["trousers", "Black Pleated Trousers", 1699, "#1d1d1f", { pleat: true }, "trousers", false, "Single-pleat tailored trousers in black with a relaxed taper."],
  ["trousers", "Olive Cargo Trousers", 1799, "#5e6445", { cargo: true }, "trousers", true, "Relaxed cargo trousers with roomy side pockets in olive cotton twill."],
  ["trousers", "Navy Formal Trousers", 1599, "#252f45", {}, "trousers", false, "Flat-front formal trousers in navy with a clean crease."],
  ["tee", "Black Full Sleeve Tee", 999, "#161616", { long: true, boxy: true, graphic: "mini" }, "full-tshirts", false, "Full-sleeve cotton tee in black with ribbed cuffs and a relaxed boxy fit."],
  ["tee", "Off-White Full Sleeve Tee", 999, "#ece7da", { long: true, boxy: true }, "full-tshirts", false, "Soft full-sleeve tee in off-white. Easy to wear alone or layered."],
  ["tee", "Navy Full Sleeve Stripe Tee", 1099, "#26334f", { long: true, boxy: true, graphic: "stripes" }, "full-tshirts", false, "Navy full-sleeve tee with a chest stripe detail."],
  ["tee", "Grey Full Sleeve Bolt Tee", 1049, "#7d7f84", { long: true, boxy: true, graphic: "bolt" }, "full-tshirts", false, "Grey full-sleeve tee with a bold bolt graphic print."],
  ["tee", "Maroon Sunset Full Sleeve Tee", 1149, "#6d2a33", { long: true, boxy: true, graphic: "sun" }, "full-tshirts", true, "Maroon full-sleeve tee with a sunset graphic on the chest."],
];

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

async function renderImages(p, i) {
  const [kind, , , color, opts] = p;
  const svg = render(kind, color, opts, i);
  const big = await sharp(Buffer.from(svg), { density: 144 }).resize(1500, 2000).png().toBuffer();
  const front = await sharp(big).resize(900, 1200).jpeg({ quality: 88 }).toBuffer();
  const isBottom = kind === "jeans" || kind === "trousers";
  const detail = await sharp(big)
    .extract({ left: 330, top: isBottom ? 180 : 300, width: 840, height: 1120 })
    .resize(900, 1200)
    .modulate({ brightness: 0.97 })
    .jpeg({ quality: 88 })
    .toBuffer();
  return [front, detail];
}

const upload = process.argv.includes("--upload");
const outDir = path.resolve("scratch/out");
fs.mkdirSync(outDir, { recursive: true });

let cloudinary;
if (upload) cloudinary = (await import("cloudinary")).v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
}) && (await import("cloudinary")).v2;

const sheet = [];
// --only-new: keep the existing prisma/demo-catalog.json products and only render/upload the missing ones
const onlyNew = process.argv.includes("--only-new");
const existing = onlyNew ? JSON.parse(fs.readFileSync("prisma/demo-catalog.json", "utf8")) : null;
const result = { categories: [], products: existing ? [...existing.products] : [] };

for (let i = 0; i < products.length; i++) {
  const p = products[i];
  const [kind, name, price, , , cat, best, description] = p;
  const slug = slugify(name);
  if (existing?.products.some((e) => e.slug === slug)) continue;
  const bufs = await renderImages(p, i);
  fs.writeFileSync(path.join(outDir, `${slug}-1.jpg`), bufs[0]);
  sheet.push(await sharp(bufs[0]).resize(250, 333).toBuffer());
  const images = [];
  if (upload) {
    for (let n = 0; n < bufs.length; n++) {
      const res = await new Promise((resolve, reject) =>
        cloudinary.uploader
          .upload_stream({ folder: "tittos-fashion-planet/demo", public_id: `${slug}-${n + 1}`, overwrite: true }, (e, r) => (e ? reject(e) : resolve(r)))
          .end(bufs[n]),
      );
      images.push(res.secure_url);
    }
  }
  result.products.push({ name, slug, price, description, images, categories: best ? [cat, "bestsellers"] : [cat], sizes: kind === "jeans" || kind === "trousers" ? B : T });
  process.stdout.write(`${i + 1}/${products.length} ${slug}\n`);
}

// category covers = first product of each category
for (const c of categories) {
  const first = result.products.find((p) => p.categories[0] === c.slug) ?? result.products.find((p) => p.categories.includes(c.slug));
  result.categories.push({ ...c, image: first?.images[0] ?? null });
}

const cols = 6;
const rows = Math.ceil(sheet.length / cols);
await sharp({ create: { width: cols * 250, height: rows * 333, channels: 3, background: "#ffffff" } })
  .composite(sheet.map((input, i) => ({ input, left: (i % cols) * 250, top: Math.floor(i / cols) * 333 })))
  .jpeg({ quality: 85 })
  .toFile(path.join(outDir, "contact-sheet.jpg"));

if (upload) {
  fs.writeFileSync("prisma/demo-catalog.json", JSON.stringify(result, null, 2) + "\n");
  console.log("wrote prisma/demo-catalog.json");
}
