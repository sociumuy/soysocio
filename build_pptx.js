const pptxgen = require("pptxgenjs");

let pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.title = 'SoySocio — Propuesta Comercial';
pres.author = 'SoySocio';

const C = {
  dark:   '0D0D0D',
  dark2:  '1A1A1A',
  dark3:  '222222',
  gold:   'B8975A',
  white:  'FFFFFF',
  bg:     'F4F3EF',
  mid:    '6B6B68',
  light:  'AEADA7',
  border: 'E2E1DB',
};

const makeShadow = () => ({ type: "outer", blur: 10, offset: 3, angle: 135, color: "000000", opacity: 0.14 });

// ─────────────────────────────────
// SLIDE 1 — PORTADA
// ─────────────────────────────────
let s1 = pres.addSlide();
s1.background = { color: C.dark };

// Gold left bar
s1.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: 0.07, h: 5.625,
  fill: { color: C.gold }, line: { color: C.gold, width: 0 }
});

// Shield body
s1.addShape(pres.shapes.RECTANGLE, {
  x: 4.3, y: 0.75, w: 1.4, h: 1.6,
  fill: { color: C.gold }, line: { color: C.gold, width: 0 }
});
s1.addShape(pres.shapes.OVAL, {
  x: 4.3, y: 2.1, w: 1.4, h: 0.85,
  fill: { color: C.gold }, line: { color: C.gold, width: 0 }
});
s1.addText("CC", {
  x: 4.3, y: 0.9, w: 1.4, h: 1.2,
  fontSize: 26, fontFace: "Georgia", bold: true,
  color: C.white, align: "center", valign: "middle", margin: 0
});

// Wordmark
s1.addText("SOYSOCIO", {
  x: 1.2, y: 3.3, w: 7.6, h: 0.75,
  fontSize: 48, fontFace: "Georgia",
  color: C.white, align: "center", charSpacing: 10, margin: 0
});

// Tagline
s1.addText("La plataforma exclusiva para socios de clubs", {
  x: 1.2, y: 4.1, w: 7.6, h: 0.45,
  fontSize: 13, fontFace: "Calibri",
  color: C.gold, align: "center", charSpacing: 1, margin: 0
});

// Footer
s1.addText("Montevideo, Uruguay  ·  2026", {
  x: 1.2, y: 5.1, w: 7.6, h: 0.35,
  fontSize: 10, fontFace: "Calibri",
  color: C.mid, align: "center", charSpacing: 2, margin: 0
});

// ─────────────────────────────────
// SLIDE 2 — EL PROBLEMA
// ─────────────────────────────────
let s2 = pres.addSlide();
s2.background = { color: C.bg };

s2.addText("El problema hoy", {
  x: 0.55, y: 0.45, w: 9, h: 0.65,
  fontSize: 36, fontFace: "Georgia",
  color: C.dark, align: "left", margin: 0
});
s2.addText("Los clubs gestionan todo por separado — y los socios lo sienten.", {
  x: 0.55, y: 1.12, w: 9, h: 0.38,
  fontSize: 13, fontFace: "Calibri",
  color: C.mid, align: "left", margin: 0
});

const problems = [
  { n: "01", title: "Sin centralización", desc: "Reservas por WhatsApp, cuotas por transferencia, noticias por email. Todo disperso, nada integrado." },
  { n: "02", title: "Gestión manual", desc: "El personal administra turnos, cobros y consultas sin ningún sistema digitalizado." },
  { n: "03", title: "Sin identidad digital", desc: "El club no tiene presencia digital propia donde el socio sienta que pertenece a algo." },
];

problems.forEach((p, i) => {
  const x = 0.38 + i * 3.12;
  s2.addShape(pres.shapes.RECTANGLE, {
    x, y: 1.75, w: 2.9, h: 3.35,
    fill: { color: C.white }, line: { color: C.border, width: 1 },
    shadow: makeShadow()
  });
  s2.addShape(pres.shapes.RECTANGLE, {
    x, y: 1.75, w: 2.9, h: 0.06,
    fill: { color: C.gold }, line: { color: C.gold, width: 0 }
  });
  s2.addText(p.n, {
    x: x + 0.22, y: 2.0, w: 1, h: 0.6,
    fontSize: 30, fontFace: "Georgia",
    color: C.gold, align: "left", margin: 0
  });
  s2.addText(p.title, {
    x: x + 0.22, y: 2.72, w: 2.5, h: 0.42,
    fontSize: 14, fontFace: "Calibri", bold: true,
    color: C.dark, align: "left", margin: 0
  });
  s2.addText(p.desc, {
    x: x + 0.22, y: 3.22, w: 2.5, h: 1.6,
    fontSize: 12, fontFace: "Calibri",
    color: C.mid, align: "left", margin: 0
  });
});

