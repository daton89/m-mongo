import Restore from './restore';
export default class RestoreContainer extends Restore {
    exec(): Promise<void>;
    private connect;
    private sshDocker;
    private spawnDocker;
}
