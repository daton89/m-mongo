"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const events_1 = __importDefault(require("events"));
const proxyquire_1 = __importDefault(require("proxyquire"));
const sinon_1 = __importDefault(require("sinon"));
const readFileSyncStub = sinon_1.default.spy();
const ssh = proxyquire_1.default('./ssh', {
    ssh2: {
        Client: class Client extends events_1.default {
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
ava_1.default('ssh connect', async (t) => {
    t.plan(1);
    await ssh.connect(connectionParams);
    t.true(readFileSyncStub.called);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3NoLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3NzaC5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsOENBQXVCO0FBQ3ZCLG9EQUFrQztBQUNsQyw0REFBb0M7QUFDcEMsa0RBQTBCO0FBRTFCLE1BQU0sZ0JBQWdCLEdBQUcsZUFBSyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBRXJDLE1BQU0sR0FBRyxHQUFHLG9CQUFVLENBQUMsT0FBTyxFQUFFO0lBQzlCLElBQUksRUFBRTtRQUNKLE1BQU0sRUFBRSxNQUFNLE1BQU8sU0FBUSxnQkFBWTtZQUNoQyxPQUFPO2dCQUNaLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFO29CQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNyQixDQUFDLENBQUMsQ0FBQztZQUNMLENBQUM7U0FDRjtLQUNGO0lBQ0QsRUFBRSxFQUFFO1FBQ0YsWUFBWSxFQUFFLGdCQUFnQjtLQUMvQjtDQUNGLENBQUMsQ0FBQztBQUVILE1BQU0sZ0JBQWdCLEdBQUc7SUFDdkIsSUFBSSxFQUFFLGFBQWE7SUFDbkIsSUFBSSxFQUFFLEVBQUU7SUFDUixRQUFRLEVBQUUsTUFBTTtJQUNoQixVQUFVLEVBQUUsR0FBRyxTQUFTLGNBQWM7Q0FDdkMsQ0FBQztBQUVGLGFBQUksQ0FBQyxhQUFhLEVBQUUsS0FBSyxFQUFDLENBQUMsRUFBQyxFQUFFO0lBQzVCLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDVixNQUFNLEdBQUcsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztJQUNwQyxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2xDLENBQUMsQ0FBQyxDQUFDIn0=