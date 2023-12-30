
class ScoreBoard {
    constructor() {
        this.points = [0, 0]
        this.strikes = [0, 0]
    }

    update(team_id, dict) {
        // if difference event to socket
        if (this.points[team_id] != dict.points) {
            // send event to socket

            // update points
            this.points[team_id] = dict.points
        }
        if (this.strikes[team_id] != dict.strikes) {
            // send event to socket

            // update strikes
            this.strikes[team_id] = dict.strikes
        }
    }
}


module.exports = ScoreBoard