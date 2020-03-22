import test from 'ava';
import EventEmitter from 'events';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
const readFileSyncStub = sinon.spy();
const ssh = proxyquire('./ssh', {
    ssh2: {
        Client: class Client extends EventEmitter {
            connect() {
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
test('ssh connect', async (t) => {
    t.plan(1);
    await ssh.connect(connectionParams);
    t.true(readFileSyncStub.called);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3NoLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3NzaC5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sSUFBSSxNQUFNLEtBQUssQ0FBQztBQUN2QixPQUFPLFlBQVksTUFBTSxRQUFRLENBQUM7QUFDbEMsT0FBTyxVQUFVLE1BQU0sWUFBWSxDQUFDO0FBQ3BDLE9BQU8sS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUUxQixNQUFNLGdCQUFnQixHQUFHLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUVyQyxNQUFNLEdBQUcsR0FBRyxVQUFVLENBQUMsT0FBTyxFQUFFO0lBQzlCLElBQUksRUFBRTtRQUNKLE1BQU0sRUFBRSxNQUFNLE1BQU8sU0FBUSxZQUFZO1lBQ2hDLE9BQU87Z0JBQ1osT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUU7b0JBQ3BCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ3JCLENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQztTQUNGO0tBQ0Y7SUFDRCxFQUFFLEVBQUU7UUFDRixZQUFZLEVBQUUsZ0JBQWdCO0tBQy9CO0NBQ0YsQ0FBQyxDQUFDO0FBRUgsTUFBTSxnQkFBZ0IsR0FBRztJQUN2QixJQUFJLEVBQUUsYUFBYTtJQUNuQixJQUFJLEVBQUUsRUFBRTtJQUNSLFFBQVEsRUFBRSxNQUFNO0lBQ2hCLFVBQVUsRUFBRSxHQUFHLFNBQVMsY0FBYztDQUN2QyxDQUFDO0FBRUYsSUFBSSxDQUFDLGFBQWEsRUFBRSxLQUFLLEVBQUMsQ0FBQyxFQUFDLEVBQUU7SUFDNUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNWLE1BQU0sR0FBRyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ3BDLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDbEMsQ0FBQyxDQUFDLENBQUMifQ==