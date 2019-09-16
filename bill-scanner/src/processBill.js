import { PythonShell } from 'python-shell';
import * as dbContext from './dbContext';

const invokePythonShell = async (pyArgs)=>{
    return new Promise ((resolve, reject)=>{
        let options = {
            mode: 'text',
            pythonPath: '/usr/local/opt/python/bin/python3.7',
            pythonOptions: ['-u'], // get print results in real-time
            scriptPath: './../ocr_core/',
            args: [JSON.stringify(pyArgs)] //Approach to send JSON as when I tried 'json' in mode I was getting error.
          };
          PythonShell.run('ocr_core.py', options, async (err, results)=>{
            if (err) reject(err);
            // console.log(JSON.parse(JSON.stringify(results.toString())));
            resolve(results);
          });
    })
};

export const processImage = async (filename) => {
    const pyArgs = {
        type: 'file',
        filename: `./uploads/${filename}`
    }
    try {
        const imageResults = await invokePythonShell(pyArgs);
        await dbContext.redisPromise().set(`file-text:${filename}`, JSON.parse(JSON.stringify(imageResults.toString())));
        return imageResults;
    } catch(err){
        throw err;
    }
};

export const processBillContent = async (billArray) => {
    const pyArgs = {
        type: 'address',
        addressstring: billArray.toString()
    } 
    let response;
    try {
        const addressResults = await invokePythonShell(pyArgs);
        console.log('addressResults', addressResults.toString());
        const totalElement = billArray.filter((item)=>{
            return item.indexOf('TOTAL') > -1;
        })
        console.log('totalElement', totalElement.toString());
        const dateElement = billArray.filter((item)=>{
            const find = item.match(/(\d{1,4}([.\-/])\d{1,2}([.\-/])\d{1,4})/g);
            return find;
        });
        console.log('dateElement', dateElement.toString());
        // const test = 'Mon 12/25/2017 10:45AM'.match(/(\d{1,4}([.\-/])\d{1,2}([.\-/])\d{1,4})/g)
        response = {
            address: addressResults.toString(),
            total: totalElement.toString(),
            date: dateElement.toString()
        };
    } catch(err){
        throw(err);
    };
    return response;
};

