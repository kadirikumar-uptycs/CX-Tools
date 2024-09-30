import { convertToSeconds, parseDateTimetoMinute } from './helper_functions';



export default class OsqueryStart {

    constructor(workerLogs) {
        this.osqueryStartPattern = /.* osquery worker initialized .*/;
        this.osVersionPattern = /^os_version/;
        this.platformVersionPattern = /^platform_info/;
        this.osqueryVersionPattern = /^osquery_info/;
        this.osqueryReceivedEvents = /.* Osquery instance .* Received .*/;

        this.versionDetails = { osVersion: [], osqueryVersion: [], platformVersion: [] };
        this.eventDetails = {};
        this.osqueryStartFullDetails = {};
        this.workerLogs = workerLogs;
        this.errors = []

        // Initiate the Parsing
        this.startLogParsing();
    }

    startLogParsing() {
        this.workerLogs.map((log, index) => {
            this.parseWorkerLogLine(log, index + 1);
            return ''
        });
    }


    parseVersion(lineNumber, line, versionName, replacedText) {
        let tempObj = {}
        let PLATFORM_ALERTS_PATTERN = /\s*platform_alerts:\s*\[.*?\]/g;
        let match = line.match(PLATFORM_ALERTS_PATTERN);
        let platform_alerts = match && match[0]?.replace('platform_alerts: ', '')?.trim();
        try {
            line.replace(replacedText, '').split(', ').forEach(temp => {
                try {
                    let [key, value] = temp.split(': ');
                    tempObj[key.trim()] = value.trim();
                } catch (error) {
                    this.errors.push(`Error while parsing log for ${versionName} at line ${lineNumber}; ${error?.message || error}`);
                }
            });
            if (platform_alerts) tempObj.platform_alerts = platform_alerts;
            tempObj.lineNumber = lineNumber;
            this.versionDetails[versionName].push(tempObj);
        } catch (error) {
            this.errors.push(`Error while parsing log for ${versionName} at line ${lineNumber}; ${error?.message || error}`);
        }
    }

    tokenizeLogLine(lineNumber, logLine) {
        let logLineDetails = {};
        let logTokens = [
            ...logLine.split(' ', 4),
            logLine.split(' ').slice(4).join(' ')
        ]
        try {
            logLineDetails.lineNumber = lineNumber;
            logLineDetails.level = logTokens[0].charAt(0);
            logLineDetails.day = logTokens[0].slice(1);
            logLineDetails.timeStamp = logTokens[1];
            logLineDetails.timeInSeconds = convertToSeconds(logLineDetails.day, logLineDetails.timeStamp);
            logLineDetails.workerPid = logTokens[2];

            // If Year is not present set current year
            logLineDetails.day = (logLineDetails?.day?.length === 4 ? new Date().getFullYear() : '') + logLineDetails.day;
        } catch (error) {
            this.errors.push(`Error while tokenizing log number ${lineNumber}; ${error?.message || error}`);
        }
        return {
            logLineDetails,
            logTokens,
        }
    }

    parseOsqueryStartLogLine(lineNumber, osqueryStartLine) {
        let { logLineDetails, logTokens } = this.tokenizeLogLine(lineNumber, osqueryStartLine);
        let logMessageWords = logTokens[4].replace('osquery worker initialized [', '').split(' ');
        try {
            if (logMessageWords[0].includes('version')) {
                logLineDetails['version'] = logMessageWords[0].split('=')[1].replace(',', '');
            } else {
                logLineDetails['version'] = 'Unknown';
            }
        } catch (error) {
            logLineDetails['watcherPid'] = 'UNKNOWN_DUE_TO_ERRORS';
            this.errors.push(`Error while looking for the osquery version in OsqueryRestartedLogLine at line number ${lineNumber}; ${error?.message || error}`);
        }

        try {
            if (logMessageWords[1].includes('watcher')) {
                logLineDetails['watcherPid'] = logMessageWords[1].split('=')[1].replace(']', '');
            } else {
                logLineDetails['watcherPid'] = 'Unknown';
            }
        } catch (error) {
            logLineDetails['watcherPid'] = 'UNKNOWN_DUE_TO_ERRORS';
            this.errors.push(`Error while looking for the Watcher PID in OsqueryRestartedLogLine at line number ${lineNumber}; ${error?.message || error}`);
        }
        if (logLineDetails?.watcherPid) {
            logLineDetails.watcherPid = logLineDetails.watcherPid.replace('\r', '');
        }
        let dateTime = parseDateTimetoMinute(logLineDetails?.day, logLineDetails?.timeStamp);
        this.osqueryStartFullDetails[dateTime] ??= {
            count: 0,
            details: [],
        };
        this.osqueryStartFullDetails[dateTime].count += 1;
        this.osqueryStartFullDetails[dateTime]?.details?.push(logLineDetails);
        return logLineDetails
    }

    parseOsqueryEvents(lineNumber, eventLogLine) {
        // replace double space with single space becuase double space will cause problems while splitting the log line based on space as seperator
        eventLogLine = eventLogLine.replace('  ', ' ').replace('  ', ' ');
        let { logLineDetails, logTokens } = this.tokenizeLogLine(lineNumber, eventLogLine);
        let logMessageWords = logTokens[4].replace('Osquery instance ', '').split(' ');
        let numberEvents = parseInt(logMessageWords[2].trim());
        let eventType = logMessageWords[3].trim();

        logLineDetails = {
            ...logLineDetails,
            eventType,
            numberEvents,
            count: numberEvents,
        };


        this.eventDetails[eventType] ??= {};

        let dateTime = parseDateTimetoMinute(logLineDetails?.day, logLineDetails?.timeStamp);

        try {
            this.eventDetails[eventType][dateTime] ??= {
                count: 0,
                details: [],
            };
            this.eventDetails[eventType][dateTime].count += numberEvents;
            this.eventDetails[eventType][dateTime]?.details.push(logLineDetails);
        } catch (error) {
            this.errors.push(`Error while counting ${eventType} events at line number ${lineNumber}; ${error?.message || error}`);
        }

        return logLineDetails;
    }

    parseWorkerLogLine(line, lineNumber) {
        let result = line.match(this.osqueryStartPattern);
        if (result) {
            try {
                if (result[0].length <= 200) {
                    this.parseOsqueryStartLogLine(lineNumber, line);
                } else {
                    let charnum = line.indexOf('osquery worker initialized');
                    if (charnum > 0) {
                        let findstart = line.slice(charnum - 55).indexOf('I');
                        let stpoint = charnum - 55 + findstart;
                        let osqueryStartLine = line.slice(stpoint);
                        this.parseOsqueryStartLogLine(lineNumber, osqueryStartLine);
                    }
                }
            } catch (error) {
                this.errors.push(`Error while looking for the Osquery start pattern at line ${lineNumber}; ${error?.message || error}`)
            }
        }

        let osVersionResults = line.match(this.osVersionPattern);
        if (osVersionResults) {
            this.parseVersion(lineNumber, line, 'osVersion', 'os_version. ');
        }

        let osqueryResults = line.match(this.osqueryVersionPattern);
        if (osqueryResults) {
            this.parseVersion(lineNumber, line, 'osqueryVersion', 'osquery_info. ');
        }

        let platformResults = line.match(this.platformVersionPattern);
        if (platformResults) {
            this.parseVersion(lineNumber, line, 'platformVersion', 'platform_info. ');
        }

        let osqueryEvents = line.match(this.osqueryReceivedEvents);
        if (osqueryEvents) {
            this.parseOsqueryEvents(lineNumber, line);
        }
    }
}

