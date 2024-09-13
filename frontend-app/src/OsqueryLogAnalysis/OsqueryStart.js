import fs from 'fs';
import readline from 'readline';
import {convert_to_seconds} from './helper_functions';

export default class OsqueryStart {

    constructor(osquery_log_file) {
        this.osquery_version_det = [];
        this.os_version_output = null;
        this.platform_output = null;
        this.osquery_start_pattern = /.* osquery worker initialized .*/;
        this.os_version_pattern = /^os_version/;
        this.platform_version_pattern = /^platform_info/;
        this.osquery_version_pattern = /^osquery_info/;
        this.osquery_received_events = /.* Osquery instance .* Received .*/;
        this.osquery_log_file = osquery_log_file;

        this.version_details = { 'os_version': {}, 'osquery_version': {}, 'platform_version': {} };
        this.osqstart_list = [];
        this.start_details = {};
        this.eventdetails = {};
        this.parse_osquery_log_for_start();
    }
    parse_start_log_line(line_number, osqstart_line) {
        let log_line_details = {};
        let log_temp = osqstart_line.split(/\s+/, 5);
        log_line_details['line_number'] = line_number;
        log_line_details['level'] = log_temp[0].charAt(0);
        log_line_details['day'] = log_temp[0].slice(1);
        log_line_details['timestamp'] = log_temp[1];
        log_line_details['time_in_seconds'] = convert_to_seconds(log_temp[0].slice(1), log_temp[1])
        log_line_details['worker_pid'] = log_temp[2]
        let temp = log_temp[4].replace('osquery worker initialized [', '').split(' ');
        try {
            if (temp[0].includes('version')) {
                log_line_details['version'] = temp[0].split('=')[1].replace(',', '');
            } else {
                log_line_details['version'] = 'Unknown';
            }
        } catch (error) {
            log_line_details['version'] = 'Unknown_Exception';
        }

        try {
            if (temp[1].includes('watcher')) {
                log_line_details['watcher_pid'] = temp[1].split('=')[1].replace(']', '');
            } else {
                log_line_details['watcher_pid'] = 'Unknown';
            }
        } catch (error) {
            log_line_details['watcher_pid'] = 'Unknown_Exception';
        }

        log_line_details['line'] = osqstart_line

        return log_line_details
    }

    parse_osversion(ln, line) {
        if (!(ln in this.version_details['os_version'])) {
            this.version_details['os_version'][ln] = {};
        }
        line.replace('os_version. ', '').split(',').forEach(temp => {
            let [key, value] = temp.split(':');
            this.version_details['os_version'][ln][key.trim()] = value.trim();
        });
    }

    parse_osqueryversion(ln, line) {
        if (!(ln in this.version_details['osquery_version'])) {
            this.version_details['osquery_version'][ln] = {};
        }
        line.replace('osquery_version. ', '').split(',').forEach(temp => {
            let [key, value] = temp.split(':');
            this.version_details['osquery_version'][ln][key.trim()] = value.trim();
        });
    }

    parse_platform(ln, line) {
        if (!(ln in this.version_details['platform_version'])) {
            this.version_details['platform_version'][ln] = {};
        }
        line.replace('platform_version. ', '').split(',').forEach(temp => {
            try {
                let [key, value] = temp.split(':');
                this.version_details['platform_version'][ln][key.trim()] = value.trim();
            } catch (error) {
                // Do Nothing
            }
        });
    }

    parse_osquery_events(ln, event_log_line) {
        let log_line_details = {};

        // Parsing osquery events
        let log_temp = event_log_line.split(/\s+/, 5);
        log_line_details['line_number'] = ln;
        log_line_details['level'] = log_temp[0].charAt(0);
        log_line_details['day'] = log_temp[0].slice(1);
        log_line_details['timestamp'] = log_temp[1];
        log_line_details['time_in_seconds'] = convert_to_seconds(log_temp[0].slice(1), log_temp[1]);
        log_line_details['worker_pid'] = log_temp[2];

        let temp = log_temp[4].replace('Osquery instance ', '').split(' ');
        let number_events = parseInt(temp[2].trim());
        let event_type = temp[3].trim();

        log_line_details['event_type'] = event_type;
        log_line_details['number_events'] = number_events;


        if (!(event_type in this.eventdetails)) {
            this.eventdetails[event_type] = {};
        }

        // Ensure timestamp key exists for event_type
        if (!(log_line_details['timestamp'] in this.eventdetails[event_type])) {
            this.eventdetails[event_type][log_line_details['timestamp']] = {
                count: number_events,
                details: []
            };
            this.eventdetails[event_type][log_line_details['timestamp']].details.push(log_line_details);
        } else {
            this.eventdetails[event_type][log_line_details['timestamp']].count += number_events;
            this.eventdetails[event_type][log_line_details['timestamp']].details.push(log_line_details);
        }

        return log_line_details;
    }


