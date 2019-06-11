// tslint:disable:no-expression-statement
import test from 'ava';
import conf from './conf';
import { connect, exec, end } from './ssh';

test('connect', async t => {
  const connections = conf.get('sshConnections');
  try {
    await connect(connections[0]);
    t.pass();
  } catch (err) {
    t.fail();
  }
});

test('exec pass', async t => {
  const command = 'echo yes';

  exec(command).subscribe(
    stout => {
      t.is(stout, 'yes');
    },
    err => {
      t.fail(err);
    },
    () => {
      t.pass();
    }
  );
});

test('end', async t => {
  try {
    await end();
    t.pass();
  } catch (err) {
    t.fail();
  }
});
