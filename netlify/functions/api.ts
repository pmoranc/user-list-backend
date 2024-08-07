import express, { Router, Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';
import serverless from "serverless-http";


const api = express();
const router = Router();

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

router.get('/users', async (req: Request, res: Response) => {
  try {
    const response = await axios.get('https://reqres.in/api/users');
    data = response.data.data;
    res.json(response.data.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data');
  }
});

router.post('/update-user', (req: Request, res: Response) => {
  const { id, first_name, last_name, email, avatar } = req.body;

  const updatedData = data.map((user: any) => {
      if (user.id === id) {
          return { ...user, first_name, last_name, email, avatar };
      }
      return user;
  });

  data = updatedData;

  res.json({ message: 'Data updated successfully', data });
});

router.put('/create-user', (req: Request, res: Response) => {
	const {  first_name, last_name, email, avatar } = req.body;
  data.push({ id: data.length + 1, first_name, last_name, email, avatar });
	res.json({ message: 'Data updated successfully', data: data });
});

router.delete('/delete-user/:id', (req: Request, res: Response) => {
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