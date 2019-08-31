module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      name: 'CU Super admin API',
      script: 'dist/index.js',
      env: {},
      env_development: {
        NODE_ENV: 'development'
      },
      env_release: {
        NODE_ENV: 'release'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ],
  deploy: {
    dev: {
      user: 'node',
      // TODO: Update with correct host
      host: '212.83.163.1',
      ref: 'origin/development',
      repo: 'git@bitbucket.org:gauravpassi/cu-super-admin-api.git',
      path: '~/cu-super-admin-api',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env dev'
    }
  }
};
