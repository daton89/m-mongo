import { DumpMaker } from './dump';
export default class SSHContainerDump extends DumpMaker {
    exec(): Promise<void>;
    private dockerCp;
    private dockerExec;
}
