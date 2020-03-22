import test from 'ava';
import EventEmitter from 'events';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

const readFileSyncStub = sinon.spy();

const ssh = proxyquire('./ssh', {
  ssh2: {
    Client: class Client extends EventEmitter {
      public connect() {
        process.nextTick(() => {
          this.emit('ready');
        });
      }
    }
  },
  fs: {
    readFileSync: readFileSyncStub
  }
});

const connectionParams = {
  host: 'my.host.net',
  port: 22,
  username: 'root',
  privateKey: `${__dirname}/ssh.spec.ts`
};

test('ssh connect', async t => {
  t.plan(1);
  await ssh.connect(connectionParams);
  t.true(readFileSyncStub.called);
});
