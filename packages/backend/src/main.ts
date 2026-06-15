import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import * as dotenv from 'dotenv';
import 'express-async-errors';

import { AppDataSource } from './database/connection';
import authRouter from './modules/auth/auth.controller';
import institutionRouter from './modules/institution/institution.controller';
import { errorHandler } from './common/middleware/error.middleware';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:4200' }));
app.use(express.json());

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/institutions', institutionRouter);

// Error handling middleware should be registered last
app.use(errorHandler);

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected successfully');
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to database:', error);
  });

