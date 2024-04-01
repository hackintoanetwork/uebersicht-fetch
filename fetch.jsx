import { run } from "uebersicht";

const opacity = "cc";
const color = "#ffffff" + opacity;
const tintColor = "#6e27f2" + opacity;

export const className = `
    bottom: 68%;
    left: 0;
    box-sizing: border-box;
    margin: auto;
    padding: 20px 20px 20px;
    color: ${color};
    font-family: Andale Mono;
    font-size: 0.8em;

    b {
        color: ${tintColor};
    }
`;

export const render = ({
    hostname,
    os,
    model,
    kernel,
    cpu,
    gpu,
    uptime,
    packages,
    memory,
    battery,
    localIp,
    mac,
    ssid,
    routerIp,
}) => {
    const SystemSection = () => (
        <div id="system">
            {" "}
            <div>
                <b>┌ {hostname}</b>
            </div>
            <div>
                <b>│ OS: </b>
                {os}
            </div>
            <div>
                <b>│ Model: </b>
                {model}
            </div>
            <div>
                <b>│ Kernel: </b>
                {kernel}
            </div>
            <div>
                <b>│ Uptime: </b>
                {uptime}
            </div>
            <div>
                <b>│ Packages: </b>
                {packages}
            </div>
        </div>
    );

    const HardwareSection = () => (
        <div id="hardware">
            {" "}
            <div>
                <b>
                    │<br />├ CPU:{" "}
                </b>
                {cpu}
            </div>
            <div>
                <b>│ GPU: </b>
                {gpu}
            </div>
            <div>
                <b>│ Memory: </b>
                {memory}
            </div>
            <div>
                <b>│ Battery: </b>
                {battery}
            </div>
        </div>
    );

    const NetworkSection = () => (
        <div id="network">
            {" "}
            <div>
                <b>
                    │<br />├ Local IP:{" "}
                </b>
                {localIp}
            </div>
            <div>
                <b>│ Router IP: </b>
                {routerIp}
            </div>
            <div>
                <b>│ Mac Address: </b>
                {mac}
            </div>
            <div>
                <b>│ SSID: </b>
                {ssid}
            </div>
        </div>
    );

    return (
        <div>
            <SystemSection />
            <HardwareSection />
            <NetworkSection />
        </div>
    );
};

export const updateState = (data, previousState) => ({
    ...previousState,
    ...data,
});

const execute = (action, interval) => {
    action();

    setInterval(action, interval);
};

export const command = async (dispatch) => {
    // Most of the scripts are from https://github.com/dylanaraps/neofetch/blob/master/neofetch
    run(`./fetch.widget/scripts/runOnce.sh`).then((data) => {
        const splitted = data.split("\n");
        dispatch({
            hostname: splitted[0],
            os: splitted[1],
            model: splitted[2],
            kernel: splitted[3],
            cpu: splitted[4],
            gpu: splitted[5],
            mac: splitted[6],
        });
    });

    execute(() => {
        run("./fetch.widget/scripts/runEveryMinute.sh").then((data) => {
            const splitted = data.split("\n");
            dispatch({
                uptime: splitted[0],
                memory: splitted[1],
                battery: splitted[2],
                date: splitted[3],
                localIp: splitted[4],
                routerIp: splitted[5],
                ssid: splitted[6],
            });
        });
    }, 1000 * 60);
};

export const refreshFrequency = false;