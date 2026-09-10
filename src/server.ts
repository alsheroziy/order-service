import fs from 'fs';
import path from 'path';
import { environments } from '@/config/enviroment';
import { errorMiddleware } from '@/middlewares/error.middleware';
import indexRoute from '@/routes/index';
import { orderCleanup } from '@/utils/cron.util';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const swaggerDocument = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'docs/swagger.json'), 'utf-8')
);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/', indexRoute);
app.use('/api/v1', indexRoute);

app.use(errorMiddleware);

const PORT = environments.PORT;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    orderCleanup();
});
