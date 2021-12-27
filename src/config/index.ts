import * as _ from "lodash";
import * as nconf from 'nconf';
const staticConfig = require('./static/index');

require('dotenv').config();

const environment = process.env.NODE_ENV || 'development';
const config:any =  _.extend(
  {
    ...staticConfig,
    environment,
  },
  // tslint:disable-next-line: no-var-requires
  require(`${ __dirname }/env/${ environment }`),
  nconf.get(),
);

export default config; 