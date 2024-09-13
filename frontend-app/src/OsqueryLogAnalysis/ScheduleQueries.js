import fs from 'fs';
import readline from 'readline';
import { convert_to_seconds } from './helper_functions';

export default class ScheduleQueries {
    constructor(osquery_log_file, gt_time) {
        this.schedule_query_pattern = /.* Executing scheduled query.*/;
        this.found_schedule_query_pattern = /.* Found results for query: .*/;
        this.osquery_start_pattern = /.* osquery worker initialized .*/;

        this.osquery_log_file = osquery_log_file;
        this.gt_time = gt_time;

        this.sqd = {};
        this.query_times = {};
        this.schedule_query_list = [];

        // Parse the osq log file for scheduled queries
        this.parse_osqlog_schedule();
    }

    get_querytimes() {
        return this.query_times;
    }

    get_scheduled_queries() {
        return this.sqd;
    }

    async parse_osqlog_schedule() {
        const fileStream = fs.createReadStream(this.osquery_log_file, { encoding: 'utf8' });
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        let line_num = 0;
        for await (const line of rl) {
            line_num += 1;

            if (this.schedule_query_pattern.test(line)) {
                this.schedule_query_list.push([line_num, line]);
            }

            if (this.found_schedule_query_pattern.test(line)) {
                this.schedule_query_list.push([line_num, line]);
            }

            let restart_results = line.match(this.osquery_start_pattern);
            if (restart_results) {
                if (line.length <= 200) {
                    this.schedule_query_list.push([line_num, line]);
                } else {
                    // Handle special case with junk in osquery worker logs sometimes
                    let charnum = line.indexOf('osquery worker initialized');
                    if (charnum > 0) {
                        let findstart = line.slice(charnum - 55).indexOf("I");
                        let stpoint = charnum - 55 + findstart;
                        let osqstartline = line.slice(stpoint);
                        this.schedule_query_list.push([line_num, osqstartline]);
                    }
                }
            }
        }
    }


    parse_schedule_log_line(schedule_query_line, line_num) {
        const log_line_details = {};
        const log_temp = schedule_query_line.split(/\s+/, 5);

        log_line_details['line_number'] = line_num;
        log_line_details['level'] = log_temp[0][0];
        log_line_details['day'] = log_temp[0].slice(1);
        log_line_details['timestamp'] = log_temp[1];
        log_line_details['time_in_seconds'] = convert_to_seconds(log_temp[0].slice(1), log_temp[1]);
        log_line_details['worker_pid'] = log_temp[2];

        if (log_temp[4].includes('Executing scheduled query')) {
            log_line_details['query_name'] = log_temp[4].split(' ', 4)[3].split(':')[0];
            log_line_details['status'] = 'execution';
        } else if (log_temp[4].includes('Found results for query')) {
            log_line_details['query_name'] = log_temp[4].replace('Found results for query', '').split(':')[1].trim();
            log_line_details['status'] = 'found';
        } else if (log_temp[4].includes('osquery worker initialized')) {
            log_line_details['query_name'] = 'unknown';
            log_line_details['status'] = 'restart';
        }

        return log_line_details;
    }