// ─────────────────────────────────
// SLIDE 3 — QUÉ ES SOYSOCIO
// ─────────────────────────────────
let s3 = pres.addSlide();
s3.background = { color: C.dark };

// Left panel darker
s3.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: 4.6, h: 5.625,
  fill: { color: C.dark3 }, line: { color: C.dark3, width: 0 }
});

s3.addText("SOYSOCIO", {
  x: 0.45, y: 0.85, w: 3.8, h: 0.65,
  fontSize: 30, fontFace: "Georgia",
  color: C.white, charSpacing: 5, margin: 0
});
s3.addShape(pres.shapes.LINE, {
  x: 0.45, y: 1.65, w: 1.6, h: 0,
  line: { color: C.gold, width: 1.5 }
});
s3.addText("La plataforma\nprivada que tu\nclub merece.", {
  x: 0.45, y: 1.9, w: 3.8, h: 1.55,
  fontSize: 22, fontFace: "Georgia",
  color: C.white, align: "left", margin: 0
});
s3.addText("Cada socio accede a una app exclusiva del club — con su identidad, sus servicios y su comunidad en un solo lugar.", {
  x: 0.45, y: 3.55, w: 3.8, h: 1.5,
  fontSize: 12, fontFace: "Calibri",
  color: C.light, align: "left", margin: 0
});

const points = [
  { label: "App con identidad propia del club", sub: "Colores, escudo y nombre del club en cada pantalla" },
  { label: "Acceso privado por socio", sub: "Cada miembro ingresa con su usuario personal" },
  { label: "Todo en un solo lugar", sub: "Reservas, tienda, noticias y más — integrados" },
  { label: "Sin trabajo extra para el club", sub: "La plataforma se gestiona con mínima intervención" },
];

points.forEach((pt, i) => {
  const y = 0.55 + i * 1.18;
  s3.addShape(pres.shapes.OVAL, {
    x: 4.95, y: y + 0.14, w: 0.16, h: 0.16,
    fill: { color: C.gold }, line: { color: C.gold, width: 0 }
  });
  s3.addText(pt.label, {
    x: 5.3, y: y, w: 4.3, h: 0.38,
    fontSize: 14, fontFace: "Calibri", bold: true,
    color: C.white, align: "left", margin: 0
  });
  s3.addText(pt.sub, {
    x: 5.3, y: y + 0.4, w: 4.3, h: 0.42,
    fontSize: 11, fontFace: "Calibri",
    color: C.light, align: "left", margin: 0
  });
  if (i < points.length - 1) {
    s3.addShape(pres.shapes.LINE, {
      x: 4.95, y: y + 0.95, w: 4.7, h: 0,
      line: { color: '272727', width: 0.75 }
    });
  }
});

// ─────────────────────────────────
// SLIDE 4 — FUNCIONALIDADES
// ─────────────────────────────────
let s4 = pres.addSlide();
s4.background = { color: C.bg };

s4.addText("Funcionalidades clave", {
  x: 0.55, y: 0.45, w: 9, h: 0.65,
  fontSize: 36, fontFace: "Georgia",
  color: C.dark, align: "left", margin: 0
});
s4.addText("Las tres funcionalidades que generan valor real desde el primer día.", {
  x: 0.55, y: 1.12, w: 9, h: 0.38,
  fontSize: 13, fontFace: "Calibri",
  color: C.mid, align: "left", margin: 0
});

const features = [
  {
    num: "01", title: "Portal del Socio",
    desc: "Cada socio crea su perfil privado. Ve su estado de cuota, historial, reservas y pedidos. Su identidad digital dentro del club.",
    tag: "Login  ·  Perfil  ·  Cuotas", dark: true
  },
  {
    num: "02", title: "Sistema de Reservas",
    desc: "Reservas de gimnasio, canchas y pileta desde el celular. Disponibilidad en tiempo real, sin llamadas ni WhatsApp.",
    tag: "Turnos online  ·  Confirmación automática", dark: false
  },
  {
    num: "03", title: "Tienda Oficial",
    desc: "El club vende su merchandising directamente a sus socios. Camisetas, gorras y accesorios con identidad del club.",
    tag: "Catálogo  ·  Carrito  ·  Pedidos", dark: false
  },
];

