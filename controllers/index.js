module.exports.index = function (req, res) {
  //首頁

  // console.log('req.session',req.session)
  if (req.session.user || req.session.passport.user){
    req.flash('error ','已登入');
    // console.log('checkoutNotLogin controllers index',req.flash())
    res.render('main');
  }else {
    res.render('gate',{problem:null});
  }


};