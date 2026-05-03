import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors(/*{origin: "my-frontend-versel-url-adress"}*/));
app.use(helmet());

app.use(express.json());

app.use((req, res, next) => {
  console.log(`New request: ${req.method} ${req.url}`);
  next();
});

app.use((req, res, next) => {
  console.log(`Midlware A`);
  next();
});

// const authMiddleware = (req, res, next) => {
//   console.log('Check auth');
//   next();
// };

// app.get('/hello', () => {
//   console.log('GET /hello');
// });

// app.get('/goodbye', () => {
//   console.log('GET /goodbye');
// });

// app.post('/create-stuff', () => {
//   console.log('POST /create-stuff');
// });

app.get('/test-error', () => {
  throw new Error('Test error');
});

app.get(
  '/students',
  /**{authMiddleware,}**/ (req, res) => {
    res.status(200).json({ message: 'List of students' });
  },
);

app.get('/students/:studentsId', (req, res) => {
  const { studentsId } = req.params;

  res.status(200).json({ message: `Student with ID ${studentsId}` });
});

app.post('/students', (req, res) => {
  console.log(req.body);
  res.status(201).json({ message: `Student ${req.body.name} created` });
});

// FOR GET, POST, DELETE, PATCH
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

app.use((err, req, res, next) => {
  const isProd = process.env.NODE_ENV === 'production';

  res.status(500).json({
    message: isProd ? 'Server Error' : err.stack,
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
