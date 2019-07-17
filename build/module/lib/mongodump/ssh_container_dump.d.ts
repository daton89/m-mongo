import Dump from './dump';
export default class SSHContainerDump extends Dump {
    exec(): Promise<void>;
    private dockerCp;
    private dockerExec;
}
