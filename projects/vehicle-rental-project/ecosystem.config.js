module.exports = {
  apps: [{
    name: 'arctictrail',
    script: 'npm',
    args: 'start',
    cwd: '/home/aleks/websites/RVRentV2',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
