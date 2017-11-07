/**
 * Created by KurtGranborg on 11/6/2017.
 */
'use strict';

const app = require('./app');

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
});