features.forEach((f, i) => {
  const x = 0.38 + i * 3.12;
  s4.addShape(pres.shapes.RECTANGLE, {
    x, y: 1.75, w: 2.9, h: 3.45,
    fill: { color: f.dark ? C.dark : C.white },
    line: { color: f.dark ? C.dark : C.border, width: 1 },
    shadow: makeShadow()
  });
  s4.addText(f.num, {
    x: x + 0.22, y: 1.95, w: 1, h: 0.6,
    fontSize: 32, fontFace: "Georgia",
    color: C.gold, align: "left", margin: 0
  });
  s4.addText(f.title, {
    x: x + 0.22, y: 2.65, w: 2.55, h: 0.45,
    fontSize: 15, fontFace: "Calibri", bold: true,
    color: f.dark ? C.white : C.dark, align: "left", margin: 0
  });
  s4.addText(f.desc, {
    x: x + 0.22, y: 3.18, w: 2.55, h: 1.45,
    fontSize: 11, fontFace: "Calibri",
    color: f.dark ? C.light : C.mid, align: "left", margin: 0
  });
  s4.addText(f.tag, {
    x: x + 0.22, y: 4.72, w: 2.55, h: 0.35,
    fontSize: 9, fontFace: "Calibri",
    color: C.gold, align: "left", charSpacing: 0.3, margin: 0
  });
});

// ─────────────────────────────────
// SLIDE 5 — CÓMO FUNCIONA
// ─────────────────────────────────
let s5 = pres.addSlide();
s5.background = { color: C.bg };

s5.addText("Cómo funciona", {
  x: 0.55, y: 0.45, w: 9, h: 0.65,
  fontSize: 36, fontFace: "Georgia",
  color: C.dark, align: "left", margin: 0
});
s5.addText("Simple para el club, poderoso para los socios.", {
  x: 0.55, y: 1.12, w: 9, h: 0.38,
  fontSize: 13, fontFace: "Calibri",
  color: C.mid, align: "left", margin: 0
});

const steps = [
  { n: "1", title: "Cerramos el acuerdo", desc: "Una reunión. Definimos funcionalidades, identidad visual y plan de implementación." },
  { n: "2", title: "Configuramos la app", desc: "En pocos días la plataforma está lista con los colores, escudo y nombre del club." },
  { n: "3", title: "Los socios acceden", desc: "Cada socio crea su perfil. El club empieza a operar digitalmente desde el día uno." },
  { n: "4", title: "Soporte continuo", desc: "Nosotros mantenemos la plataforma. El club no se preocupa por nada técnico." },
];

steps.forEach((st, i) => {
  const x = 0.4 + i * 2.35;
  // Circle
  s5.addShape(pres.shapes.OVAL, {
    x: x + 0.82, y: 1.85, w: 0.7, h: 0.7,
    fill: { color: C.dark }, line: { color: C.dark, width: 0 }
  });
  s5.addText(st.n, {
    x: x + 0.82, y: 1.85, w: 0.7, h: 0.7,
    fontSize: 18, fontFace: "Georgia", bold: true,
    color: C.gold, align: "center", valign: "middle", margin: 0
  });
  // Connector
  if (i < steps.length - 1) {
    s5.addShape(pres.shapes.LINE, {
      x: x + 1.57, y: 2.2, w: 0.78, h: 0,
      line: { color: C.gold, width: 1, transparency: 40 }
    });
  }
  s5.addText(st.title, {
    x: x + 0.1, y: 2.75, w: 2.15, h: 0.5,
    fontSize: 13, fontFace: "Calibri", bold: true,
    color: C.dark, align: "center", margin: 0
  });
  s5.addText(st.desc, {
    x: x + 0.1, y: 3.32, w: 2.15, h: 1.9,
    fontSize: 11, fontFace: "Calibri",
    color: C.mid, align: "center", margin: 0
  });
});

// ─────────────────────────────────
// SLIDE 6 — POR QUÉ URUGUAY
// ─────────────────────────────────
let s6 = pres.addSlide();
s6.background = { color: C.dark };

s6.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: 0.07, h: 5.625,
  fill: { color: C.gold }, line: { color: C.gold, width: 0 }
});

s6.addText("¿Por qué ahora\nen Uruguay?", {
  x: 0.7, y: 0.85, w: 4.0, h: 1.7,
  fontSize: 34, fontFace: "Georgia",
  color: C.white, align: "left", margin: 0
});
s6.addShape(pres.shapes.LINE, {
  x: 0.7, y: 2.65, w: 2.0, h: 0,
  line: { color: C.gold, width: 1.5 }
});
s6.addText("Uruguay tiene una cultura de club social única en la región — y ningún competidor serio en el espacio digital de membresías.", {
  x: 0.7, y: 2.88, w: 4.1, h: 1.5,
  fontSize: 13, fontFace: "Calibri",
  color: C.light, align: "left", margin: 0
});

