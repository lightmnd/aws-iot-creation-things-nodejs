// Modbus mapping

const booleanModbusCodes = [
  { code: 500, description: "allarme generico", type: "boolean" },
  { code: 501, description: "allarme sonde macchina", type: "boolean" },
  { code: 502, description: "allarmi ingressi", type: "boolean" },
  { code: 503, description: "allarmi da logiche", type: "boolean" },
  { code: 504, description: "allarmi circuito frigo 1", type: "boolean" },
  { code: 505, description: "allarmi circuito frigo 2", type: "boolean" },
  { code: 506, description: "allarmi resettabili", type: "boolean" },
  { code: 507, description: "allarmi non resettabili", type: "boolean" },
  { code: 550, description: "guasto sonda CO2 ambiente", type: "boolean" },
  { code: 551, description: "guasto sonda VOC ambiente", type: "boolean" },
  {
    code: 552,
    description: "guasto sonda temperatura ambiente",
    type: "boolean",
  },
  {
    code: 553,
    description: "guasto sonda temperatura esterna",
    type: "boolean",
  },
  { code: 554, description: "guasto sonda temperatura acqua", type: "boolean" },
  {
    code: 555,
    description: "guasto sonda temperatura mandata",
    type: "boolean",
  },
  {
    code: 556,
    description: "guasto sonda temperatura protezione antigelo batt acqua",
    type: "boolean",
  },
  {
    code: 557,
    description: "guasto sonda temperatura sbrinamento recuperatore",
    type: "boolean",
  },
  { code: 558, description: "guasto sonda umidità ambiente", type: "boolean" },
  {
    code: 600,
    description: "allarme resistenze elettriche grave",
    type: "boolean",
  },
  {
    code: 601,
    description: "allarme resistenze elettriche lieve",
    type: "boolean",
  },
  { code: 602, description: "allarme fuga gas", type: "boolean" },
  { code: 603, description: "allarme ventilazione", type: "boolean" },
  { code: 604, description: "allarme ventilatore ricircolo", type: "boolean" },
  { code: 605, description: "allarme ventilatore estrazione", type: "boolean" },
  {
    code: 606,
    description: "allarme ventilatore condensazione",
    type: "boolean",
  },
  { code: 607, description: "allame flussostato grave", type: "boolean" },
  { code: 608, description: "allarme flussostato lieve", type: "boolean" },
  { code: 609, description: "allarme sequenza fasi", type: "boolean" },
  { code: 650, description: "segnalazione pulire filtri", type: "boolean" },
  {
    code: 651,
    description: "segnalazione pulire tubo ionizzatore",
    type: "boolean",
  },
  {
    code: 652,
    description: "segnalazione sostituire tubo ionizzatore",
    type: "boolean",
  },
  {
    code: 653,
    description: "allarme protezione antigelo batteria acqua",
    type: "boolean",
  },
  {
    code: 654,
    description: "allarme protezione batteria acqua lieve",
    type: "boolean",
  },
  {
    code: 655,
    description: "allarme alta temperatura acqua per on compressore",
    type: "boolean",
  },
  {
    code: 656,
    description: "allarme bassa temperatura per on compressore",
    type: "boolean",
  },
  {
    code: 657,
    description:
      "allarme antigelo batteria acqua kit controllo temperatura mandata grave",
    type: "boolean",
  },
  {
    code: 658,
    description:
      "allarme antigelo batteria acqua kit controllo temperatura mandata lieve",
    type: "boolean",
  },
  { code: 659, description: "allarme macchina scarica", type: "boolean" },
  {
    code: 660,
    description: "allarme mancanza comunicazione con display",
    type: "boolean",
  },
  {
    code: 661,
    description: "allarme mancanza comunicazione con ionizzatore",
    type: "boolean",
  },
  {
    code: 662,
    description: "allarme mancanza comunicazione modbus master",
    type: "boolean",
  },
];
