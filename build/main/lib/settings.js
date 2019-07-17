"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer = __importStar(require("./inquirer"));
const conf_1 = __importDefault(require("./conf"));
const chalk_1 = __importDefault(require("chalk"));
const ssh_1 = require("./ssh");
async function showMainMenu() {
    const answer = await inquirer.selectMainMenu();
    return answer;
}
exports.showMainMenu = showMainMenu;
function getStoragePath() {
    const storagePath = conf_1.default.get('settings.defaultStoragePath');
    return storagePath || process.cwd();
}
exports.getStoragePath = getStoragePath;
async function setStoragePath() {
    const { storagePath } = await inquirer.askStoragePath();
    conf_1.default.set('settings.defaultStoragePath', storagePath);
    return storagePath;
}
exports.setStoragePath = setStoragePath;
async function setSshConnection() {
    const answer = await inquirer.askSshConnection();
    const sshConnections = conf_1.default.get('sshConnections') || [];
    conf_1.default.set('sshConnections', [...sshConnections, answer]);
    console.log(`${chalk_1.default.bold.cyan('New connection saved:')}
    ${chalk_1.default.cyan('Host:')} ${chalk_1.default.magenta(answer.host)}
    ${chalk_1.default.cyan('Port:')} ${chalk_1.default.magenta(`${answer.port}`)}
    ${chalk_1.default.cyan('Username:')} ${chalk_1.default.magenta(answer.username)}
    ${chalk_1.default.cyan('PrivateKey:')} ${chalk_1.default.magenta(answer.privateKey)}
  `);
    return answer;
}
exports.setSshConnection = setSshConnection;
async function runSshCommand() {
    const connections = conf_1.default.get('sshConnections') || [];
    if (!connections.length) {
        console.log(chalk_1.default.yellow(`Ooops, no ssh connections found, let's setup a new one!`));
        const conn = await setSshConnection();
        connections.push(conn);
    }
    const { connectionHost, command } = await inquirer.askSshCommand(connections);
    const connection = connections.find(({ host }) => host === connectionHost);
    await ssh_1.connect(connection);
    await ssh_1.exec(command);
    ssh_1.end();
    return { connection, command };
}
exports.runSshCommand = runSshCommand;
async function showRestartOrExit() {
    const answer = await inquirer.askRestartOrExit();
    return answer;
}
exports.showRestartOrExit = showRestartOrExit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dGluZ3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3NldHRpbmdzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHFEQUF1QztBQUN2QyxrREFBMEI7QUFDMUIsa0RBQTBCO0FBQzFCLCtCQUE2RDtBQUV0RCxLQUFLLFVBQVUsWUFBWTtJQUNoQyxNQUFNLE1BQU0sR0FBRyxNQUFNLFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUUvQyxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBSkQsb0NBSUM7QUFFRCxTQUFnQixjQUFjO0lBQzVCLE1BQU0sV0FBVyxHQUFHLGNBQUksQ0FBQyxHQUFHLENBQUMsNkJBQTZCLENBQUMsQ0FBQztJQUU1RCxPQUFPLFdBQVcsSUFBSSxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDdEMsQ0FBQztBQUpELHdDQUlDO0FBRU0sS0FBSyxVQUFVLGNBQWM7SUFDbEMsTUFBTSxFQUFFLFdBQVcsRUFBRSxHQUFHLE1BQU0sUUFBUSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBRXhELGNBQUksQ0FBQyxHQUFHLENBQUMsNkJBQTZCLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFFckQsT0FBTyxXQUFXLENBQUM7QUFDckIsQ0FBQztBQU5ELHdDQU1DO0FBRU0sS0FBSyxVQUFVLGdCQUFnQjtJQUNwQyxNQUFNLE1BQU0sR0FBRyxNQUFNLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0lBRWpELE1BQU0sY0FBYyxHQUF1QixjQUFJLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxDQUFDO0lBRTVFLGNBQUksQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxHQUFHLGNBQWMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBRXhELE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxlQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQztNQUNuRCxlQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLGVBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztNQUNqRCxlQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLGVBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7TUFDdEQsZUFBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxlQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7TUFDekQsZUFBSyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxlQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7R0FDaEUsQ0FBQyxDQUFDO0lBRUgsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQWZELDRDQWVDO0FBRU0sS0FBSyxVQUFVLGFBQWE7SUFDakMsTUFBTSxXQUFXLEdBQUcsY0FBSSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUVyRCxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRTtRQUN2QixPQUFPLENBQUMsR0FBRyxDQUNULGVBQUssQ0FBQyxNQUFNLENBQUMseURBQXlELENBQUMsQ0FDeEUsQ0FBQztRQUNGLE1BQU0sSUFBSSxHQUFHLE1BQU0sZ0JBQWdCLEVBQUUsQ0FBQztRQUN0QyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3hCO0lBRUQsTUFBTSxFQUFFLGNBQWMsRUFBRSxPQUFPLEVBQUUsR0FBRyxNQUFNLFFBQVEsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUM7SUFFOUUsTUFBTSxVQUFVLEdBQXFCLFdBQVcsQ0FBQyxJQUFJLENBQ25ELENBQUMsRUFBRSxJQUFJLEVBQW9CLEVBQUUsRUFBRSxDQUFDLElBQUksS0FBSyxjQUFjLENBQ3hELENBQUM7SUFFRixNQUFNLGFBQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUUxQixNQUFNLFVBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUVwQixTQUFHLEVBQUUsQ0FBQztJQUVOLE9BQU8sRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLENBQUM7QUFDakMsQ0FBQztBQXhCRCxzQ0F3QkM7QUFFTSxLQUFLLFVBQVUsaUJBQWlCO0lBQ3JDLE1BQU0sTUFBTSxHQUFHLE1BQU0sUUFBUSxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFDakQsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQUhELDhDQUdDIn0=