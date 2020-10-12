const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res)=>{
   const endpoint = req.url;
   if( endpoint==='/start' ){
      fs.readFile('./index.html',(err, data)=>{
         res.writeHead(200, {'Content-Type': 'text/html'});
         res.write(data);
         res.end();
      });
   }
   if( endpoint==='/api' ){
      // ここに処理を記述してください。  
      req.on('data', function(chunk){
         let data = JSON.parse(chunk)

         // dataで他のnumで割り切れるものがあれば、FizzBuzz形式に文字を変化させる。
         dataReverse = data.obj.slice().reverse()
         data.obj = dataReverse.map((value, index)=>{
            for (let i=index+1;i < data.obj.length;i++){
               if (value.num % dataReverse[i].num === 0){
                  return { num: value.num, text: value.text + dataReverse[i].text }
               }
            }
            return {num : value.num, text: value.text}
            // numが小さい順にソートする。
         }).reverse()

         
         // dataにFizzBuzzの文字達を最小公倍数ごとに追加する。
         for (let m=0;m < data.obj.length;m++){
            for (let n=m+1; n < data.obj.length;n++){
               // 3つ以上のFizzBuzz状態は存在しないため、考慮しない。
               // 30より上は表示しないので、掛けて30を超えるものはdataにpushしない。
               if (data.obj[m].num * data.obj[n].num <= 30) {
                  data.obj.push({
                     "num": data.obj[m].num * data.obj[n].num,
                     "text": data.obj[m].text + data.obj[n].text
                  })
               }
            }
         }
         
         
         // それぞれの倍数ごとにanswerを変化させる。
         // 1-30の配列を作成し、倍数が出てきた場合に文字化する。
         let answer = {data: []}
         for (let i=1;i <=30; i++){
            // inpは、英字が入力されたかどうかを判定する。
            let inp = true
            for (let x=0;x < data.obj.length;x++){
               if (i % data.obj[x].num === 0) {
                  inp = false
                  answer.data[i-1] = data.obj[x].text
               }
            }
            if (inp) {
               answer.data[i-1] = i
            }
         }

         // answerを送信する。
         req.on('end', ()=>{
            res.end(JSON.stringify(answer))
         })
      })
   }
});
server.listen(8080); 