"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const ssh_1 = require("./ssh");
// test('ssh', t => {
//   t.plan(1);
//   return new Promise(async resolve => {
//     const connection = {
//       host: 'daton.it',
//       port: 22,
//       username: 'root',
//       privateKey: process.env.PRIVATE_KEY || 'C:\\Users\\tonyd\\.ssh\\daton.it'
//     };
//     console.log('connection =>', connection);
//     await connect(connection);
//     const command = 'echo yes';
//     exec(command).subscribe(
//       stout => {
//         console.log('stout', stout);
//         t.regex(stout, new RegExp('yes'));
//         resolve();
//       },
//       err => {
//         console.log('err', err);
//         t.fail(err);
//       },
//       async () => {
//         console.log('ended');
//         await end();
//       }
//     );
//   });
// });
ava_1.default('ssh', t => {
    t.plan(3);
    t.is(typeof ssh_1.connect, 'function');
    t.is(typeof ssh_1.exec, 'function');
    t.is(typeof ssh_1.end, 'function');
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3NoLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3NzaC5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsOENBQXVCO0FBQ3ZCLCtCQUEyQztBQUUzQyxxQkFBcUI7QUFDckIsZUFBZTtBQUVmLDBDQUEwQztBQUMxQywyQkFBMkI7QUFDM0IsMEJBQTBCO0FBQzFCLGtCQUFrQjtBQUNsQiwwQkFBMEI7QUFDMUIsa0ZBQWtGO0FBQ2xGLFNBQVM7QUFFVCxnREFBZ0Q7QUFFaEQsaUNBQWlDO0FBRWpDLGtDQUFrQztBQUVsQywrQkFBK0I7QUFDL0IsbUJBQW1CO0FBQ25CLHVDQUF1QztBQUN2Qyw2Q0FBNkM7QUFDN0MscUJBQXFCO0FBQ3JCLFdBQVc7QUFDWCxpQkFBaUI7QUFDakIsbUNBQW1DO0FBQ25DLHVCQUF1QjtBQUN2QixXQUFXO0FBQ1gsc0JBQXNCO0FBQ3RCLGdDQUFnQztBQUNoQyx1QkFBdUI7QUFDdkIsVUFBVTtBQUNWLFNBQVM7QUFDVCxRQUFRO0FBQ1IsTUFBTTtBQUVOLGFBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUU7SUFDZCxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRVYsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLGFBQU8sRUFBRSxVQUFVLENBQUMsQ0FBQztJQUNqQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sVUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQzlCLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxTQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDL0IsQ0FBQyxDQUFDLENBQUMifQ==