import express from "express";
import { usersRouter } from "./routes/users.js";
import { transfersRouter } from "./routes/transfers.js";

const app = express();
app.use(express.json());

app.use("/api/users", usersRouter);
app.use("/api/transfers", transfersRouter);

app.listen(3001, () => console.log("float api listening on :3001"));