    parse_osquery_log_for_start() {
        let ln = 0;
        const fileStream = fs.createReadStream(this.osquery_log_file, { encoding: 'utf8' });
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        rl.on('line', (line) => {
            let result = line.match(this.osquery_start_pattern);
            if (result) {
                if (result[0].length <= 200) {
                    this.osqstart_list.push([ln, line]);
                } else {
                    // Handling special case where there may be junk in osquery worker logs
                    let charnum = line.indexOf('osquery worker initialized');
                    if (charnum > 0) {
                        let findstart = line.slice(charnum - 55).indexOf('I');
                        let stpoint = charnum - 55 + findstart;
                        let osqstartline = line.slice(stpoint);
                        this.osqstart_list.push([ln, osqstartline]);
                    }
                }
            }

            // Match and process os version log
            let osversion_results = line.match(this.os_version_pattern);
            if (osversion_results) {
                this.parse_osversion(ln, line);
            }

            // Match and process osquery version log
            let osquery_results = line.match(this.osquery_version_pattern);
            if (osquery_results) {
                this.parse_osqueryversion(ln, line);
            }

            // Match and process platform version log
            let platform_results = line.match(this.platform_version_pattern);
            if (platform_results) {
                this.parse_platform(ln, line);
            }

            // Match and process osquery events
            let osquery_events = line.match(this.osquery_received_events);
            if (osquery_events) {
                this.parse_osquery_events(ln, line, this);
            }
            ln++;
        });
    }


    analyse_osqlog_start() {
        let ln = 0;

        this.osqstart_list.forEach((osqstart_line_temp) => {
            let [line_number, log_line] = osqstart_line_temp;
            this.start_details[ln] = this.parse_start_log_line(line_number, log_line);

            if (ln > 0) {
                // Measure the time between the last restart time
                try {
                    if (parseInt(this.start_details[ln]['day']) === parseInt(this.start_details[ln - 1]['day'])) {
                        this.start_details[ln]['restart_time_diff'] = parseFloat(
                            (this.start_details[ln]['time_in_seconds'] -
                                this.start_details[ln - 1]['time_in_seconds']).toFixed(3)
                        );
                    } else {
                        // ln-1 nearing the end of the day
                        let seconds_diff_to_endofday = 86399 - this.start_details[ln - 1]['time_in_seconds'];
                        let seconds_in_days_diff =
                            (parseInt(this.start_details[ln]['day']) - parseInt(this.start_details[ln - 1]['day']) - 1) * 86400 +
                            seconds_diff_to_endofday;

                        this.start_details[ln]['restart_time_diff'] = parseFloat(
                            (seconds_in_days_diff - this.start_details[ln]['time_in_seconds']).toFixed(3)
                        );
                    }
                } catch (error) {
                    console.error(`Error in conversion of osquery restart... ${log_line}`);
                }
            }

            ln++;
        });

        this.analyse_version_stats();
    }


    analyse_version_stats() {
        // os_version details
        let os_version_det = [];

        for (let ln in this.version_details['os_version']) {
            let output = `${this.version_details['os_version'][ln]['name']} \
    ${this.version_details['os_version'][ln]['version']} \
    ${this.version_details['os_version'][ln]['arch']}`;

            os_version_det.push(output);
        }

        try {
            this.os_version_output = Array.from(new Set(os_version_det))[0];
        } catch (error) {
            this.os_version_output = "UNKNOWN";
        }

        // osquery_version details
        this.osquery_version_det = [];
        let ln_tmp = 0, prev_ln;

        for (let ln in this.version_details['osquery_version']) {
            try {
                let time_diff = 0;
                if (ln_tmp > 0) {
                    time_diff = parseInt(this.version_details['osquery_version'][ln]['start_time']) -
                        parseInt(this.version_details['osquery_version'][prev_ln]['start_time']);
                }

                let output = `${time_diff} \
    ${this.version_details['osquery_version'][ln]['start_time']} \
    ${this.version_details['osquery_version'][ln]['pid']} \
    ${this.version_details['osquery_version'][ln]['uuid']} \
    ${this.version_details['osquery_version'][ln]['version']} \
    ${this.version_details['osquery_version'][ln]['watcher']}`;

                prev_ln = ln;
                ln_tmp += 1;
                this.osquery_version_det.push(output);
            } catch (error) {
                console.error("Exception in the osquery version stats ...", error);
            }
        }

        // platform_version details
        let platform_det = [];

        try {
            for (let ln in this.version_details['platform_version']) {
                let output = `${this.version_details['platform_version'][ln]['vendor']} \
    ${this.version_details['platform_version'][ln]['version']}`;

                platform_det.push(output);
            }
            this.platform_output = Array.from(new Set(platform_det))[0];
        } catch (error) {
            console.log("Exception in the platform version stats ...", error);
        }
    }

}