    analyse_schedule_queries_execution_time() {
        let ln = 0;
        for (const schedule_query_line_tmp of this.schedule_query_list) {
            const [line_num, schedule_query_line] = schedule_query_line_tmp;
            this.sqd[ln] = this.parse_schedule_log_line(schedule_query_line, line_num);

            if (ln > 0 && (
                (this.sqd[ln]['status'] === 'found') ||
                (this.sqd[ln]['status'] === 'execution' && this.sqd[ln - 1]['status'] === 'execution') ||
                (this.sqd[ln]['status'] === 'restart' && this.sqd[ln - 1]['status'] === 'execution')
            )) {
                if (this.sqd[ln - 1]['worker_pid'] === this.sqd[ln]['worker_pid'] &&
                    this.sqd[ln - 1]['query_name'] === this.sqd[ln]['query_name']) {
                    this.sqd[ln - 1]['matched'] = 'Highly';
                    this.sqd[ln - 1]['execution_time'] =
                        parseFloat(this.sqd[ln]['time_in_seconds'] - this.sqd[ln - 1]['time_in_seconds']).toFixed(3);
                } else if (this.sqd[ln]['status'] === 'restart') {
                    this.sqd[ln - 1]['matched'] = 'restarted';
                    this.sqd[ln - 1]['execution_time'] =
                        parseFloat(this.sqd[ln]['time_in_seconds'] - this.sqd[ln - 1]['time_in_seconds']).toFixed(3);
                } else {
                    this.sqd[ln - 1]['matched'] = 'Likely';
                    this.sqd[ln - 1]['execution_time'] =
                        parseFloat(this.sqd[ln]['time_in_seconds'] - this.sqd[ln - 1]['time_in_seconds']).toFixed(3);
                }

                this.sqd[ln - 1]['next_timestamp'] = this.sqd[ln]['timestamp'];

                if (this.sqd[ln - 1]['execution_time'] > this.gt_time) {
                    if (!(this.sqd[ln - 1]['query_name'] in this.query_times)) {
                        this.query_times[this.sqd[ln - 1]['query_name']] = [];
                    }
                    this.query_times[this.sqd[ln - 1]['query_name']].push(this.sqd[ln - 1]);
                }
            }

            ln += 1;
        }

        // Resetting the schedule query list
        this.schedule_query_list = [];
    }

    get_top_schedule_by_time(dtime, retime, bycount = 5) {
        const rtimeinsec = convert_to_seconds(dtime, retime);
        const tmplines = Object.keys(this.sqd).sort((a, b) => a - b);

        let line_number;
        try {
            for (const linum of tmplines) {
                if (this.sqd[linum]['time_in_seconds'] > rtimeinsec) {
                    line_number = this.sqd[linum]['line_number'];
                    break;
                }
            }
            if (!line_number) {
                return 0;
            }
        } catch (err) {
            console.error(`Exception in get_top_schedule_by_time: ${err}`);
        }

        return line_number;
    }

    get_top_scheduled_lines_by_ref_linenum(ref_line_num, num_of_queries) {
        const line_num_to_monitor = [];
        const required_ln_dump = [];
        const lnumbers = Object.keys(this.sqd).sort((a, b) => a - b);

        for (const ln of lnumbers) {
            if (this.sqd[ln]['line_number'] <= ref_line_num) {
                required_ln_dump.push(ln);
            } else {
                break;
            }
        }

        let qnumber = 1, lnum = 1, nattemp = 1;
        while (qnumber <= num_of_queries && required_ln_dump.length > 1 && nattemp < 100) {
            const req_line_number = required_ln_dump.length - lnum;
            if (req_line_number > 0 && this.sqd[required_ln_dump[req_line_number]]['status'] === 'execution') {
                line_num_to_monitor.push(required_ln_dump[req_line_number]);
                qnumber += 1;
            } else {
                nattemp += 1;
            }
            lnum += 1;
        }

        return line_num_to_monitor;
    }

    dump_query_execution_times(output_schedule) {
        const output_schedule_fd = fs.createWriteStream(output_schedule, { flags: 'w' });

        output_schedule_fd.write(`\n${'*'.repeat(20)} Summary of schedule queries greater than 10 seconds ${'*'.repeat(20)}\n`);
        for (const qname of Object.keys(this.query_times).sort()) {
            output_schedule_fd.write(`\n\t ${qname} \n`);
            for (const qt of this.query_times[qname]) {
                const output = `\t\t ${qt['day']} - ${qt['timestamp']} : ${qt['query_name']} : ${qt['worker_pid']} : ${qt['matched']} : ${qt['execution_time']} : ${qt['next_timestamp']}`;
                output_schedule_fd.write(output + '\n');
            }
        }
    }
}