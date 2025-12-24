import cron from "node-cron";
import { marcarOlvidadas } from "../controllers/bicicletas.controller.js";

cron.schedule("* * * * *", async () => {
  console.log("Ejecutando nodecrone: Marcando bicicletas olvidadas");
  await marcarOlvidadas();
});

//para todos los dias a las 21 horas seira cron.schedule("0 21 * * *", async () => {
// astericos todo es ejecutando cada minuto