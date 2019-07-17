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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3NoLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3NzaC5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sSUFBSSxNQUFNLEtBQUssQ0FBQztBQUN2QixPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsTUFBTSxPQUFPLENBQUM7QUFFM0MscUJBQXFCO0FBQ3JCLGVBQWU7QUFFZiwwQ0FBMEM7QUFDMUMsMkJBQTJCO0FBQzNCLDBCQUEwQjtBQUMxQixrQkFBa0I7QUFDbEIsMEJBQTBCO0FBQzFCLGtGQUFrRjtBQUNsRixTQUFTO0FBRVQsZ0RBQWdEO0FBRWhELGlDQUFpQztBQUVqQyxrQ0FBa0M7QUFFbEMsK0JBQStCO0FBQy9CLG1CQUFtQjtBQUNuQix1Q0FBdUM7QUFDdkMsNkNBQTZDO0FBQzdDLHFCQUFxQjtBQUNyQixXQUFXO0FBQ1gsaUJBQWlCO0FBQ2pCLG1DQUFtQztBQUNuQyx1QkFBdUI7QUFDdkIsV0FBVztBQUNYLHNCQUFzQjtBQUN0QixnQ0FBZ0M7QUFDaEMsdUJBQXVCO0FBQ3ZCLFVBQVU7QUFDVixTQUFTO0FBQ1QsUUFBUTtBQUNSLE1BQU07QUFFTixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFO0lBQ2QsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVWLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDakMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztJQUM5QixDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQy9CLENBQUMsQ0FBQyxDQUFDIn0=