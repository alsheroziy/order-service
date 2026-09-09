import express from 'express';
import { environments } from './config/enviroment.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = environments.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
