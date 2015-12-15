'use strict';

var express     = require('express');

    express()
    .use(express.static('.'))
    .listen(9091);
