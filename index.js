const pm2 = require('./pm2');
const Pm2 = require('./pm2');

const pidMap = {};

function needToRestart(ps) {
  console.log(`CPU load: ${ps.monit.cpu} %`);
  return ps.monit.cpu > 90;
}

async function monitoring() {
  const ps = await Pm2.psList();

  console.log(`find ${ps.length} processes`);
  for(let i = 0; i < ps.length; ++i) {
    const pid = ps[i].pid;
    pidMap[pid] = pidMap[pid] || 0;

    console.log(`pid: ${pid} - ${ps[i].name} - checking ...`);

    if(needToRestart(ps[i])) {
      pidMap[pid]++;
    } else {
      pidMap[pid] = 0;
    }

    if(pidMap[pid] === 4) {
      console.log(`pid: ${ps[i].pid} restarting ...`);
      await pm2.restart(ps[i].pm_id);
    }

    console.log(`pid: ${ps[i].pid} done`);
  }
  console.log("");
}

async function main() {
  console.log(`connecting to pm2 ...`);
  await Pm2.connect();

  console.log(`listen to pm2 processes ...`);
  setInterval(() => monitoring(), 30000);
}

main().then(() => {}).catch((err) => console.log(`start-error: ${err}`));
