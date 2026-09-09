import express from 'express';
import { environments } from '@/config/enviroment';
import { errorMiddleware } from '@/middlewares/error.middleware';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(errorMiddleware);

const PORT = environments.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
