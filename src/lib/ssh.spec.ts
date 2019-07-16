import test from 'ava';
import { connect, exec, end } from './ssh';

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

test('ssh', t => {
  t.plan(3);

  t.is(typeof connect, 'function');
  t.is(typeof exec, 'function');
  t.is(typeof end, 'function');
});
