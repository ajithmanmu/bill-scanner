#### Bill Scanner App - WIP

A simple implementation of a bill scanner API using Express + Python + Redis. 
We use a Python wrapper to grab text from a bill image using the Tesseract Engine (https://github.com/tesseract-ocr/tesseract)

An Express app is setup that accepts the path of a bill image and spits out the text from it.

Endpoint: `/compute?filename=<filename>`

Response:
```
{
    "address": "[123543 MAIN ST,,PORTCITY,CA]",
    "total": "TOTAL: $119.88",
    "date": "Mon 3/07/2017 10:45AM",
    "imageText": "123543 MAIN ST,,PORTCITY,CALIFORNIA 19210,, ,,Mon 3/07/2017 10:45AM,, , ,,74-013 Hard EVA Travel Case x1 $9.99,18-326 70 in1 Magnetic Driver Kitx1 $23.99,,TOTAL: $119.88,Incl. VAT (20%): $19.98,Bank Card# HRHK HKHK HHH 7211,Response: APPROVED,,INV. 654238 AUTH. 192107,, ,,Receipts are required for all refunds,Refunds must be made within 30 days"
}
```
Redis is used as a database to store the results from the Tesseract Engine.

#### Setup

##### Express
```
cd bill-scanner
npm install
npm run dev
```
##### Python OCR
```
python3 setup.py install
```
