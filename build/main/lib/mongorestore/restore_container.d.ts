import Restore from './restore';
export default class RestoreContainer extends Restore {
    exec(): Promise<unknown>;
    private connect;
    private sshDockerCp;
}
