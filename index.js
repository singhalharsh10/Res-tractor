const express = require('express')
const app = express()
const upload = require('express-fileupload')
const pdfparese = require('pdf-parse')
const fs = require('fs')
const csv = require('fast-csv')

app.use(upload())
app.use(express.json())



app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.post('/', (req, res) => {
    if (req.files) {
        console.log(req.files)
        let email
        let linked
        let pno
        let textlin
        let tectle
            //res.send(req.files)
        req.files.file.mv('./' + req.files.file.name, (err) => {
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                const pdffile = fs.readFileSync(req.files.file.name)
                pdfparese(pdffile).then((data) => {
                        console.log(data)
                        email = data.text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi)
                        linked = data.text.match(/(linkedin\.com\/in\/[A-z0-9_-]+)/gi)
                        pno = data.text.match(/([6789]\d\d\d\d\d\d\d\d\d+)/gi)
                        textlin = data.text.split(/\r\n|\r|\n/).length;
                        tectle = data.text.length - 2 * textlin;



                    }).then(() => {
                        var ws = fs.createWriteStream('my.csv');
                        csv.write([
                                ['emailid', email],
                                ["linkedin", linked],
                                ["phoneNo", pno],
                                ["textLines", textlin],
                                ["textLength", tectle]
                            ], { headers: true }

                        ).pipe(ws)

                    })
                    .catch((err) => {
                        res.send(err)
                    })
                res.sendFile(__dirname + '/download.html')
                    // res.send('done')

            }
        })
    } else
        res.sendFile('not find');
})

app.post('/download', (req, res) => {
        res.download('my.csv')
    })
    // const pdffile=fs.readFile()

app.listen(5000, (err) => console.log("connecttion set at port 5000"));