/**
 * Backend realizado por: Jhusef Alfonso López Parra
 */
const cronEmail = require("./cron");
const app = require("./app");
const port = process.env.PORT || 5000;

const cron = require("cron");

const job = new cron.CronJob("0 16 * * *", function () {
  cronEmail.EmailService
    .then(response => console.info(response))
    .catch(errors => console.error(errors))
});

job.start();

app.listen(port, () => {
  console.info(
    `Servidor iniciado en el puerto: ${port}; en modo: ${process.env.NODE_ENV}.`
  );
});
