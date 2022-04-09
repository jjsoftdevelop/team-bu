module.exports = {
  apps: [
    {
      name: 'team-bu',
      script: 'app.js',
      instances: 'max', //負載平衡下的cpu數量
      exec_mode: 'cluster', //cpu 負載平衡模式
      max_memory_restart: '1G', //緩存多少記憶體重整
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss:SSS',
      env: {
        port: 3000, //指定伺服器上的port
        "NODE_ENV": "prod",
      }
    }
  ],
};
