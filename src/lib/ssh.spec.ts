import test from 'ava';
import conf from './conf';
import { connect, exec, end } from './ssh';

test('ssh', t => {
  t.plan(1);

  return new Promise(async resolve => {
    const connections = conf.get('sshConnections');

    await connect(connections[0]);

    console.log('connected');

    const command = 'echo yes';
    exec(command).subscribe(
      stout => {
        console.log('stout', stout);
        t.regex(stout, new RegExp('yes'));
        resolve();
      },
      err => {
        console.log('err', err);
        t.fail(err);
      },
      async () => {
        console.log('ended');
        await end();
        // t.pass();
      }
    );
  });
});