const stats = [
  { num: "+500", label: "clubs activos en Uruguay" },
  { num: "0", label: "competidores directos conocidos" },
  { num: "USD", label: "economía estable, precios en dólares" },
];

stats.forEach((st, i) => {
  const y = 0.65 + i * 1.58;
  s6.addShape(pres.shapes.RECTANGLE, {
    x: 5.4, y, w: 4.1, h: 1.35,
    fill: { color: C.dark2 }, line: { color: '272727', width: 1 },
    shadow: makeShadow()
  });
  s6.addText(st.num, {
    x: 5.65, y: y + 0.1, w: 3.6, h: 0.7,
    fontSize: 42, fontFace: "Georgia",
    color: C.gold, align: "left", margin: 0
  });
  s6.addText(st.label, {
    x: 5.65, y: y + 0.82, w: 3.6, h: 0.38,
    fontSize: 11, fontFace: "Calibri",
    color: C.light, align: "left", margin: 0
  });
});

// ─────────────────────────────────
// SLIDE 7 — PROPUESTA DE VALOR
// ─────────────────────────────────
let s7 = pres.addSlide();
s7.background = { color: C.bg };

s7.addText("¿Qué gana el club?", {
  x: 0.55, y: 0.45, w: 9, h: 0.65,
  fontSize: 36, fontFace: "Georgia",
  color: C.dark, align: "left", margin: 0
});
s7.addText("Valor concreto desde el primer mes.", {
  x: 0.55, y: 1.12, w: 9, h: 0.38,
  fontSize: 13, fontFace: "Calibri",
  color: C.mid, align: "left", margin: 0
});

const values = [
  { title: "Ingresos nuevos", desc: "La tienda de merchandising genera ventas directas. El club cobra sin intermediarios." },
  { title: "Menos carga operativa", desc: "Las reservas se gestionan solas. El personal deja de responder consultas repetidas." },
  { title: "Fidelización real", desc: "El socio usa la app a diario. Su vínculo con el club se fortalece." },
  { title: "Imagen premium", desc: "El club proyecta modernidad y exclusividad. Atrae y retiene socios." },
  { title: "Datos propios", desc: "El club sabe qué usan sus socios, cuándo y cómo — para tomar mejores decisiones." },
  { title: "Cero preocupaciones técnicas", desc: "SoySocio se encarga del mantenimiento, updates y soporte." },
];

values.forEach((v, i) => {
  const col = i % 3;
  const row = Math.floor(i / 3);
  const x = 0.38 + col * 3.12;
  const y = 1.72 + row * 1.8;
  s7.addShape(pres.shapes.RECTANGLE, {
    x, y, w: 2.9, h: 1.6,
    fill: { color: C.white }, line: { color: C.border, width: 1 },
    shadow: makeShadow()
  });
  s7.addShape(pres.shapes.RECTANGLE, {
    x, y, w: 0.07, h: 1.6,
    fill: { color: C.gold }, line: { color: C.gold, width: 0 }
  });
  s7.addText(v.title, {
    x: x + 0.24, y: y + 0.16, w: 2.52, h: 0.38,
    fontSize: 13, fontFace: "Calibri", bold: true,
    color: C.dark, align: "left", margin: 0
  });
  s7.addText(v.desc, {
    x: x + 0.24, y: y + 0.6, w: 2.52, h: 0.85,
    fontSize: 11, fontFace: "Calibri",
    color: C.mid, align: "left", margin: 0
  });
});

// ─────────────────────────────────
// SLIDE 8 — PRECIO
// ─────────────────────────────────
let s8 = pres.addSlide();
s8.background = { color: C.bg };

s8.addText("Inversión", {
  x: 0.55, y: 0.45, w: 9, h: 0.65,
  fontSize: 36, fontFace: "Georgia",
  color: C.dark, align: "left", margin: 0
});
s8.addText("Un precio fijo mensual, sin sorpresas ni costos ocultos.", {
  x: 0.55, y: 1.12, w: 9, h: 0.38,
  fontSize: 13, fontFace: "Calibri",
  color: C.mid, align: "left", margin: 0
});

