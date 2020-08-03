const forky = require('forky');
const cluster = require('cluster');
const { WEB_CONCURRENCY } = require('./config');

const workerId = () => {
    if(cluster.isWorker) {
        return cluster.worker.id;
    }
    return 'Undefined';
}
  
forky({
    path: 'src/app/index.js',
    workers: WEB_CONCURRENCY,
    enable_logging: true
});


process.on('exit', (code) => {
    console.log('Exit code: ' + code + 'Worker: ' + workerId);
    forky.disconnect();
});

process.on('uncaughtException', (err) => {
    forky.disconnect();
    throw new Error(err.message);
});
