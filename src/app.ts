import * as dotenv from 'dotenv'
dotenv.config();
import app from './server'
import config from './configs/config';



app.listen(config.port, () => {
  console.log(`running on http://localhost:${config.port}`)
  console.log(`environment: ${config.env}`)
})