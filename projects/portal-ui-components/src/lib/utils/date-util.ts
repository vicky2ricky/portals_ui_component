import * as moment from "moment";

export class DateUtil {
    /**
     * @description checks if a range lies within other set
     * @param start start limit of outer range
     * @param end end limit of outer range
     * @param oStart start limit of inner range
     * @param oEnd end limit of inner range
     * @returns returns true if the inner range lies within outer range else returns false
     * @example DateUtil.contains(buildingSchStartTime, buildingSchEndTime, zoneSchStartTime, zoneSchEndTime)
     */
    static contains(start, end, oStart, oEnd) {
        const startInRange = (start <= oStart);
        const endInRange = (end >= oEnd);

        return (startInRange && endInRange);
    }

    /**
     * @description checks if a range lies within other set
     * @param start start limit of outer range
     * @param end end limit of outer range
     * @param oStart start limit of inner range
     * @param oEnd end limit of inner range
     * @returns returns true if the inner range lies within outer range else returns false
     * @example DateUtil.contains(buildingSchStartTime, buildingSchEndTime, zoneSchStartTime, zoneSchEndTime)
     */
    static overlaps(start, end, oStart, oEnd, options = { adjacent: false }) {
        const intersects = (DateUtil.intersect(start, end, oStart, oEnd) !== null);

        if (options.adjacent && !intersects) {
            return DateUtil.adjacent(start, end, oStart, oEnd);
        }

        return intersects;
    }

    /**
     * @description retuns intersections of inner and outer ranges
     * @param start start limit of outer range
     * @param end end limit of outer range
     * @param oStart start limit of inner range
     * @param oEnd end limit of inner range
     * @returns returns the intersection of ranges or returns null
     * @example  DateUtil.intersect(buildingSchStartTime, buildingSchEndTime, zoneSchStartTime, zoneSchEndTime);
     */
    static intersect(start, end, otherStart, otherEnd) {

        const isZeroLength = (start === end);
        const isOtherZeroLength = (otherStart === otherEnd);

        // Zero-length ranges
        if (isZeroLength) {
            const point = start;

            if ((point === otherStart) || (point === otherEnd)) {
                return null;
            } else if ((point > otherStart) && (point < otherEnd)) {
                return [start, end];
            }
        } else if (isOtherZeroLength) {
            const point = otherStart;

            if ((point === start) || (point === end)) {
                return null;
            } else if ((point > start) && (point < end)) {
                return [point, point];
            }
        }

        // Non zero-length ranges
        if ((start <= otherStart) && (otherStart < end) && (end < otherEnd)) {
            return [otherStart, end];
        } else if ((otherStart < start) && (start < otherEnd) && (otherEnd <= end)) {
            return [start, otherEnd];
        } else if ((otherStart < start) && (start <= end) && (end < otherEnd)) {
            return [start, end];
        } else if ((start <= otherStart) && (otherStart <= otherEnd) && (otherEnd <= end)) {
            return [otherStart, otherEnd];
        }

        return null;
    }

    /**
     * @description verifies if dates are adjacent
     * @param start start limit of outer range
     * @param end end limit of outer range
     * @param oStart start limit of inner range
     * @param oEnd end limit of inner range
     * @returns returns true if dates are adjacent
     * @example  DateUtil.adjacent(start, end, oStart, oEnd)
     */
    static adjacent(start, end, oStart, oEnd) {
        const sameStartEnd = start.isSame(oEnd);
        const sameEndStart = end.isSame(oStart);

        return (sameStartEnd && (oStart.valueOf() <= start.valueOf())) || (sameEndStart && (oEnd.valueOf() >=
            end.valueOf()));
    }

    static dateFormat(value,siteTimeZone) {
        if (!(value && value.isValid())) return '--';
    
        const timePeriod = value.diff(moment(), 'days');
        if(siteTimeZone)
            value = moment(value).tz(siteTimeZone)
        const duration =  value.format('hh:mm:ss A')
        let displayMessage = '';
        switch (timePeriod) {
          case 0:
            let timeDiffMinutes = Math.abs(value.diff(moment(), 'minutes'))
            if(timeDiffMinutes < 60) {
                displayMessage = `${(timeDiffMinutes > 0 ? timeDiffMinutes+ ' mins ago' : 'Just now')}`;
            } else {
                displayMessage = `On ${value.format('DD MMMM, YYYY')} | ${duration}`
            }
            break
    
          default:
            displayMessage = `On ${value.format('DD MMMM, YYYY')} | ${duration}`
            break
        }
        return displayMessage;
    }
}
