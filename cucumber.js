module.exports = {
  default: {
    // Feature files path
    paths: ['features/**/*.feature'],
    
    
    
    // Step definitions and hooks paths
    require: [
      'features/stepdef/**/*.js',
      'features/Hooks/**/*.js'
    ],
    
    // Report formats
    format: [
      'progress-bar',
      'json:reports/cucumber-report.json',
      'html:reports/cucumber-report.html'
    ],
    
    // Parallel execution
    parallel: 2,
    
    // Tags to run (exclude @ignore)
    tags: 'not @ignore',
    
    // Retry failed tests
    retry: 1,
    
    // Timeout for steps
    timeout: 60000,
    
    // World parameters
    worldParameters: {
      env: 'qa'
    }
  },
};
