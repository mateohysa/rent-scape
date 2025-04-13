import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { authMiddleware } from "./middleware/authMiddleware";
// import routes
import tenantRoutes from "./routes/tenantRoutes";
import managerRoutes from "./routes/managerRoutes";

// CONFIGURATIONS
dotenv.config();
const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
import propertyRoutes from "./routes/propertyRoutes";

// ROUTES
app.get("/", (req, res) => {
  res.send("This is the home route");
});
app.use("/properties", propertyRoutes);
app.use("/tenants", authMiddleware(["tenant"]), tenantRoutes);
app.use("/manager", authMiddleware(["manager"]), managerRoutes);

// SERVER
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
