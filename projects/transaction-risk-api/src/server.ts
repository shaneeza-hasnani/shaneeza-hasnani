import express from "express";
import { assessRisk, isTransaction } from "./risk";

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/assess-risk", (req, res) => {
  if (!isTransaction(req.body)) {
    res.status(400).json({
      error: "Invalid transaction. Required: transactionId (string), amount (nonnegative number), country (string), isInternational (boolean), accountAgeDays (nonnegative integer)."
    });
    return;
  }
  res.json(assessRisk(req.body));
});

app.use((err: Error & { status?: number }, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err.status === 400) {
    res.status(400).json({ error: "Malformed JSON request body" });
    return;
  }
  next(err);
});

app.listen(port, () => {
  console.log(`Transaction Risk API running at http://localhost:${port}`);
});
