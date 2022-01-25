const fs = require('fs');
const csv = require('csv-parser');

function compare (arrayFile1, arrayFile2) {
    console.table(arrayFile1);
    console.table(arrayFile2);

    let intersection = arrayFile1.filter(x => arrayFile2.includes(x));
    let difference1 = arrayFile1.filter(x => !arrayFile2.includes(x));
    let difference2 = arrayFile2.filter(x => !arrayFile1.includes(x));
    let differenceSymmetric = difference1.concat(difference2);

    console.log(`Intersection - Both have`);
    console.log(intersection);
    console.log(`Difference1 - Present in first file but the second one`);
    console.log(difference1);
    console.log(`Difference2 - Present in the second file but the first one`);
    console.log(difference2);
    console.log(`DifferenceSymmetric - Different from both`);
    console.log(differenceSymmetric);
}

const myArgs = process.argv;

if (myArgs.length != 6) {
    console.log("Wrong number of arguments\n" +
    "npm start <csvPathFile1> <columnFile1> <csvPathFile2> <columnFile2>");
    process.exit(1);
}

const csvPathFile1 = myArgs[2];
const columnNameFile1 = myArgs[3];
const csvPathFile2 = myArgs[4];
const columnNameFile2 = myArgs[5];

const arrayFile1 = [];
const arrayFile2 = [];

fs.createReadStream(`input/${csvPathFile1}`)
    .pipe(csv())
    .on('data', function (row) {
        arrayFile1.push(row[columnNameFile1]);
    })
    .on('end', function () {
        fs.createReadStream(`input/${csvPathFile2}`)
            .pipe(csv())
            .on('data', function (row) {
                arrayFile2.push(row[columnNameFile2]);
            })
            .on('end', function () {
                compare(arrayFile1, arrayFile2);
            })
        ;
    })
;