// Price card
s8.addShape(pres.shapes.RECTANGLE, {
  x: 0.45, y: 1.72, w: 5.3, h: 3.5,
  fill: { color: C.dark }, line: { color: C.dark, width: 0 },
  shadow: makeShadow()
});
s8.addText("USD", {
  x: 0.75, y: 2.05, w: 2, h: 0.5,
  fontSize: 20, fontFace: "Georgia",
  color: C.gold, align: "left", margin: 0
});
s8.addText("1.500", {
  x: 0.65, y: 2.42, w: 4.7, h: 1.15,
  fontSize: 88, fontFace: "Georgia",
  color: C.white, align: "left", margin: 0
});
s8.addText("por mes", {
  x: 0.75, y: 3.62, w: 3, h: 0.42,
  fontSize: 16, fontFace: "Calibri",
  color: C.light, align: "left", margin: 0
});
s8.addShape(pres.shapes.LINE, {
  x: 0.75, y: 4.15, w: 4.6, h: 0,
  line: { color: '2A2A2A', width: 0.75 }
});
s8.addText("Sin costo de implementación  ·  Sin permanencia mínima", {
  x: 0.75, y: 4.28, w: 4.6, h: 0.7,
  fontSize: 11, fontFace: "Calibri",
  color: C.mid, align: "left", margin: 0
});

// What's included
s8.addText("Incluye:", {
  x: 6.15, y: 1.72, w: 3.4, h: 0.45,
  fontSize: 13, fontFace: "Calibri", bold: true,
  color: C.dark, align: "left", margin: 0
});

const included = [
  "App con identidad exclusiva del club",
  "Portal privado para socios",
  "Sistema de reservas de instalaciones",
  "Tienda de merchandising oficial",
  "Panel de administración",
  "Soporte y mantenimiento incluidos",
  "Actualizaciones sin costo adicional",
];

included.forEach((item, i) => {
  const y = 2.28 + i * 0.44;
  s8.addShape(pres.shapes.OVAL, {
    x: 6.15, y: y + 0.09, w: 0.15, h: 0.15,
    fill: { color: C.gold }, line: { color: C.gold, width: 0 }
  });
  s8.addText(item, {
    x: 6.44, y, w: 3.15, h: 0.4,
    fontSize: 11, fontFace: "Calibri",
    color: C.mid, align: "left", margin: 0
  });
});

// ─────────────────────────────────
// SLIDE 9 — SIGUIENTE PASO
// ─────────────────────────────────
let s9 = pres.addSlide();
s9.background = { color: C.dark };

s9.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: 0.07, h: 5.625,
  fill: { color: C.gold }, line: { color: C.gold, width: 0 }
});

s9.addText("El siguiente paso\nes una conversación.", {
  x: 1.0, y: 1.0, w: 8.2, h: 1.9,
  fontSize: 44, fontFace: "Georgia",
  color: C.white, align: "left", margin: 0
});
s9.addShape(pres.shapes.LINE, {
  x: 1.0, y: 3.05, w: 2.5, h: 0,
  line: { color: C.gold, width: 1.5 }
});
s9.addText("En 30 minutos te mostramos la plataforma funcionando y respondemos todas tus preguntas — sin compromiso.", {
  x: 1.0, y: 3.28, w: 7.8, h: 0.75,
  fontSize: 14, fontFace: "Calibri",
  color: C.light, align: "left", margin: 0
});

// CTA button
s9.addShape(pres.shapes.RECTANGLE, {
  x: 1.0, y: 4.3, w: 4.6, h: 0.82,
  fill: { color: C.gold }, line: { color: C.gold, width: 0 }
});
s9.addText("Agendar reunión con SoySocio", {
  x: 1.0, y: 4.3, w: 4.6, h: 0.82,
  fontSize: 14, fontFace: "Calibri", bold: true,
  color: C.dark, align: "center", valign: "middle", margin: 0
});

// Contact
s9.addText("Francisco Mattos & Mathías Revetria  ·  soysocio.uy", {
  x: 5.9, y: 4.5, w: 3.7, h: 0.4,
  fontSize: 10, fontFace: "Calibri",
  color: C.mid, align: "right", margin: 0
});

// ─────────────────────────────────
// EXPORT
// ─────────────────────────────────
pres.writeFile({ fileName: "C:\\Users\\franc\\OneDrive\\Escritorio\\soysocio\\SoySocio_Propuesta_Comercial.pptx" })
  .then(() => console.log("✅ Presentación creada: SoySocio_Propuesta_Comercial.pptx"))
  .catch(e => console.error("❌ Error:", e));
