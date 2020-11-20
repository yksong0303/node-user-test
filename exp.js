const exp = require('express');
const dbInfo = require('./db-config');
const oracleDb = require('oracledb');
const port = 80;

var server = exp();


var getNodeTests = async function (params){
    console.log(params)
    var con = await oracleDb.getConnection(dbInfo);
    var sql = 'select * from node_test';
    if(params){
        sql +=' where 1=1 ';
        if(params.nt_num){
            sql+=' and nt_num=:nt_num ';
        }
        if(params.nt_name){
            sql += ' and nt_name=:nt_name ';
        }
    }
    console.log(sql);
    var result = await  con.execute(sql,params);

    var meta = result.metaData;
    var rows = result.rows;
    
    var jsonArr = [];
    for (var i=0;i<rows.length;i++) {
        //console.log(i+','+meta[i]['name'])
        var row = result.rows[i]
        var nt={}
        for (var j=0;j<meta.length;j++) {
            var md = meta[j]
            nt[md.name] = row[j]
        }
        jsonArr.push(nt)
    }
   return jsonArr;
};


server.get('/nodetests',async function(req,res,next){
    // console.log(req.query);
    // console.log(req.nt_num);
    // console.log(req.nt_name);
    var jsonArr= await getNodeTests(req.query);
    res.json(jsonArr).send();
})
server.get('/views/*',function(req,res){
    // console.log(__dirname);
    // console.log(req.url);
    res.sendFile(__dirname+req.url+'.html');
})
server.listen(port,function(){
    console.log('server started ${port} port');
})