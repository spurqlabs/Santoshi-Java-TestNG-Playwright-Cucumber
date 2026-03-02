module.exports = {
  default: {
    require: ["steps/**/*.js"],
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