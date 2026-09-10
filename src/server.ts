import { environments } from '@/config/enviroment';
import { errorMiddleware } from '@/middlewares/error.middleware';
import indexRoute from '@/routes/index';
import { orderCleanup } from '@/utils/cron.util';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRoute);
app.use('/api/v1', indexRoute);

app.use(errorMiddleware);

const PORT = environments.PORT;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    orderCleanup();
});
