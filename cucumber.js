module.exports = {
  default: {
    require: ["./features/stepDef/*.js","./features/hooks/**/*.js"],
    
    format: [
      "progress-bar",
      "html:test-results/reports/cucumber-report.html",
      "json:test-results/reports/cucumber-report.json",
      "junit:test-results/reports/cucumber-report.xml"
    ],
   parallel: 3,
    publishQuiet: true,
    formatOptions: {
      snippetInterface: "async-await"
    }
  }
};