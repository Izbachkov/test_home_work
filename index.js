import express from 'express';
import bodyParser from 'body-parser';
import { createReadStream } from 'fs';
import crypto from 'crypto';
import http from 'http';
import webdriver from 'selenium-webdriver';

import appSrc from './app.js';

const app = appSrc(express, bodyParser, createReadStream, crypto, http, webdriver);

app.listen(process.env.PORT);
