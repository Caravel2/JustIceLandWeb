exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['test/angularE2ETest/**/*Spec.js'],

  baseUrl:'http://localhost:8000/',

  capabilities:{
    'browserName':'chrome'
  },

  jasmineNodeOpts:{
    showColors:true
  }
};