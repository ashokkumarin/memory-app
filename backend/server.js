const express = require("express");
const cors = require("cors");

const memoryRoutes = require("./routes/memoryRoutes");
const queryRoutes = require("./routes/queryRoutes");

require("./db/init");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/memory", memoryRoutes);
app.use("/query", queryRoutes);


app.listen(3000, () => console.log("Backend running on 3000"));