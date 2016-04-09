var Position = require('./position');

var

exports.getByIsin = function(req,res){
  if(!req.params.isin){
    return next(err);
  }else {
    Position.find({'ISIN': req.params.isin},function(err,result){
      if(err){
        return next(err);
      }else{
        result.forEach(function(v){delete v._id});
        console.log(result);
        res.json(result);
      }
    });
  }
};

exports.getByEmitter = function(req,res){
  if(!req.params.emitter){
    return next(err);
  }else {
    Position.find({'emitter': req.params.emitter},function(err,result){
      if(err){
        return next(err);
      }else{
        result.forEach(function(v){ delete v._id});
        res.json(result);
      }
    });
  }
};

exports.getByDate = function(req,res){
  if(!req.params.date){
    return next(err);
  }else {
    Position.find({'positionDate': req.params.date},function(err,result){
      if(err){
        return next(err);
      }else{
        result.forEach(function(v){ delete v._id});
        res.json(result);
      }
    });
  }
};

exports.getByHolder = function(req,res){
  if(!req.params.holder){
    return next(err);
  }else {
    Position.find({'positionHolder': req.params.holder},function(err,result){
      if(err){
        return next(err);
      }else{
        result.forEach(function(v){ delete v._id});
        res.json(result);
      }
    });
  }
};
