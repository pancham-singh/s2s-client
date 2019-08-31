import { Router } from 'express';
import * as multer from 'multer';
import { uploadDir } from '../config';

const upload = multer({ dest: uploadDir });

const route = Router();

route.post('/', upload.single('file'), (req, res) => {
  if (!req.user || !req.user.roles.find((r) => r.name === 'admin')) {
    return res.status(400).json({ message: 'You are not allowed to perform this operation.' });
  }

  return res.json({ filename: req.file.filename });
});

export default route;
