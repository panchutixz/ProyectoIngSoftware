import cron from "node-cron";
import { marcarOlvidadasCron } from "../controllers/bicicletas.controller.js";

cron.schedule("* * * * *", async () => {
  console.log("Ejecutando nodecrone: Marcando bicicletas olvidadas");
  await marcarOlvidadasCron();
});

//para todos los dias a las 21 horas seria cron.schedule("0 21 * * *", async () => {
// astericos todo es ejecutando cada minuto