import { AppDataSource } from "./data-source";
import express from "express";
import { userRouter } from "./routes/userRouter";
import { productRouter } from "./routes/productRouter";
import { cartRouter } from "./routes/cartRouter";
import { orderRouter } from "./routes/orderRouter";

AppDataSource.initialize()
  .then(() => {
    console.log("Все работает");
  })
  .catch((error) => {
    console.log(error);
  });

const PORT = process.env.PORT || 8080;
const app = express();

app.use(express.json());
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);

const start = () => {
  try {
    app.listen(PORT, () => {
      console.log("Server started on port ", PORT);
    });
  } catch (e) {
    console.log(e);
  }
};

start();
