var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var async = require('async');
var Position = require('./position');

// Set the headers
var headers = {
    'User-Agent':       'Super Agent/0.0.1',
    'Content-Type':     'application/x-www-form-urlencoded'
}

// Configure the request
var options = {
    url: 'https://www.bundesanzeiger.de/ebanzwww/wexsservlet?page.navid=to_nlp_start',
    method: 'GET',
    headers: headers
}

var cookie;
var host = 'https://www.bundesanzeiger.de';

var formData = {
  '(page.navid=nlpstarttonlpresultlist_search)':'Leerverkäufe+suchen'
};

getShortData = function(followUpUrl,cb){
  if(followUpUrl){
    options.url = followUpUrl
  }

  var currentTime = Date.now();
// Start the request
request(options, function (error, response, body) {
 var data = [];
   if (!error && response.statusCode == 200) {
       // Print out the response body
       cookie = response.headers["set-cookie"];
       //console.log(response);
       $ = cheerio.load(body);
       //console.log($('tr').text());
       $('table.result tr').each(function(idx, el){
          var position = {};
            $(this).children().each(function(idx,el){
              position[nameArray[idx]]=$(this).text().replace('» Historie','').replace(' %','').replace(',','.').trim();
              //singleRow.push($(this).text().replace('» Historie','').replace(' %',''));
            });
          position['CrawlDate'] = currentTime;
          console.log(position);
          data.push(position);
       });

       var lastIndex = null;
       var followUpUrl = null;

       if (followUpUrl === null){
         if($('.generic_search_table_bottom li.pagelinks ul li.last a').attr('href')){
          lastIndex = $('.generic_search_table_bottom li.pagelinks ul li.last a').attr('href').slice(-2);
          followUpUrl = $('.generic_search_table_bottom li.pagelinks ul li.last a').attr('href').slice(0,-2);
        }
      }
      var result = {
        data: data,
        lastIndex: lastIndex,
        followUpUrl:followUpUrl
      };

      cb(null,result)
   } else {
   cb(null,null)
 }
});
}

var nameArray = ['positionHolder','emitter','ISIN','position','positionDate'];

getFullShortData = function(cb){
var shortData = [];


var initialResult = getShortData(null,function(err,initialResult){
  //console.log(initialResult);
  if(initialResult.hasOwnProperty('data')){
    shortData = shortData.concat(initialResult.data);
  }
  var lastPage = initialResult.lastIndex;
  var followUpLink = host+initialResult.followUpUrl;

  async.times(lastPage,function(n,next){
    if(n>1){
      getShortData(followUpLink+n,function(err,res){
        next(err,res)
      })
    }else{next(null,{})}
  }, function(err, results){

 for(idx in results){
   if(results[idx].hasOwnProperty('data'))
    shortData = shortData.concat(results[idx].data);
}

// fs.writeFile("./test",JSON.stringify( shortData), function(err) {
//     if(err) {
//         cb(err,null);
//     }
//     console.log("The file was saved!");
//
// });
  cb(null,shortData);
});


});
}

//shortData.push(initialResult.data);
//lastPage = initialResult.lastIndex;

// getFullShortData(function(err,res){
//   console.log("Final results");
//   console.log(res);
// })



getShortDataByEntity = function(entityName,entityValue,cb){
  getFullShortData(function(err,res){
    var shortData =[];
    for(idx in res){
      if(res[idx].hasOwnProperty(entityName)){
        if(res[idx][entityName] === entityValue){
          shortData = shortData.concat(res[idx]);
        }
      }
    }
    cb(null,shortData);
  });
};

getShortDataByEmitter = function(name,cb){
  getShortDataByEntity('emitter',name,function(err,res){
    if(err){
      cb(err,null);
    } else {
      cb(null,res);
    }
  });
}
getShortDataByIsin= function(name,cb){
  getShortDataByEntity('ISIN',name,function(err,res){
    if(err){
      cb(err,null);
    } else {
      cb(null,res);
    }
  });
}
getShortDataByDate= function(name,cb){
  getShortDataByEntity('positionDate',name,function(err,res){
    if(err){
      cb(err,null);
    } else {
      cb(null,res);
    }
  });
}
getShortDataByHolder= function(name,cb){
  getShortDataByEntity('positionHolder',function(err,res){
    if(err){
      cb(err,null);
    } else {
      cb(null,res);
    }
  });
}

// getShortDataByEmitter('AIXTRON SE',function(err,res){
//     console.log(res);
// });

// getShortDataByDate('2016-04-07',function(err,res){
//     console.log(res);
// });

// getShortDataByIsin('DE000A0WMPJ6',function(err,res){
//     console.log(res);
// });

getByIsin = function(req,res){
  if(!req.params.isin){
    return next(err);
  }else {
    getShortDataByIsin(req.params.isin,function(err,result){
      if(err){
        return next(err);
      }else{
        res.json(result);
      }
    });
  }
};

getByEmitter = function(req,res){
  if(!req.params.emitter){
    return next(err);
  }else {
    getShortDataByEmitter(req.params.emitter,function(err,result){
      if(err){
        return next(err);
      }else{
        res.json(result);
      }
    });
  }
};

getByDate = function(req,res){
  if(!req.params.date){
    return next(err);
  }else {
    getShortDataByDate(req.params.date,function(err,result){
      if(err){
        return next(err);
      }else{
        res.json(result);
      }
    });
  }
};

getByHolder = function(req,res){
  if(!req.params.holder){
    return next(err);
  }else {
    getShortDataByHolder(req.params.holder,function(err,result){
      if(err){
        return next(err);
      }else{
        res.json(result);
      }
    });
  }
};

exports.getAllPositions = function(){
  getFullShortData(function(err,result){

  Position.collection.drop( function(err, response) {
    console.log(response);
  });

  Position.collection.insert(result,insertCb);
    function insertCb(err,docs){
      if(err){
        console.log("Error inserting crawling results: "+err);
        //res.json({status:'err'});
        return({status:'err'});
      } else {
        console.log("Successfully crawled current short position data.");
        //res.json({status:'ok'});
        return({status:'ok'});
      }
    }
  });
}
