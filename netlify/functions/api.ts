import express, { Router, Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';
import NodeCache from 'node-cache';
import serverless from "serverless-http";


// const app = express();
const api = express();
const router = Router();

// const port = 3000;
// const port = process.env.PORT || 3000; // Use environment variable or default to 3000

router.use(express.json());
router.use(cors());


interface ApiResponse {
  [x: string]: any;
  data: any;
}

let data: ApiResponse = {
  data: null
}

router.get('/', (req: Request, res: Response) => {
  res.send('Hi, thanks for the opportunity!');
});

// router.get('/api/users', async (req: Request, res: Response) => {
//   try {
//     const response = await axios.get('https://reqres.in/api/users');
//     data = response.data.data;
//     res.json(data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error fetching data');
//   }
// });

const cache = new NodeCache();

router.get('/api/users', async (req: Request, res: Response) => {
  try {
    let cachedData = cache.get('users');
    if (cachedData) {
      return res.json(cachedData);
    }
    const response = await axios.get('https://reqres.in/api/users');
    cache.set('users', response.data.data);
    res.json(response.data.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data');
  }
});

// router.post('/api/update-user', (req: Request, res: Response) => {
//   const { id, first_name, last_name, email, avatar } = req.body;

//   const updatedData = data.map((user: any) => {
//       if (user.id === id) {
//           return { ...user, first_name, last_name, email, avatar };
//       }
//       return user;
//   });

//   data = updatedData;

//   res.json({ message: 'Data updated successfully', data });
// });

router.post('/api/update-user', (req: Request, res: Response) => {
  const { id, first_name, last_name, email, avatar } = req.body;

  const cachedData = cache.get('users');
  console.log(cachedData);
  return;
  if (cachedData) {
    console.log(cachedData);
  }

  const updatedData = cachedData.map((user: any) => {
      if (user.id === id) {
          return { ...user, first_name, last_name, email, avatar };
      }
      return user;
  });

  cache.set('users', updatedData);

  res.json({ message: 'Data updated successfully', data: updatedData });
});

router.put('/api/create-user', (req: Request, res: Response) => {
	const {  first_name, last_name, email, avatar } = req.body;
  data.push({ id: data.length + 1, first_name, last_name, email, avatar });
	res.json({ message: 'Data updated successfully', data: data });
});

router.delete('/api/delete-user/:id', (req: Request, res: Response) => {
	const { id } = req.params;
	const numericId = parseInt(id, 10);

	const updatedData = data.filter((user: any) => {
		return user.id !== numericId
	});
	
	data = updatedData;
	res.json({ message: 'Data updated successfully', data });
});

api.use("/api/", router);

export const handler = serverless(api);

// app.listen(port, () => {
//   console.log(`Server started on port ${port}`);
// });

// export default app;
// module.exports = app;